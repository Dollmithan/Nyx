// Shared utilities, icons, and market-data hooks for Nyx
// Exports onto window so other Babel scripts can use them.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- ICONS (stroke 1.5, lucide-style minimalism, hand-picked) ----------
const Icon = ({ d, size = 16, fill = "none", stroke = "currentColor", strokeWidth = 1.5, children, viewBox = "0 0 24 24", style }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {d ? <path d={d} /> : children}
  </svg>
);

const I = {
  Logo: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 20 L4 4 L12 14 L20 4 L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="14" r="2" fill="oklch(0.82 0.19 145)" />
    </svg>
  ),
  Home: (p) => <Icon {...p}><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></Icon>,
  Chart: (p) => <Icon {...p}><path d="M3 3v18h18M7 14l4-4 3 3 5-6"/></Icon>,
  Wallet: (p) => <Icon {...p}><path d="M3 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1V5a2 2 0 0 1 2-2h11"/><circle cx="16" cy="13" r="1.2" fill="currentColor" stroke="none"/></Icon>,
  Sparkles: (p) => <Icon {...p}><path d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5z"/><path d="M19 16l.9 2 2.1.6-2.1.6L19 21l-.9-1.8-2.1-.6 2.1-.6z"/></Icon>,
  Bell: (p) => <Icon {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 0 0 4 0"/></Icon>,
  Settings: (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></Icon>,
  ArrowUp: (p) => <Icon {...p}><path d="M7 17L17 7M17 7H8M17 7v9"/></Icon>,
  ArrowDown: (p) => <Icon {...p}><path d="M17 7L7 17M7 17h9M7 17V8"/></Icon>,
  ArrowRight: (p) => <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7"/></Icon>,
  Check: (p) => <Icon {...p}><path d="M5 12l4 4L19 7"/></Icon>,
  Plus: (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>,
  Search: (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Icon>,
  Bot: (p) => <Icon {...p}><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 13v.01M15 13v.01M12 3v4M8 20v2M16 20v2"/></Icon>,
  Shield: (p) => <Icon {...p}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></Icon>,
  Key: (p) => <Icon {...p}><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9 3 3-2 2 2 2-3 3-2-2-2 2"/></Icon>,
  User: (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></Icon>,
  Eye: (p) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></Icon>,
  X: (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>,
  Menu: (p) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h16"/></Icon>,
  Github: (p) => <Icon {...p}><path d="M9 19c-4 1.5-4-2-6-2m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6 0C6.7 2.8 5.6 3.1 5.6 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></Icon>,
  Twitter: (p) => <Icon {...p}><path d="M22 4.5c-1 .5-2 .8-3 1a4.5 4.5 0 0 0-7.7 4 12.7 12.7 0 0 1-9.3-4.7 4.5 4.5 0 0 0 1.4 6 4.5 4.5 0 0 1-2-.5v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 2 19.5a12.7 12.7 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6c.9-.6 1.6-1.4 2.3-2.3z"/></Icon>,
  Discord: (p) => <Icon {...p}><path d="M19 6a16 16 0 0 0-4-1.2l-.2.4a14 14 0 0 0-5.6 0L9 4.8A16 16 0 0 0 5 6a17 17 0 0 0-3 11 17 17 0 0 0 5 2.5l.7-1.1a11 11 0 0 1-2.5-1.2l.6-.5a12 12 0 0 0 10.4 0l.6.5a11 11 0 0 1-2.5 1.2L15 19.5a17 17 0 0 0 5-2.5 17 17 0 0 0-1-11z"/><circle cx="9" cy="13" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.3" fill="currentColor" stroke="none"/></Icon>,
  Zap: (p) => <Icon {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></Icon>,
  Trend: (p) => <Icon {...p}><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></Icon>,
  Pause: (p) => <Icon {...p}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></Icon>,
  Play: (p) => <Icon {...p}><path d="M6 4l14 8-14 8z"/></Icon>,
  More: (p) => <Icon {...p}><circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/></Icon>,
  Filter: (p) => <Icon {...p}><path d="M3 4h18l-7 9v6l-4 2v-8z"/></Icon>,
  Logout: (p) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></Icon>,
  Globe: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></Icon>,
  Lock: (p) => <Icon {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></Icon>,
  Mail: (p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></Icon>,
};

// ---------- MARKET DATA ----------
const COIN_SEED = [
  { sym: "BTC", name: "Bitcoin", price: 96420.5, holdings: 0.482, vol: 0.012, color: "oklch(0.78 0.16 70)" },
  { sym: "ETH", name: "Ethereum", price: 3284.12, holdings: 6.81, vol: 0.018, color: "oklch(0.7 0.14 260)" },
  { sym: "SOL", name: "Solana", price: 184.56, holdings: 24.5, vol: 0.028, color: "oklch(0.72 0.18 320)" },
  { sym: "AVAX", name: "Avalanche", price: 42.18, holdings: 0, vol: 0.025, color: "oklch(0.7 0.2 25)" },
  { sym: "LINK", name: "Chainlink", price: 17.42, holdings: 65, vol: 0.022, color: "oklch(0.7 0.14 240)" },
  { sym: "ARB", name: "Arbitrum", price: 1.18, holdings: 320, vol: 0.03, color: "oklch(0.7 0.14 230)" },
  { sym: "OP", name: "Optimism", price: 2.41, holdings: 0, vol: 0.032, color: "oklch(0.7 0.2 25)" },
  { sym: "RNDR", name: "Render", price: 8.62, holdings: 48, vol: 0.035, color: "oklch(0.78 0.18 30)" },
  { sym: "INJ", name: "Injective", price: 28.4, holdings: 0, vol: 0.04, color: "oklch(0.72 0.18 20)" },
  { sym: "TIA", name: "Celestia", price: 6.12, holdings: 0, vol: 0.038, color: "oklch(0.72 0.16 320)" },
];

// Generate stable historical series for each coin (deterministic)
function genHistory(seed, points = 120, vol = 0.02, drift = 0.001) {
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const series = [];
  let price = 100;
  for (let i = 0; i < points; i++) {
    const r = (rand() - 0.5) * 2;
    price = price * (1 + drift + r * vol);
    series.push(price);
  }
  return series;
}

// Hook: live ticker that updates each coin's price every interval
function useLiveMarket(intervalMs = 1800) {
  const [tick, setTick] = useState(0);
  const stateRef = useRef(null);
  if (!stateRef.current) {
    stateRef.current = COIN_SEED.map((c, i) => {
      const hist = genHistory(i * 137 + 11, 168, c.vol, 0.0008 + i * 0.0001);
      const last = hist[hist.length - 1];
      const factor = c.price / last;
      const scaled = hist.map(p => p * factor);
      return { ...c, history: scaled, prev: c.price, change24h: ((c.price - scaled[scaled.length - 25]) / scaled[scaled.length - 25]) * 100 };
    });
  }
  useEffect(() => {
    const id = setInterval(() => {
      stateRef.current = stateRef.current.map(c => {
        const r = (Math.random() - 0.49) * 2;
        const next = c.price * (1 + r * c.vol * 0.4);
        const newHist = [...c.history.slice(1), next];
        return {
          ...c,
          prev: c.price,
          price: next,
          history: newHist,
          change24h: ((next - newHist[newHist.length - 25]) / newHist[newHist.length - 25]) * 100,
        };
      });
      setTick(t => t + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return stateRef.current;
}

// ---------- FORMATTERS ----------
const fmtUSD = (n, opts = {}) => {
  const { decimals = 2, compact = false } = opts;
  if (compact && Math.abs(n) >= 1000) {
    if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  }
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
};
const fmtPct = (n, decimals = 2) => `${n >= 0 ? "+" : ""}${n.toFixed(decimals)}%`;
const fmtCoin = (n, sym) => `${n.toLocaleString("en-US", { maximumFractionDigits: 4 })} ${sym}`;

// ---------- SPARKLINE ----------
function Sparkline({ data, width = 80, height = 28, color, fill = false }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const last = data[data.length - 1];
  const first = data[0];
  const positive = last >= first;
  const stroke = color || (positive ? "var(--accent)" : "var(--loss)");
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {fill && <polygon points={area} fill={stroke} opacity="0.12" />}
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- AREA CHART (for dashboard, asset detail) ----------
function AreaChart({ data, width = 800, height = 240, color = "var(--accent)", showAxis = false, padding = 0, lastDot = true }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = width - padding * 2;
  const h = height - padding * 2;
  const pts = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * w;
    const y = padding + h - ((v - min) / range) * h;
    return [x, y];
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${padding + h} L${pts[0][0]},${padding + h} Z`;
  const id = `grad-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {lastDot && (
        <>
          <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="6" fill={color} opacity="0.2"/>
          <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={color} />
        </>
      )}
    </svg>
  );
}

// ---------- CANDLESTICK CHART ----------
function CandlestickChart({ data, width = 800, height = 320 }) {
  // data: [{o,h,l,c}]
  if (!data || data.length === 0) return null;
  const all = data.flatMap(d => [d.h, d.l]);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1;
  const cw = width / data.length;
  const bw = Math.max(2, cw * 0.6);
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const x = i * cw + cw / 2;
        const yH = height - ((d.h - min) / range) * height;
        const yL = height - ((d.l - min) / range) * height;
        const yO = height - ((d.o - min) / range) * height;
        const yC = height - ((d.c - min) / range) * height;
        const up = d.c >= d.o;
        const color = up ? "var(--accent)" : "var(--loss)";
        return (
          <g key={i}>
            <line x1={x} y1={yH} x2={x} y2={yL} stroke={color} strokeWidth="1"/>
            <rect x={x - bw/2} y={Math.min(yO, yC)} width={bw} height={Math.max(1, Math.abs(yO - yC))} fill={color} opacity={up ? 0.85 : 0.95}/>
          </g>
        );
      })}
    </svg>
  );
}

// Generate candle data from a price series
function toCandles(series, candleSize = 4) {
  const candles = [];
  for (let i = 0; i < series.length; i += candleSize) {
    const slice = series.slice(i, i + candleSize);
    if (slice.length === 0) continue;
    candles.push({
      o: slice[0],
      c: slice[slice.length - 1],
      h: Math.max(...slice),
      l: Math.min(...slice),
    });
  }
  return candles;
}

// ---------- DONUT ----------
function Donut({ segments, size = 180, thickness = 18 }) {
  const r = size / 2 - thickness / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let off = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-2)" strokeWidth={thickness}/>
      {segments.map((s, i) => {
        const len = (s.value / total) * c;
        const dasharray = `${len} ${c - len}`;
        const dashoffset = -off;
        off += len;
        return (
          <circle key={i}
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={s.color} strokeWidth={thickness}
            strokeDasharray={dasharray} strokeDashoffset={dashoffset}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: "all 0.3s" }}
          />
        );
      })}
    </svg>
  );
}

// ---------- BAR CHART ----------
function BarChart({ data, width = 600, height = 180 }) {
  // data: [{label, value}]
  const max = Math.max(...data.map(d => Math.abs(d.value))) || 1;
  const bw = width / data.length;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const h = (Math.abs(d.value) / max) * (height - 20);
        const y = d.value >= 0 ? height/2 - h : height/2;
        return (
          <rect key={i}
            x={i * bw + 2} y={y}
            width={bw - 4} height={h}
            fill={d.value >= 0 ? "var(--accent)" : "var(--loss)"}
            opacity="0.85"
            rx="2"
          />
        );
      })}
      <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="var(--line)" strokeDasharray="2,3"/>
    </svg>
  );
}

// ---------- TICKING NUMBER (smooth display + flash) ----------
function TickingPrice({ value, prev, decimals = 2, prefix = "$", className = "" }) {
  const up = value > prev;
  const down = value < prev;
  const flashKey = `${value}-${prev}`;
  return (
    <span className={`num ${className} ${up ? "flash-up" : down ? "flash-down" : ""}`} key={flashKey} style={{ padding: "0 2px", borderRadius: 3, transition: "all 0.2s" }}>
      {prefix}{value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}

// ---------- ROUTING (super-light hash router) ----------
function useRoute() {
  const [route, setRoute] = useState(() => location.hash.replace("#/", "") || "home");
  useEffect(() => {
    const h = () => setRoute(location.hash.replace("#/", "") || "home");
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  const navigate = (r) => { location.hash = `#/${r}`; };
  return [route, navigate];
}

// Export everything
Object.assign(window, {
  I, useLiveMarket, COIN_SEED,
  fmtUSD, fmtPct, fmtCoin,
  Sparkline, AreaChart, CandlestickChart, Donut, BarChart,
  TickingPrice, toCandles, useRoute,
  React, useState, useEffect, useRef, useMemo, useCallback,
});
