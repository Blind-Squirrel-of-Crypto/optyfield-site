const BASE = "https://www.optyfield.com";
const PAGES = ["", "/dispatch-scheduling", "/customer-approvals", "/equipment-register", "/fitness-service-companies", "/demo", "/pricing", "/about", "/contact", "/privacy", "/terms"];

export default function sitemap() {
  return PAGES.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "monthly", priority: p === "" ? 1 : p.startsWith("/privacy") || p.startsWith("/terms") ? 0.2 : 0.8 }));
}
