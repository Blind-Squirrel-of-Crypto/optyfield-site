"use client";
import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════
// SITE CONFIG — Toggle features here
// ═══════════════════════════════════════════
const CONFIG = {
  SHOW_BOOK_DEMO: true,
  SHOW_PRICING: true,
  PRICING_COMING_SOON: true,
  CONTACT_EMAIL: "hello@optyfield.com",
  PHONE: "281-932-9345",
  FORMSPREE_ID: "",
};

// ═══════════════════════════════════════════
// BRAND TOKENS
// ═══════════════════════════════════════════
const C = {
  navy: "#0B1426", navyLight: "#1A2744", navyMid: "#0F1B33",
  red: "#EF4444", redLight: "#FF8080", redDark: "#DC2626",
  redGlow: "rgba(239,68,68,0.15)",
  white: "#F0F2F5", offWhite: "#F8F9FB",
  gray: "#6B7280", grayLight: "#9CA3AF", grayDark: "#374151",
  bg: "#FFFFFF", surfaceLight: "#F3F4F6",
};

const GEAR_PATH = "M80,57 L84.669,52.553 L90.45,54.947 L90.607,61.393 L90.607,61.393 L97.053,61.55 L99.447,67.331 L95,72 L95,72 L99.447,76.669 L97.053,82.45 L90.607,82.607 L90.607,82.607 L90.45,89.053 L84.669,91.447 L80,87 L80,87 L75.331,91.447 L69.55,89.053 L69.393,82.607 L69.393,82.607 L62.947,82.45 L60.553,76.669 L65,72 L65,72 L60.553,67.331 L62.947,61.55 L69.393,61.393 L69.393,61.393 L69.55,54.947 L75.331,52.553 L80,57 Z";
const SHIELD_PATH = "M80,32 C91.4,32 118,44 118,60.8 C118,84.8 102.8,106.4 80,128 C57.2,106.4 42,84.8 42,60.8 C42,44 68.6,32 80,32Z";

// ═══════════════════════════════════════════
// SVG LOGO COMPONENTS
// ═══════════════════════════════════════════
function ShieldLogo({ size = 64 }) {
  const id = "sl" + size;
  return (
    <svg viewBox="38 28 84 104" width={size * 0.808} height={size} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A2744"/><stop offset="100%" stopColor="#0B1426"/>
        </linearGradient>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d={SHIELD_PATH} fill={`url(#grad-${id})`} stroke="#EF4444" strokeWidth="1.5"/>
      <g filter={`url(#glow-${id})`}>
        <path d={GEAR_PATH} fill="none" stroke="#EF4444" strokeWidth="1.8"/>
        <circle cx="80" cy="72" r="9" fill="none" stroke="#EF4444" strokeWidth="1.2"/>
        <circle cx="80" cy="72" r="3.5" fill="#EF4444"/>
      </g>
      <path d="M75,73 L79,77 L86,69" fill="none" stroke="#FF8080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Logo({ height = 36, theme = "light", showSub = false }) {
  const id = `wm-${theme}-${showSub ? "s" : "n"}-${height}`;
  const textFill = theme === "dark" ? "#F8FAFC" : "#0B1426";
  const textY = showSub ? 32 : 38;
  return (
    <svg viewBox="0 0 278.46 70" height={height} style={{ display: "block", width: "auto" }}>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A2744"/><stop offset="100%" stopColor="#0B1426"/>
        </linearGradient>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g transform="translate(0, 5) scale(0.5769) translate(-38, -28)">
        <path d={SHIELD_PATH} fill={`url(#grad-${id})`} stroke="#EF4444" strokeWidth="1.5"/>
        <g filter={`url(#glow-${id})`}>
          <path d={GEAR_PATH} fill="none" stroke="#EF4444" strokeWidth="1.8"/>
          <circle cx="80" cy="72" r="9" fill="none" stroke="#EF4444" strokeWidth="1.2"/>
          <circle cx="80" cy="72" r="3.5" fill="#EF4444"/>
        </g>
        <path d="M75,73 L79,77 L86,69" fill="none" stroke="#FF8080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <text x="58.46" y={textY} fontFamily="'DM Sans', 'Segoe UI', Arial, sans-serif" fontSize="30" fontWeight="700" letterSpacing="-0.5">
        <tspan fill={textFill}>Opty</tspan><tspan fill="#EF4444">Field</tspan>
      </text>
      {showSub && (
        <text x="58.46" y="56" fontFamily="'DM Sans', 'Segoe UI', Arial, sans-serif" fontSize="9" fill={theme === "dark" ? "#8899AA" : "#0B1426"} letterSpacing="2.5" fontWeight="400">FIELD SERVICE CRM</text>
      )}
    </svg>
  );
}

// ═══════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════
function FadeIn({ children, delay = 0, style = {} }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (<div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`, ...style }}>{children}</div>);
}

function Button({ children, variant = "primary", size = "md", onClick, style = {} }) {
  const [hov, setHov] = useState(false);
  const base = { fontFamily: "'DM Sans', sans-serif", fontWeight: 700, border: "none", cursor: "pointer", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.25s ease", whiteSpace: "nowrap" };
  const sizes = { sm: { padding: "8px 18px", fontSize: 13 }, md: { padding: "12px 28px", fontSize: 14 }, lg: { padding: "16px 36px", fontSize: 16 } };
  const variants = {
    primary: { background: hov ? C.redDark : C.red, color: "#fff", boxShadow: hov ? `0 8px 30px ${C.redGlow}` : `0 4px 16px ${C.redGlow}` },
    secondary: { background: hov ? C.surfaceLight : "transparent", color: C.navy, border: `1.5px solid ${C.navy}22` },
    ghost: { background: "transparent", color: hov ? C.red : C.navy },
    white: { background: hov ? "#fff" : "rgba(255,255,255,0.95)", color: C.navy, boxShadow: hov ? "0 8px 30px rgba(0,0,0,0.15)" : "0 4px 16px rgba(0,0,0,0.08)" }
  };
  return (<button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>{children}</button>);
}

function SectionLabel({ children }) {
  return (<div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: C.red, fontWeight: 700, marginBottom: 12 }}>{children}</div>);
}

function SectionTitle({ children, light = false }) {
  return (<h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: light ? "#fff" : C.navy, letterSpacing: -0.5, lineHeight: 1.15, margin: "0 0 16px" }}>{children}</h2>);
}

function Container({ children, style = {} }) {
  return (<div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px", ...style }}>{children}</div>);
}

const Icons = {
  dispatch: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>),
  ai: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>),
  mobile: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>),
  portal: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>),
  route: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>),
  inventory: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>),
  quickbooks: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>),
  offline: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>),
  estimate: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>),
  check: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  arrow: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>),
  menu: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>),
  close: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  const links = [{ id: "home", label: "Home" }, { id: "features", label: "Features" }, ...(CONFIG.SHOW_PRICING ? [{ id: "pricing", label: "Pricing" }] : []), { id: "about", label: "About" }, { id: "contact", label: "Contact" }];
  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", borderBottom: scrolled ? "1px solid #E5E7EB" : "1px solid transparent", transition: "all 0.3s ease" }}>
        <Container>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
            <div onClick={() => setPage("home")} style={{ cursor: "pointer" }}><Logo height={44} theme="light" showSub={true} /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
              {links.map((l) => (<span key={l.id} onClick={() => setPage(l.id)} style={{ fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", color: page === l.id ? C.red : C.grayDark, transition: "color 0.2s ease" }}>{l.label}</span>))}
              {CONFIG.SHOW_BOOK_DEMO && (<Button size="sm" onClick={() => setPage("contact")}>Book a Demo</Button>)}
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn" style={{ background: "none", border: "none", cursor: "pointer", color: C.navy, display: "none" }}>{mobileOpen ? Icons.close : Icons.menu}</button>
          </div>
        </Container>
      </nav>
      {mobileOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, bottom: 0, zIndex: 999, background: "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", padding: "32px 24px", gap: 8 }}>
          {links.map((l) => (<span key={l.id} onClick={() => { setPage(l.id); setMobileOpen(false); }} style={{ fontSize: 20, fontWeight: 600, padding: "12px 0", fontFamily: "'DM Sans', sans-serif", color: page === l.id ? C.red : C.navy, cursor: "pointer", borderBottom: `1px solid ${C.surfaceLight}` }}>{l.label}</span>))}
          {CONFIG.SHOW_BOOK_DEMO && (<div style={{ marginTop: 16 }}><Button size="lg" onClick={() => { setPage("contact"); setMobileOpen(false); }} style={{ width: "100%", justifyContent: "center" }}>Book a Demo</Button></div>)}
        </div>
      )}
      <style>{`@media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-menu-btn { display: block !important; } }`}</style>
    </>
  );
}

// ═══════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════
function Footer({ setPage }) {
  return (
    <footer style={{ background: C.navy, color: "#fff", padding: "64px 0 32px" }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <div onClick={() => setPage("home")} style={{ cursor: "pointer" }}><Logo height={80} theme="dark" showSub={true} /></div>
            <p style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.7, marginTop: 16 }}>Built by field service veterans for teams that move. Dispatching, estimating, and customer management — all in one platform.</p>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.grayLight, marginBottom: 16 }}>Product</div>
            {["Features", ...(CONFIG.SHOW_PRICING ? ["Pricing"] : []), "About"].map((l) => (<div key={l} onClick={() => setPage(l.toLowerCase())} style={{ fontSize: 14, color: "#ccc", marginBottom: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{l}</div>))}
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.grayLight, marginBottom: 16 }}>Contact</div>
            <div style={{ fontSize: 14, color: "#ccc", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>{CONFIG.CONTACT_EMAIL}</div>
            <div style={{ fontSize: 14, color: "#ccc", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>{CONFIG.PHONE}</div>
            <div style={{ fontSize: 14, color: "#ccc", fontFamily: "'DM Sans', sans-serif" }}>Houston, Texas</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontSize: 12, color: C.grayLight, fontFamily: "'DM Sans', sans-serif" }}>© 2026 OptyField. All rights reserved.</div>
          <div style={{ display: "flex", gap: 20 }}>{[{ label: "Privacy Policy", id: "privacy" }, { label: "Terms of Service", id: "terms" }].map((t) => (<span key={t.id} onClick={() => setPage(t.id)} style={{ fontSize: 12, color: C.grayLight, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{t.label}</span>))}</div>
        </div>
      </Container>
    </footer>
  );
}

function FeatureCard({ icon, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ padding: 28, borderRadius: 16, cursor: "default", background: hov ? "#fff" : C.offWhite, border: `1px solid ${hov ? C.red + "22" : "transparent"}`, boxShadow: hov ? `0 12px 40px ${C.redGlow}` : "none", transition: "all 0.35s ease" }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: C.redGlow, marginBottom: 18 }}>{icon}</div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>{title}</h3>
      <p style={{ fontSize: 13, color: C.gray, lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
    </div>
  );
}

// ═══════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════
function HomePage({ setPage }) {
  const stats = [{ value: "50–70%", label: "Faster estimates with AI" }, { value: "2-Way", label: "QuickBooks sync" }, { value: "100%", label: "Offline-capable mobile app" }, { value: "Real-time", label: "Multi-user dispatch sync" }];
  const features = [
    { icon: Icons.dispatch, title: "Drag & Drop Dispatch", desc: "Board, list, and map views with real-time multi-user sync. Drag jobs between technicians, area zones, and time slots — everyone sees changes instantly." },
    { icon: Icons.ai, title: "AI-Powered Estimating", desc: "Technicians submit diagnostics from the field. AI parses notes, matches parts, calculates labor, and generates draft estimates with confidence scores — in under 60 seconds." },
    { icon: Icons.mobile, title: "Technician Mobile App", desc: "iOS & Android app with schedule view, GPS tracking, status updates, checklists, equipment history, photo capture, and full offline capability." },
    { icon: Icons.portal, title: "Customer Portal", desc: "Branded portal where customers view estimates, approve repairs unit-by-unit, track technician arrival, submit service requests, and download invoices." },
    { icon: Icons.route, title: "Route Optimization", desc: "Optimize daily routes from shop or technician's home. Minimize drive time, maximize jobs completed. Integrated with Google Maps." },
    { icon: Icons.quickbooks, title: "QuickBooks Integration", desc: "Two-way sync with QuickBooks Online. Estimates become invoices. Payment status flows back automatically. No double-entry." },
  ];
  return (
    <>
      <section style={{ background: `linear-gradient(165deg, ${C.navy} 0%, ${C.navyMid} 50%, #0D1526 100%)`, paddingTop: 120, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 500, height: 500, background: `radial-gradient(circle, ${C.redGlow} 0%, transparent 70%)`, borderRadius: "50%" }} />
        <Container style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            <FadeIn delay={0.1}><h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(36px, 5.5vw, 60px)", fontWeight: 700, color: "#fff", letterSpacing: -1, lineHeight: 1.08, margin: "0 0 20px" }}>Dispatch smarter.<br /><span style={{ color: C.red }}>Serve faster.</span></h1></FadeIn>
            <FadeIn delay={0.2}><p style={{ fontSize: 18, color: C.grayLight, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", margin: "0 0 36px", maxWidth: 520 }}>The field service CRM built for teams that move. AI-powered estimates, real-time dispatch, a technician mobile app, and a customer portal — all connected.</p></FadeIn>
            <FadeIn delay={0.3}><div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Button size="lg" onClick={() => setPage("features")}>Explore Features {Icons.arrow}</Button>{CONFIG.SHOW_BOOK_DEMO && (<Button variant="white" size="lg" onClick={() => setPage("contact")}>Book a Demo</Button>)}</div></FadeIn>
          </div>
          <FadeIn delay={0.4}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 1, marginTop: 72, background: "rgba(255,255,255,0.06)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              {stats.map((s, i) => (<div key={i} style={{ padding: "24px 20px", background: "rgba(255,255,255,0.02)", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700, color: C.red }}>{s.value}</div><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.grayLight, marginTop: 4 }}>{s.label}</div></div>))}
            </div>
          </FadeIn>
        </Container>
      </section>
      <section style={{ padding: "96px 0", background: C.bg }}>
        <Container>
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 64px" }}><FadeIn><SectionLabel>Core Platform</SectionLabel><SectionTitle>Everything your field team needs</SectionTitle><p style={{ fontSize: 16, color: C.gray, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>From the dispatcher's board to the technician's phone to the customer's inbox — one connected system.</p></FadeIn></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>{features.map((f, i) => (<FadeIn key={i} delay={i * 0.08}><FeatureCard {...f} /></FadeIn>))}</div>
        </Container>
      </section>
      <section style={{ padding: "96px 0", background: `linear-gradient(180deg, ${C.surfaceLight} 0%, #fff 100%)` }}>
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>
            <FadeIn>
              <SectionLabel>AI Estimating Engine</SectionLabel><SectionTitle>Technician notes to professional estimates in 60 seconds</SectionTitle>
              <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>Your techs describe what they see. Our AI reads the notes, identifies the right parts from your catalog, calculates labor, and builds a draft estimate — complete with confidence scores so your estimators know exactly where to focus.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{["Photo analysis via Claude Vision AI", "Learns from estimator corrections over time", "Confidence scoring with 5-component breakdown", "Fuzzy matching for technician shorthand & abbreviations"].map((t, i) => (<div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>{Icons.check}<span style={{ fontSize: 14, color: C.grayDark, fontFamily: "'DM Sans', sans-serif" }}>{t}</span></div>))}</div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ background: C.navy, borderRadius: 16, padding: 24, fontFamily: "'Space Mono', monospace", fontSize: 12, color: C.grayLight, lineHeight: 1.8, border: `1px solid ${C.navyLight}`, boxShadow: `0 24px 48px rgba(11,20,38,0.25)` }}>
                <div style={{ color: C.gray, marginBottom: 8 }}>// Tech submits from field</div>
                <div><span style={{ color: C.red }}>equipment:</span> "Precor EFX 835 Elliptical"</div>
                <div><span style={{ color: C.red }}>notes:</span> "crossramp cover damaged,</div>
                <div style={{ paddingLeft: 16 }}>user grips worn, elevation motor</div>
                <div style={{ paddingLeft: 16 }}>lower cover broken"</div>
                <div style={{ height: 16 }} />
                <div style={{ color: C.gray }}>// AI generates draft estimate ↓</div>
                <div style={{ background: C.navyLight, borderRadius: 8, padding: 12, marginTop: 8, border: `1px solid rgba(255,255,255,0.05)` }}>
                  <div style={{ color: "#22C55E" }}>✓ Front Hand Grip (×2) — $90.61 — 92%</div>
                  <div style={{ color: "#22C55E" }}>✓ Rear Hand Grip (×2) — $115.79 — 92%</div>
                  <div style={{ color: "#22C55E" }}>✓ Ramp Center Cover — $135.93 — 88%</div>
                  <div style={{ color: "#F59E0B" }}>⚠ Lift Pedestal Cover — $94.64 — 75%</div>
                  <div style={{ color: C.grayLight, marginTop: 8, fontSize: 10 }}>Labor: 1.5 hrs | Total: $643.47</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
      <section style={{ padding: "96px 0", background: C.bg }}>
        <Container>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}><FadeIn><SectionLabel>Built For the Field</SectionLabel><SectionTitle>We know your world</SectionTitle><p style={{ fontSize: 15, color: C.gray, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>OptyField was built by people who've run field service operations. We understand dispatchers, technicians, estimators, and the customers they serve.</p></FadeIn></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[{ title: "Apartments & Hotels", desc: "Multi-site, multi-unit facilities with large equipment inventories" }, { title: "Corporate Wellness", desc: "Offices and campuses with service agreements and scheduled maintenance" }, { title: "Fitness Centers", desc: "High-volume facilities with diverse equipment across multiple brands" }, { title: "Hospitals & Universities", desc: "Recreation centers with strict compliance needs and access protocols" }].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}><div style={{ padding: 28, borderRadius: 14, border: `1px solid ${C.surfaceLight}`, transition: "all 0.3s ease", background: "#fff" }}><div style={{ width: 8, height: 8, borderRadius: 4, background: C.red, marginBottom: 16 }} /><h4 style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>{item.title}</h4><p style={{ fontSize: 13, color: C.gray, lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p></div></FadeIn>
            ))}
          </div>
        </Container>
      </section>
      <section style={{ padding: "80px 0", background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: "-30%", left: "-5%", width: 400, height: 400, background: `radial-gradient(circle, ${C.redGlow} 0%, transparent 70%)`, borderRadius: "50%" }} />
        <Container style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <FadeIn>
            <SectionTitle light>Ready to optimize your operation?</SectionTitle>
            <p style={{ fontSize: 16, color: C.grayLight, fontFamily: "'DM Sans', sans-serif", marginBottom: 32, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>See how OptyField connects your entire field service workflow — from dispatch to invoice.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}><Button size="lg" onClick={() => setPage("features")}>Explore Features</Button>{CONFIG.SHOW_BOOK_DEMO && (<Button variant="white" size="lg" onClick={() => setPage("contact")}>Book a Demo</Button>)}</div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════
// FEATURES PAGE
// ═══════════════════════════════════════════
function FeaturesPage({ setPage }) {
  const sections = [
    { icon: Icons.dispatch, label: "Dispatch", title: "Command center for your operation", desc: "The dispatch board is the nerve center of OptyField. Three views — board, list, and map — let you manage your team however works best.", details: ["Board view with drag-and-drop scheduling across technicians and time slots", "List view with advanced filtering, sorting, and search", "Map view with Google Maps showing job locations and live tech positions", "16 configurable area zones for geographic organization", "Pending and carryover columns for unscheduled work", "Real-time multi-user sync via Socket.IO", "Right-click context menus for quick actions", "Route optimization with configurable start/end points"] },
    { icon: Icons.ai, label: "AI Estimating", title: "From field notes to draft estimates in 60 seconds", desc: "Technicians describe what they find. The AI engine parses their notes, matches parts, calculates labor, and produces a draft estimate with confidence scores.", details: ["Claude AI integration with Vision for photo analysis", "Multi-stage pipeline: NLP → entity extraction → parts matching → pricing", "5-component confidence scoring", "Learning engine — corrections feed back into future prompts", "Fuzzy matching for technician shorthand and abbreviations", "Queue management with status filtering", "Historical context injection from 12 months of patterns", "Line-by-line approve, edit, or reject workflow"] },
    { icon: Icons.mobile, label: "Mobile App", title: "Everything your techs need, on or offline", desc: "A native mobile app for iOS and Android. Technicians see their schedule, update status, complete checklists, capture photos, and navigate to jobs — even offline.", details: ["Today's schedule with color-coded status indicators", "One-tap status updates: En Route → On Site → Complete", "Equipment history and service records on-site", "Checklist completion with previous values for comparison", "Diagnostic input for AI estimating (categories, severity, notes, photos)", "GPS tracking (foreground and background)", "Full offline capability with automatic sync on reconnect", "Dead letter queue, sync history, and conflict resolution"] },
    { icon: Icons.portal, label: "Customer Portal", title: "Give your customers self-service", desc: "A branded web portal where customers view estimates, approve repairs unit-by-unit, track technician arrival, submit requests, view invoices, and leave feedback.", details: ["Branded login with customer-specific credentials", "Dashboard with stats, locations, and equipment counts", "Estimate viewing with unit-by-unit approve or decline", "Real-time technician tracking widget with ETA", "Service request submission with location and priority", "Invoice viewing with payment status and PDF download", "Post-service feedback and star ratings", "Service history with completed work order details"] },
    { icon: Icons.estimate, label: "Estimates & Work Orders", title: "Professional quotes, streamlined workflow", desc: "Create, track, and convert estimates through a complete lifecycle. Convert approved estimates into purchase orders and invoices automatically.", details: ["Unit-based pricing with per-equipment line items", "Status workflow: Draft → Sent → Approved / Declined / Expired", "Partial approval — customers approve individual units", "Professional PDF generation with your branding", "Work order system: Pending → Scheduled → En Route → On Site → Complete", "Office queue for review, parts needed, and reschedule routing", "Service agreements with auto-generated maintenance work orders", "Checklist templates with auto-flagging for failed items"] },
    { icon: Icons.inventory, label: "Parts & Inventory", title: "Track every part from order to install", desc: "Full parts inventory with stock tracking, warehouse bin locations, low-stock alerts, and automatic adjustments on PO receiving or work order completion.", details: ["Part definitions with manufacturer, equipment type, and vendor pricing", "Stock tracking: quantity on hand, allocated, and available", "Warehouse bin location tracking", "Low-stock alerts with configurable reorder levels", "Stock adjustment UI with audit trail", "Automatic stock increment on PO receiving", "Automatic stock deduction on work order completion", "Purchase orders: Draft → Sent → Confirmed → Shipped → Received"] },
    { icon: Icons.quickbooks, label: "QuickBooks", title: "Two-way sync, zero double-entry", desc: "Connect to QuickBooks Online with OAuth. Customers sync automatically. Approved estimates become invoices with one click.", details: ["OAuth connection with token refresh", "Customer matching, creation, and updates in QBO", "One-click invoice creation from approved estimates", "Payment status sync (Paid / Partial / Unpaid)", "Admin settings UI with connection management"] },
    { icon: Icons.offline, label: "Offline & Real-Time", title: "Works everywhere — even with no signal", desc: "The mobile app works fully offline. The web app uses Socket.IO for real-time updates across all connected users.", details: ["TTL-based data caching with offline-first reads", "Sync queue with 3-attempt retry and dead letter queue", "Background sync every 15 minutes", "Conflict resolution: client-wins for tech data, server-wins for schedule", "Sync history log with trigger tracking", "Socket.IO real-time updates for dispatch and notifications", "Push notifications via Expo Push", "8 email templates triggered across key workflow events"] },
  ];
  return (
    <section style={{ paddingTop: 120, paddingBottom: 80 }}>
      <Container>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 72px" }}><FadeIn><SectionLabel>Platform</SectionLabel><SectionTitle>Built for field service, top to bottom</SectionTitle><p style={{ fontSize: 16, color: C.gray, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>Every module connects. Dispatch feeds the mobile app. The mobile app feeds AI estimating. Estimates feed QuickBooks. Customers see it all in the portal.</p></FadeIn></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {sections.map((s, i) => (
            <FadeIn key={i} delay={0.05}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, padding: 40, borderRadius: 20, background: i % 2 === 0 ? C.offWhite : "#fff", border: `1px solid ${C.surfaceLight}` }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}><div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: C.redGlow }}>{s.icon}</div><div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.red, fontWeight: 700 }}>{s.label}</div></div>
                  <h3 style={{ fontSize: 24, fontWeight: 700, color: C.navy, margin: "0 0 12px", fontFamily: "'DM Sans', sans-serif", letterSpacing: -0.3 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: C.gray, lineHeight: 1.75, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{s.details.map((d, j) => (<div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><div style={{ minWidth: 6, height: 6, borderRadius: 3, background: C.red, marginTop: 6 }} /><span style={{ fontSize: 13, color: C.grayDark, lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>{d}</span></div>))}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ═══════════════════════════════════════════
// PRICING PAGE
// ═══════════════════════════════════════════
function PricingPage({ setPage }) {
  if (CONFIG.PRICING_COMING_SOON) {
    return (
      <section style={{ paddingTop: 160, paddingBottom: 120 }}><Container><div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}><FadeIn>
        <div style={{ margin: "0 auto 24px", display: "flex", justifyContent: "center" }}><ShieldLogo size={72} /></div>
        <SectionLabel>Pricing</SectionLabel><SectionTitle>We're finalizing our plans</SectionTitle>
        <p style={{ fontSize: 16, color: C.gray, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginBottom: 32 }}>We're putting the finishing touches on pricing that works for field service teams of every size. Reach out and we'll walk you through the platform.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>{CONFIG.SHOW_BOOK_DEMO && (<Button size="lg" onClick={() => setPage("contact")}>Talk to Us</Button>)}<Button variant="secondary" size="lg" onClick={() => setPage("features")}>Explore Features</Button></div>
      </FadeIn></div></Container></section>
    );
  }
  return (<section style={{ paddingTop: 120, paddingBottom: 80 }}><Container><div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 56px" }}><FadeIn><SectionLabel>Pricing</SectionLabel><SectionTitle>Simple, transparent pricing</SectionTitle><p style={{ fontSize: 16, color: C.gray, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>No surprises. Pick the plan that fits your team.</p></FadeIn></div><div style={{ textAlign: "center", color: C.gray, fontFamily: "'DM Sans', sans-serif" }}><p>Pricing tiers will appear here.</p></div></Container></section>);
}

// ═══════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════
function AboutPage() {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 80 }}><Container><div style={{ maxWidth: 680, margin: "0 auto" }}>
      <FadeIn><SectionLabel>Our Story</SectionLabel><SectionTitle>Built by people who've lived field service</SectionTitle></FadeIn>
      <FadeIn delay={0.1}><div style={{ fontSize: 16, color: C.grayDark, lineHeight: 1.85, fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ marginBottom: 20 }}>OptyField started in the field — literally. After 37 years running a commercial fitness equipment service company in Houston, Texas, we knew exactly what worked, what didn't, and what was missing from every CRM we tried.</p>
        <p style={{ marginBottom: 20 }}>We had 12 technicians covering apartments, hotels, corporate wellness centers, hospitals, and universities. Our estimating team produced over $250,000 in repair estimates every month. And every single one started with a technician's handwritten notes, abbreviations included.</p>
        <p style={{ marginBottom: 20 }}>Translating those notes into professional estimates took 30 to 60 minutes each — finding the right part numbers, looking up prices, calculating labor, formatting the quote. We knew there had to be a better way.</p>
        <div style={{ borderLeft: `3px solid ${C.red}`, padding: "20px 24px", margin: "32px 0", background: C.offWhite, borderRadius: "0 12px 12px 0" }}><p style={{ fontSize: 17, fontWeight: 600, color: C.navy, margin: 0, fontStyle: "italic" }}>"We didn't set out to build a CRM. We set out to fix the estimate bottleneck. Then we kept building because every piece connected to the next."</p></div>
        <p style={{ marginBottom: 20 }}>OptyField is the system we wished we had. AI-powered estimating that turns technician shorthand into draft estimates in under a minute. A dispatch board that actually supports multiple dispatchers without stepping on each other's work. A mobile app that works even when technicians are in a basement with no signal.</p>
        <p style={{ marginBottom: 20 }}>We built it for our own team first. Now we're building it for yours.</p>
      </div></FadeIn>
      <FadeIn delay={0.2}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 48 }}>
        {[{ val: "37", label: "Years in field service" }, { val: "Houston, TX", label: "Where it all started" }, { val: "Real problems", label: "Not hypothetical ones" }].map((s, i) => (<div key={i} style={{ padding: 24, borderRadius: 14, background: C.offWhite, border: `1px solid ${C.surfaceLight}` }}><div style={{ fontSize: 24, fontWeight: 700, color: C.red, fontFamily: "'DM Sans', sans-serif" }}>{s.val}</div><div style={{ fontSize: 13, color: C.gray, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{s.label}</div></div>))}
      </div></FadeIn>
    </div></Container></section>
  );
}

// ═══════════════════════════════════════════
// CONTACT PAGE
// ═══════════════════════════════════════════
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    setSubmitting(true);
    if (CONFIG.FORMSPREE_ID) { try { await fetch(`https://formspree.io/f/${CONFIG.FORMSPREE_ID}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, company: form.company, teamSize: form.size, message: form.message, _subject: `OptyField Demo Request from ${form.name}` }) }); } catch (e) {} }
    setSubmitting(false); setSubmitted(true);
  };
  return (
    <section style={{ paddingTop: 120, paddingBottom: 80 }}><Container>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, maxWidth: 960, margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>Get in Touch</SectionLabel><SectionTitle>{CONFIG.SHOW_BOOK_DEMO ? "Book a demo or say hello" : "Let's talk"}</SectionTitle>
          <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif", marginBottom: 32 }}>{CONFIG.SHOW_BOOK_DEMO ? "We'd love to show you around OptyField. Fill out the form and we'll set up a walkthrough tailored to your operation." : "Have questions about OptyField? We'd love to hear from you."}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[{ label: "Email", value: CONFIG.CONTACT_EMAIL }, { label: "Phone", value: CONFIG.PHONE }, { label: "Location", value: "Houston, Texas" }].map((c, i) => (<div key={i}><div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.gray, marginBottom: 4 }}>{c.label}</div><div style={{ fontSize: 16, fontWeight: 600, color: C.navy, fontFamily: "'DM Sans', sans-serif" }}>{c.value}</div></div>))}
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          {submitted ? (
            <div style={{ padding: 48, borderRadius: 20, background: C.offWhite, textAlign: "center", border: `1px solid ${C.surfaceLight}` }}><div style={{ fontSize: 48, marginBottom: 16 }}>✓</div><h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>We'll be in touch</h3><p style={{ fontSize: 14, color: C.gray, fontFamily: "'DM Sans', sans-serif" }}>Thanks, {form.name}! We typically respond within one business day.</p></div>
          ) : (
            <div style={{ padding: 32, borderRadius: 20, background: C.offWhite, border: `1px solid ${C.surfaceLight}` }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[{ key: "name", label: "Name", placeholder: "Your name", type: "text" }, { key: "email", label: "Email", placeholder: "you@company.com", type: "email" }, { key: "company", label: "Company", placeholder: "Company name", type: "text" }].map((f) => (
                  <div key={f.key}><label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.navy, display: "block", marginBottom: 6 }}>{f.label}</label><input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#fff", boxSizing: "border-box", transition: "border-color 0.2s" }} onFocus={(e) => e.target.style.borderColor = C.red} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} /></div>
                ))}
                <div><label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.navy, display: "block", marginBottom: 6 }}>Team size</label><select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#fff", boxSizing: "border-box", color: form.size ? C.navy : C.grayLight }}><option value="">How many technicians?</option><option value="1-5">1–5 technicians</option><option value="6-15">6–15 technicians</option><option value="16-50">16–50 technicians</option><option value="50+">50+ technicians</option></select></div>
                <div><label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: C.navy, display: "block", marginBottom: 6 }}>Message</label><textarea placeholder="Tell us about your operation..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#fff", resize: "vertical", boxSizing: "border-box" }} onFocus={(e) => e.target.style.borderColor = C.red} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} /></div>
                <Button size="lg" onClick={handleSubmit} style={{ width: "100%", justifyContent: "center", marginTop: 4, opacity: submitting ? 0.6 : 1 }}>{submitting ? "Sending..." : CONFIG.SHOW_BOOK_DEMO ? "Request a Demo" : "Send Message"}</Button>
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </Container></section>
  );
}

// ═══════════════════════════════════════════
// PRIVACY POLICY PAGE
// ═══════════════════════════════════════════
function PrivacyPage() {
  const S = { h3: { fontSize: 20, fontWeight: 700, color: C.navy, margin: "32px 0 12px", fontFamily: "'DM Sans', sans-serif" }, p: { fontSize: 15, color: C.grayDark, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", margin: "0 0 16px" } };
  return (
    <section style={{ paddingTop: 120, paddingBottom: 80 }}><Container><div style={{ maxWidth: 720, margin: "0 auto" }}>
      <FadeIn>
        <SectionLabel>Legal</SectionLabel>
        <SectionTitle>Privacy Policy</SectionTitle>
        <p style={{ ...S.p, color: C.gray, marginBottom: 40 }}>Last Updated: February 2026</p>

        <p style={S.p}>OptyField ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our field service management platform, including our web application, mobile applications, and customer portal (collectively, the "Service").</p>

        <h3 style={S.h3}>1. Information We Collect</h3>
        <p style={S.p}><strong>Account Information:</strong> When you or your employer creates an OptyField account, we collect names, email addresses, phone numbers, and company information necessary to provide the Service.</p>
        <p style={S.p}><strong>Location Data:</strong> Our mobile application collects GPS location data to enable dispatch tracking, route optimization, and job navigation. Location data may be collected in the foreground while the app is in use and in the background for dispatch visibility, only when you have granted permission.</p>
        <p style={S.p}><strong>Job and Work Order Data:</strong> We store information related to work orders, customer records, equipment details, estimates, invoices, checklists, technician notes, and photographs submitted through the Service.</p>
        <p style={S.p}><strong>Device Information:</strong> We collect device identifiers and push notification tokens to deliver job assignment alerts, parts-ready notifications, and other Service-related communications.</p>
        <p style={S.p}><strong>Usage Data:</strong> We collect information about how you interact with the Service, including pages visited, features used, and actions taken, to improve our platform.</p>

        <h3 style={S.h3}>2. How We Use Your Information</h3>
        <p style={S.p}>We use the information we collect to provide, maintain, and improve the Service, including dispatching and scheduling, technician GPS tracking and route optimization, AI-powered estimate generation from technician field notes and photos, push notification delivery for job assignments and status updates, QuickBooks integration for invoicing and payment tracking, and customer portal access for estimate approval and service tracking.</p>

        <h3 style={S.h3}>3. AI-Powered Features</h3>
        <p style={S.p}>OptyField uses artificial intelligence to generate draft estimates from technician-submitted notes and photographs. This data is processed to match parts, calculate labor, and produce estimates with confidence scores. Technician inputs and estimator corrections may be used to improve the accuracy of future AI-generated estimates within your organization's account.</p>

        <h3 style={S.h3}>4. Data Sharing</h3>
        <p style={S.p}>We do not sell your personal information. We may share data with service providers that help us operate the platform (such as cloud hosting, email delivery, and payment processing), with QuickBooks when you enable the integration, and as required by law or to protect our legal rights.</p>

        <h3 style={S.h3}>5. Data Security</h3>
        <p style={S.p}>We implement industry-standard security measures including encrypted data transmission (HTTPS/TLS), secure authentication, role-based access controls, and regular security practices. While no system is completely secure, we take reasonable steps to protect your information.</p>

        <h3 style={S.h3}>6. Data Retention</h3>
        <p style={S.p}>We retain your information for as long as your account is active or as needed to provide the Service. Work order history, equipment records, and estimate data are retained to support ongoing service operations. You may request deletion of your data by contacting us.</p>

        <h3 style={S.h3}>7. Your Rights</h3>
        <p style={S.p}>Depending on your location, you may have the right to access, correct, or delete your personal information, object to or restrict certain processing, request data portability, and withdraw consent where processing is based on consent. To exercise these rights, contact us using the information below.</p>

        <h3 style={S.h3}>8. Children's Privacy</h3>
        <p style={S.p}>The Service is not directed to individuals under the age of 16. We do not knowingly collect personal information from children.</p>

        <h3 style={S.h3}>9. Changes to This Policy</h3>
        <p style={S.p}>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website with a revised "Last Updated" date.</p>

        <h3 style={S.h3}>10. Contact Us</h3>
        <p style={S.p}>If you have questions about this Privacy Policy or our data practices, contact us at:</p>
        <div style={{ background: C.offWhite, borderRadius: 14, padding: 24, border: `1px solid ${C.surfaceLight}` }}>
          <p style={{ ...S.p, margin: 0 }}><strong>OptyField</strong><br />Email: {CONFIG.CONTACT_EMAIL}<br />Phone: {CONFIG.PHONE}<br />Houston, Texas</p>
        </div>
      </FadeIn>
    </div></Container></section>
  );
}

// ═══════════════════════════════════════════
// TERMS OF SERVICE PAGE
// ═══════════════════════════════════════════
function TermsPage() {
  const S = { h3: { fontSize: 20, fontWeight: 700, color: C.navy, margin: "32px 0 12px", fontFamily: "'DM Sans', sans-serif" }, p: { fontSize: 15, color: C.grayDark, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", margin: "0 0 16px" } };
  return (
    <section style={{ paddingTop: 120, paddingBottom: 80 }}><Container><div style={{ maxWidth: 720, margin: "0 auto" }}>
      <FadeIn>
        <SectionLabel>Legal</SectionLabel>
        <SectionTitle>Terms of Service</SectionTitle>
        <p style={{ ...S.p, color: C.gray, marginBottom: 40 }}>Last Updated: February 2026</p>

        <p style={S.p}>These Terms of Service ("Terms") govern your use of the OptyField platform and services. By accessing or using OptyField, you agree to be bound by these Terms.</p>

        <h3 style={S.h3}>1. Service Description</h3>
        <p style={S.p}>OptyField is a field service management platform that provides dispatching, work order management, AI-powered estimating, technician mobile applications, customer portal, inventory tracking, and QuickBooks integration. The Service is designed for commercial field service operations and is provided on a subscription basis.</p>

        <h3 style={S.h3}>2. Account Responsibilities</h3>
        <p style={S.p}>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating accounts and to notify us promptly of any unauthorized use. Account administrators are responsible for managing user access and permissions within their organization.</p>

        <h3 style={S.h3}>3. Acceptable Use</h3>
        <p style={S.p}>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service in any way that violates applicable laws or regulations, to attempt to gain unauthorized access to any part of the Service, to interfere with the proper functioning of the Service, or to use the Service to transmit harmful or malicious content.</p>

        <h3 style={S.h3}>4. Data Ownership</h3>
        <p style={S.p}>You retain ownership of all data you submit to the Service, including customer records, work orders, estimates, photographs, and other business data ("Your Data"). You grant us a limited license to use Your Data solely to provide and improve the Service. We will not access, use, or share Your Data except as necessary to operate the Service or as described in our Privacy Policy.</p>

        <h3 style={S.h3}>5. AI-Generated Content</h3>
        <p style={S.p}>OptyField's AI estimating features generate draft estimates based on technician inputs. AI-generated estimates are drafts intended for human review and approval. We do not guarantee the accuracy, completeness, or suitability of AI-generated content. Your estimators and administrators are responsible for reviewing, editing, and approving all estimates before they are sent to customers.</p>

        <h3 style={S.h3}>6. Service Availability</h3>
        <p style={S.p}>We strive to maintain high availability of the Service but do not guarantee uninterrupted access. We may perform scheduled maintenance, and the Service may experience occasional downtime. Our mobile application includes offline capabilities to mitigate the impact of connectivity issues.</p>

        <h3 style={S.h3}>7. Payment Terms</h3>
        <p style={S.p}>Subscription fees are billed according to the plan selected. All fees are non-refundable except as required by law. We reserve the right to modify pricing with reasonable advance notice.</p>

        <h3 style={S.h3}>8. Limitation of Liability</h3>
        <p style={S.p}>To the fullest extent permitted by law, OptyField shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities arising from your use of or inability to use the Service.</p>

        <h3 style={S.h3}>9. Termination</h3>
        <p style={S.p}>Either party may terminate the subscription with written notice. Upon termination, we will provide a reasonable period to export Your Data. We may suspend or terminate accounts that violate these Terms.</p>

        <h3 style={S.h3}>10. Changes to Terms</h3>
        <p style={S.p}>We may update these Terms from time to time. We will notify you of material changes. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.</p>

        <h3 style={S.h3}>11. Governing Law</h3>
        <p style={S.p}>These Terms are governed by the laws of the State of Texas. Any disputes shall be resolved in the courts located in Harris County, Texas.</p>

        <h3 style={S.h3}>12. Contact</h3>
        <p style={S.p}>Questions about these Terms? Contact us at:</p>
        <div style={{ background: C.offWhite, borderRadius: 14, padding: 24, border: `1px solid ${C.surfaceLight}` }}>
          <p style={{ ...S.p, margin: 0 }}><strong>OptyField</strong><br />Email: {CONFIG.CONTACT_EMAIL}<br />Phone: {CONFIG.PHONE}<br />Houston, Texas</p>
        </div>
      </FadeIn>
    </div></Container></section>
  );
}

// ═══════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════
export default function OptyFieldSite() {
  const [page, setPage] = useState("home");
  const navigate = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: C.navy, minHeight: "100vh", background: C.bg }}>
      <Nav page={page} setPage={navigate} />
      {page === "home" && <HomePage setPage={navigate} />}
      {page === "features" && <FeaturesPage setPage={navigate} />}
      {page === "pricing" && <PricingPage setPage={navigate} />}
      {page === "about" && <AboutPage />}
      {page === "contact" && <ContactPage />}
      {page === "privacy" && <PrivacyPage />}
      {page === "terms" && <TermsPage />}
      <Footer setPage={navigate} />
    </div>
  );
}
