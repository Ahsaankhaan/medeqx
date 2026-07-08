import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/content-shell';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: 'Privacy Policy — MedeqX',
  description: 'How MedeqX collects, uses, stores, and protects your personal information. Your contact details stay private until you inquire on a listing.',
  alternates: { canonical: `${SITE}/privacy` },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const updated = 'May 2026';
  return (
    <ContentShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro={`How we handle your data. Last updated: ${updated}.`}
      breadcrumb={[{ href: '/privacy', label: 'Privacy' }]}
    >
      <h2>1. Who we are</h2>
      <p>
        MedeqX (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the marketplace at <Link href="/">medeqx.com</Link>, a B2B platform for buying and selling used and refurbished medical equipment in Saudi Arabia and the GCC. We are based in Dammam, Saudi Arabia.
      </p>

      <h2>2. What information we collect</h2>
      <p>We collect only what we need to operate the marketplace:</p>
      <ul>
        <li><strong>When you post a listing:</strong> equipment details (name, manufacturer, model, condition, price, photos), your name, email, phone, and organisation name.</li>
        <li><strong>When you submit an inquiry:</strong> your name, email, phone, optional company name, and the message you write.</li>
        <li><strong>When you contact us:</strong> your name, email, and message content.</li>
        <li><strong>Technical data:</strong> IP address, browser type, pages viewed (standard server access logs only — no third-party analytics cookies as of this date).</li>
      </ul>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To publish your listing (equipment details only — never your contact info on the public site).</li>
        <li>To forward your inquiry to the relevant seller and send you a confirmation copy.</li>
        <li>To send transactional emails (listing under review, listing approved, inquiry confirmation).</li>
        <li>To respond to your contact-form message.</li>
        <li>To verify seller identity during our listing review process.</li>
        <li>To investigate misuse or fraud where reported.</li>
      </ul>

      <h2>4. What we never do</h2>
      <ul>
        <li>We <strong>never</strong> sell, share, or rent your data to third parties for marketing.</li>
        <li>We <strong>never</strong> publish your contact details (email, phone) on the public website.</li>
        <li>We <strong>never</strong> share buyer details with sellers other than the specific listing they inquired about.</li>
        <li>We <strong>never</strong> use your data for AI training, analytics resale, or any purpose outside operating the marketplace.</li>
      </ul>

      <h2>5. Who can see your information</h2>
      <ul>
        <li><strong>Sellers:</strong> when a buyer submits an inquiry, the seller of that specific listing receives the buyer&apos;s name, email, phone (if provided), company name, and message — and nothing else.</li>
        <li><strong>Buyers:</strong> when an inquiry is submitted, the buyer receives a confirmation email containing the listing reference and seller name. Buyer contact details remain visible only to the seller and our admin team.</li>
        <li><strong>Our admin team:</strong> can see all listings, inquiries, and contact details for moderation, support, and fraud prevention.</li>
        <li><strong>Service providers:</strong> our email delivery provider (SMTP) processes outbound email but does not retain user data beyond delivery.</li>
      </ul>

      <h2>6. Data retention</h2>
      <ul>
        <li>Listings remain published until you delete them or we mark them &quot;sold&quot;.</li>
        <li>Inquiry records are retained for 5 years for dispute resolution.</li>
        <li>Contact-form messages are retained for 2 years.</li>
        <li>Server access logs are rotated every 30 days.</li>
      </ul>

      <h2>7. Your rights</h2>
      <p>
        You can at any time:
      </p>
      <ul>
        <li><strong>Request a copy</strong> of all data we hold about you</li>
        <li><strong>Correct</strong> incorrect information</li>
        <li><strong>Delete</strong> your account and associated listings</li>
        <li><strong>Withdraw</strong> a listing or inquiry</li>
      </ul>
      <p>
        Email <a href="mailto:info@medeqx.com">info@medeqx.com</a> for any of the above. We respond within 7 working days.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We use only essential cookies necessary to keep you logged in to the admin panel and to remember your language preference. We do not use third-party tracking, advertising, or analytics cookies as of the date above. If this changes, we will update this policy and notify users.
      </p>

      <h2>9. Security</h2>
      <p>
        Data is stored on servers hosted in compliance with international standards. Admin access is protected by token-based authentication. We do not store payment information (transactions happen directly between buyer and seller). We disclose security incidents that affect personal data within 72 hours of discovery, in line with international best practice.
      </p>

      <h2>10. Children</h2>
      <p>
        MedeqX is a B2B platform intended for healthcare procurement professionals. We do not knowingly collect information from anyone under 18.
      </p>

      <h2>11. Updates to this policy</h2>
      <p>
        We may update this policy from time to time. Material changes will be communicated by email to registered sellers and prominently on the homepage. The &quot;Last updated&quot; date at the top of this page always reflects the current version.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about this policy or your data: <a href="mailto:info@medeqx.com">info@medeqx.com</a>.
      </p>
    </ContentShell>
  );
}
