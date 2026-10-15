import Link from "next/link";
import { CTA, Checks, DemoDataNote, Shot } from "../_components/site";

export const metadata = {
  title: "Software for commercial fitness equipment service companies",
  description: "OptyField is built for companies that repair and maintain commercial fitness equipment for gyms, apartment fitness rooms, hotels, corporate wellness centers, hospitals and universities.",
  alternates: { canonical: "/fitness-service-companies" },
};

const CUSTOMERS = [
  ["Apartment & condo fitness rooms", "Many small sites, a property manager approving the work, and a portal login that covers every property they manage."],
  ["Hotels & resorts", "Engineering directors who want machines back in service fast and a clear record of what was done."],
  ["Corporate wellness centers", "Scheduled PM agreements, checklists and a maintenance report after every visit."],
  ["Gyms & health clubs", "High-traffic floors with dozens of machines from several brands, and repairs quoted machine by machine."],
  ["Hospitals, universities & rec centers", "Several buildings, access instructions per location, and a PO number on every approval."],
  ["Senior living & physical therapy", "Smaller fleets where an out-of-service machine matters, and a history the facility can see."],
];

export default function ForFitnessServiceCompanies() {
  return (
    <>
      <section className="section dark hero">
        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 820 }}>
          <div className="eyebrow">Who it&apos;s for</div>
          <h1>Built for companies that keep <span className="accent">commercial fitness equipment running.</span></h1>
          <p className="lede">
            If your techs spend their days on Life Fitness, Precor, Matrix, Cybex, StairMaster and Keiser equipment at gyms,
            apartment complexes, hotels and corporate fitness centers, OptyField was built for the way you work.
          </p>
          <div className="btn-row">
            <Link href="/contact" className="btn btn-primary">Book a walkthrough</Link>
            <Link href="/demo" className="btn btn-ghost">Click through the demo</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="center narrow" style={{ marginBottom: 40 }}>
            <h2>Your customers, and what they need from you</h2>
          </div>
          <div className="grid grid-3">
            {CUSTOMERS.map(([t, d]) => (
              <div key={t} className="card soft"><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container grid grid-2">
          <div>
            <h2>Why general field-service software falls short</h2>
            <Checks items={[
              "It quotes a job. You quote 6 machines, and the customer approves 4.",
              "It tracks a customer's address. You need every machine at that address by serial number.",
              "It schedules from a list. You plan a day across a whole metro area, by part of town.",
              "Its customer portal is an invoice page. Yours needs approvals, equipment and maintenance reports.",
            ]} />
          </div>
          <div>
            <Shot src="/demo/shots/dispatch-board.png" alt="Dispatch board with each technician's schedule" label="Dispatch Board" />
            <DemoDataNote />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <h2>Moving over from spreadsheets or another system</h2>
          <p>
            Setup is done with you, not left to you. We import your customers, locations, equipment lists and parts from
            your spreadsheets or your current software, set up your team, and train your office staff and technicians.
          </p>
          <p className="small muted" style={{ marginTop: 14 }}>The technician app is on iPhone today. Android is planned.</p>
        </div>
      </section>

      <CTA />
    </>
  );
}
