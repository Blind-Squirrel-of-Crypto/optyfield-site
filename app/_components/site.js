// Shared, server-rendered building blocks for every page.
import Link from "next/link";
import Image from "next/image";

export const SITE = {
  // "Book a Demo" submissions go to the OptyField API, which emails them to Doug.
  DEMO_REQUEST_URL: "https://exer-tech-api-production.up.railway.app/api/public/demo-request",
  CONTACT_EMAIL: "hello@optyfield.com",
  PHONE: "281-932-9345",
  URL: "https://www.optyfield.com",
};

const GEAR_PATH = "M80,57 L84.669,52.553 L90.45,54.947 L90.607,61.393 L90.607,61.393 L97.053,61.55 L99.447,67.331 L95,72 L95,72 L99.447,76.669 L97.053,82.45 L90.607,82.607 L90.607,82.607 L90.45,89.053 L84.669,91.447 L80,87 L80,87 L75.331,91.447 L69.55,89.053 L69.393,82.607 L69.393,82.607 L62.947,82.45 L60.553,76.669 L65,72 L65,72 L60.553,67.331 L62.947,61.55 L69.393,61.393 L69.393,61.393 L69.55,54.947 L75.331,52.553 L80,57 Z";
const SHIELD_PATH = "M80,32 C91.4,32 118,44 118,60.8 C118,84.8 102.8,106.4 80,128 C57.2,106.4 42,84.8 42,60.8 C42,44 68.6,32 80,32Z";

export function Logo({ height = 44, theme = "light", sub = "FITNESS EQUIPMENT SERVICE" }) {
  const id = `wm-${theme}-${height}`;
  const textFill = theme === "dark" ? "#F8FAFC" : "#0B1426";
  return (
    <svg viewBox="0 0 278.46 70" height={height} style={{ display: "block", width: "auto" }} role="img" aria-label="OptyField">
      <defs>
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A2744" /><stop offset="100%" stopColor="#0B1426" />
        </linearGradient>
      </defs>
      <g transform="translate(0, 5) scale(0.5769) translate(-38, -28)">
        <path d={SHIELD_PATH} fill={`url(#grad-${id})`} stroke="#EF4444" strokeWidth="1.5" />
        <path d={GEAR_PATH} fill="none" stroke="#EF4444" strokeWidth="1.8" />
        <circle cx="80" cy="72" r="9" fill="none" stroke="#EF4444" strokeWidth="1.2" />
        <circle cx="80" cy="72" r="3.5" fill="#EF4444" />
        <path d="M75,73 L79,77 L86,69" fill="none" stroke="#FF8080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="58.46" y={sub ? 32 : 38} fontFamily="'DM Sans', 'Segoe UI', Arial, sans-serif" fontSize="30" fontWeight="700" letterSpacing="-0.5">
        <tspan fill={textFill}>Opty</tspan><tspan fill="#EF4444">Field</tspan>
      </text>
      {sub && (
        <text x="58.46" y="54" fontFamily="'DM Sans', 'Segoe UI', Arial, sans-serif" fontSize="8.2" fill={theme === "dark" ? "#8899AA" : "#0B1426"} letterSpacing="1.6">{sub}</text>
      )}
    </svg>
  );
}

/** A real product screenshot in a simple window frame. All shots come from tools/demo-capture. */
export function Shot({ src, alt, label, priority = false, caption }) {
  return (
    <figure>
      <div className="shot">
        <div className="shot-bar" aria-hidden="true"><i /><i /><i />{label && <span>{label}</span>}</div>
        <Image src={src} alt={alt} width={1600} height={1000} priority={priority} sizes="(max-width: 900px) 100vw, 900px" />
      </div>
      {caption && <figcaption className="caption">{caption}</figcaption>}
    </figure>
  );
}

export function DemoDataNote() {
  return <p className="demo-note">Screens show &ldquo;Northwind Fitness Service,&rdquo; a made-up demo company. No real customer data.</p>;
}

export function CTA({ title = "See it with your own equipment list", text = "A 30-minute walkthrough, built around how your techs, estimators and customers work today." }) {
  return (
    <section className="section dark center">
      <div className="container narrow">
        <h2>{title}</h2>
        <p className="lede" style={{ margin: "0 auto 28px" }}>{text}</p>
        <div className="btn-row">
          <Link href="/contact" className="btn btn-primary">Book a walkthrough</Link>
          <Link href="/demo" className="btn btn-ghost">Click through a 2-minute demo</Link>
        </div>
      </div>
    </section>
  );
}

export function Checks({ items }) {
  return <ul className="checks">{items.map((t) => <li key={typeof t === "string" ? t : t.key}>{t}</li>)}</ul>;
}

export function Soon() {
  return <span className="badge soon">Coming soon</span>;
}
