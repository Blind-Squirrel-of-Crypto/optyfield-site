import Link from "next/link";
import { CTA, Checks, Soon } from "../_components/site";

export const metadata = {
  title: "Pricing",
  description: "OptyField pricing for commercial fitness equipment service companies starts from $499 a month. Customer portal, technician app, dispatch board and equipment register included.",
  alternates: { canonical: "/pricing" },
};

// Doug 2026-10-14: show "From $499/month" and "Book a walkthrough" only.
// Don't publish the full pricing sheet (plans, per-tech fees, setup fee, discounts).
export default function Pricing() {
  return (
    <>
      <section className="section">
        <div className="container center narrow">
          <div className="eyebrow">Pricing</div>
          <h1 className="h2">From $499 a month</h1>
          <p className="lede" style={{ margin: "0 auto 28px" }}>
            Pricing depends on how many technicians and office staff you have. Book a 30-minute walkthrough and we&apos;ll
            give you a price for your team.
          </p>
          <div className="btn-row">
            <Link href="/contact" className="btn btn-primary">Book a walkthrough</Link>
            <Link href="/demo" className="btn btn-ghost">Click through the demo first</Link>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container grid grid-2" style={{ alignItems: "start" }}>
          <div>
            <h2>Every plan includes</h2>
            <Checks items={[
              "Customer portal with machine-by-machine approval",
              "Equipment register by make, model and serial",
              "Dispatch board and Schedule Builder",
              "Technician app for iPhone",
              "Parts, vendors and purchase orders",
              "Maintenance agreements, checklists and maintenance reports",
              "Daily database backups, kept off-site",
            ]} />
            <p className="small muted" style={{ marginTop: 16 }}>AI-drafted estimates <Soon /> · QuickBooks Online invoicing <Soon /> · Android technician app <Soon /></p>
          </div>
          <div>
            <h2>Getting started</h2>
            <p>Setup is done with you, not left to you:</p>
            <div style={{ marginTop: 12 }}>
              <Checks items={[
                "We import your customers, locations, equipment lists and parts",
                "User accounts and roles for your team",
                "Live training for your office team and your technicians",
                "Customer portal set up, with your first customer contacts loaded",
              ]} />
            </div>
          </div>
        </div>
      </section>

      <CTA title="Get a price for your team" text="Tell us how many techs and office staff you have, and we'll walk you through it." />
    </>
  );
}
