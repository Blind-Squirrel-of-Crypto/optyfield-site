import Link from "next/link";
import { CTA, Checks, DemoDataNote, Shot } from "../_components/site";
import Video from "../_components/Video";

export const metadata = {
  title: "Customers approve repairs machine by machine",
  description: "OptyField's customer portal lets gym, hotel and apartment managers approve or decline fitness equipment repairs one machine at a time, sign, and add a PO number. Only approved machines move on to parts and dispatch.",
  alternates: { canonical: "/customer-approvals" },
};

export default function CustomerApprovals() {
  return (
    <>
      <section className="section dark hero">
        <div className="container grid grid-2" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <div className="eyebrow">Customer portal</div>
            <h1>&ldquo;Yes to the treadmill, <span className="accent">not the seat pad.&rdquo;</span></h1>
            <p className="lede">
              Fitness repair estimates cover many machines, and customers rarely approve all of them. OptyField lets them decide
              machine by machine, in one place, and tells your office exactly what was approved.
            </p>
            <div className="btn-row">
              <Link href="/demo" className="btn btn-primary">Click through it</Link>
              <Link href="/contact" className="btn btn-ghost">Book a walkthrough</Link>
            </div>
          </div>
          <div>
            <Shot src="/demo/shots/portal-estimate.png" alt="Customer portal estimate with an Approve and Decline button for each machine" label="Customer Portal" priority />
            <DemoDataNote />
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container narrow">
          <div className="center video-head">
            <div className="eyebrow">Watch it · 90 seconds</div>
            <h2>One estimate, from the customer&apos;s inbox to the parts order</h2>
          </div>
          <Video name="customer-portal" title="Customer approves an estimate machine by machine" width={1440} height={900}
            caption="The customer approves four machines, declines one, signs with a PO number. The office releases the approved work to parts ordering." />
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <h2>What your customer sees</h2>
            <Checks items={[
              "Each machine on its own card: make, model, serial, your tech's notes, parts and price",
              "Approve or decline each machine, or all of them at once",
              "Approved and declined totals that update as they decide",
              "Sign by name and add their PO number",
              "Their equipment, service history and maintenance reports in the same portal",
              "One login for property managers who look after several sites",
            ]} />
          </div>
          <div>
            <Shot src="/demo/shots/portal-submit.png" alt="Four machines approved, one declined, with totals" label="Customer Portal" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container grid grid-2">
          <div>
            <Shot src="/demo/shots/approval-queue.png" alt="Approval queue showing a partially approved estimate ready to release to parts ordering" label="Approval Queue" />
          </div>
          <div>
            <h2>What your office sees</h2>
            <p>
              Approved estimates land in an approval queue with the customer&apos;s PO number. The office releases the approved
              machines to parts ordering or straight to dispatch. Declined machines stay on file, so you can quote them again
              later without retyping anything.
            </p>
            <p style={{ marginTop: 14 }}>
              You can also see when a customer has opened an estimate, so you know who to follow up with.
            </p>
          </div>
        </div>
      </section>

      <CTA title="Stop chasing approvals by email" />
    </>
  );
}
