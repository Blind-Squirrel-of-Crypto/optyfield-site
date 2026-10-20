import Link from "next/link";
import demo from "../../public/demo/demo-data.json";
import { CTA, Checks, DemoDataNote, Shot } from "../_components/site";
import Video from "../_components/Video";

export const metadata = {
  title: "Dispatch board and Schedule Builder",
  description: "Plan your fitness service techs' days on one dispatch board and a Schedule Builder map: unscheduled jobs grouped by area, drag to assign, and routes put in driving order.",
  alternates: { canonical: "/dispatch-scheduling" },
};

// Schedule Builder shots need a Google Maps key at capture time; until they exist
// the section shows text only (see tools/demo-capture/flows/schedule-builder.mjs).
const sb = demo.flows["schedule-builder"]?.steps ?? [];
const sbShot = (key) => sb.find((s) => s.key === key);

export default function DispatchScheduling() {
  const sbSchedule = sbShot("sb-schedule");
  return (
    <>
      <section className="section dark hero">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 760 }}>
            <div className="eyebrow">Dispatch &amp; scheduling</div>
            <h1>Every tech&apos;s day on one board. <span className="accent">Every open job on one map.</span></h1>
            <p className="lede">
              Your dispatchers see who&apos;s where, what&apos;s waiting in each part of town, and drag jobs onto a tech&apos;s day.
              Schedule Builder puts the backlog on a map so a day can be planned by geography, not by reading down a list.
            </p>
            <div className="btn-row">
              <Link href="/demo" className="btn btn-primary">Click through the demo</Link>
              <Link href="/contact" className="btn btn-ghost">Book a walkthrough</Link>
            </div>
          </div>
          <div className="hero-shot">
            <Shot src="/demo/shots/dispatch-board.png" alt="Dispatch board: unscheduled jobs grouped by area on the left, each technician's day on the right" label="Dispatch Board" priority />
            <DemoDataNote />
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container narrow">
          <div className="center video-head">
            <div className="eyebrow">Watch it · 75 seconds</div>
            <h2>Plan a day: board, map and Schedule Builder</h2>
          </div>
          <Video name="dispatch-schedule-builder" title="Dispatch board and Schedule Builder walkthrough" width={1920} height={1080}
            caption="Drag a job onto a tech's day, see the day as a list and on the map, then build and optimise a route in Schedule Builder and send it to the board." />
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <div className="eyebrow">Dispatch board</div>
            <h2>Drag, drop, done</h2>
            <Checks items={[
              "Unscheduled jobs wait in their area of town, with maintenance and repair calls easy to tell apart",
              "Each technician's day as a timeline, today and the days ahead",
              "Drag a job onto a tech's afternoon; it shows up on their iPhone",
              "Every dispatcher sees changes as they happen",
              "Board, list and map views, plus right-click shortcuts for common moves",
            ]} />
          </div>
          <div>
            <Shot src="/demo/shots/dispatch-assigned.png" alt="A job dragged onto a technician's 4 PM slot" label="Dispatch Board" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container grid grid-2">
          <div>
            <Shot src="/videos/schedule-builder-route.webp" alt="Schedule Builder: waiting jobs pinned on the map and a five-stop route put in driving order" label="Schedule Builder" />
          </div>
          <div>
            <div className="eyebrow">Schedule Builder</div>
            <h2>Plan the day on a map</h2>
            <p>
              Schedule Builder shows every job waiting to be scheduled on one map, coloured by area, with your techs&apos; booked
              stops alongside. Pick the jobs that belong together, or load a tech&apos;s existing day, and OptyField puts them in
              driving order, starting and ending at the shop or the tech&apos;s home. Then send the whole route to the board in one click.
            </p>
          </div>
        </div>
      </section>

      {sbSchedule && (
        <section className="section">
          <div className="container narrow">
            <Shot src={`/demo/shots/${sbSchedule.image}`} alt="Building a technician's route in Schedule Builder" label="Schedule Builder" />
          </div>
        </section>
      )}

      <CTA title="See your own week on the board" />
    </>
  );
}
