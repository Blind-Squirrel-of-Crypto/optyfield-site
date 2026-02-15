export const metadata = {
  title: "Privacy Policy — OptyField",
  description: "OptyField Privacy Policy. How we collect, use, and protect your information.",
};

const C = {
  navy: "#0B1426", navyLight: "#1A2744",
  red: "#EF4444", redLight: "#FF8080",
  white: "#F0F2F5", offWhite: "#F8F9FB",
  gray: "#6B7280", grayDark: "#374151",
  bg: "#FFFFFF", surfaceLight: "#F3F4F6",
};

const SHIELD_PATH = "M80,32 C91.4,32 118,44 118,60.8 C118,84.8 102.8,106.4 80,128 C57.2,106.4 42,84.8 42,60.8 C42,44 68.6,32 80,32Z";
const GEAR_PATH = "M80,57 L84.669,52.553 L90.45,54.947 L90.607,61.393 L90.607,61.393 L97.053,61.55 L99.447,67.331 L95,72 L95,72 L99.447,76.669 L97.053,82.45 L90.607,82.607 L90.607,82.607 L90.45,89.053 L84.669,91.447 L80,87 L80,87 L75.331,91.447 L69.55,89.053 L69.393,82.607 L69.393,82.607 L62.947,82.45 L60.553,76.669 L65,72 L65,72 L60.553,67.331 L62.947,61.55 L69.393,61.393 L69.393,61.393 L69.55,54.947 L75.331,52.553 L80,57 Z";

export default function PrivacyPage() {
  const h3 = { fontSize: 20, fontWeight: 700, color: C.navy, margin: "32px 0 12px", fontFamily: "'DM Sans', sans-serif" };
  const p = { fontSize: 15, color: C.grayDark, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", margin: "0 0 16px" };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: C.navy, minHeight: "100vh", background: C.bg }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${C.surfaceLight}`, padding: "16px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <svg viewBox="38 28 84 104" width={28} height={35} style={{ display: "block" }}>
              <defs>
                <linearGradient id="pg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1A2744"/><stop offset="100%" stopColor="#0B1426"/>
                </linearGradient>
              </defs>
              <path d={SHIELD_PATH} fill="url(#pg)" stroke="#EF4444" strokeWidth="1.5"/>
              <path d={GEAR_PATH} fill="none" stroke="#EF4444" strokeWidth="1.8"/>
              <circle cx="80" cy="72" r="9" fill="none" stroke="#EF4444" strokeWidth="1.2"/>
              <polyline points="75,72 79,76 86,68" fill="none" stroke="#FF8080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 22, fontWeight: 700, color: C.navy, letterSpacing: -0.5 }}>
              Opty<span style={{ color: C.red }}>Field</span>
            </span>
          </a>
        </div>
      </header>

      {/* Privacy Policy Content */}
      <main style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, color: C.red, marginBottom: 8, fontFamily: "'Space Mono', monospace" }}>Legal</p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: C.navy, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Privacy Policy</h1>
          <p style={{ ...p, color: C.gray, marginBottom: 40 }}>Last Updated: February 2026</p>

          <p style={p}>OptyField (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our field service management platform, including our web application, mobile applications, and customer portal (collectively, the &ldquo;Service&rdquo;).</p>

          <h3 style={h3}>1. Information We Collect</h3>
          <p style={p}><strong>Account Information:</strong> When you or your employer creates an OptyField account, we collect names, email addresses, phone numbers, and company information necessary to provide the Service.</p>
          <p style={p}><strong>Location Data:</strong> Our mobile application collects GPS location data to enable dispatch tracking, route optimization, and job navigation. Location data may be collected in the foreground while the app is in use and in the background for dispatch visibility, only when you have granted permission.</p>
          <p style={p}><strong>Job and Work Order Data:</strong> We store information related to work orders, customer records, equipment details, estimates, invoices, checklists, technician notes, and photographs submitted through the Service.</p>
          <p style={p}><strong>Device Information:</strong> We collect device identifiers and push notification tokens to deliver job assignment alerts, parts-ready notifications, and other Service-related communications.</p>
          <p style={p}><strong>Usage Data:</strong> We collect information about how you interact with the Service, including pages visited, features used, and actions taken, to improve our platform.</p>

          <h3 style={h3}>2. How We Use Your Information</h3>
          <p style={p}>We use the information we collect to provide, maintain, and improve the Service, including dispatching and scheduling, technician GPS tracking and route optimization, AI-powered estimate generation from technician field notes and photos, push notification delivery for job assignments and status updates, QuickBooks integration for invoicing and payment tracking, and customer portal access for estimate approval and service tracking.</p>

          <h3 style={h3}>3. AI-Powered Features</h3>
          <p style={p}>OptyField uses artificial intelligence to generate draft estimates from technician-submitted notes and photographs. This data is processed to match parts, calculate labor, and produce estimates with confidence scores. Technician inputs and estimator corrections may be used to improve the accuracy of future AI-generated estimates within your organization&apos;s account.</p>

          <h3 style={h3}>4. Data Sharing</h3>
          <p style={p}>We do not sell your personal information. We may share data with service providers that help us operate the platform (such as cloud hosting, email delivery, and payment processing), with QuickBooks when you enable the integration, and as required by law or to protect our legal rights.</p>

          <h3 style={h3}>5. Data Security</h3>
          <p style={p}>We implement industry-standard security measures including encrypted data transmission (HTTPS/TLS), secure authentication, role-based access controls, and regular security practices. While no system is completely secure, we take reasonable steps to protect your information.</p>

          <h3 style={h3}>6. Data Retention</h3>
          <p style={p}>We retain your information for as long as your account is active or as needed to provide the Service. Work order history, equipment records, and estimate data are retained to support ongoing service operations. You may request deletion of your data by contacting us.</p>

          <h3 style={h3}>7. Your Rights</h3>
          <p style={p}>Depending on your location, you may have the right to access, correct, or delete your personal information, object to or restrict certain processing, request data portability, and withdraw consent where processing is based on consent. To exercise these rights, contact us using the information below.</p>

          <h3 style={h3}>8. Children&apos;s Privacy</h3>
          <p style={p}>The Service is not directed to individuals under the age of 16. We do not knowingly collect personal information from children.</p>

          <h3 style={h3}>9. Changes to This Policy</h3>
          <p style={p}>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website with a revised &ldquo;Last Updated&rdquo; date.</p>

          <h3 style={h3}>10. Contact Us</h3>
          <p style={p}>If you have questions about this Privacy Policy or our data practices, contact us at:</p>
          <div style={{ background: C.offWhite, borderRadius: 14, padding: 24, border: `1px solid ${C.surfaceLight}` }}>
            <p style={{ ...p, margin: 0 }}><strong>OptyField</strong><br />Email: hello@optyfield.com<br />Phone: 281-932-9345<br />Houston, Texas</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: C.navy, padding: "40px 0 24px", borderTop: `1px solid ${C.navyLight}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#64748B" }}>&copy; {new Date().getFullYear()} OptyField. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
