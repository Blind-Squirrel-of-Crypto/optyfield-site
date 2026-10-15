import Link from "next/link";
import { Logo, SITE } from "./site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo height={56} theme="dark" />
            <p style={{ marginTop: 14, maxWidth: 260 }}>Service software for commercial fitness equipment companies. Built and run every day by one.</p>
          </div>
          <div>
            <h4>Product</h4>
            <Link href="/dispatch-scheduling">Dispatch &amp; Schedule Builder</Link>
            <Link href="/customer-approvals">Customer approvals</Link>
            <Link href="/equipment-register">Equipment register</Link>
            <Link href="/demo">Interactive demo</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link href="/fitness-service-companies">Who it&apos;s for</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Book a walkthrough</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={`mailto:${SITE.CONTACT_EMAIL}`}>{SITE.CONTACT_EMAIL}</a>
            <a href={`tel:${SITE.PHONE.replace(/-/g, "")}`}>{SITE.PHONE}</a>
            <span className="line">Houston, Texas</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} OptyField. All rights reserved.</span>
          <span><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Service</Link></span>
        </div>
      </div>
    </footer>
  );
}
