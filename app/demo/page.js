import Link from "next/link";
import demo from "../../public/demo/demo-data.json";
import DemoPlayer from "./DemoPlayer";
import Video from "../_components/Video";

export const metadata = {
  title: "Interactive demo",
  description: "Click through OptyField in 2 minutes: plan the day on the dispatch board, the customer approves repairs machine by machine, and the office releases the approved work.",
  alternates: { canonical: "/demo" },
};

export default function Demo() {
  return (
    <section className="section">
      <div className="container">
        <div className="center narrow" style={{ marginBottom: 32 }}>
          <div className="eyebrow">Interactive demo · {demo.tour.length} steps</div>
          <h1 className="h2">Plan the day, get the repairs approved</h1>
          <p className="lede" style={{ margin: "0 auto" }}>
            Click the highlighted buttons, or use Next and your arrow keys. These are real OptyField screens, using a made-up
            demo company, Northwind Fitness Service.
          </p>
        </div>
        <DemoPlayer steps={demo.tour} />
        <p className="center small muted" style={{ marginTop: 18 }}>
          Want the full version? <Link href="/contact?from=demo" className="accent"><b>Book a 30-minute walkthrough →</b></Link>
        </p>
      </div>
      <div className="container" style={{ marginTop: 72 }}>
        <div className="center video-head">
          <div className="eyebrow">Prefer to watch?</div>
          <h2>Two short walkthroughs</h2>
        </div>
        <div className="grid grid-2" style={{ alignItems: "start" }}>
          <Video name="dispatch-schedule-builder" title="Dispatch board and Schedule Builder walkthrough" width={1920} height={1080}
            caption="Dispatch board and Schedule Builder · 75 seconds" />
          <Video name="customer-portal" title="Customer approves an estimate machine by machine" width={1440} height={900}
            caption="Customer approval to parts order · 90 seconds" />
        </div>
      </div>
    </section>
  );
}
