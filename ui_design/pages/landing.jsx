// Landing / hero marketing page

function Landing({ navigate }) {
  const market = useLiveMarket(2200);
  const top = market.slice(0, 6);

  return (
    <div className="page-enter" style={{ minHeight: "100vh", background: "var(--bg)", overflow: "hidden", position: "relative" }}>
      {/* glow blob */}
      <div style={{
        position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
        width: 1200, height: 600,
        background: "radial-gradient(ellipse at center, oklch(0.82 0.19 145 / 0.18), transparent 60%)",
        pointerEvents: "none", zIndex: 0,
      }}/>

      {/* nav */}
      <nav style={{ position: "relative", zIndex: 10, padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--line)" }}>
        <div className="flex aic gap-2">
          <I.Logo size={22}/>
          <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>Nyx</span>
          <span className="badge badge-line" style={{ marginLeft: 8 }}>BETA</span>
        </div>
        <div className="flex aic gap-6" style={{ fontSize: 13, color: "var(--text-2)" }}>
          <a href="#features">How it works</a>
          <a href="#agents">Agents</a>
          <a href="#performance">Performance</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="flex aic gap-3">
          <button className="btn btn-quiet" onClick={() => navigate("signin")}>Sign in</button>
          <button className="btn btn-primary" onClick={() => navigate("signup")}>Get started <I.ArrowRight size={14}/></button>
        </div>
      </nav>

      {/* hero */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 48px 60px", textAlign: "center", maxWidth: 1100, margin: "0 auto" }}>
        <div className="badge badge-line" style={{ marginBottom: 28, padding: "6px 12px", fontSize: 12 }}>
          <span className="live-dot"/> Live · 12,408 portfolios managed by Nyx agents
        </div>
        <h1 style={{ fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 0.98, fontWeight: 500, letterSpacing: "-0.04em", marginBottom: 28 }}>
          Crypto investing,<br/>
          <span style={{ color: "var(--text-3)" }}>handled by </span>
          <span style={{ background: "linear-gradient(180deg, var(--accent), oklch(0.62 0.19 145))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>autonomous AI</span>.
        </h1>
        <p style={{ fontSize: 19, color: "var(--text-2)", maxWidth: 620, margin: "0 auto 40px", lineHeight: 1.5 }}>
          You set the goal. Nyx's agents research the market, build a strategy, and execute trades — 24/7. Built for the rest of us, not Wall Street.
        </p>
        <div className="flex aic jcc gap-3" style={{ marginBottom: 80 }}>
          <button className="btn btn-primary" style={{ padding: "14px 24px", fontSize: 14 }} onClick={() => navigate("signup")}>
            Start with $50 <I.ArrowRight size={14}/>
          </button>
          <button className="btn btn-ghost" style={{ padding: "14px 24px", fontSize: 14 }} onClick={() => navigate("dashboard")}>
            See live demo
          </button>
        </div>

        {/* live tickers strip */}
        <div className="card" style={{ overflow: "hidden", padding: 0, background: "var(--bg-2)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", borderBottom: "1px solid var(--line)" }}>
            {top.map(c => (
              <div key={c.sym} style={{ padding: "16px 18px", borderRight: "1px solid var(--line)", textAlign: "left" }}>
                <div className="flex aic jcb">
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.05em" }}>{c.sym}/USD</div>
                    <TickingPrice value={c.price} prev={c.prev} decimals={c.price < 10 ? 3 : 2} className="" />
                  </div>
                  <Sparkline data={c.history.slice(-32)} width={50} height={24}/>
                </div>
                <div className={`num ${c.change24h >= 0 ? "up" : "down"}`} style={{ fontSize: 11, marginTop: 4 }}>
                  {fmtPct(c.change24h)}
                </div>
              </div>
            ))}
          </div>
          {/* preview chart strip */}
          <div style={{ padding: "8px 18px 0", textAlign: "left" }}>
            <div className="flex aic jcb" style={{ marginBottom: 4 }}>
              <div className="flex aic gap-2">
                <div className="live-dot"/>
                <span style={{ fontSize: 12, color: "var(--text-2)" }}>Nyx Balanced agent · last 30 days</span>
              </div>
              <span className="num up" style={{ fontSize: 13 }}>+18.42%</span>
            </div>
            <AreaChart data={genHeroSeries(140)} height={72} />
          </div>
        </div>
      </section>

      {/* trust strip */}
      <section style={{ padding: "40px 48px", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="flex aic jcb" style={{ maxWidth: 1100, margin: "0 auto", flexWrap: "wrap", gap: 24 }}>
          <span className="uppercase muted">Built on the rails of</span>
          <div className="flex aic gap-8" style={{ flexWrap: "wrap", color: "var(--text-3)", fontWeight: 500, fontSize: 14, letterSpacing: "-0.01em" }}>
            <span>Coinbase Custody</span>
            <span>·</span>
            <span>Fireblocks</span>
            <span>·</span>
            <span>Chainlink Oracles</span>
            <span>·</span>
            <span>SOC 2 Type II</span>
            <span>·</span>
            <span>Insured to $250K</span>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="features" style={{ padding: "120px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 64, maxWidth: 700 }}>
          <span className="uppercase" style={{ color: "var(--accent)" }}>The product</span>
          <h2 style={{ fontSize: 48, lineHeight: 1.05, fontWeight: 500, letterSpacing: "-0.03em", marginTop: 12 }}>
            Three steps. Then the agents take over.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--line)", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
          {[
            { n: "01", t: "Pick your risk", d: "Conservative, balanced, or aggressive. Or build a custom mandate in plain English.", icon: <I.Shield size={20}/> },
            { n: "02", t: "Fund your account", d: "Connect a card, bank, or existing wallet. Start with as little as $50. Withdraw anytime.", icon: <I.Wallet size={20}/> },
            { n: "03", t: "Watch agents work", d: "Nyx's agents research, allocate, and rebalance — and explain every move in your feed.", icon: <I.Bot size={20}/> },
          ].map((s, i) => (
            <div key={i} style={{ padding: 32, background: "var(--bg)", minHeight: 280 }}>
              <div className="flex aic jcb" style={{ marginBottom: 24 }}>
                <span className="mono" style={{ color: "var(--text-4)", fontSize: 13 }}>{s.n}</span>
                <div style={{ color: "var(--accent)" }}>{s.icon}</div>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 12 }}>{s.t}</h3>
              <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.55 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* agents */}
      <section id="agents" style={{ padding: "60px 48px 120px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="flex jcb" style={{ marginBottom: 48, alignItems: "flex-end", gap: 32 }}>
          <div style={{ maxWidth: 600 }}>
            <span className="uppercase" style={{ color: "var(--accent)" }}>The agents</span>
            <h2 style={{ fontSize: 48, lineHeight: 1.05, fontWeight: 500, letterSpacing: "-0.03em", marginTop: 12 }}>
              A team of specialists, not a single black box.
            </h2>
          </div>
          <p style={{ color: "var(--text-2)", fontSize: 15, maxWidth: 380 }}>
            Each agent handles one job. They debate, vote, and write down their reasoning so you can read it like a journal.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
          <div className="card" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
            <div className="badge badge-accent" style={{ marginBottom: 16 }}>Lead agent</div>
            <h3 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 12 }}>Atlas</h3>
            <p style={{ color: "var(--text-2)", marginBottom: 28, fontSize: 15, maxWidth: 480 }}>
              Sets your portfolio's overall direction. Ingests on-chain flows, ETF data, macro events, and social sentiment to allocate across themes.
            </p>
            <div className="col gap-2" style={{ fontSize: 13 }}>
              <AgentLogLine time="2 min ago" text="Increased L2 exposure: ARB +3%, OP +2%. Reasoning: bridge volume up 41% week-over-week."/>
              <AgentLogLine time="14 min ago" text="Trimmed BTC by 1.5%. Reasoning: ETF inflows decelerating; rotating to high-beta."/>
              <AgentLogLine time="1 hr ago" text="Held SOL through volatility. Reasoning: net stablecoin issuance still positive."/>
            </div>
          </div>
          <div className="col gap-3">
            {[
              { n: "Hermes", role: "Execution", desc: "Splits orders, hunts liquidity, slips less than 0.08% on average.", icon: <I.Zap size={18}/> },
              { n: "Cassandra", role: "Risk", desc: "Watches drawdown, vol, and correlation. Pulls the brakes when things break.", icon: <I.Shield size={18}/> },
              { n: "Argus", role: "Research", desc: "Reads every announcement, decodes every contract. Surfaces signals to Atlas.", icon: <I.Eye size={18}/> },
            ].map(a => (
              <div key={a.n} className="card" style={{ padding: 20, display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div>
                  <div className="flex aic gap-2">
                    <h4 style={{ fontSize: 15, fontWeight: 600 }}>{a.n}</h4>
                    <span className="muted" style={{ fontSize: 12 }}>· {a.role}</span>
                  </div>
                  <p style={{ color: "var(--text-2)", fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* performance */}
      <section id="performance" style={{ padding: "60px 48px 120px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="card" style={{ padding: 48, display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 48, alignItems: "center" }}>
          <div>
            <span className="uppercase" style={{ color: "var(--accent)" }}>Performance</span>
            <h2 style={{ fontSize: 40, lineHeight: 1.05, fontWeight: 500, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 24 }}>
              Outpaced HODL by 2.3× last cycle.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 24 }}>
              {[
                { l: "12-month return", v: "+148%", sub: "Balanced agent" },
                { l: "Max drawdown", v: "−18%", sub: "vs −62% BTC" },
                { l: "Sharpe ratio", v: "1.84", sub: "Net of fees" },
              ].map(s => (
                <div key={s.l}>
                  <div className="uppercase muted" style={{ marginBottom: 4 }}>{s.l}</div>
                  <div className="num" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>{s.v}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
              Past performance is not indicative of future results. Crypto is volatile and you may lose principal.
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <AreaChart data={genHeroSeries(180, 1, 0.022)} height={260}/>
            <div style={{ position: "absolute", top: 12, right: 0, display: "flex", gap: 12 }}>
              <span className="badge badge-accent">Nyx Balanced</span>
              <span className="badge badge-line">BTC</span>
            </div>
          </div>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" style={{ padding: "60px 48px 120px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="uppercase" style={{ color: "var(--accent)" }}>Pricing</span>
          <h2 style={{ fontSize: 48, lineHeight: 1.05, fontWeight: 500, letterSpacing: "-0.03em", marginTop: 12 }}>
            One fee. No spread games.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { n: "Starter", p: "Free", desc: "Up to $1K AUM", feats: ["1 agent strategy", "Weekly rebalancing", "Email summaries"] },
            { n: "Trader", p: "0.65%", sub: "/yr AUM", desc: "Most popular", featured: true,
              feats: ["All agents", "Real-time rebalancing", "Custom mandates", "API access"] },
            { n: "Whale", p: "Talk to us", desc: "AUM over $1M", feats: ["Dedicated agents", "OTC desk access", "1-on-1 strategy review"] },
          ].map(t => (
            <div key={t.n} className="card" style={{ padding: 28, position: "relative",
              borderColor: t.featured ? "var(--accent)" : "var(--line)",
              background: t.featured ? "linear-gradient(180deg, oklch(0.21 0.04 145), var(--surface))" : "var(--surface)" }}>
              {t.featured && <span className="badge badge-accent" style={{ position: "absolute", top: -10, right: 24 }}>Most popular</span>}
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{t.n}</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                <span className="num" style={{ fontSize: 36, letterSpacing: "-0.02em" }}>{t.p}</span>
                {t.sub && <span className="muted" style={{ fontSize: 14 }}>{t.sub}</span>}
              </div>
              <p className="muted" style={{ fontSize: 13, marginBottom: 24 }}>{t.desc}</p>
              <div className="col gap-2" style={{ marginBottom: 24 }}>
                {t.feats.map(f => (
                  <div key={f} className="flex aic gap-2" style={{ fontSize: 13 }}>
                    <I.Check size={14} stroke="var(--accent)" strokeWidth={2}/>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button className={t.featured ? "btn btn-primary" : "btn btn-ghost"} style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate("signup")}>
                Get started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "48px", display: "grid", gridTemplateColumns: "1.5fr repeat(3, 1fr)", gap: 32, maxWidth: 1400, margin: "0 auto" }}>
        <div>
          <div className="flex aic gap-2" style={{ marginBottom: 12 }}>
            <I.Logo size={20}/>
            <span style={{ fontWeight: 600 }}>Nyx</span>
          </div>
          <p className="muted" style={{ fontSize: 13, maxWidth: 280, marginBottom: 16 }}>
            Autonomous crypto investing for the rest of us.
          </p>
          <div className="flex gap-3" style={{ color: "var(--text-3)" }}>
            <I.Twitter size={16}/><I.Discord size={16}/><I.Github size={16}/>
          </div>
        </div>
        {[
          { h: "Product", l: ["Agents", "Strategies", "Performance", "Security"] },
          { h: "Resources", l: ["Docs", "Blog", "Whitepaper", "Status"] },
          { h: "Company", l: ["About", "Careers", "Press", "Contact"] },
        ].map(c => (
          <div key={c.h}>
            <div className="uppercase muted" style={{ marginBottom: 12 }}>{c.h}</div>
            <div className="col gap-2">
              {c.l.map(x => <a key={x} style={{ fontSize: 13, color: "var(--text-2)" }}>{x}</a>)}
            </div>
          </div>
        ))}
        <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--line)", paddingTop: 24, display: "flex", justifyContent: "space-between", color: "var(--text-3)", fontSize: 12 }}>
          <span>© 2026 Nyx Labs, Inc. Not investment advice. Crypto involves risk of loss.</span>
          <span>v2.4 · Built in Brooklyn & Lisbon</span>
        </div>
      </footer>
    </div>
  );
}

function AgentLogLine({ time, text }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "10px 12px", borderRadius: 8, background: "var(--bg-2)", borderLeft: "2px solid var(--accent)" }}>
      <span className="mono muted" style={{ fontSize: 11, flexShrink: 0, paddingTop: 2 }}>{time}</span>
      <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

// nice hero series
function genHeroSeries(n = 140, seed = 7, vol = 0.018) {
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const series = [];
  let p = 100;
  for (let i = 0; i < n; i++) {
    const r = (rand() - 0.5) * 2;
    p = p * (1 + 0.005 + r * vol);
    series.push(p);
  }
  return series;
}

window.Landing = Landing;
