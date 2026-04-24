// Asset detail / chart view

function AssetDetail({ navigate }) {
  const market = useLiveMarket(1500);
  const [sym, setSym] = useState("BTC");
  const coin = market.find(c => c.sym === sym) || market[0];
  const [tf, setTf] = useState("1D");
  const [orderType, setOrderType] = useState("market");
  const [side, setSide] = useState("buy");
  const [amount, setAmount] = useState("250");

  const candles = useMemo(() => toCandles(coin.history, 2), [coin.sym, coin.history.length]);

  return (
    <AppShell route="asset" navigate={navigate}
      title="Markets"
      subtitle="Live prices across 24 venues. Trade manually or hand it to Hermes."
      actions={<button className="btn btn-ghost" style={{ fontSize: 12 }}><I.Search size={12}/> Find asset</button>}>

      {/* coin pills */}
      <div className="flex gap-2" style={{ marginBottom: 20, flexWrap: "wrap" }}>
        {market.slice(0, 8).map(c => (
          <button key={c.sym} className={`chip ${c.sym === sym ? "active" : ""}`} onClick={() => setSym(c.sym)}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: c.color }}/>
            {c.sym}
            <span className="num muted">{fmtUSD(c.price, { decimals: c.price < 10 ? 3 : 2 })}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        {/* main chart card */}
        <div className="card" style={{ padding: 24 }}>
          <div className="flex aic jcb" style={{ marginBottom: 24 }}>
            <div className="flex aic gap-3">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: coin.color, opacity: 0.18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="mono" style={{ fontWeight: 600, color: coin.color }}>{coin.sym.slice(0,2)}</span>
              </div>
              <div>
                <div className="flex aic gap-2">
                  <h2 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>{coin.name}</h2>
                  <span className="muted mono">{coin.sym}/USD</span>
                </div>
                <div className="flex aic gap-3" style={{ marginTop: 4 }}>
                  <TickingPrice value={coin.price} prev={coin.prev} decimals={coin.price < 10 ? 3 : 2} className="" />
                  <span className={`num ${coin.change24h >= 0 ? "up" : "down"}`} style={{ fontSize: 13 }}>
                    {fmtPct(coin.change24h)} <span className="muted">· 24h</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              {["15m","1H","4H","1D","1W","1M"].map(t => (
                <button key={t} className="chip" style={{ padding: "4px 10px", fontSize: 11,
                  background: tf === t ? "var(--accent-soft)" : "transparent",
                  borderColor: tf === t ? "var(--accent)" : "var(--line)",
                  color: tf === t ? "var(--accent)" : "var(--text-2)" }}
                  onClick={() => setTf(t)}>{t}</button>
              ))}
            </div>
          </div>

          <CandlestickChart data={candles.slice(-60)} height={320}/>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
            {[
              { l: "Market cap", v: fmtUSD(coin.price * 19.7e6, { compact: true, decimals: 1 }) },
              { l: "24h volume", v: fmtUSD(coin.price * 320000, { compact: true, decimals: 1 }) },
              { l: "24h high", v: fmtUSD(Math.max(...coin.history.slice(-25)), { decimals: 2 }) },
              { l: "24h low", v: fmtUSD(Math.min(...coin.history.slice(-25)), { decimals: 2 }) },
              { l: "Your position", v: coin.holdings ? `${coin.holdings} ${coin.sym}` : "—" },
            ].map(s => (
              <div key={s.l}>
                <div className="uppercase muted" style={{ marginBottom: 4 }}>{s.l}</div>
                <div className="num" style={{ fontSize: 14 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* trade panel */}
        <div className="col gap-3">
          <div className="card" style={{ padding: 20 }}>
            <div className="flex" style={{ background: "var(--bg-2)", borderRadius: 8, padding: 3, marginBottom: 16 }}>
              {["buy","sell"].map(s => (
                <button key={s} onClick={() => setSide(s)} style={{
                  flex: 1, padding: "8px 12px", borderRadius: 6, fontSize: 13, fontWeight: 500,
                  background: side === s ? (s === "buy" ? "var(--accent)" : "var(--loss)") : "transparent",
                  color: side === s ? (s === "buy" ? "#061a0d" : "#fff") : "var(--text-2)",
                  textTransform: "capitalize"
                }}>{s} {coin.sym}</button>
              ))}
            </div>
            <div className="flex gap-1" style={{ marginBottom: 16 }}>
              {["market","limit","stop"].map(o => (
                <button key={o} className="chip" style={{ flex: 1, justifyContent: "center", padding: "5px 0", fontSize: 11,
                  background: orderType === o ? "var(--accent-soft)" : "transparent",
                  borderColor: orderType === o ? "var(--accent)" : "var(--line)",
                  color: orderType === o ? "var(--accent)" : "var(--text-2)",
                  textTransform: "capitalize" }} onClick={() => setOrderType(o)}>{o}</button>
              ))}
            </div>
            <label className="label">Amount (USD)</label>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <span style={{ position: "absolute", left: 14, top: 11, color: "var(--text-3)" }}>$</span>
              <input className="input num" style={{ paddingLeft: 26, fontSize: 18, fontWeight: 500 }} value={amount} onChange={e => setAmount(e.target.value)}/>
            </div>
            <div className="flex gap-1" style={{ marginBottom: 16 }}>
              {["25","50","100","250","Max"].map(v => (
                <button key={v} className="chip" style={{ flex: 1, justifyContent: "center", padding: "4px 0", fontSize: 11 }} onClick={() => v !== "Max" && setAmount(v)}>{v === "Max" ? v : "$" + v}</button>
              ))}
            </div>
            {orderType === "limit" && (
              <>
                <label className="label">Limit price</label>
                <input className="input num" defaultValue={coin.price.toFixed(2)} style={{ marginBottom: 12 }}/>
              </>
            )}
            <div className="col gap-1" style={{ padding: 12, background: "var(--bg-2)", borderRadius: 8, fontSize: 12, marginBottom: 16 }}>
              <div className="flex jcb"><span className="muted">You'll receive</span><span className="num">{(parseFloat(amount || 0) / coin.price).toFixed(6)} {coin.sym}</span></div>
              <div className="flex jcb"><span className="muted">Network fee</span><span className="num">$0.00</span></div>
              <div className="flex jcb"><span className="muted">Nyx fee (0.1%)</span><span className="num">${(parseFloat(amount || 0) * 0.001).toFixed(2)}</span></div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px 16px",
              background: side === "buy" ? "var(--accent)" : "var(--loss)",
              color: side === "buy" ? "#061a0d" : "#fff" }}>
              {side === "buy" ? "Buy" : "Sell"} {coin.sym}
            </button>
            <p className="muted" style={{ fontSize: 11, textAlign: "center", marginTop: 10, lineHeight: 1.4 }}>
              Hermes will route your order across 6 venues for best price.
            </p>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div className="flex aic gap-2" style={{ marginBottom: 12 }}>
              <I.Sparkles size={14} style={{ color: "var(--accent)" }}/>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Atlas on {coin.sym}</span>
            </div>
            <div className="flex aic gap-2" style={{ marginBottom: 12 }}>
              <span className="badge badge-accent">Bullish</span>
              <span className="muted" style={{ fontSize: 11 }}>Confidence 72%</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>
              {coin.sym === "BTC" && "ETF flows decelerating. I'm trimming on strength but core position stays intact through the cycle."}
              {coin.sym === "ETH" && "Pectra upgrade landing in 6 weeks. Net L1 fees up. I'm holding through this consolidation."}
              {coin.sym === "SOL" && "REV is up 38% week-over-week. Memecoin rotation favoring SOL infra. Adding on dips below $180."}
              {!["BTC","ETH","SOL"].includes(coin.sym) && "Watching liquidity and on-chain activity. No clear edge yet — waiting for confirmation."}
            </p>
          </div>
        </div>
      </div>

      {/* recent trades + order book */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 500 }}>Recent agent trades · {coin.sym}</h3>
          </div>
          <table className="tbl">
            <thead><tr><th>Time</th><th>Side</th><th>Agent</th><th style={{ textAlign: "right" }}>Price</th><th style={{ textAlign: "right" }}>Size</th></tr></thead>
            <tbody>
              {[
                { t: "14:32", side: "buy", agent: "Hermes", price: coin.price * 0.998, size: 0.012 },
                { t: "11:08", side: "buy", agent: "Hermes", price: coin.price * 0.992, size: 0.024 },
                { t: "Mon", side: "sell", agent: "Hermes", price: coin.price * 1.018, size: 0.008 },
                { t: "Sun", side: "buy", agent: "Hermes", price: coin.price * 0.974, size: 0.041 },
                { t: "Sun", side: "buy", agent: "Hermes", price: coin.price * 0.962, size: 0.018 },
              ].map((t, i) => (
                <tr key={i}>
                  <td className="mono muted" style={{ fontSize: 12 }}>{t.t}</td>
                  <td><span className={`badge ${t.side === "buy" ? "badge-accent" : "badge-loss"}`}>{t.side.toUpperCase()}</span></td>
                  <td style={{ fontSize: 12 }}>{t.agent}</td>
                  <td className="num" style={{ textAlign: "right" }}>{fmtUSD(t.price)}</td>
                  <td className="num" style={{ textAlign: "right" }}>{t.size} {coin.sym}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Order book · aggregated</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 12 }}>
            <div>
              <div className="flex jcb muted uppercase" style={{ marginBottom: 6 }}><span>Bid</span><span>Size</span></div>
              {[0,1,2,3,4,5,6].map(i => {
                const p = coin.price * (1 - (i+1) * 0.0008);
                const sz = (Math.random() * 8 + 1).toFixed(3);
                return (
                  <div key={i} className="flex jcb" style={{ padding: "5px 8px", borderRadius: 4, background: `linear-gradient(to left, var(--accent-soft) ${i*8+12}%, transparent ${i*8+12}%)`, marginBottom: 1 }}>
                    <span className="num up">{p.toFixed(2)}</span>
                    <span className="num muted">{sz}</span>
                  </div>
                );
              })}
            </div>
            <div>
              <div className="flex jcb muted uppercase" style={{ marginBottom: 6 }}><span>Ask</span><span>Size</span></div>
              {[0,1,2,3,4,5,6].map(i => {
                const p = coin.price * (1 + (i+1) * 0.0008);
                const sz = (Math.random() * 8 + 1).toFixed(3);
                return (
                  <div key={i} className="flex jcb" style={{ padding: "5px 8px", borderRadius: 4, background: `linear-gradient(to right, var(--loss-soft) ${i*8+12}%, transparent ${i*8+12}%)`, marginBottom: 1 }}>
                    <span className="num down">{p.toFixed(2)}</span>
                    <span className="num muted">{sz}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

window.AssetDetail = AssetDetail;
