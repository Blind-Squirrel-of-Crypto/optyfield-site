import { Suspense } from "react";
import { SITE } from "../_components/site";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Book a walkthrough",
  description: "Book a 30-minute OptyField walkthrough for your fitness equipment service company.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <section className="section">
      <div className="container grid grid-2" style={{ alignItems: "start", maxWidth: 980 }}>
        <div>
          <div className="eyebrow">Book a walkthrough</div>
          <h1 className="h2">See OptyField with your own work</h1>
          <p style={{ marginTop: 12 }}>
            A 30-minute video call with the team that built it. Bring a few of your techs&apos; notes and an equipment list
            if you have them, and we&apos;ll show you what OptyField does with them.
          </p>
          <div style={{ display: "grid", gap: 18, marginTop: 30 }}>
            <div><div className="eyebrow" style={{ color: "var(--muted)", marginBottom: 4 }}>Email</div><a href={`mailto:${SITE.CONTACT_EMAIL}`}><b>{SITE.CONTACT_EMAIL}</b></a></div>
            <div><div className="eyebrow" style={{ color: "var(--muted)", marginBottom: 4 }}>Phone</div><a href={`tel:${SITE.PHONE.replace(/-/g, "")}`}><b>{SITE.PHONE}</b></a></div>
            <div><div className="eyebrow" style={{ color: "var(--muted)", marginBottom: 4 }}>Location</div><b>Houston, Texas</b></div>
          </div>
        </div>
        <Suspense fallback={null}><ContactForm /></Suspense>
      </div>
    </section>
  );
}
