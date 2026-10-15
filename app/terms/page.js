import { SITE } from "../_components/site";

export const metadata = {
  title: "Terms of Service",
  description: "OptyField Terms of Service.",
  alternates: { canonical: "/terms" },
};

// Text unchanged from the previous single-page site (Last Updated: February 2026).
export default function TermsPage() {
  return (
    <section className="section">
      <div className="container narrow legal">
        <div className="eyebrow">Legal</div>
        <h1 className="h2">Terms of Service</h1>
        <p className="muted" style={{ marginBottom: 32 }}>Last Updated: February 2026</p>
        <p>These Terms of Service ("Terms") govern your use of the OptyField platform and services. By accessing or using OptyField, you agree to be bound by these Terms.</p>

        <h3>1. Service Description</h3>
        <p>OptyField is a field service management platform that provides dispatching, work order management, AI-powered estimating, technician mobile applications, customer portal, inventory tracking, and QuickBooks integration. The Service is designed for commercial field service operations and is provided on a subscription basis.</p>

        <h3>2. Account Responsibilities</h3>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating accounts and to notify us promptly of any unauthorized use. Account administrators are responsible for managing user access and permissions within their organization.</p>

        <h3>3. Acceptable Use</h3>
        <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service in any way that violates applicable laws or regulations, to attempt to gain unauthorized access to any part of the Service, to interfere with the proper functioning of the Service, or to use the Service to transmit harmful or malicious content.</p>

        <h3>4. Data Ownership</h3>
        <p>You retain ownership of all data you submit to the Service, including customer records, work orders, estimates, photographs, and other business data ("Your Data"). You grant us a limited license to use Your Data solely to provide and improve the Service. We will not access, use, or share Your Data except as necessary to operate the Service or as described in our Privacy Policy.</p>

        <h3>5. AI-Generated Content</h3>
        <p>OptyField's AI estimating features generate draft estimates based on technician inputs. AI-generated estimates are drafts intended for human review and approval. We do not guarantee the accuracy, completeness, or suitability of AI-generated content. Your estimators and administrators are responsible for reviewing, editing, and approving all estimates before they are sent to customers.</p>

        <h3>6. Service Availability</h3>
        <p>We strive to maintain high availability of the Service but do not guarantee uninterrupted access. We may perform scheduled maintenance, and the Service may experience occasional downtime. Our mobile application includes offline capabilities to mitigate the impact of connectivity issues.</p>

        <h3>7. Payment Terms</h3>
        <p>Subscription fees are billed according to the plan selected. All fees are non-refundable except as required by law. We reserve the right to modify pricing with reasonable advance notice.</p>

        <h3>8. Limitation of Liability</h3>
        <p>To the fullest extent permitted by law, OptyField shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities arising from your use of or inability to use the Service.</p>

        <h3>9. Termination</h3>
        <p>Either party may terminate the subscription with written notice. Upon termination, we will provide a reasonable period to export Your Data. We may suspend or terminate accounts that violate these Terms.</p>

        <h3>10. Changes to Terms</h3>
        <p>We may update these Terms from time to time. We will notify you of material changes. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.</p>

        <h3>11. Governing Law</h3>
        <p>These Terms are governed by the laws of the State of Texas. Any disputes shall be resolved in the courts located in Harris County, Texas.</p>

        <h3>12. Contact</h3>
        <p>Questions about these Terms? Contact us at:</p>
        <div className="card soft">
          <p style={{ margin: 0 }}><strong>OptyField</strong><br />Email: {SITE.CONTACT_EMAIL}<br />Phone: {SITE.PHONE}<br />Houston, Texas</p>
        </div>
      </div>
    </section>
  );
}
