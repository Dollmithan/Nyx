from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView, TemplateView

from .forms import FintechAuthenticationForm, SignUpForm


COIN_SEED = [
    {"sym": "BTC", "name": "Bitcoin", "price": 96420.5, "holdings": 0.482, "vol": 0.012, "color": "oklch(0.78 0.16 70)"},
    {"sym": "ETH", "name": "Ethereum", "price": 3284.12, "holdings": 6.81, "vol": 0.018, "color": "oklch(0.7 0.14 260)"},
    {"sym": "SOL", "name": "Solana", "price": 184.56, "holdings": 24.5, "vol": 0.028, "color": "oklch(0.72 0.18 320)"},
    {"sym": "AVAX", "name": "Avalanche", "price": 42.18, "holdings": 0, "vol": 0.025, "color": "oklch(0.7 0.2 25)"},
    {"sym": "LINK", "name": "Chainlink", "price": 17.42, "holdings": 65, "vol": 0.022, "color": "oklch(0.7 0.14 240)"},
    {"sym": "ARB", "name": "Arbitrum", "price": 1.18, "holdings": 320, "vol": 0.03, "color": "oklch(0.7 0.14 230)"},
    {"sym": "OP", "name": "Optimism", "price": 2.41, "holdings": 0, "vol": 0.032, "color": "oklch(0.7 0.2 25)"},
    {"sym": "RNDR", "name": "Render", "price": 8.62, "holdings": 48, "vol": 0.035, "color": "oklch(0.78 0.18 30)"},
    {"sym": "INJ", "name": "Injective", "price": 28.4, "holdings": 0, "vol": 0.04, "color": "oklch(0.72 0.18 20)"},
    {"sym": "TIA", "name": "Celestia", "price": 6.12, "holdings": 0, "vol": 0.038, "color": "oklch(0.72 0.16 320)"},
]


def get_display_name(user):
    if getattr(user, "first_name", ""):
        return user.first_name
    if getattr(user, "email", ""):
        return user.email.split("@")[0].title()
    return user.username


def format_money(amount, decimals=2):
    return f"${amount:,.{decimals}f}"


def format_pct(value, decimals=2):
    return f"{value:+.{decimals}f}%"


def format_compact_money(amount):
    abs_amount = abs(amount)
    if abs_amount >= 1_000_000_000:
        return f"${amount / 1_000_000_000:.2f}B"
    if abs_amount >= 1_000_000:
        return f"${amount / 1_000_000:.2f}M"
    if abs_amount >= 1_000:
        return f"${amount / 1_000:.2f}K"
    return format_money(amount, 2)


def gen_history(seed, points=168, vol=0.02, drift=0.001):
    state = seed
    price = 100
    series = []
    for _ in range(points):
        state = (state * 9301 + 49297) % 233280
        rand = state / 233280
        shock = (rand - 0.5) * 2
        price = price * (1 + drift + shock * vol)
        series.append(price)
    return series


def sparkline_points(data, width, height):
    if not data:
        return ""
    minimum = min(data)
    maximum = max(data)
    spread = maximum - minimum or 1
    points = []
    for index, value in enumerate(data):
        x = (index / (len(data) - 1)) * width
        y = height - ((value - minimum) / spread) * height
        points.append(f"{x:.2f},{y:.2f}")
    return " ".join(points)


def area_chart_paths(data, width=800, height=240, padding=0):
    minimum = min(data)
    maximum = max(data)
    spread = maximum - minimum or 1
    inner_width = width - padding * 2
    inner_height = height - padding * 2
    points = []
    for index, value in enumerate(data):
        x = padding + (index / (len(data) - 1)) * inner_width
        y = padding + inner_height - ((value - minimum) / spread) * inner_height
        points.append((x, y))

    line = " ".join(
        f"{'M' if index == 0 else 'L'}{x:.2f},{y:.2f}"
        for index, (x, y) in enumerate(points)
    )
    area = (
        f"{line} L{points[-1][0]:.2f},{padding + inner_height:.2f} "
        f"L{points[0][0]:.2f},{padding + inner_height:.2f} Z"
    )
    return {
        "line_path": line,
        "area_path": area,
        "last_x": f"{points[-1][0]:.2f}",
        "last_y": f"{points[-1][1]:.2f}",
    }


def build_conic_gradient(segments):
    total = sum(segment["value"] for segment in segments) or 1
    stops = []
    current = 0
    for segment in segments:
        start = current / total * 100
        current += segment["value"]
        end = current / total * 100
        stops.append(f"{segment['color']} {start:.2f}% {end:.2f}%")
    return f"conic-gradient({', '.join(stops)})"


def build_market():
    market = []
    for index, coin in enumerate(COIN_SEED):
        history = gen_history(index * 137 + 11, 168, coin["vol"], 0.0008 + index * 0.0001)
        factor = coin["price"] / history[-1]
        scaled = [point * factor for point in history]
        prev = scaled[-2]
        change_24h = ((scaled[-1] - scaled[-25]) / scaled[-25]) * 100
        market.append(
            {
                **coin,
                "history": scaled,
                "prev": prev,
                "change24h": change_24h,
                "display_price": format_money(coin["price"], 2 if coin["price"] >= 10 else 3),
                "display_change": format_pct(change_24h),
                "is_up": change_24h >= 0,
                "sparkline": sparkline_points(scaled[-32:], 80, 24),
                "watch_sparkline": sparkline_points(scaled[-32:], 70, 22),
                "mini_sparkline": sparkline_points(scaled[-32:], 50, 24),
            }
        )
    return market


def portfolio_history_from_market(market):
    history_length = len(market[0]["history"])
    portfolio_history = []
    for index in range(history_length):
        total = 0
        for coin in market:
            total += coin["holdings"] * coin["history"][index]
        portfolio_history.append(total)
    return portfolio_history


def to_candles(series, candle_size=2):
    candles = []
    for index in range(0, len(series), candle_size):
        window = series[index:index + candle_size]
        if not window:
            continue
        candles.append(
            {
                "o": window[0],
                "c": window[-1],
                "h": max(window),
                "l": min(window),
            }
        )
    return candles


def candlestick_shapes(candles, width=800, height=320):
    values = []
    for candle in candles:
        values.extend([candle["h"], candle["l"]])
    minimum = min(values)
    maximum = max(values)
    spread = maximum - minimum or 1
    candle_width = width / len(candles)
    body_width = max(2, candle_width * 0.6)
    shapes = []
    for index, candle in enumerate(candles):
        x = index * candle_width + candle_width / 2
        y_high = height - ((candle["h"] - minimum) / spread) * height
        y_low = height - ((candle["l"] - minimum) / spread) * height
        y_open = height - ((candle["o"] - minimum) / spread) * height
        y_close = height - ((candle["c"] - minimum) / spread) * height
        is_up = candle["c"] >= candle["o"]
        shapes.append(
            {
                "x": f"{x:.2f}",
                "y_high": f"{y_high:.2f}",
                "y_low": f"{y_low:.2f}",
                "rect_x": f"{(x - body_width / 2):.2f}",
                "rect_y": f"{min(y_open, y_close):.2f}",
                "rect_height": f"{max(1, abs(y_open - y_close)):.2f}",
                "rect_width": f"{body_width:.2f}",
                "is_up": is_up,
            }
        )
    return shapes


def dual_line_chart(series1, series2, height=280, width=1000):
    def normalize(series):
        base = series[0] or 1
        return [(value / base) * 100 for value in series]

    first = normalize(series1)
    second = normalize(series2)
    baseline = [100 + (index / len(first)) * 35 for index in range(len(first))]
    combined = first + second + baseline
    minimum = min(combined)
    maximum = max(combined)
    spread = maximum - minimum or 1

    def line_path(series):
        points = []
        for index, value in enumerate(series):
            x = (index / (len(series) - 1)) * width
            y = height - ((value - minimum) / spread) * (height - 20) - 10
            points.append((x, y))
        return " ".join(
            f"{'M' if index == 0 else 'L'}{x:.2f},{y:.2f}"
            for index, (x, y) in enumerate(points)
        )

    area_points = []
    for index, value in enumerate(first):
        x = (index / (len(first) - 1)) * width
        y = height - ((value - minimum) / spread) * (height - 20) - 10
        area_points.append(f"{x:.2f},{y:.2f}")

    area = f"M0,{height} L {' L '.join(area_points)} L{width},{height} Z"
    grid_lines = [f"{10 + part * (height - 20):.2f}" for part in [0, 0.25, 0.5, 0.75, 1]]
    return {
        "portfolio_line": line_path(first),
        "benchmark_line": line_path(second),
        "baseline_line": line_path(baseline),
        "portfolio_area": area,
        "grid_lines": grid_lines,
    }


def monthly_return_bars(monthly, width=600, height=200):
    max_value = max(abs(item["v"]) for item in monthly) or 1
    bar_width = width / len(monthly)
    bars = []
    for index, item in enumerate(monthly):
        bar_height = (abs(item["v"]) / max_value) * (height - 20)
        y = height / 2 - bar_height if item["v"] >= 0 else height / 2
        bars.append(
            {
                "x": f"{index * bar_width + 2:.2f}",
                "y": f"{y:.2f}",
                "width": f"{bar_width - 4:.2f}",
                "height": f"{bar_height:.2f}",
                "positive": item["v"] >= 0,
                "label": item["m"],
            }
        )
    return bars


def order_book_rows(price, is_bid=True):
    rows = []
    for index in range(7):
        level_price = price * (1 - (index + 1) * 0.0008) if is_bid else price * (1 + (index + 1) * 0.0008)
        size = ((index + 3) * 1.137) % 8 + 1
        rows.append(
            {
                "price": f"{level_price:.2f}",
                "size": f"{size:.3f}",
                "width": index * 8 + 12,
            }
        )
    return rows


def alert_rows():
    return [
        {"id": 1, "type": "trade", "agent": "Hermes", "title": "Buy filled - 320 ARB", "body": "Filled at $1.18 avg across 6 venues. Slippage 0.04% - good.", "time": "2 min ago", "unread": True, "severity": "ok"},
        {"id": 2, "type": "rebalance", "agent": "Atlas", "title": "Portfolio rebalanced", "body": "Increased L2 exposure by 3.4%. Trimmed BTC by 2.1%. Reasoning: bridge volume +41% W/W.", "time": "14 min ago", "unread": True, "severity": "info"},
        {"id": 3, "type": "risk", "agent": "Cassandra", "title": "Vol approaching mandate ceiling", "body": "Portfolio vol at 24.2% - within 50% mandate but elevated. Watching closely.", "time": "1 hr ago", "unread": True, "severity": "warn"},
        {"id": 4, "type": "signal", "agent": "Argus", "title": "Unusual stablecoin minting on Solana", "body": "$48M USDC minted in last hour. Forwarded to Atlas. May trigger SOL allocation review.", "time": "3 hr ago", "unread": False, "severity": "info"},
        {"id": 5, "type": "price", "agent": None, "title": "BTC crossed $96,000", "body": "Your alert triggered. Price hit $96,012 at 11:42 ET.", "time": "5 hr ago", "unread": False, "severity": "info"},
        {"id": 6, "type": "deposit", "agent": None, "title": "Deposit confirmed - $500", "body": "ACH transfer from Chase ..4291 settled. Atlas will deploy capital within 24 hours.", "time": "Yesterday", "unread": False, "severity": "ok"},
        {"id": 7, "type": "risk", "agent": "Cassandra", "title": "Drawdown threshold hit - paused", "body": "Portfolio drew down 6% in 48h. I paused new positions for 12 hours per your mandate. Resumed normally.", "time": "Apr 18", "unread": False, "severity": "warn"},
    ]


class AppPageView(LoginRequiredMixin, TemplateView):
    active_page = ""
    page_title = ""
    page_subtitle = ""

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(
            {
                "active_page": self.active_page,
                "page_title": self.page_title,
                "page_subtitle": self.page_subtitle,
                "display_name": get_display_name(self.request.user),
            }
        )
        return context


class LandingPageView(TemplateView):
    template_name = "accounts/landing.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        market = build_market()
        context["top_market"] = market[:6]
        context["hero_chart"] = area_chart_paths(gen_history(7, 140, 0.018, 0.005), width=900, height=72)
        return context


class DashboardView(AppPageView):
    template_name = "accounts/dashboard.html"
    active_page = "dashboard"
    page_title = "Good afternoon"
    page_subtitle = "Your agents have made 4 trades in the last 24 hours."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        market = build_market()
        holdings = [coin for coin in market if coin["holdings"] > 0]
        total_value = sum(coin["holdings"] * coin["price"] for coin in holdings)
        total_prev = sum(coin["holdings"] * coin["prev"] for coin in holdings)
        day_delta = total_value - total_prev
        day_pct = (day_delta / total_prev) * 100 if total_prev else 0

        portfolio_history = portfolio_history_from_market(market)
        segments = []
        for coin in holdings:
            value = coin["holdings"] * coin["price"]
            segments.append(
                {
                    "label": coin["sym"],
                    "value": value,
                    "color": coin["color"],
                    "percent": (value / total_value) * 100 if total_value else 0,
                }
            )

        watchlist = [coin for coin in market if coin["holdings"] == 0][:4]
        for coin in holdings + watchlist:
            coin["holding_value"] = format_money(coin["holdings"] * coin["price"], 0)
            coin["holdings_display"] = f"{coin['holdings']:,.4f}".rstrip("0").rstrip(".")

        context.update(
            {
                "holdings": holdings,
                "watchlist": watchlist,
                "portfolio_total": format_money(total_value, 2),
                "portfolio_day_delta": format_money(day_delta, 2),
                "portfolio_day_pct": format_pct(day_pct),
                "portfolio_positive": day_delta >= 0,
                "portfolio_chart": area_chart_paths(portfolio_history[-120:], width=920, height=180),
                "allocation_segments": segments,
                "allocation_gradient": build_conic_gradient(segments),
                "journal_entries": [
                    {"agent": "Atlas", "action": "Rebalance", "time": "2m ago", "text": "Moved 2.4% from BTC into ARB and OP. Layer-2 bridge volume up 41% W/W, narrative momentum strong."},
                    {"agent": "Hermes", "action": "Trade filled", "time": "14m ago", "text": "Bought 320 ARB at $1.18 avg across 6 venues. Slippage: 0.04%."},
                    {"agent": "Cassandra", "action": "Risk check", "time": "1h ago", "text": "Portfolio vol within mandate (24%). No drawdown action needed."},
                    {"agent": "Argus", "action": "Signal", "time": "3h ago", "text": "Detected unusual stablecoin minting on Solana. Flagged for Atlas review."},
                ],
                "memo_tags": ["Bullish L2s", "Reduce BTC", "AI infra"],
            }
        )
        return context


class MarketsView(AppPageView):
    template_name = "accounts/markets.html"
    active_page = "markets"
    page_title = "Markets"
    page_subtitle = "Live prices across 24 venues. Trade manually or hand it to Hermes."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        market = build_market()
        sym = self.request.GET.get("sym", "BTC")
        timeframe = self.request.GET.get("tf", "1D")
        order_type = self.request.GET.get("order", "market")
        side = self.request.GET.get("side", "buy")
        amount = self.request.GET.get("amount", "250")
        selected = next((coin for coin in market if coin["sym"] == sym), market[0])
        candles = candlestick_shapes(to_candles(selected["history"], 2)[-60:], width=800, height=320)

        recent_trades = [
            {"time": "14:32", "side": "buy", "agent": "Hermes", "price": selected["price"] * 0.998, "size": 0.012},
            {"time": "11:08", "side": "buy", "agent": "Hermes", "price": selected["price"] * 0.992, "size": 0.024},
            {"time": "Mon", "side": "sell", "agent": "Hermes", "price": selected["price"] * 1.018, "size": 0.008},
            {"time": "Sun", "side": "buy", "agent": "Hermes", "price": selected["price"] * 0.974, "size": 0.041},
            {"time": "Sun", "side": "buy", "agent": "Hermes", "price": selected["price"] * 0.962, "size": 0.018},
        ]
        for trade in recent_trades:
            trade["display_price"] = format_money(trade["price"], 2)
            trade["size_display"] = f"{trade['size']} {selected['sym']}"

        context.update(
            {
                "market": market,
                "selected_coin": selected,
                "timeframe": timeframe,
                "timeframe_options": ["15m", "1H", "4H", "1D", "1W", "1M"],
                "order_type": order_type,
                "order_type_options": ["market", "limit", "stop"],
                "quick_amounts": ["25", "50", "100", "250"],
                "side": side,
                "amount": amount,
                "candles": candles,
                "market_caps": [
                    {"label": "Market cap", "value": format_compact_money(selected["price"] * 19_700_000)},
                    {"label": "24h volume", "value": format_compact_money(selected["price"] * 320_000)},
                    {"label": "24h high", "value": format_money(max(selected["history"][-25:]), 2)},
                    {"label": "24h low", "value": format_money(min(selected["history"][-25:]), 2)},
                    {"label": "Your position", "value": f"{selected['holdings']} {selected['sym']}" if selected["holdings"] else "-"},
                ],
                "receive_amount": f"{(float(amount or 0) / selected['price']):.6f}",
                "fee_amount": f"{(float(amount or 0) * 0.001):.2f}",
                "recent_trades": recent_trades,
                "bids": order_book_rows(selected["price"], True),
                "asks": order_book_rows(selected["price"], False),
            }
        )
        return context


class StatisticsView(AppPageView):
    template_name = "accounts/statistics.html"
    active_page = "statistics"
    page_title = "Statistics"
    page_subtitle = "How your agents are doing - and how they got there."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        period = self.request.GET.get("period", "YTD")
        market = build_market()
        portfolio_history = portfolio_history_from_market(market)
        btc_history = next(coin for coin in market if coin["sym"] == "BTC")["history"]
        monthly = [
            {"m": "May", "v": 4.2}, {"m": "Jun", "v": -2.8}, {"m": "Jul", "v": 8.1}, {"m": "Aug", "v": -5.4},
            {"m": "Sep", "v": 11.2}, {"m": "Oct", "v": 6.8}, {"m": "Nov", "v": 18.4}, {"m": "Dec", "v": -7.1},
            {"m": "Jan", "v": 14.2}, {"m": "Feb", "v": 9.8}, {"m": "Mar", "v": -3.6}, {"m": "Apr", "v": 12.4},
        ]
        context.update(
            {
                "period": period,
                "period_options": ["1M", "3M", "YTD", "1Y", "All"],
                "dual_chart": dual_line_chart(portfolio_history, btc_history),
                "monthly": monthly,
                "monthly_bars": monthly_return_bars(monthly),
                "contributors": [
                    {"sym": "SOL", "name": "Solana", "contrib": 8420, "pct": 38.4},
                    {"sym": "ETH", "name": "Ethereum", "contrib": 4180, "pct": 19.0},
                    {"sym": "BTC", "name": "Bitcoin", "contrib": 3640, "pct": 16.6},
                    {"sym": "ARB", "name": "Arbitrum", "contrib": 1890, "pct": 8.6},
                    {"sym": "LINK", "name": "Chainlink", "contrib": -640, "pct": -2.9},
                ],
                "agent_scoreboard": [
                    {"name": "Atlas", "trades": 28, "win": "71%", "avg": "+2.1%", "pl": "+$8,420"},
                    {"name": "Hermes", "trades": 142, "win": "84%", "avg": "+0.4%", "pl": "+$2,180"},
                    {"name": "Cassandra", "trades": 9, "win": "88%", "avg": "+4.8%", "pl": "+$1,640"},
                    {"name": "Argus", "trades": 0, "win": "-", "avg": "-", "pl": "research only"},
                ],
                "risk_rows": [
                    {"label": "Volatility (90d)", "value": "24.2%", "pct": 48, "cap": "50% mandate", "color": "var(--accent)"},
                    {"label": "Beta to BTC", "value": "0.82", "pct": 62, "cap": "<= 1.0", "color": "var(--warn)"},
                    {"label": "Concentration (top 3)", "value": "64%", "pct": 64, "cap": "<= 70%", "color": "var(--warn)"},
                    {"label": "Stablecoin buffer", "value": "8.4%", "pct": 42, "cap": ">= 5%", "color": "var(--accent)"},
                ],
            }
        )
        return context


class AlertsView(AppPageView):
    template_name = "accounts/alerts.html"
    active_page = "alerts"
    page_title = "Alerts"
    page_subtitle = "Everything your agents thought you should know."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        current_filter = self.request.GET.get("filter", "all")
        alerts = alert_rows()
        filtered = alerts if current_filter == "all" else [item for item in alerts if item["type"] == current_filter]
        context.update(
            {
                "current_filter": current_filter,
                "alerts": filtered,
                "filter_counts": {
                    "all": len(alerts),
                    "trade": len([item for item in alerts if item["type"] == "trade"]),
                    "rebalance": len([item for item in alerts if item["type"] == "rebalance"]),
                    "risk": len([item for item in alerts if item["type"] == "risk"]),
                    "signal": len([item for item in alerts if item["type"] == "signal"]),
                    "price": len([item for item in alerts if item["type"] == "price"]),
                },
            }
        )
        return context


class SettingsView(AppPageView):
    template_name = "accounts/settings.html"
    active_page = "settings"
    page_title = "Settings"
    page_subtitle = "Account, security, and the things only you should change."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        tab = self.request.GET.get("tab", "account")
        context["settings_tab"] = tab
        return context


class SignUpView(CreateView):
    form_class = SignUpForm
    template_name = "accounts/signup.html"
    success_url = reverse_lazy("dashboard")

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect("dashboard")
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        response = super().form_valid(form)
        login(self.request, self.object)
        messages.success(self.request, "Your Nyx account is live.")
        return response


class FintechLoginView(LoginView):
    authentication_form = FintechAuthenticationForm
    template_name = "accounts/login.html"
    redirect_authenticated_user = True

    def form_valid(self, form):
        messages.success(self.request, "Signed in successfully.")
        return super().form_valid(form)
