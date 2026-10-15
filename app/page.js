import Link from "next/link";
import { CTA, Checks, DemoDataNote, Shot, Soon } from "./_components/site";

export const metadata = { alternates: { canonical: "/" } };

const PILLARS = [
  {
    href: "/customer-approvals", num: "01", title: "Customers approve machine by machine",
    text: "The gym manager opens one link, sees every machine with its own notes and price, approves the treadmill, declines the seat pad, and signs. Partial approvals stop being a phone-tag problem.",
  },
  {
    href: "/equipment-register", num: "02", title: "Every machine has a history",
    text: "Each treadmill, elliptical, bike and cable stack is on file by make, model, serial and position, with its repairs, estimates and warranty, at every location you service.",
  },
  {
    href: "/dispatch-scheduling", num: "03", title: "Plan the day by the map",
    text: "Unscheduled jobs wait by area of town. Drag them onto a tech's day, or use Schedule Builder to see the whole backlog on a map and send a tech a route in driving order.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero section dark">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 760 }}>
            <div className="eyebrow">For commercial fitness equipment service companies</div>
            <h1>More repairs approved. <span className="accent">Every machine accounted for.</span></h1>
            <p className="lede">
              OptyField was built inside a Houston commercial fitness equipment service company, and it runs that company every
              working day. Now it&apos;s available to companies like yours.
            </p>
            <div className="btn-row">
              <Link href="/demo" className="btn btn-primary">Click through the demo</Link>
              <Link href="/contact" className="btn btn-ghost">Book a walkthrough</Link>
            </div>
          </div>
          <div className="hero-shot">
            <Shot src="/demo/shots/dispatch-board.png" alt="Dispatch board: unscheduled jobs grouped by area of town, and each technician's day" label="Dispatch Board" priority />
            <DemoDataNote />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="center narrow" style={{ marginBottom: 48 }}>
            <div className="eyebrow">What makes it different</div>
            <h2>Built around the machines, not the trade</h2>
            <p className="lede" style={{ margin: "0 auto" }}>
              General field-service apps are built for plumbers and HVAC crews. Fitness equipment service has its own shape:
              dozens of machines per site, repairs quoted per machine, and customers who approve some and not others.
            </p>
          </div>
          <div className="trio">
            {PILLARS.map((p) => (
              <Link key={p.href} href={p.href} className="card">
                <div className="num">{p.num}</div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <span className="more">How it works →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container grid grid-2">
          <div>
            <div className="eyebrow">From the field to approved, in one system</div>
            <h2>One repair, start to finish</h2>
            <ol className="steps-list" style={{ marginTop: 20 }}>
              <li><b>The tech writes notes on site</b> for each machine in the OptyField iPhone app.</li>
              <li><b>Your estimator builds the estimate</b> machine by machine and sends it to the customer&apos;s portal.</li>
              <li><b>The customer approves machine by machine</b>, signs and adds a PO number.</li>
              <li><b>Only the approved machines move on</b> to parts ordering and the dispatch board.</li>
            </ol>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Link href="/demo" className="btn btn-primary">Click through it</Link>
            </div>
          </div>
          <div>
            <Shot src="/demo/shots/portal-submit.png" alt="Customer portal: four machines approved and one declined, with approved and declined totals" label="Customer Portal" />
            <DemoDataNote />
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container">
          <div className="grid grid-2">
            <div>
              <div className="eyebrow">Proof, not promises</div>
              <h2>Built inside a fitness service company</h2>
              <p>
                OptyField wasn&apos;t designed in a boardroom. The dispatchers, estimators, technicians and billing team at a Houston fitness service company use it all day,
                with apartment complexes, hotels, corporate gyms, hospitals and universities across the Houston area. When something
                gets in their way, it gets changed.
              </p>
              <div className="btn-row" style={{ marginTop: 24 }}>
                <Link href="/about" className="btn btn-ghost">Read the story</Link>
              </div>
            </div>
            <div className="proof">
              <div><b>15,000+</b><span>machines on file at the company it was built in</span></div>
              <div><b>Every day</b><span>in use by a working office and field team</span></div>
              <div><b>Houston, TX</b><span>where it was built</span></div>
              <div><b>One trade</b><span>commercial fitness equipment, nothing else</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <div className="eyebrow">Also in the box</div>
            <h2>Everything else you run the business on</h2>
            <Checks items={[
              "Technician app for iPhone: schedule, notes per machine, photos, checklists",
              "Maintenance agreements, PM checklists and maintenance summaries for your customers",
              "Parts, vendors and purchase orders, tied to the jobs that need them",
              "Approval queue: the office releases approved work to parts or dispatch",
              "Sales quotes for equipment, accessories and other non-repair items",
            ]} />
            <p className="small muted" style={{ marginTop: 18 }}>AI-drafted estimates from tech notes <Soon /> &nbsp; QuickBooks Online invoicing <Soon /> &nbsp; Android tech app <Soon /></p>
          </div>
          <div>
            <Shot src="/demo/shots/register-detail.png" alt="One treadmill's service history" label="Equipment history" />
            <DemoDataNote />
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
