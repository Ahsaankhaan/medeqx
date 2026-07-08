import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ContentShell } from '@/components/content-shell';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: "Seller's Guide — How to Sell Used Medical Equipment in Saudi Arabia",
  description: 'Practical guide for hospitals, clinics, and suppliers on how to list used medical equipment, take good photos, price fairly, and handle inquiries on the GCC market.',
  keywords: ['how to sell used medical equipment', 'sell used MRI', 'sell hospital equipment Saudi Arabia', 'hospital asset disposal KSA', 'sell medical equipment GCC', 'liquidate medical equipment'],
  alternates: { canonical: `${SITE}/guides/selling` },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How does my hospital dispose of used medical equipment in Saudi Arabia?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most hospitals dispose of surplus equipment through (1) auction to authorised dealers, (2) direct sale to other facilities, (3) trade-in with the OEM. MedeqX is the easiest direct-to-buyer route — list the equipment free, our team reviews within 24 hours, verified buyer inquiries are forwarded to you by email. You retain full control over price and acceptance.' } },
    { '@type': 'Question', name: 'How long does it take to sell used medical equipment on MedeqX?',
      acceptedAnswer: { '@type': 'Answer', text: 'Common items (hospital beds, patient monitors, dental chairs) typically receive inquiries within 1–3 weeks. High-value imaging (MRI, CT) can take 1–4 months given the buyer pool size and procurement cycles. Listings priced realistically against market comparables sell 3× faster than overpriced ones.' } },
    { '@type': 'Question', name: 'What photos should I include on my listing?',
      acceptedAnswer: { '@type': 'Answer', text: 'Include at minimum: (1) full equipment shot from the front, (2) close-up of the OEM model/serial label, (3) control panel / screen showing it powering on, (4) close-up of any wear or damage. For imaging modalities, include a scan of a phantom or test pattern. Hospitals reject listings without serial number photos and condition close-ups.' } },
    { '@type': 'Question', name: 'How does MedeqX charge for selling?',
      acceptedAnswer: { '@type': 'Answer', text: 'Posting is completely free. We charge a 4% commission on confirmed sale value (minimum SAR 500), invoiced only after the transaction completes. No subscription, no listing fees, no fees for inquiries received.' } },
    { '@type': 'Question', name: 'What happens after a buyer inquires?',
      acceptedAnswer: { '@type': 'Answer', text: 'You receive the buyer\'s contact details (name, email, phone, company) immediately by email with the inquiry message. Negotiation, inspection, payment, and delivery are handled directly between you and the buyer. MedeqX is notified when the transaction completes so we can invoice the commission.' } },
  ],
};

export default function SellingGuide() {
  return (
    <>
      <Script id="sell-faq" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ContentShell
        eyebrow="Seller's Guide"
        title="How to Sell Used Medical Equipment in the GCC"
        intro="A short guide for hospitals, clinics, and equipment suppliers to list, price, and close sales effectively on MedeqX."
        breadcrumb={[{ href: '/guides', label: 'Guides' }, { href: '/guides/selling', label: "Seller's Guide" }]}
      >
        <h2>Why sell on MedeqX?</h2>
        <ul>
          <li><strong>Free to post.</strong> No subscription. No listing fees. 4% commission only on confirmed sale (min SAR 500).</li>
          <li><strong>Verified buyers.</strong> Inquiries come from real hospital procurement officers, biomedical engineers, and clinic managers — not tyre-kickers.</li>
          <li><strong>Privacy.</strong> Your contact details stay private until a qualified buyer inquires.</li>
          <li><strong>GCC reach.</strong> Active buyers in Riyadh, Jeddah, Dammam, Dubai, Doha and across the region.</li>
        </ul>

        <h2>Step 1: Prepare the listing details</h2>
        <p>Have these ready before you start the listing form:</p>
        <ul>
          <li><strong>Equipment name</strong> (e.g. &quot;Philips IntelliVue MX800 Patient Monitor&quot;)</li>
          <li><strong>Manufacturer + model + serial number</strong></li>
          <li><strong>Year of manufacture</strong> (check the OEM label, not your purchase date)</li>
          <li><strong>Condition</strong> — New / Refurbished / Used / For Parts</li>
          <li><strong>Photos</strong> — 4–6 clear shots (see below)</li>
          <li><strong>Asking price in SAR</strong> — or &quot;by inquiry&quot; if you want to negotiate</li>
          <li><strong>Location</strong> — city where the equipment is physically located</li>
          <li><strong>Description</strong> — 3–5 sentences on what&apos;s included, why you&apos;re selling, condition specifics</li>
          <li><strong>Specs</strong> — technical specs for engineers (resolution, channels, software version, etc.)</li>
        </ul>

        <h2>Step 2: Take photos that sell</h2>
        <p>Listings with strong photos receive <strong>5–10× more inquiries</strong>. Minimum shots:</p>
        <ol>
          <li><strong>Full equipment, front view</strong> — well-lit, neutral background (a clean wall is fine)</li>
          <li><strong>Close-up of the OEM serial/model label</strong> — buyers verify the model from this</li>
          <li><strong>Control panel / screen powered on</strong> — proves it works</li>
          <li><strong>Side or back view</strong> — shows full condition</li>
          <li><strong>Close-up of any wear / damage / scratches</strong> — honesty builds trust</li>
          <li>(Imaging only) <strong>A phantom scan or test image</strong> — proves diagnostic quality</li>
        </ol>
        <p>
          Use a phone camera with bright daylight. No need for professional photography — clarity beats artistry. Avoid stock photos or OEM brochure images; buyers want to see the actual unit.
        </p>

        <h2>Step 3: Price it right</h2>
        <p>
          The biggest mistake sellers make: anchoring on the original purchase price. The market doesn&apos;t care what you paid in 2018 — it cares what comparable units sell for today.
        </p>
        <p>Use these rough benchmarks (refine by checking <Link href="/guides/pricing">our pricing guide</Link>):</p>
        <ul>
          <li>Used, 5–10 years old, well-maintained: <strong>20–40% of new OEM list price</strong></li>
          <li>Refurbished with limited warranty: <strong>35–55%</strong></li>
          <li>For parts only: <strong>5–15%</strong></li>
        </ul>
        <p>
          Realistic pricing leads to inquiries within weeks; aspirational pricing leads to months of silence. You can always negotiate down — but a stale listing loses momentum.
        </p>

        <h2>Step 4: Write a compelling description</h2>
        <p>Strong descriptions answer these in 3–5 sentences:</p>
        <ul>
          <li><strong>Why are you selling?</strong> (Upgrade, hospital relocation, surplus, etc.) — a credible reason builds trust.</li>
          <li><strong>What&apos;s the maintenance history?</strong> (AMC active until X, last serviced by Y, etc.)</li>
          <li><strong>What&apos;s included?</strong> (accessories, manuals, original packaging, current consumables)</li>
          <li><strong>What&apos;s the condition honestly?</strong> (cosmetic wear, any known issues)</li>
          <li><strong>What are your terms?</strong> (price firm/negotiable, transport responsibility, inspection welcome)</li>
        </ul>

        <h2>Step 5: Handle inquiries professionally</h2>
        <ul>
          <li><strong>Respond within 24 hours.</strong> Buyers often inquire on 3–5 listings simultaneously — first responder wins.</li>
          <li><strong>Welcome an inspection.</strong> Refusing inspection is the biggest red flag for buyers. Embrace it; it accelerates trust.</li>
          <li><strong>Be honest about issues.</strong> A buyer who finds an undisclosed issue post-sale will dispute the deal. Better to price-in the issue upfront.</li>
          <li><strong>Don&apos;t over-promise.</strong> If you don&apos;t know the answer to a technical question, say so and offer to get back to them after checking.</li>
        </ul>

        <h2>Step 6: Negotiate the deal</h2>
        <ul>
          <li>Expect buyers to start 10–25% below your asking price. Counter at 5–10% below your bottom line.</li>
          <li>Bundle accessories or extended consumables for goodwill rather than dropping price further.</li>
          <li>For high-value deals, use a written Letter of Intent (LOI) before any inspection visit.</li>
          <li>Typical payment structure: 30% deposit on PO, 50% on inspection pass, 20% on installation acceptance.</li>
        </ul>

        <h2>Step 7: Close the transaction</h2>
        <ul>
          <li>Issue a proper invoice with your CR / VAT number.</li>
          <li>Provide all original manuals, accessories, and service history documents.</li>
          <li>Provide a signed equipment transfer certificate for the buyer&apos;s regulatory records.</li>
          <li>Notify MedeqX when the sale completes so we can invoice the 4% commission.</li>
        </ul>

        <h2>Hospital asset disposal</h2>
        <p>
          Decommissioning a department, upgrading a fleet, or closing a facility? MedeqX offers <Link href="/contact">brokerage and valuation services</Link> for full-site liquidations: bulk listing creation, valuation of mixed inventory, and direct introduction to buyer pools. Email us at <a href="mailto:info@medeqx.com">info@medeqx.com</a> with a high-level inventory list.
        </p>

        <h2>Frequently asked questions</h2>
        {faqSchema.mainEntity.map((q, i) => (
          <div key={i}>
            <h3>{q.name}</h3>
            <p>{q.acceptedAnswer.text}</p>
          </div>
        ))}

        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 mt-8 not-prose">
          <p className="font-bold text-[#0D1B3E] mb-1">Ready to list?</p>
          <p className="text-sm text-slate-600 mb-3">Free to post. Reviewed in 24 hours. 4% commission only on sale.</p>
          <Link href="/post-listing" className="inline-flex items-center gap-1.5 rounded-lg bg-[#0057FF] px-4 py-2 text-xs font-semibold text-white no-underline">
            Post Your Equipment →
          </Link>
        </div>
      </ContentShell>
    </>
  );
}
