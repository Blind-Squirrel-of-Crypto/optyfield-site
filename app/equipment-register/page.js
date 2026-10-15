import Link from "next/link";
import { CTA, Checks, DemoDataNote, Shot } from "../_components/site";

export const metadata = {
  title: "Fitness equipment register by make, model and serial",
  description: "Track every treadmill, elliptical, bike and strength machine you service by make, model, serial number and position, with its repairs, estimates, warranty and maintenance history, at every customer location.",
  alternates: { canonical: "/equipment-register" },
};

export default function EquipmentRegister() {
  return (
    <>
      <section className="section dark hero">
        <div className="container grid grid-2" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <div className="eyebrow">Equipment register</div>
            <h1>Every machine you service, <span className="accent">and its whole history.</span></h1>
            <p className="lede">
              Your customers don&apos;t have &ldquo;a gym.&rdquo; They have 14 treadmills, 9 ellipticals and a cable crossover
              that keeps fraying. OptyField keeps a record of each one.
            </p>
            <div className="btn-row">
              <Link href="/demo" className="btn btn-primary">Click through the demo</Link>
              <Link href="/contact" className="btn btn-ghost">Book a walkthrough</Link>
            </div>
          </div>
          <div>
            <Shot src="/demo/shots/register-list.png" alt="Equipment list showing machines by make, model, serial, position and status" label="Equipment" priority />
            <DemoDataNote />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <h2>What&apos;s on file for each machine</h2>
            <Checks items={[
              "Make, model, serial number and position on the floor (TM-1, EL-3…)",
              "Status: good, repairs needed, out of service, repaired, removed",
              "Install date and warranty, with expired warranties marked",
              "Every visit's notes, repairs, estimates and checklists",
              "Which customer and location it belongs to, across all your accounts",
            ]} />
            <p style={{ marginTop: 18 }}>
              The Houston service company OptyField was built in keeps more than 15,000 machines on file this way. If you have equipment lists in spreadsheets today,
              we import them during setup.
            </p>
          </div>
          <div>
            <Shot src="/demo/shots/register-detail.png" alt="One treadmill's service history: earlier maintenance notes and the latest repair notes" label="Equipment history" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container grid grid-2">
          <div>
            <Shot src="/demo/shots/portal-equipment.png" alt="Customer portal equipment page listing machines by location" label="Customer Portal" />
          </div>
          <div>
            <h2>Your customers see their machines too</h2>
            <p>
              In the customer portal, a fitness director can see every machine at each of their locations, what needs attention
              and what was done, plus maintenance reports from your PM visits.
            </p>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
