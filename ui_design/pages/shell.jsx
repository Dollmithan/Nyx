// App shell — sidebar + topbar — used by dashboard, asset detail, stats, alerts, settings

function AppShell({ route, navigate, children, title, subtitle, actions }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "232px 1fr", minHeight: "100vh", background: "var(--bg)" }}>
      {/* sidebar */}
      <aside style={{ borderRight: "1px solid var(--line)", padding: "20px 14px", display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 0, height: "100vh" }}>
        <div className="flex aic gap-2" style={{ padding: "4px 10px 16px" }}>
          <I.Logo size={22}/>
          <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>Nyx</span>
          <span className="badge badge-line" style={{ marginLeft: "auto", fontSize: 10 }}>BETA</span>
        </div>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <I.Search size={14} style={{ position: "absolute", left: 11, top: 9, color: "var(--text-3)" }}/>
          <input className="input" placeholder="Search" style={{ paddingLeft: 32, padding: "6px 10px 6px 32px", fontSize: 13, background: "var(--bg)" }}/>
          <span className="mono" style={{ position: "absolute", right: 8, top: 7, fontSize: 11, color: "var(--text-4)", border: "1px solid var(--line)", padding: "1px 5px", borderRadius: 4 }}>⌘K</span>
        </div>
        <NavSection title="Overview">
          <NavItem active={route === "dashboard"} onClick={() => navigate("dashboard")} icon={<I.Home className="nav-icon"/>}>Dashboard</NavItem>
          <NavItem active={route === "asset"} onClick={() => navigate("asset")} icon={<I.Chart className="nav-icon"/>}>Markets</NavItem>
          <NavItem active={route === "stats"} onClick={() => navigate("stats")} icon={<I.Trend className="nav-icon"/>}>Statistics</NavItem>
        </NavSection>
        <NavSection title="Agents">
          <NavItem icon={<I.Bot className="nav-icon"/>}>Atlas <Pill>Lead</Pill></NavItem>
          <NavItem icon={<I.Zap className="nav-icon"/>}>Hermes</NavItem>
          <NavItem icon={<I.Shield className="nav-icon"/>}>Cassandra</NavItem>
          <NavItem icon={<I.Eye className="nav-icon"/>}>Argus</NavItem>
        </NavSection>
        <NavSection title="Account">
          <NavItem active={route === "alerts"} onClick={() => navigate("alerts")} icon={<I.Bell className="nav-icon"/>}>Alerts <Pill green>3</Pill></NavItem>
          <NavItem active={route === "settings"} onClick={() => navigate("settings")} icon={<I.Settings className="nav-icon"/>}>Settings</NavItem>
        </NavSection>
        <div style={{ marginTop: "auto" }}>
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--line)", padding: 12, borderRadius: 10, marginBottom: 8 }}>
            <div className="flex aic gap-2" style={{ marginBottom: 6 }}>
              <div className="live-dot"/>
              <span style={{ fontSize: 12, fontWeight: 500 }}>Agents active</span>
            </div>
            <p className="muted" style={{ fontSize: 11, lineHeight: 1.4 }}>3 trades in the last hour. Atlas is bullish on L2s.</p>
          </div>
          <button className="nav-item" style={{ width: "100%" }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, oklch(0.6 0.18 145), oklch(0.4 0.12 240))" }}/>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>Alex Morgan</div>
              <div className="muted" style={{ fontSize: 11 }}>Trader plan</div>
            </div>
            <I.More size={14}/>
          </button>
        </div>
      </aside>
      {/* main */}
      <main style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ borderBottom: "1px solid var(--line)", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>{title}</h1>
            {subtitle && <p className="muted" style={{ fontSize: 13, marginTop: 2 }}>{subtitle}</p>}
          </div>
          <div className="flex aic gap-2">
            {actions}
            <button className="btn btn-ghost" style={{ padding: 10 }}><I.Bell size={16}/></button>
          </div>
        </header>
        <div className="page-enter" style={{ flex: 1, padding: 32, minWidth: 0 }}>{children}</div>
      </main>
    </div>
  );
}

function NavSection({ title, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div className="uppercase" style={{ color: "var(--text-4)", padding: "12px 12px 6px", fontSize: 10 }}>{title}</div>
      <div className="col" style={{ gap: 1 }}>{children}</div>
    </div>
  );
}
function NavItem({ active, icon, children, onClick }) {
  return (
    <button onClick={onClick} className={`nav-item ${active ? "active" : ""}`} style={{ width: "100%", justifyContent: "flex-start" }}>
      {icon}
      <span style={{ flex: 1, textAlign: "left" }}>{children}</span>
    </button>
  );
}
function Pill({ children, green }) {
  return <span style={{ marginLeft: "auto", fontSize: 10, padding: "2px 6px", borderRadius: 4, background: green ? "var(--accent-soft)" : "var(--line)", color: green ? "var(--accent)" : "var(--text-3)", fontWeight: 500 }}>{children}</span>;
}

window.AppShell = AppShell;
