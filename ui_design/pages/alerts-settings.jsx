// Alerts + Settings

function Alerts({ navigate }) {
  const [filter, setFilter] = useState("all");
  const alerts = [
    { id: 1, type: "trade", agent: "Hermes", title: "Buy filled · 320 ARB", body: "Filled at $1.18 avg across 6 venues. Slippage 0.04% — good.", time: "2 min ago", unread: true, severity: "ok" },
    { id: 2, type: "rebalance", agent: "Atlas", title: "Portfolio rebalanced", body: "Increased L2 exposure by 3.4%. Trimmed BTC by 2.1%. Reasoning: bridge volume +41% W/W.", time: "14 min ago", unread: true, severity: "info" },
    { id: 3, type: "risk", agent: "Cassandra", title: "Vol approaching mandate ceiling", body: "Portfolio vol at 24.2% — within 50% mandate but elevated. Watching closely.", time: "1 hr ago", unread: true, severity: "warn" },
    { id: 4, type: "signal", agent: "Argus", title: "Unusual stablecoin minting on Solana", body: "$48M USDC minted in last hour. Forwarded to Atlas. May trigger SOL allocation review.", time: "3 hr ago", severity: "info" },
    { id: 5, type: "price", agent: null, title: "BTC crossed $96,000", body: "Your alert triggered. Price hit $96,012 at 11:42 ET.", time: "5 hr ago", severity: "info" },
    { id: 6, type: "deposit", agent: null, title: "Deposit confirmed · $500", body: "ACH transfer from Chase ••4291 settled. Atlas will deploy capital within 24 hours.", time: "Yesterday", severity: "ok" },
    { id: 7, type: "risk", agent: "Cassandra", title: "Drawdown threshold hit · paused", body: "Portfolio drew down 6% in 48h. I paused new positions for 12 hours per your mandate. Resumed normally.", time: "Apr 18", severity: "warn" },
  ];
  const filtered = alerts.filter(a => filter === "all" || a.type === filter);

  return (
    <AppShell route="alerts" navigate={navigate}
      title="Alerts"
      subtitle="Everything your agents thought you should know."
      actions={<>
        <button className="btn btn-ghost" style={{ fontSize: 12 }}>Mark all read</button>
        <button className="btn btn-ghost" style={{ fontSize: 12 }}><I.Plus size={12}/> New rule</button>
      </>}>

      <div className="flex gap-2" style={{ marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { id: "all", l: "All", c: alerts.length },
          { id: "trade", l: "Trades", c: 1 },
          { id: "rebalance", l: "Rebalances", c: 1 },
          { id: "risk", l: "Risk", c: 2 },
          { id: "signal", l: "Signals", c: 1 },
          { id: "price", l: "Price alerts", c: 1 },
        ].map(f => (
          <button key={f.id} className={`chip ${filter === f.id ? "active" : ""}`} onClick={() => setFilter(f.id)}>
            {f.l} <span className="muted">{f.c}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        <div className="card" style={{ overflow: "hidden" }}>
          {filtered.map((a, i) => (
            <div key={a.id} style={{
              padding: "18px 20px",
              borderBottom: i < filtered.length - 1 ? "1px solid var(--line)" : "none",
              background: a.unread ? "var(--bg-2)" : "transparent",
              display: "flex", gap: 16,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: a.severity === "warn" ? "oklch(0.82 0.16 85 / 0.15)" : a.severity === "ok" ? "var(--accent-soft)" : "oklch(0.78 0.12 230 / 0.15)",
                color: a.severity === "warn" ? "var(--warn)" : a.severity === "ok" ? "var(--accent)" : "var(--info)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {a.type === "trade" && <I.Zap size={16}/>}
                {a.type === "rebalance" && <I.Trend size={16}/>}
                {a.type === "risk" && <I.Shield size={16}/>}
                {a.type === "signal" && <I.Sparkles size={16}/>}
                {a.type === "price" && <I.Bell size={16}/>}
                {a.type === "deposit" && <I.Wallet size={16}/>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex jcb aic" style={{ marginBottom: 4 }}>
                  <div className="flex aic gap-2">
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{a.title}</span>
                    {a.unread && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}/>}
                  </div>
                  <span className="mono muted" style={{ fontSize: 11 }}>{a.time}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5, marginBottom: 6 }}>{a.body}</p>
                {a.agent && <span className="muted" style={{ fontSize: 11 }}><I.Bot size={11} style={{ display: "inline-block", verticalAlign: -1, marginRight: 4 }}/>{a.agent}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="col gap-3">
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Notification preferences</h3>
            <div className="col gap-3">
              {[
                { l: "Trade fills", e: true, p: false },
                { l: "Rebalances", e: true, p: true },
                { l: "Risk events", e: true, p: true },
                { l: "Daily summary", e: false, p: false },
                { l: "Price alerts", e: true, p: true },
              ].map(p => (
                <div key={p.l} className="flex jcb aic" style={{ fontSize: 13 }}>
                  <span>{p.l}</span>
                  <div className="flex gap-2 aic">
                    <Toggle on={p.e} label="E"/>
                    <Toggle on={p.p} label="P"/>
                  </div>
                </div>
              ))}
            </div>
            <div className="muted" style={{ fontSize: 11, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
              E = email · P = push
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Quiet hours</h3>
            <p className="muted" style={{ fontSize: 12, marginBottom: 12 }}>Only critical risk events come through.</p>
            <div className="flex gap-2">
              <input className="input num" defaultValue="22:00" style={{ flex: 1 }}/>
              <span className="muted" style={{ alignSelf: "center" }}>to</span>
              <input className="input num" defaultValue="07:00" style={{ flex: 1 }}/>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Toggle({ on, label }) {
  const [v, setV] = useState(on);
  return (
    <button onClick={() => setV(!v)} style={{
      width: 36, height: 20, borderRadius: 10, padding: 2,
      background: v ? "var(--accent)" : "var(--line)", position: "relative", transition: "all 0.2s",
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: "50%", background: v ? "#061a0d" : "var(--text-3)",
        transform: v ? "translateX(16px)" : "translateX(0)", transition: "transform 0.2s",
      }}/>
    </button>
  );
}

function Settings({ navigate }) {
  const [tab, setTab] = useState("account");

  return (
    <AppShell route="settings" navigate={navigate}
      title="Settings"
      subtitle="Account, security, and the things only you should change."
      actions={<button className="btn btn-quiet" onClick={() => navigate("home")}><I.Logout size={14}/> Sign out</button>}>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 32 }}>
        <div className="col gap-1" style={{ position: "sticky", top: 32, alignSelf: "start" }}>
          {[
            { id: "account", l: "Account", icon: <I.User size={14}/> },
            { id: "security", l: "Security", icon: <I.Shield size={14}/> },
            { id: "agents", l: "Agent mandate", icon: <I.Bot size={14}/> },
            { id: "api", l: "API keys", icon: <I.Key size={14}/> },
            { id: "billing", l: "Billing", icon: <I.Wallet size={14}/> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`nav-item ${tab === t.id ? "active" : ""}`} style={{ width: "100%", justifyContent: "flex-start" }}>
              {t.icon} {t.l}
            </button>
          ))}
        </div>

        <div className="col gap-3" style={{ maxWidth: 720 }}>
          {tab === "account" && <>
            <SettingsSection title="Profile" desc="How you appear in the app.">
              <div className="flex aic gap-4" style={{ marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, oklch(0.6 0.18 145), oklch(0.4 0.12 240))" }}/>
                <div>
                  <button className="btn btn-ghost" style={{ fontSize: 12 }}>Upload</button>
                  <p className="muted" style={{ fontSize: 11, marginTop: 8 }}>PNG or JPG, up to 2MB</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label className="label">Full name</label><input className="input" defaultValue="Alex Morgan"/></div>
                <div><label className="label">Display name</label><input className="input" defaultValue="alex"/></div>
                <div style={{ gridColumn: "1 / -1" }}><label className="label">Email</label><input className="input" defaultValue="alex@nyx.fi"/></div>
                <div><label className="label">Country</label><select className="input" defaultValue="US"><option>United States</option><option>Canada</option><option>UK</option></select></div>
                <div><label className="label">Timezone</label><select className="input"><option>America/New_York</option><option>America/Los_Angeles</option></select></div>
              </div>
            </SettingsSection>
            <SettingsSection title="Display" desc="Aesthetic preferences.">
              <SettingsRow label="Currency" v={<select className="input" style={{ width: 140 }}><option>USD</option><option>EUR</option><option>GBP</option></select>}/>
              <SettingsRow label="Number format" v={<select className="input" style={{ width: 140 }}><option>1,000.00</option><option>1.000,00</option></select>}/>
              <SettingsRow label="Hide small balances" v={<Toggle on={true}/>}/>
            </SettingsSection>
          </>}

          {tab === "security" && <>
            <SettingsSection title="Password" desc="Last changed 47 days ago.">
              <div className="col gap-3">
                <div><label className="label">Current password</label><input type="password" className="input" placeholder="••••••••"/></div>
                <div><label className="label">New password</label><input type="password" className="input"/></div>
                <button className="btn btn-primary" style={{ alignSelf: "flex-start" }}>Update password</button>
              </div>
            </SettingsSection>
            <SettingsSection title="Two-factor authentication" desc="Required for withdrawals over $1K.">
              <SettingsRow label="Authenticator app" v={<><span className="badge badge-accent">Enabled</span></>} sub="Synced with 1Password"/>
              <SettingsRow label="SMS backup" v={<Toggle on={false}/>} sub="Recommended off — SIM swap risk"/>
              <SettingsRow label="Hardware key" v={<button className="btn btn-ghost" style={{ fontSize: 12 }}>Add YubiKey</button>}/>
            </SettingsSection>
            <SettingsSection title="Active sessions" desc="Sign out devices you don't recognize.">
              {[
                { d: "MacBook Pro · Brooklyn, NY", b: "Chrome 132 · Current session", t: "Now", current: true },
                { d: "iPhone 15 · Brooklyn, NY", b: "Nyx iOS 2.4.1", t: "2 hours ago" },
                { d: "Unknown · Lagos, NG", b: "Chrome 130", t: "Apr 18" },
              ].map((s, i) => (
                <div key={i} className="flex jcb aic" style={{ padding: "12px 0", borderBottom: i < 2 ? "1px solid var(--line)" : "none" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{s.d}{s.current && <span className="badge badge-accent" style={{ marginLeft: 8 }}>This device</span>}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{s.b} · {s.t}</div>
                  </div>
                  {!s.current && <button className="btn btn-quiet" style={{ fontSize: 12, color: "var(--loss)" }}>Revoke</button>}
                </div>
              ))}
            </SettingsSection>
          </>}

          {tab === "agents" && <>
            <SettingsSection title="Mandate" desc="The rules your agents must follow. Cassandra enforces these.">
              <SettingsRow label="Max drawdown" v={<input className="input num" defaultValue="−25%" style={{ width: 100 }}/>}/>
              <SettingsRow label="Max single position" v={<input className="input num" defaultValue="35%" style={{ width: 100 }}/>}/>
              <SettingsRow label="Stablecoin floor" v={<input className="input num" defaultValue="5%" style={{ width: 100 }}/>}/>
              <SettingsRow label="Allowed asset universe" v={<button className="btn btn-ghost" style={{ fontSize: 12 }}>Top 50 by mcap · Edit</button>}/>
            </SettingsSection>
            <SettingsSection title="Agent autonomy" desc="When can agents act without asking you?">
              <SettingsRow label="Trades under $500" v={<select className="input" defaultValue="auto" style={{ width: 200 }}><option value="auto">Execute automatically</option><option>Notify only</option><option>Ask first</option></select>}/>
              <SettingsRow label="Trades $500–$5,000" v={<select className="input" defaultValue="notify" style={{ width: 200 }}><option>Execute automatically</option><option value="notify">Notify only</option><option>Ask first</option></select>}/>
              <SettingsRow label="Trades over $5,000" v={<select className="input" defaultValue="ask" style={{ width: 200 }}><option>Execute automatically</option><option>Notify only</option><option value="ask">Ask first</option></select>}/>
              <SettingsRow label="Move to stables in panic" v={<Toggle on={true}/>} sub="Cassandra can pull the brake without asking"/>
            </SettingsSection>
          </>}

          {tab === "api" && <>
            <SettingsSection title="API keys" desc="For algo traders. Read-only by default.">
              {[
                { name: "Personal trading bot", scope: "Trade · Read", created: "Mar 12, 2026", last: "2 hours ago" },
                { name: "Portfolio tracker", scope: "Read", created: "Jan 4, 2026", last: "Yesterday" },
              ].map((k, i) => (
                <div key={i} className="flex jcb aic" style={{ padding: "14px 0", borderBottom: i < 1 ? "1px solid var(--line)" : "none" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{k.name}</div>
                    <div className="flex aic gap-2 muted" style={{ fontSize: 11, marginTop: 2 }}>
                      <span className="mono">nyx_••••••••••a4f2</span>
                      <span>·</span><span className="badge badge-line">{k.scope}</span>
                      <span>·</span><span>Created {k.created}</span>
                      <span>·</span><span>Last used {k.last}</span>
                    </div>
                  </div>
                  <button className="btn btn-quiet" style={{ fontSize: 12, color: "var(--loss)" }}>Revoke</button>
                </div>
              ))}
              <button className="btn btn-primary" style={{ fontSize: 12, marginTop: 16 }}><I.Plus size={12}/> Create API key</button>
            </SettingsSection>
            <SettingsSection title="Webhooks" desc="Get notified at your endpoint.">
              <div className="flex gap-2">
                <input className="input mono" placeholder="https://your-server.com/webhook" defaultValue="https://hooks.alex.dev/nyx"/>
                <button className="btn btn-ghost">Test</button>
              </div>
            </SettingsSection>
          </>}

          {tab === "billing" && <>
            <SettingsSection title="Plan" desc="You're on the Trader plan.">
              <div style={{ padding: 20, background: "linear-gradient(135deg, oklch(0.21 0.04 145), var(--surface))", borderRadius: 12, border: "1px solid var(--line)" }}>
                <div className="flex jcb aic">
                  <div>
                    <div className="flex aic gap-2"><span style={{ fontSize: 18, fontWeight: 500 }}>Trader</span><span className="badge badge-accent">Active</span></div>
                    <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>0.65% / yr on AUM · billed monthly</p>
                  </div>
                  <button className="btn btn-ghost" style={{ fontSize: 12 }}>Change plan</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
                  <div><div className="muted uppercase" style={{ marginBottom: 4 }}>This month</div><div className="num">$24.18</div></div>
                  <div><div className="muted uppercase" style={{ marginBottom: 4 }}>YTD</div><div className="num">$87.42</div></div>
                  <div><div className="muted uppercase" style={{ marginBottom: 4 }}>Next bill</div><div className="num">May 1</div></div>
                </div>
              </div>
            </SettingsSection>
            <SettingsSection title="Payment method" desc="Used for subscription fees only. Deposits are separate.">
              <div className="flex aic gap-3" style={{ padding: 14, background: "var(--bg-2)", borderRadius: 10 }}>
                <div style={{ width: 40, height: 28, borderRadius: 4, background: "var(--line-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em" }}>VISA</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>Visa ending 4291</div>
                  <div className="muted" style={{ fontSize: 11 }}>Expires 09/27</div>
                </div>
                <button className="btn btn-quiet" style={{ fontSize: 12 }}>Replace</button>
              </div>
            </SettingsSection>
          </>}
        </div>
      </div>
    </AppShell>
  );
}

function SettingsSection({ title, desc, children }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500 }}>{title}</h3>
        {desc && <p className="muted" style={{ fontSize: 12, marginTop: 2 }}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}
function SettingsRow({ label, v, sub }) {
  return (
    <div className="flex jcb aic" style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
      <div>
        <div style={{ fontSize: 13 }}>{label}</div>
        {sub && <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{sub}</div>}
      </div>
      {v}
    </div>
  );
}

window.Alerts = Alerts;
window.Settings = Settings;
