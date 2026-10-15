"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./site";

export const NAV = [
  { href: "/customer-approvals", label: "Approvals" },
  { href: "/equipment-register", label: "Equipment" },
  { href: "/dispatch-scheduling", label: "Dispatch" },
  { href: "/fitness-service-companies", label: "Who it's for" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" aria-label="OptyField home"><Logo height={46} /></Link>
        <nav className="nav-links" aria-label="Main">
          {NAV.map((l) => <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}>{l.label}</Link>)}
          <Link href="/demo" aria-current={path === "/demo" ? "page" : undefined}>Demo</Link>
          <Link href="/contact" className="btn btn-primary btn-sm">Book a walkthrough</Link>
        </nav>
        <button className="nav-menu-btn" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
      </div>
      <nav id="mobile-nav" className={`nav-mobile${open ? " open" : ""}`} aria-label="Mobile">
        {NAV.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        <Link href="/demo">Demo</Link>
        <Link href="/contact" className="btn btn-primary">Book a walkthrough</Link>
      </nav>
    </header>
  );
}
