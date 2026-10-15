"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// A small click-through "peek" demo built from real screenshots. Steps, captions and
// hotspot positions come from public/demo/demo-data.json, which tools/demo-capture
// regenerates from the live app (npm run capture), so the tour survives a redesign.
//
// Analytics: every step view and the final CTA click call track(). Wire it to the
// analytics tool you pick (e.g. Vercel Analytics `track`) — today it is a no-op.
function track(event, data) {
  if (typeof window !== "undefined" && typeof window.va === "function") window.va("event", { name: event, data });
}

function tipPosition(h) {
  // Put the caption beside the hotspot, on whichever side has more room.
  if (!h) return { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
  const style = {};
  if (h.x + h.w / 2 > 50) style.right = `${Math.min(100 - h.x + 1.5, 70)}%`;
  else style.left = `${Math.min(h.x + h.w + 1.5, 70)}%`;
  style.top = `${Math.max(2, Math.min(h.y, 62))}%`;
  return style;
}

export default function DemoPlayer({ steps }) {
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const step = steps[i];
  const go = useCallback((n) => {
    if (n >= steps.length) { setDone(true); track("demo_finished"); return; }
    setDone(false);
    setI(Math.max(0, n));
  }, [steps.length]);

  useEffect(() => { if (!done) track("demo_step", { step: i + 1, key: step.key }); }, [i, done, step.key]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go]);
  // Preload the next screenshot so clicks feel instant.
  useEffect(() => { if (steps[i + 1]) { const img = new window.Image(); img.src = `/demo/shots/${steps[i + 1].image}`; } }, [i, steps]);

  const h = step.hotspot;
  return (
    <div className="peek">
      <div className="peek-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/demo/shots/${step.image}`} alt={`${step.title}. ${step.caption}`} width={1600} height={1000} />
        {!done && h && (
          <button className="peek-hotspot" style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
            aria-label={`Next: ${steps[i + 1]?.title ?? "finish"}`} onClick={() => go(i + 1)} />
        )}
        {!done && (
          <div className="peek-tip" style={tipPosition(h)}>
            <b>{step.title}</b>
            <p>{step.caption}</p>
            {!h && <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} onClick={() => go(i + 1)}>Next →</button>}
          </div>
        )}
        {done && (
          <div className="peek-end">
            <h3>That&apos;s the 2-minute version.</h3>
            <p>In a 30-minute walkthrough we&apos;ll show OptyField with work like yours (your customers, your equipment, your week) and answer every question.</p>
            <div className="btn-row" style={{ justifyContent: "center" }}>
              <Link href="/contact?from=demo" className="btn btn-primary" onClick={() => track("demo_cta_click")}>Book a full walkthrough</Link>
              <button className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,.3)" }} onClick={() => go(0)}>Start over</button>
            </div>
          </div>
        )}
      </div>
      <div className="peek-mobile-caption">
        {!done && <><b>{step.title}</b><p>{step.caption}</p></>}
      </div>
      <div className="peek-bar">
        <span>Step {Math.min(i + 1, steps.length)} of {steps.length}{h && !done ? " · click the highlighted button" : ""}</span>
        <div className="peek-dots" role="group" aria-label="Demo steps">
          {steps.map((s, n) => (
            <button key={s.key} aria-label={`Step ${n + 1}: ${s.title}`} aria-current={n === i && !done ? "step" : undefined} onClick={() => go(n)} />
          ))}
        </div>
        <span style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-sm btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,.25)" }} onClick={() => go(i - 1)} disabled={i === 0 && !done}>← Back</button>
          <button className="btn btn-sm btn-primary" onClick={() => go(i + 1)}>{i === steps.length - 1 && !done ? "Finish" : "Next →"}</button>
        </span>
      </div>
    </div>
  );
}
