"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SITE } from "../_components/site";

// Book a Demo form. Posts to the OptyField API (/api/public/demo-request), which emails
// doug@optyfield.com. Only shows "We'll be in touch" once the request was actually delivered.
export default function ContactForm() {
  const params = useSearchParams();
  const from = params.get("from");
  const [form, setForm] = useState({
    name: "", email: "", company: "", size: "",
    message: from === "demo" ? "I clicked through the online demo and would like a full walkthrough." : "",
    website: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.name || !form.email) { setError("Please enter your name and email."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch(SITE.DEMO_REQUEST_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, company: form.company, teamSize: form.size, message: form.message, website: form.website }),
      });
      if (res.ok) { setSubmitted(true); }
      else { const data = await res.json().catch(() => ({})); setError(data.message || `Something went wrong. Please email ${SITE.CONTACT_EMAIL}.`); }
    } catch {
      setError(`We couldn't reach our server. Please email ${SITE.CONTACT_EMAIL} or call ${SITE.PHONE}.`);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="form center" role="status">
        <div style={{ fontSize: 44 }} aria-hidden="true">✓</div>
        <h3>We&apos;ll be in touch</h3>
        <p className="muted">Thanks, {form.name}. We usually reply within one business day.</p>
      </div>
    );
  }
  return (
    <form className="form" onSubmit={handleSubmit} noValidate style={{ position: "relative" }}>
      <div><label htmlFor="f-name">Name</label><input id="f-name" autoComplete="name" value={form.name} onChange={set("name")} placeholder="Your name" required /></div>
      <div><label htmlFor="f-email">Work email</label><input id="f-email" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@company.com" required /></div>
      <div><label htmlFor="f-company">Company</label><input id="f-company" autoComplete="organization" value={form.company} onChange={set("company")} placeholder="Company name" /></div>
      <div>
        <label htmlFor="f-size">Technicians</label>
        <select id="f-size" value={form.size} onChange={set("size")}>
          <option value="">How many technicians?</option>
          <option value="1-5">1–5 technicians</option>
          <option value="6-15">6–15 technicians</option>
          <option value="16-50">16–50 technicians</option>
          <option value="50+">50+ technicians</option>
        </select>
      </div>
      <div><label htmlFor="f-msg">Anything we should know?</label><textarea id="f-msg" rows={4} value={form.message} onChange={set("message")} placeholder="What kind of customers you service, what you use today…" /></div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="honeypot" value={form.website} onChange={set("website")} />
      {error && <div role="alert" className="error">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={submitting} style={{ opacity: submitting ? 0.6 : 1 }}>
        {submitting ? "Sending…" : "Book my walkthrough"}
      </button>
    </form>
  );
}
