// Dashboard — portfolio overview

function Dashboard({ navigate }) {
  const market = useLiveMarket(1800);
  const [range, setRange] = useState("1M");

  const holdings = market.filter(c => c.holdings > 0);
  const totalValue = holdings.reduce((s, c) => s + c.holdings * c.price, 0);
  const totalPrev = holdings.reduce((s, c) => s + c.holdings * c.prev, 0);
  const dayDelta = totalValue - totalPrev;
  const dayPct = (dayDelta / totalPrev) * 100;

  // portfolio history aggregated
  const portHistory = useMemo(() => {
    const len = market[0].history.length;
    const out = [];
    for (let i = 0; i < len; i++) {
      let v = 0;
      for (const c of market) v += c.holdings * c.history[i];
      out.push(v);
    }
    return out;
  }, [market.length]);

  const segments = holdings.map(c => ({ label: c.sym, value: c.holdings * c.price, color: c.color }));

  return (
    <AppShell route="dashboard" navigate={navigate}
      title="Good afternoon, Alex"
      subtitle="Your agents have made 4 trades in the last 24 hours."
      actions={<>
        <button className="btn btn-ghost"><I.Plus size={14}/> Deposit</button>
        <button className="btn btn-primary"><I.Sparkles size={14}/> Ask Nyx</button>
      </>}>

      {/* hero portfolio card */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
          <div className="flex jcb" style={{ marginBottom: 8 }}>
            <span className="uppercase muted">Total portfolio value</span>
            <div className="flex aic gap-1">
              {["1D","1W","1M","3M","1Y","All"].map(r => (
                <button key={r} className="chip" style={{ padding: "3px 9px", fontSize: 11,
                  background: range === r ? "var(--accent-soft)" : "transparent",
                  borderColor: range === r ? "var(--accent)" : "var(--line)",
                  color: range === r ? "var(--accent)" : "var(--text-2)" }} onClick={() => setRange(r)}>{r}</button>
              ))}
            </div>
          </div>
          <div className="flex aic gap-3" style={{ marginBottom: 4 }}>
            <span className="num" style={{ fontSize: 44, letterSpacing: "-0.025em" }}>
              {fmtUSD(totalValue, { decimals: 2 })}
            </span>
          </div>
          <div className="flex aic gap-3" style={{ marginBottom: 24 }}>
            <span className={`num ${dayDelta >= 0 ? "up" : "down"}`} style={{ fontSize: 14 }}>
              {dayDelta >= 0 ? "+" : ""}{fmtUSD(dayDelta)} ({fmtPct(dayPct)})
            </span>
            <span className="muted" style={{ fontSize: 13 }}>· today</span>
          </div>
          <AreaChart data={portHistory.slice(-120)} height={180} />
        </div>

        {/* allocation */}
        <div className="card" style={{ padding: 24 }}>
          <div className="flex jcb" style={{ marginBottom: 16 }}>
            <span className="uppercase muted">Allocation</span>
            <a className="muted" style={{ fontSize: 12, cursor: "pointer" }}>Rebalance</a>
          </div>
          <div className="flex aic gap-4">
            <div style={{ position: "relative" }}>
              <Donut segments={segments} size={150} thickness={14}/>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <span className="muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Holdings</span>
                <span className="num" style={{ fontSize: 22, letterSpacing: "-0.02em" }}>{holdings.length}</span>
              </div>
            </div>
            <div className="col gap-2" style={{ flex: 1 }}>
              {segments.map((s, i) => {
                const pct = (s.value / totalValue) * 100;
                return (
                  <div key={i} className="flex aic gap-2" style={{ fontSize: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }}/>
                    <span style={{ flex: 1 }}>{s.label}</span>
                    <span className="num muted">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI activity + holdings table */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="flex jcb aic" style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)" }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 500 }}>Holdings</h3>
              <p className="muted" style={{ fontSize: 12 }}>Live · prices update every couple seconds</p>
            </div>
            <button className="btn btn-ghost" style={{ padding: "6px 10px", fontSize: 12 }}><I.Filter size={12}/> Filter</button>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>Asset</th><th style={{ textAlign: "right" }}>Price</th><th style={{ textAlign: "right" }}>24h</th><th>7d</th><th style={{ textAlign: "right" }}>Holdings</th><th style={{ textAlign: "right" }}>Value</th></tr>
            </thead>
            <tbody>
              {holdings.map(c => (
                <tr key={c.sym} style={{ cursor: "pointer" }} onClick={() => navigate("asset")}>
                  <td>
                    <div className="flex aic gap-3">
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: c.color, opacity: 0.15, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: c.color }}>{c.sym.slice(0,2)}</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{c.name}</div>
                        <div className="muted mono" style={{ fontSize: 11 }}>{c.sym}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}><TickingPrice value={c.price} prev={c.prev} decimals={c.price < 10 ? 3 : 2}/></td>
                  <td style={{ textAlign: "right" }}><span className={`num ${c.change24h >= 0 ? "up" : "down"}`}>{fmtPct(c.change24h)}</span></td>
                  <td><Sparkline data={c.history.slice(-32)} width={80} height={24}/></td>
                  <td className="num" style={{ textAlign: "right", color: "var(--text-2)" }}>{c.holdings.toLocaleString()} {c.sym}</td>
                  <td className="num" style={{ textAlign: "right" }}>{fmtUSD(c.holdings * c.price, { decimals: 0 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI feed */}
        <div className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div className="flex jcb aic" style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)" }}>
            <div className="flex aic gap-2">
              <I.Bot size={16} style={{ color: "var(--accent)" }}/>
              <h3 style={{ fontSize: 15, fontWeight: 500 }}>Agent journal</h3>
            </div>
            <span className="badge badge-accent"><span className="live-dot"/> Live</span>
          </div>
          <div className="col" style={{ padding: 16, gap: 12, flex: 1 }}>
            {[
              { agent: "Atlas", time: "2m ago", action: "Rebalance", text: "Moved 2.4% from BTC into ARB and OP. Layer-2 bridge volume up 41% W/W, narrative momentum strong.", tag: "BUY" },
              { agent: "Hermes", time: "14m ago", action: "Trade filled", text: "Bought 320 ARB at $1.18 avg across 6 venues. Slippage: 0.04%.", tag: "FILL" },
              { agent: "Cassandra", time: "1h ago", action: "Risk check", text: "Portfolio vol within mandate (24%). No drawdown action needed.", tag: "OK" },
              { agent: "Argus", time: "3h ago", action: "Signal", text: "Detected unusual stablecoin minting on Solana. Flagged for Atlas review.", tag: "INFO" },
            ].map((a, i) => (
              <div key={i} style={{ padding: 14, background: "var(--bg-2)", borderRadius: 10, borderLeft: "2px solid var(--accent)" }}>
                <div className="flex jcb" style={{ marginBottom: 6 }}>
                  <div className="flex aic gap-2">
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{a.agent}</span>
                    <span className="muted mono" style={{ fontSize: 11 }}>· {a.action}</span>
                  </div>
                  <span className="mono muted" style={{ fontSize: 11 }}>{a.time}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>{a.text}</p>
              </div>
            ))}
          </div>
          <button className="btn btn-quiet" style={{ padding: "12px 16px", borderTop: "1px solid var(--line)", justifyContent: "center" }}>
            View full journal <I.ArrowRight size={12}/>
          </button>
        </div>
      </div>

      {/* watchlist + strategy */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="flex jcb aic" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 500 }}>Atlas's watchlist</h3>
            <span className="badge badge-line">Curated</span>
          </div>
          <div className="col gap-1">
            {market.filter(c => c.holdings === 0).slice(0, 4).map(c => (
              <div key={c.sym} className="flex aic jcb" style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <div className="flex aic gap-3">
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: c.color, opacity: 0.15, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="mono" style={{ fontSize: 10, fontWeight: 600, color: c.color }}>{c.sym.slice(0,2)}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                    <div className="muted mono" style={{ fontSize: 11 }}>{c.sym}</div>
                  </div>
                </div>
                <Sparkline data={c.history.slice(-32)} width={70} height={22}/>
                <div style={{ textAlign: "right" }}>
                  <TickingPrice value={c.price} prev={c.prev} decimals={c.price < 10 ? 3 : 2}/>
                  <div className={`num ${c.change24h >= 0 ? "up" : "down"}`} style={{ fontSize: 11 }}>{fmtPct(c.change24h)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24, background: "linear-gradient(135deg, oklch(0.21 0.04 145), var(--surface))" }}>
          <div className="flex aic gap-2" style={{ marginBottom: 12 }}>
            <I.Sparkles size={18} style={{ color: "var(--accent)" }}/>
            <h3 style={{ fontSize: 15, fontWeight: 500 }}>Atlas's take this week</h3>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-2)", marginBottom: 16 }}>
            "Macro is calm. Bitcoin dominance is rolling over and L2s are finally catching a bid. I'm rotating ~5% from BTC into ARB, OP, and a new RNDR position. Cassandra has the leash."
          </p>
          <div className="flex gap-2" style={{ flexWrap: "wrap", marginBottom: 16 }}>
            <span className="chip active">Bullish L2s</span>
            <span className="chip active">Reduce BTC</span>
            <span className="chip">AI infra</span>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" style={{ fontSize: 12 }}>Read full memo</button>
            <button className="btn btn-ghost" style={{ fontSize: 12 }}>Override</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

window.Dashboard = Dashboard;
