export const metadata = {
  title: "Privacy Policy",
  description: "OptyField Privacy Policy. How we collect, use, and protect your information.",
  alternates: { canonical: "/privacy" },
};

// Text unchanged from the previous version (Last Updated: February 2026). Header and footer
// now come from the shared site layout. This URL is the App Store privacy-policy link.
export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container narrow legal">
        <div className="eyebrow">Legal</div>
        <h1 className="h2">Privacy Policy</h1>
        <p className="muted" style={{ marginBottom: 32 }}>Last Updated: February 2026</p>

          <p>OptyField (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our field service management platform, including our web application, mobile applications, and customer portal (collectively, the &ldquo;Service&rdquo;).</p>

          <h3>1. Information We Collect</h3>
          <p><strong>Account Information:</strong> When you or your employer creates an OptyField account, we collect names, email addresses, phone numbers, and company information necessary to provide the Service.</p>
          <p><strong>Location Data:</strong> Our mobile application collects GPS location data to enable dispatch tracking, route optimization, and job navigation. Location data may be collected in the foreground while the app is in use and in the background for dispatch visibility, only when you have granted permission.</p>
          <p><strong>Job and Work Order Data:</strong> We store information related to work orders, customer records, equipment details, estimates, invoices, checklists, technician notes, and photographs submitted through the Service.</p>
          <p><strong>Device Information:</strong> We collect device identifiers and push notification tokens to deliver job assignment alerts, parts-ready notifications, and other Service-related communications.</p>
          <p><strong>Usage Data:</strong> We collect information about how you interact with the Service, including pages visited, features used, and actions taken, to improve our platform.</p>

          <h3>2. How We Use Your Information</h3>
          <p>We use the information we collect to provide, maintain, and improve the Service, including dispatching and scheduling, technician GPS tracking and route optimization, AI-powered estimate generation from technician field notes and photos, push notification delivery for job assignments and status updates, QuickBooks integration for invoicing and payment tracking, and customer portal access for estimate approval and service tracking.</p>

          <h3>3. AI-Powered Features</h3>
          <p>OptyField uses artificial intelligence to generate draft estimates from technician-submitted notes and photographs. This data is processed to match parts, calculate labor, and produce estimates with confidence scores. Technician inputs and estimator corrections may be used to improve the accuracy of future AI-generated estimates within your organization&apos;s account.</p>

          <h3>4. Data Sharing</h3>
          <p>We do not sell your personal information. We may share data with service providers that help us operate the platform (such as cloud hosting, email delivery, and payment processing), with QuickBooks when you enable the integration, and as required by law or to protect our legal rights.</p>

          <h3>5. Data Security</h3>
          <p>We implement industry-standard security measures including encrypted data transmission (HTTPS/TLS), secure authentication, role-based access controls, and regular security practices. While no system is completely secure, we take reasonable steps to protect your information.</p>

          <h3>6. Data Retention</h3>
          <p>We retain your information for as long as your account is active or as needed to provide the Service. Work order history, equipment records, and estimate data are retained to support ongoing service operations. You may request deletion of your data by contacting us.</p>

          <h3>7. Your Rights</h3>
          <p>Depending on your location, you may have the right to access, correct, or delete your personal information, object to or restrict certain processing, request data portability, and withdraw consent where processing is based on consent. To exercise these rights, contact us using the information below.</p>

          <h3>8. Children&apos;s Privacy</h3>
          <p>The Service is not directed to individuals under the age of 16. We do not knowingly collect personal information from children.</p>

          <h3>9. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website with a revised &ldquo;Last Updated&rdquo; date.</p>

          <h3>10. Contact Us</h3>
          <p>If you have questions about this Privacy Policy or our data practices, contact us at:</p>
          <div className="card soft">
            <p style={{ margin: 0 }}><strong>OptyField</strong><br />Email: hello@optyfield.com<br />Phone: 281-932-9345<br />Houston, Texas</p>
          </div>
      </div>
    </section>
  );
}
