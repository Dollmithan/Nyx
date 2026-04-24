// Statistics / performance analytics

function Statistics({ navigate }) {
  const market = useLiveMarket(2200);
  const [period, setPeriod] = useState("YTD");

  // synthetic monthly returns
  const monthly = [
    { m: "May", v: 4.2 }, { m: "Jun", v: -2.8 }, { m: "Jul", v: 8.1 },
    { m: "Aug", v: -5.4 }, { m: "Sep", v: 11.2 }, { m: "Oct", v: 6.8 },
    { m: "Nov", v: 18.4 }, { m: "Dec", v: -7.1 }, { m: "Jan", v: 14.2 },
    { m: "Feb", v: 9.8 }, { m: "Mar", v: -3.6 }, { m: "Apr", v: 12.4 },
  ];

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

  const btcHistory = market.find(c => c.sym === "BTC").history;

  return (
    <AppShell route="stats" navigate={navigate}
      title="Statistics"
      subtitle="How your agents are doing — and how they got there."
      actions={<>
        <div className="flex gap-1">
          {["1M","3M","YTD","1Y","All"].map(p => (
            <button key={p} className="chip" style={{ padding: "5px 10px", fontSize: 12,
              background: period === p ? "var(--accent-soft)" : "transparent",
              borderColor: period === p ? "var(--accent)" : "var(--line)",
              color: period === p ? "var(--accent)" : "var(--text-2)" }} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 12 }}>Export CSV</button>
      </>}>

      {/* big KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { l: "Total return", v: "+62.4%", sub: "+ $14,287", up: true },
          { l: "vs. BTC HODL", v: "+24.1%", sub: "Outperformance", up: true },
          { l: "Sharpe ratio", v: "1.84", sub: "Net of fees" },
          { l: "Max drawdown", v: "−18.2%", sub: "Mar 4 – Mar 19", up: false },
        ].map(s => (
          <div key={s.l} className="card" style={{ padding: 20 }}>
            <div className="uppercase muted" style={{ marginBottom: 8 }}>{s.l}</div>
            <div className={`num ${s.up === true ? "up" : s.up === false ? "down" : ""}`} style={{ fontSize: 28, letterSpacing: "-0.02em" }}>{s.v}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* portfolio vs benchmark */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div className="flex jcb aic" style={{ marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 500 }}>Portfolio vs benchmark</h3>
            <p className="muted" style={{ fontSize: 12 }}>Your holdings (green) plotted against BTC (gray) and 60/40 (dashed)</p>
          </div>
          <div className="flex gap-3" style={{ fontSize: 12 }}>
            <span className="flex aic gap-1"><span style={{ width: 10, height: 2, background: "var(--accent)" }}/>Nyx Balanced</span>
            <span className="flex aic gap-1"><span style={{ width: 10, height: 2, background: "var(--text-3)" }}/>BTC</span>
            <span className="flex aic gap-1"><span style={{ width: 10, height: 2, background: "var(--text-4)", borderTop: "1px dashed" }}/>60/40 BTC/ETH</span>
          </div>
        </div>
        <DualLineChart series1={portHistory} series2={btcHistory} height={280}/>
      </div>

      {/* monthly returns + drivers */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Monthly returns</h3>
          <BarChart data={monthly.map(m => ({ label: m.m, value: m.v }))} height={200}/>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", marginTop: 8 }}>
            {monthly.map(m => (
              <div key={m.m} className="muted mono" style={{ fontSize: 10, textAlign: "center" }}>{m.m}</div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Top contributors · YTD</h3>
          <div className="col gap-3">
            {[
              { sym: "SOL", name: "Solana", contrib: 8420, pct: 38.4 },
              { sym: "ETH", name: "Ethereum", contrib: 4180, pct: 19.0 },
              { sym: "BTC", name: "Bitcoin", contrib: 3640, pct: 16.6 },
              { sym: "ARB", name: "Arbitrum", contrib: 1890, pct: 8.6 },
              { sym: "LINK", name: "Chainlink", contrib: -640, pct: -2.9 },
            ].map(c => (
              <div key={c.sym}>
                <div className="flex jcb" style={{ marginBottom: 4 }}>
                  <div className="flex aic gap-2">
                    <span className="mono" style={{ fontSize: 12 }}>{c.sym}</span>
                    <span className="muted" style={{ fontSize: 12 }}>{c.name}</span>
                  </div>
                  <span className={`num ${c.contrib >= 0 ? "up" : "down"}`} style={{ fontSize: 13 }}>
                    {c.contrib >= 0 ? "+" : ""}{fmtUSD(c.contrib, { decimals: 0 })}
                  </span>
                </div>
                <div style={{ height: 4, background: "var(--bg-2)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.abs(c.pct) * 2}%`, height: "100%",
                    background: c.contrib >= 0 ? "var(--accent)" : "var(--loss)",
                  }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* agent scoreboard + risk */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 500 }}>Agent scoreboard</h3>
            <p className="muted" style={{ fontSize: 12 }}>Trade-level performance, last 90 days</p>
          </div>
          <table className="tbl">
            <thead><tr><th>Agent</th><th style={{textAlign:"right"}}>Trades</th><th style={{textAlign:"right"}}>Win rate</th><th style={{textAlign:"right"}}>Avg P/L</th><th style={{textAlign:"right"}}>P/L</th></tr></thead>
            <tbody>
              {[
                { n: "Atlas", trades: 28, win: 71, avg: 2.1, pl: 8420 },
                { n: "Hermes", trades: 142, win: 84, avg: 0.4, pl: 2180 },
                { n: "Cassandra", trades: 9, win: 88, avg: 4.8, pl: 1640, note: "drawdown saves" },
                { n: "Argus", trades: 0, win: null, avg: null, pl: null, note: "research only" },
              ].map(a => (
                <tr key={a.n}>
                  <td><div className="flex aic gap-2"><I.Bot size={14} style={{ color: "var(--accent)" }}/>{a.n}</div></td>
                  <td className="num" style={{ textAlign: "right" }}>{a.trades}</td>
                  <td className="num" style={{ textAlign: "right" }}>{a.win !== null ? a.win + "%" : "—"}</td>
                  <td className="num" style={{ textAlign: "right" }}>{a.avg !== null ? `+${a.avg}%` : "—"}</td>
                  <td className="num up" style={{ textAlign: "right" }}>{a.pl !== null ? "+" + fmtUSD(a.pl, {decimals:0}) : a.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Risk profile</h3>
          <div className="col gap-3">
            <RiskRow label="Volatility (90d)" value="24.2%" pct={48} cap="50% mandate"/>
            <RiskRow label="Beta to BTC" value="0.82" pct={62} cap="≤ 1.0"/>
            <RiskRow label="Concentration (top 3)" value="64%" pct={64} cap="≤ 70%"/>
            <RiskRow label="Stablecoin buffer" value="8.4%" pct={42} cap="≥ 5%" inverse/>
          </div>
          <div style={{ padding: 12, background: "var(--bg-2)", borderRadius: 8, marginTop: 16, display: "flex", gap: 10 }}>
            <I.Shield size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}/>
            <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>
              Cassandra: "All metrics within mandate. I'd let Atlas keep its current tilt for another week."
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function RiskRow({ label, value, pct, cap, inverse }) {
  const color = inverse ? "var(--accent)" : (pct > 80 ? "var(--loss)" : pct > 60 ? "var(--warn)" : "var(--accent)");
  return (
    <div>
      <div className="flex jcb" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 13 }}>{label}</span>
        <div className="flex gap-2 aic">
          <span className="num" style={{ fontSize: 13 }}>{value}</span>
          <span className="muted" style={{ fontSize: 11 }}>· {cap}</span>
        </div>
      </div>
      <div style={{ height: 6, background: "var(--bg-2)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width 0.4s" }}/>
      </div>
    </div>
  );
}

function DualLineChart({ series1, series2, height = 260 }) {
  if (!series1 || !series2) return null;
  // normalize both to 100 base
  const norm = (s) => { const f = s[0]; return s.map(v => (v / f) * 100); };
  const a = norm(series1);
  const b = norm(series2);
  const baseline = a.map((_, i) => 100 + (i / a.length) * 35); // 60/40 hypothetical line
  const all = [...a, ...b, ...baseline];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1;
  const w = 1000;
  const path = (s, color, dash = false) => {
    const pts = s.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (s.length - 1)) * w} ${height - ((v - min) / range) * (height - 20) - 10}`).join(" ");
    return <path d={pts} fill="none" stroke={color} strokeWidth="1.75" strokeDasharray={dash ? "4,4" : ""}/>;
  };
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="dual-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* horizontal grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1="0" x2={w} y1={10 + t * (height - 20)} y2={10 + t * (height - 20)} stroke="var(--line)" strokeDasharray="2,4"/>
      ))}
      {/* port area */}
      <path d={(() => {
        const pts = a.map((v, i) => `${(i / (a.length - 1)) * w},${height - ((v - min) / range) * (height - 20) - 10}`);
        return `M0,${height} L ${pts.join(" L ")} L${w},${height} Z`;
      })()} fill="url(#dual-grad)"/>
      {path(baseline, "var(--text-4)", true)}
      {path(b, "var(--text-3)")}
      {path(a, "var(--accent)")}
    </svg>
  );
}

window.Statistics = Statistics;
