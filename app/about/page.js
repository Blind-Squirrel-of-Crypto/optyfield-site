import { CTA } from "../_components/site";

export const metadata = {
  title: "About",
  description: "OptyField was built inside a Houston commercial fitness equipment service company, for the way that work really happens. That company still runs on it every day.",
  alternates: { canonical: "/about" },
};

// Customer TYPES may be named (Doug 2026-10-14); never customer names.
// Don't name the service company (Doug 2026-10-15, company is being sold) — "a Houston
// commercial fitness equipment service company" instead. Doug's own name is fine.
// Facts confirmed by Doug 2026-10-14: 37 years, about $250k/month of service work,
// signed "Doug Berry, founder". 12 technicians matches production.
export default function About() {
  return (
    <>
      <section className="section">
        <div className="container narrow">
          <div className="eyebrow">Our story</div>
          <h1 className="h2">Built inside a fitness equipment service company</h1>
          <p style={{ marginTop: 20 }}>
            OptyField started inside a commercial fitness equipment service company in Houston, Texas, one with 37 years in
            the business. Its 12 technicians look after equipment at apartment complexes, hotels, corporate offices and wellness
            centers, hospitals and universities.
          </p>
          <p style={{ marginTop: 16 }}>
            The company does about $250,000 a month of service work, and most repair estimates cover several machines that a
            customer may or may not approve. Off-the-shelf field-service software was built for plumbers and HVAC
            crews, and none of it fit that work.
          </p>
          <div className="quote">&ldquo;We didn&apos;t set out to build a CRM. We set out to fix the estimate bottleneck. Then we kept building, because every piece connected to the next.&rdquo;</div>
          <p>
            So we built the system we wished we had: a customer portal where clients approve repairs machine by machine,
            an equipment register for every machine it services, a dispatch board and Schedule Builder for planning the day,
            and a technician app to tie it together. AI that drafts estimates from technician notes is next.
          </p>
          <p style={{ marginTop: 16 }}>
            That company&apos;s office and field team use OptyField every working day. Many of its features exist because someone
            in that office or in a van asked for them. Now we&apos;re opening it up to other fitness service companies.
          </p>
          <p style={{ marginTop: 16 }}>— Doug Berry, founder</p>
        </div>
      </section>
      <CTA title="Talk to the people who built it" text="Your walkthrough is with the team that runs a fitness service company on OptyField." />
    </>
  );
}
