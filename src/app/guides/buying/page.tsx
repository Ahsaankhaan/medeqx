import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ContentShell } from '@/components/content-shell';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: "Buyer's Guide — How to Buy Used Medical Equipment Safely in Saudi Arabia",
  description: 'A practical guide for hospitals and clinics on how to vet sellers, inspect used medical equipment, negotiate, transport, and avoid the most common buying mistakes in the GCC.',
  keywords: ['how to buy used medical equipment', 'buy used MRI safely', 'used CT scanner inspection', 'used hospital equipment checklist', 'buyer guide medical equipment Saudi Arabia', 'refurbished medical equipment vs used'],
  alternates: { canonical: `${SITE}/guides/buying` },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do I verify a used medical equipment seller in Saudi Arabia?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ask for the seller\'s commercial registration (CR), Saudi Food and Drug Authority (SFDA) authorization where applicable, and verifiable references from previous transactions. Cross-check the seller\'s name against the hospital or clinic they claim to represent. On MedeqX, every seller is reviewed by our team before listing.' } },
    { '@type': 'Question', name: 'What should I inspect before buying a used MRI or CT scanner?',
      acceptedAnswer: { '@type': 'Answer', text: 'Always commission an independent biomedical engineering inspection for high-value items. Verify the OEM service history, last calibration date, software licence transferability, cryogen levels (for MRI), tube count and remaining life (for CT), and detector quality. Test power-on, scan a phantom, and confirm DICOM output. Get the inspection report in writing before payment.' } },
    { '@type': 'Question', name: 'What is the difference between used and refurbished medical equipment?',
      acceptedAnswer: { '@type': 'Answer', text: 'Used equipment is sold "as is" without restoration. Refurbished equipment has been inspected, repaired where needed, and brought back to near-original specifications by a qualified refurbisher (often the OEM or an authorised partner) and typically includes a limited warranty. Refurbished costs more than used but reduces buyer risk significantly.' } },
    { '@type': 'Question', name: 'How much should I pay for used medical equipment?',
      acceptedAnswer: { '@type': 'Answer', text: 'As a rough rule, expect to pay 20–40% of new OEM list price for well-maintained used equipment 5–10 years old. Refurbished commands 35–55%. See our pricing guide for category-specific benchmarks.' } },
    { '@type': 'Question', name: 'Who handles transport and installation of used hospital equipment in the GCC?',
      acceptedAnswer: { '@type': 'Answer', text: 'Agree this in writing before payment. Options: (1) seller delivers and installs at buyer site, (2) buyer arranges transport via a logistics specialist, (3) OEM-authorised service company handles decommission and re-install. For MRI / CT, professional rigging and a crane is mandatory — never DIY.' } },
  ],
};

export default function BuyingGuide() {
  return (
    <>
      <Script id="buy-faq" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ContentShell
        eyebrow="Buyer's Guide"
        title="How to Buy Used Medical Equipment Safely in the GCC"
        intro="A practical, GCC-specific checklist for hospitals, clinics, and biomedical engineers buying pre-owned imaging, monitoring, and surgical equipment. Read this before you wire payment."
        breadcrumb={[{ href: '/guides', label: 'Guides' }, { href: '/guides/buying', label: "Buyer's Guide" }]}
      >
        <h2>1. Decide: used or refurbished?</h2>
        <p>
          The first decision is condition tier. Both have a place in a hospital budget:
        </p>
        <ul>
          <li><strong>Used</strong> — sold as-is by the previous owner. Lowest price (20–40% of new OEM). Best for: budget-conscious clinics, well-known model with strong service support, when buyer has in-house biomedical engineering capability.</li>
          <li><strong>Refurbished</strong> — restored to near-original specs by the OEM or authorised partner, with limited warranty (typically 3–12 months). Costs 35–55% of new OEM. Best for: mission-critical imaging (MRI, CT, mammography), and any equipment your team is not confident inspecting themselves.</li>
        </ul>

        <h2>2. Vet the seller</h2>
        <p>Before any payment, confirm:</p>
        <ul>
          <li><strong>Identity</strong> — named hospital, clinic, or licensed equipment company. No one selling under an Instagram handle.</li>
          <li><strong>Commercial Registration (CR)</strong> for companies, or hospital procurement office contact for institutional sellers.</li>
          <li><strong>SFDA registration</strong> where the equipment requires it (most active medical devices).</li>
          <li><strong>References</strong> — at least one previous buyer who can confirm the seller delivered as promised.</li>
          <li><strong>Physical presence</strong> — request a site visit to inspect the equipment in operation before payment.</li>
        </ul>
        <p>
          On MedeqX, every seller is manually reviewed before listing — see how on the <Link href="/verification">verification page</Link>.
        </p>

        <h2>3. Inspect the equipment</h2>
        <p>For high-value equipment (over SAR 200K), commission an <strong>independent biomedical engineering inspection</strong>. Expect to pay SAR 3,000–10,000 — trivial vs the deal size. The inspection should cover:</p>
        <ul>
          <li>Power-on test and full functional self-test</li>
          <li>OEM service log review (calibration, repairs, AMC history)</li>
          <li>Hours of use / scan counts (for imaging modalities)</li>
          <li>Critical wear components — X-ray tube life, MRI cryogen level, CT detector, ultrasound probe condition</li>
          <li>Software / firmware version, licence transferability</li>
          <li>DICOM / HL7 output validation</li>
          <li>Physical condition — covers, cables, footswitch, accessories complete</li>
          <li>Spare parts availability — confirm OEM still supports the model for 3+ years</li>
        </ul>

        <h2>4. Negotiate smart</h2>
        <ul>
          <li><strong>Anchor on comparables.</strong> Ask the seller what they paid (where appropriate) and what comparable models recently sold for. Reference our <Link href="/guides/pricing">pricing guide</Link> for benchmarks.</li>
          <li><strong>Bundle leverage.</strong> Buying multiple items? Negotiate a package discount of 5–15%.</li>
          <li><strong>Inspection-contingent offer.</strong> Make your purchase price contingent on a successful inspection — written into the LOI / PO.</li>
          <li><strong>Hold-back.</strong> 10–20% payment held back until successful installation and acceptance test at buyer site.</li>
        </ul>

        <h2>5. Transport &amp; installation</h2>
        <p>This is where many deals go wrong. Settle in writing before payment:</p>
        <ul>
          <li><strong>Who decommissions</strong> at seller site (often a rigging crew + biomedical engineer)</li>
          <li><strong>Who transports</strong> — for MRI/CT, use a specialist medical logistics provider with insurance</li>
          <li><strong>Who installs and commissions</strong> at buyer site — OEM-authorised service is strongly recommended for imaging</li>
          <li><strong>Acceptance test criteria</strong> — what must work for the buyer to release final payment</li>
          <li><strong>Insurance during transit</strong> — name the buyer on the cargo policy if buyer-paid transport</li>
        </ul>

        <h2>6. Payment &amp; risk reduction</h2>
        <ul>
          <li>Never wire 100% upfront for high-value items. Standard structure: 30% deposit on PO, 50% on inspection pass, 20% on installation acceptance.</li>
          <li>For first-time sellers, consider escrow via your bank.</li>
          <li>Use bank transfer with full transaction reference — never cash for items above SAR 50K.</li>
          <li>Get a signed delivery acceptance certificate. This is your legal proof for warranty claims.</li>
        </ul>

        <h2>7. After the sale</h2>
        <ul>
          <li>Register the equipment under your facility&apos;s name with the relevant regulator (SFDA for KSA).</li>
          <li>Set up a fresh AMC with the OEM-authorised service provider in your country.</li>
          <li>Run baseline QA tests before clinical use.</li>
          <li>Add to your biomedical engineering inventory and PM schedule.</li>
        </ul>

        <h2>Common buying mistakes to avoid</h2>
        <ul>
          <li>Skipping the independent inspection on items over SAR 200K — the most common and most expensive mistake.</li>
          <li>Not confirming software licence transferability — leaves you with a paperweight on some imaging modalities.</li>
          <li>Verbal-only agreements on transport / installation responsibilities.</li>
          <li>Paying 100% upfront to a previously-unknown seller.</li>
          <li>Buying obsolete models where OEM no longer supplies spare parts.</li>
        </ul>

        <h2>Frequently asked questions</h2>
        {faqSchema.mainEntity.map((q, i) => (
          <div key={i}>
            <h3>{q.name}</h3>
            <p>{q.acceptedAnswer.text}</p>
          </div>
        ))}

        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 mt-8 not-prose">
          <p className="font-bold text-[#0D1B3E] mb-1">Ready to browse?</p>
          <p className="text-sm text-slate-600 mb-3">Every listing on MedeqX has been reviewed by our team. Start with verified categories or specific brands.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/categories" className="rounded-lg bg-[#0057FF] px-4 py-2 text-xs font-semibold text-white no-underline">Browse Categories →</Link>
            <Link href="/manufacturers" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 no-underline">Browse by Brand →</Link>
            <Link href="/contact" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 no-underline">Need help sourcing? →</Link>
          </div>
        </div>
      </ContentShell>
    </>
  );
}
