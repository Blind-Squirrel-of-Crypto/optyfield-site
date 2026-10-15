import Link from "next/link";
import demo from "../../public/demo/demo-data.json";
import DemoPlayer from "./DemoPlayer";

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
    </section>
  );
}
