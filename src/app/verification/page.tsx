import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ShieldCheck, Eye, Search, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ContentShell } from '@/components/content-shell';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: 'Verification Process — How MedeqX Reviews Listings & Protects Buyers',
  description: 'Learn how MedeqX verifies every medical equipment listing before it goes live, protects buyer and seller contact details, and reduces risk for high-value hospital procurement.',
  keywords: ['MedeqX verification', 'verified medical equipment seller Saudi Arabia', 'safe used medical equipment', 'hospital equipment due diligence', 'medical equipment fraud prevention GCC'],
  alternates: { canonical: `${SITE}/verification` },
  openGraph: { title: 'MedeqX Verification Process', description: 'How we review every listing and protect buyers and sellers.', url: `${SITE}/verification`, type: 'website' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does MedeqX verify medical equipment listings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every listing on MedeqX is manually reviewed by our team within 24 hours of submission. We check that the seller details are real (named hospital, clinic, or supplier with verifiable contact), that the equipment described matches the photos, that pricing is realistic for the model and condition, and that the listing complies with our equipment-quality standards.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are buyer and seller contact details made public?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Contact details — for both buyers and sellers — are never displayed on the public site. When a buyer submits an inquiry, we forward verified buyer details directly to the seller by email. This prevents spam, scraping, and unsolicited contact.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if a listing is misrepresented?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Report any listing concern to info@medeqx.com with the reference number. We investigate within 48 hours; misrepresented listings are suspended immediately and the seller is banned from re-posting until they demonstrate compliance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does MedeqX guarantee equipment condition?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MedeqX is a marketplace — final inspection, testing, and warranty terms are negotiated directly between buyer and seller. We strongly recommend buyers commission an independent biomedical inspection for high-value items (MRI, CT, ventilators). MedeqX can introduce you to qualified inspection partners on request.',
      },
    },
  ],
};

export default function VerificationPage() {
  return (
    <>
      <Script id="verify-faq" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ContentShell
        eyebrow="Trust"
        title="How MedeqX Verifies Every Listing"
        intro="Buying or selling used medical equipment is a high-stakes decision. Here&apos;s exactly how we reduce risk for both sides — and what you should still verify yourself."
        breadcrumb={[{ href: '/verification', label: 'Verification' }]}
      >
        {/* 4 trust pillars — explicit colors so text stays visible regardless of prose cascade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 not-prose">
          {[
            { icon: Eye,         title: 'Manual listing review',     desc: 'Every listing reviewed by our team within 24 hours before publishing.' },
            { icon: ShieldCheck, title: 'Seller identity check',     desc: 'Hospitals, clinics, and suppliers verified before they can list.' },
            { icon: Lock,        title: 'Private contact details',   desc: 'Buyer and seller info never published — inquiries forwarded by email only.' },
            { icon: CheckCircle2,title: 'No-spam inquiries',         desc: 'Buyer details verified at inquiry time; sellers only contacted by qualified leads.' },
          ].map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
                <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#0057FF]" />
                </div>
                <h3 className="font-extrabold text-[#0D1B3E] text-base mb-2 leading-snug" style={{ color: '#0D1B3E' }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        <h2>Our 5-step review process</h2>
        <ol>
          <li><strong>Seller submission.</strong> The seller fills out the listing form (name, contact, hospital/company, equipment, condition, photos, price).</li>
          <li><strong>Identity check.</strong> We confirm the seller is a real organisation — typically a hospital procurement officer, clinic manager, biomedical engineer, or licensed equipment supplier — using LinkedIn, hospital websites, commercial registration, and a quick verification call where needed.</li>
          <li><strong>Equipment check.</strong> We confirm the equipment described matches the photos, manufacturer model is plausible, and condition rating is consistent with the photos provided.</li>
          <li><strong>Pricing sanity check.</strong> We compare the asking price against recent comparable transactions and OEM list prices. Outlier listings are queried with the seller before approval.</li>
          <li><strong>Approval.</strong> Approved listings go live with a unique reference number. The seller receives an email confirmation; the buyer-facing listing shows the &quot;Verified&quot; trust badge.</li>
        </ol>

        <h2>What buyers should still verify themselves</h2>
        <p>
          MedeqX&apos;s review reduces risk significantly but does not replace your own due diligence on high-value items. We strongly recommend:
        </p>
        <ul>
          <li><strong>Independent biomedical inspection</strong> for items over SAR 200K. MedeqX can introduce qualified inspection partners.</li>
          <li><strong>Power-on test</strong> at the seller&apos;s site before payment.</li>
          <li><strong>Service history review</strong> — request the equipment&apos;s OEM service records, AMC history, and last calibration date.</li>
          <li><strong>Software / firmware licence transfer</strong> for software-locked equipment (CT, MRI, anaesthesia).</li>
          <li><strong>Spare parts &amp; consumables availability</strong> — confirm OEM continues to support the model.</li>
          <li><strong>Transport and installation responsibility</strong> — agreed in writing before payment.</li>
        </ul>

        <h2>Privacy &amp; data protection</h2>
        <ul>
          <li>Buyer emails, phones and company names are <strong>only</strong> forwarded to the specific seller of the listing inquired about — never to third parties.</li>
          <li>Seller contact details are never published on the public website; they are only sent to verified buyer inquiries.</li>
          <li>We do not sell, share, or rent any user data.</li>
          <li>See the full <Link href="/privacy">privacy policy</Link> for details.</li>
        </ul>

        <h2>Reporting a problem</h2>
        <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-5 not-prose">
          <div className="flex items-start gap-3">
            <AlertTriangle size={22} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-extrabold mb-1.5 text-base" style={{ color: '#78350F' }}>See something off?</p>
              <p className="text-sm leading-relaxed" style={{ color: '#92400E' }}>
                If a listing seems misrepresented or you experience a problem with a seller, email <a href="mailto:info@medeqx.com" className="font-bold underline" style={{ color: '#0057FF' }}>info@medeqx.com</a> with the listing reference number (e.g. REF-1023). We investigate within 48 hours and suspend confirmed violators immediately.
              </p>
            </div>
          </div>
        </div>

        <h2>Frequently asked questions</h2>
        <h3>How does MedeqX verify medical equipment listings?</h3>
        <p>{faqSchema.mainEntity[0].acceptedAnswer.text}</p>
        <h3>Are buyer and seller contact details made public?</h3>
        <p>{faqSchema.mainEntity[1].acceptedAnswer.text}</p>
        <h3>What if a listing is misrepresented?</h3>
        <p>{faqSchema.mainEntity[2].acceptedAnswer.text}</p>
        <h3>Does MedeqX guarantee equipment condition?</h3>
        <p>{faqSchema.mainEntity[3].acceptedAnswer.text}</p>

        <div className="rounded-2xl bg-blue-50 border-2 border-blue-100 p-6 mt-8 not-prose">
          <div className="flex items-start gap-3">
            <Search size={22} className="text-[#0057FF] mt-0.5 shrink-0" />
            <div>
              <p className="font-extrabold mb-1.5 text-base" style={{ color: '#0D1B3E' }}>Browse verified listings</p>
              <p className="text-sm mb-3" style={{ color: '#475569' }}>Every listing on MedeqX has passed our 5-step review.</p>
              <Link href="/categories" className="inline-flex items-center gap-1.5 rounded-lg bg-[#0057FF] px-4 py-2 text-xs font-bold text-white no-underline hover:bg-[#1a6aff]">
                Browse Categories →
              </Link>
            </div>
          </div>
        </div>
      </ContentShell>
    </>
  );
}
