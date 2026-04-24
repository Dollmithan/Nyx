// Sign in + sign up onboarding

function SignIn({ navigate }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  return (
    <AuthShell>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 8 }}>Welcome back.</h1>
        <p className="muted">Your agents have been busy. Let's see what they did.</p>
      </div>
      <form className="col gap-4" onSubmit={(e) => { e.preventDefault(); navigate("dashboard"); }}>
        <div>
          <label className="label">Email</label>
          <div style={{ position: "relative" }}>
            <I.Mail size={16} style={{ position: "absolute", left: 14, top: 14, color: "var(--text-3)" }}/>
            <input className="input" style={{ paddingLeft: 40 }} type="email" placeholder="you@domain.com" value={email} onChange={e => setEmail(e.target.value)}/>
          </div>
        </div>
        <div>
          <div className="flex jcb">
            <label className="label">Password</label>
            <a className="muted" style={{ fontSize: 12 }}>Forgot?</a>
          </div>
          <div style={{ position: "relative" }}>
            <I.Lock size={16} style={{ position: "absolute", left: 14, top: 14, color: "var(--text-3)" }}/>
            <input className="input" style={{ paddingLeft: 40, paddingRight: 40 }} type={showPw ? "text" : "password"} placeholder="••••••••" value={pw} onChange={e => setPw(e.target.value)}/>
            <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 12, top: 12, color: "var(--text-3)" }}>
              <I.Eye size={16}/>
            </button>
          </div>
        </div>
        <label className="flex aic gap-2" style={{ fontSize: 13, color: "var(--text-2)", cursor: "pointer" }}>
          <input type="checkbox" defaultChecked style={{ accentColor: "oklch(0.82 0.19 145)" }}/>
          Keep me signed in for 30 days
        </label>
        <button className="btn btn-primary" type="submit" style={{ justifyContent: "center", padding: "12px 16px" }}>
          Sign in <I.ArrowRight size={14}/>
        </button>
      </form>
      <div className="flex aic gap-3" style={{ margin: "24px 0", color: "var(--text-3)" }}>
        <div className="hr" style={{ flex: 1 }}/>
        <span style={{ fontSize: 11 }}>OR</span>
        <div className="hr" style={{ flex: 1 }}/>
      </div>
      <div className="col gap-2">
        <button className="btn btn-ghost" style={{ justifyContent: "center", padding: 12 }}>
          <span style={{ fontWeight: 600, marginRight: 4 }}>G</span> Continue with Google
        </button>
        <button className="btn btn-ghost" style={{ justifyContent: "center", padding: 12 }}>
          <I.Wallet size={16}/> Connect wallet
        </button>
      </div>
      <p className="muted" style={{ fontSize: 13, textAlign: "center", marginTop: 28 }}>
        New here? <a onClick={() => navigate("signup")} style={{ color: "var(--accent)", cursor: "pointer" }}>Create an account</a>
      </p>
    </AuthShell>
  );
}

function SignUp({ navigate }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ email: "", name: "", risk: "balanced", goal: "growth", deposit: 250 });

  const next = () => step < 3 ? setStep(s => s + 1) : navigate("dashboard");
  const back = () => step > 0 ? setStep(s => s - 1) : navigate("home");

  return (
    <AuthShell wide>
      {/* progress */}
      <div className="flex aic gap-2" style={{ marginBottom: 32 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? "var(--accent)" : "var(--line)" }}/>
        ))}
      </div>

      {step === 0 && (
        <>
          <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 8 }}>Create your account</h1>
          <p className="muted" style={{ marginBottom: 32 }}>Step 1 of 4 — under a minute, we promise.</p>
          <div className="col gap-4">
            <div><label className="label">Full name</label><input className="input" placeholder="Alex Morgan" value={data.name} onChange={e => setData({...data, name: e.target.value})}/></div>
            <div><label className="label">Email</label><input className="input" type="email" placeholder="you@domain.com" value={data.email} onChange={e => setData({...data, email: e.target.value})}/></div>
            <div><label className="label">Password</label><input className="input" type="password" placeholder="At least 10 characters"/></div>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 8 }}>What's the goal?</h1>
          <p className="muted" style={{ marginBottom: 32 }}>Atlas uses this to set your portfolio's tilt.</p>
          <div className="col gap-2">
            {[
              { id: "growth", t: "Grow my money", d: "Long-term, ride the cycle. Higher highs, deeper drawdowns." },
              { id: "income", t: "Earn yield", d: "Stable returns from staking, lending, and market-neutral strategies." },
              { id: "preserve", t: "Preserve & beat inflation", d: "Conservative tilt, mostly BTC and stablecoins." },
              { id: "experiment", t: "I'm here to experiment", d: "Smaller allocations to thematic baskets, more frequent rotation." },
            ].map(o => (
              <button key={o.id} type="button" onClick={() => setData({...data, goal: o.id})}
                style={{ textAlign: "left", padding: 18, borderRadius: 12,
                  border: `1px solid ${data.goal === o.id ? "var(--accent)" : "var(--line)"}`,
                  background: data.goal === o.id ? "var(--accent-soft)" : "var(--bg-2)" }}>
                <div className="flex aic jcb">
                  <span style={{ fontWeight: 500, fontSize: 15 }}>{o.t}</span>
                  {data.goal === o.id && <I.Check size={16} stroke="var(--accent)" strokeWidth={2}/>}
                </div>
                <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>{o.d}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 8 }}>How much risk?</h1>
          <p className="muted" style={{ marginBottom: 32 }}>You can change this any time. Cassandra (your risk agent) will hold you to it.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { id: "conservative", t: "Conservative", expRet: "8–15%", expDd: "−12%", coins: "BTC, ETH, stables" },
              { id: "balanced", t: "Balanced", expRet: "20–40%", expDd: "−25%", coins: "BTC, ETH, top L1s" },
              { id: "aggressive", t: "Aggressive", expRet: "60–120%", expDd: "−45%", coins: "Mid-caps, narratives" },
            ].map(o => (
              <button key={o.id} type="button" onClick={() => setData({...data, risk: o.id})}
                style={{ textAlign: "left", padding: 20, borderRadius: 12,
                  border: `1px solid ${data.risk === o.id ? "var(--accent)" : "var(--line)"}`,
                  background: data.risk === o.id ? "var(--accent-soft)" : "var(--bg-2)" }}>
                <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 12 }}>{o.t}</div>
                <div className="col gap-1">
                  <Row k="Exp. annual return" v={<span className="num up">{o.expRet}</span>}/>
                  <Row k="Max drawdown" v={<span className="num down">{o.expDd}</span>}/>
                  <Row k="Holdings" v={<span style={{ fontSize: 12 }}>{o.coins}</span>}/>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 8 }}>Make your first deposit</h1>
          <p className="muted" style={{ marginBottom: 32 }}>Start small. You can withdraw any time without penalty.</p>
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--line)", padding: 24, borderRadius: 12, marginBottom: 16 }}>
            <div className="muted uppercase" style={{ marginBottom: 8 }}>Initial deposit</div>
            <div className="flex aic gap-1" style={{ marginBottom: 16 }}>
              <span className="num" style={{ fontSize: 56, letterSpacing: "-0.03em" }}>${data.deposit}</span>
            </div>
            <input type="range" min="50" max="5000" step="50" value={data.deposit}
              onChange={e => setData({...data, deposit: +e.target.value})}
              style={{ width: "100%", accentColor: "oklch(0.82 0.19 145)" }}/>
            <div className="flex aic gap-2" style={{ marginTop: 16 }}>
              {[50, 100, 250, 500, 1000].map(v => (
                <button key={v} type="button" className="chip" onClick={() => setData({...data, deposit: v})}>${v}</button>
              ))}
            </div>
          </div>
          <div className="col gap-2">
            {[
              { t: "Debit / credit card", d: "Instant · 1.5% fee", icon: <I.Wallet size={18}/> },
              { t: "Bank transfer (ACH)", d: "1–2 days · Free", icon: <I.Globe size={18}/> },
              { t: "Crypto wallet", d: "Network fees only", icon: <I.Key size={18}/>, picked: true },
            ].map(p => (
              <div key={p.t} style={{ padding: 16, borderRadius: 10, border: `1px solid ${p.picked ? "var(--accent)" : "var(--line)"}`, display: "flex", alignItems: "center", gap: 14, background: p.picked ? "var(--accent-soft)" : "transparent" }}>
                <span style={{ color: p.picked ? "var(--accent)" : "var(--text-3)" }}>{p.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{p.t}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{p.d}</div>
                </div>
                {p.picked && <I.Check size={16} stroke="var(--accent)" strokeWidth={2}/>}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex jcb" style={{ marginTop: 32 }}>
        <button className="btn btn-quiet" onClick={back}>{step === 0 ? "Cancel" : "Back"}</button>
        <button className="btn btn-primary" onClick={next}>
          {step === 3 ? "Activate agents" : "Continue"} <I.ArrowRight size={14}/>
        </button>
      </div>
    </AuthShell>
  );
}

function Row({ k, v }) {
  return <div className="flex aic jcb" style={{ fontSize: 12 }}><span className="muted">{k}</span><span>{v}</span></div>;
}

function AuthShell({ children, wide = false }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1.1fr", background: "var(--bg)" }}>
      <div className="grid-bg" style={{ position: "relative", padding: 48, display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid var(--line)", overflow: "hidden" }}>
        <a href="#/home" className="flex aic gap-2" style={{ position: "relative", zIndex: 2 }}>
          <I.Logo size={22}/>
          <span style={{ fontWeight: 600, fontSize: 16 }}>Nyx</span>
        </a>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 440 }}>
          <div style={{ marginBottom: 24, color: "var(--accent)" }}>
            <I.Sparkles size={28}/>
          </div>
          <p style={{ fontSize: 26, lineHeight: 1.25, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 24 }}>
            "I checked Nyx for the first time in three weeks. It had quietly rebalanced four times, dodged a 12% chop, and the journal explained every move."
          </p>
          <div className="flex aic gap-3">
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, oklch(0.6 0.18 145), oklch(0.4 0.12 240))" }}/>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Maya R.</div>
              <div className="muted" style={{ fontSize: 12 }}>Software engineer · Nyx user since '25</div>
            </div>
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 2, display: "flex", gap: 20, fontSize: 12, color: "var(--text-3)" }}>
          <span>SOC 2 Type II</span><span>Insured to $250K</span><span>Cold storage</span>
        </div>
      </div>
      <div style={{ padding: "48px 64px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="page-enter" style={{ width: "100%", maxWidth: wide ? 560 : 380 }}>{children}</div>
      </div>
    </div>
  );
}

window.SignIn = SignIn;
window.SignUp = SignUp;
