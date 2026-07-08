import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ContentShell } from '@/components/content-shell';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: 'Used Medical Equipment Pricing Guide — MRI, CT, Ultrasound (SAR)',
  description: 'How to estimate the resale value of used MRI, CT, ultrasound, hospital beds, ventilators, dental chairs and other medical equipment in Saudi Arabia. Depreciation, condition tiers, and 2026 SAR benchmarks.',
  keywords: ['used MRI price Saudi Arabia', 'used CT scanner price SAR', 'refurbished medical equipment cost', 'used ultrasound machine price KSA', 'medical equipment depreciation', 'how to price used hospital equipment'],
  alternates: { canonical: `${SITE}/guides/pricing` },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How much does a used MRI machine cost in Saudi Arabia?',
      acceptedAnswer: { '@type': 'Answer', text: 'A well-maintained used 1.5T MRI typically sells for SAR 400K–1.2M depending on age (5–12 years), brand (Siemens, GE, Philips command premium), and software level. Refurbished with warranty: SAR 800K–2M. New OEM list price reference: SAR 4–7M.' } },
    { '@type': 'Question', name: 'How much does a used CT scanner cost in Saudi Arabia?',
      acceptedAnswer: { '@type': 'Answer', text: 'Used 16-slice CT: SAR 200K–450K. Used 64-slice: SAR 450K–900K. Used 128/256-slice: SAR 800K–1.8M. Refurbished commands 30–50% premium. Tube life and detector quality are the biggest value drivers.' } },
    { '@type': 'Question', name: 'How much does a used ultrasound machine cost?',
      acceptedAnswer: { '@type': 'Answer', text: 'Mid-range used ultrasound systems (Philips HD11, GE Voluson E8, Mindray DC8) typically SAR 25K–90K. High-end (Voluson E10, Aplio i800) SAR 80K–250K. Probe condition is the single biggest factor — verify before purchase.' } },
    { '@type': 'Question', name: 'What factors affect used medical equipment pricing the most?',
      acceptedAnswer: { '@type': 'Answer', text: 'In order of impact: (1) age in years, (2) brand reputation, (3) condition tier (used vs refurbished), (4) OEM service continuity for the model, (5) software licence transferability, (6) included accessories, (7) seller type (hospital direct vs broker), (8) GCC market liquidity for that specific model.' } },
  ],
};

export default function PricingGuide() {
  return (
    <>
      <Script id="price-faq" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ContentShell
        eyebrow="Pricing Guide"
        title="Used Medical Equipment Price Guide — Saudi Arabia &amp; GCC"
        intro="Benchmark ranges in SAR for the most-traded categories. Use these as a starting point for negotiation, not a guarantee — actual prices depend on specific brand, model, condition, and remaining service life."
        breadcrumb={[{ href: '/guides', label: 'Guides' }, { href: '/guides/pricing', label: 'Pricing Guide' }]}
      >
        <h2>The fundamentals of medical equipment depreciation</h2>
        <p>
          Most medical equipment loses value on a rough curve: ~30% in year 1, then 10–15% per year for the next 7–10 years, levelling off as the equipment approaches end-of-life support. Brand strength and OEM service continuity slow this curve; obsolete software accelerates it.
        </p>
        <p>
          A useful rule of thumb for the GCC used market:
        </p>
        <ul>
          <li><strong>Used</strong>, 5–10 years old, well-maintained, no warranty: <strong>20–40% of new OEM list price</strong></li>
          <li><strong>Refurbished</strong>, restored by OEM/authorised partner, limited warranty: <strong>35–55%</strong></li>
          <li><strong>For parts only</strong>, non-functional: <strong>5–15%</strong></li>
        </ul>

        <h2>Imaging — MRI, CT, X-Ray, Ultrasound</h2>

        <h3>MRI Scanners</h3>
        <ul>
          <li>1.5T used (5–12 yrs): <strong>SAR 400K – 1.2M</strong></li>
          <li>1.5T refurbished w/ warranty: <strong>SAR 800K – 2M</strong></li>
          <li>3T used: <strong>SAR 1.2M – 3M</strong></li>
          <li>3T refurbished: <strong>SAR 2.5M – 5M</strong></li>
        </ul>
        <p><em>Key value drivers:</em> cryogen level, magnet age, coil count, software channels, helium boil-off rate. Always verify quench history.</p>

        <h3>CT Scanners</h3>
        <ul>
          <li>16-slice used: <strong>SAR 200K – 450K</strong></li>
          <li>64-slice used: <strong>SAR 450K – 900K</strong></li>
          <li>128-slice used: <strong>SAR 800K – 1.6M</strong></li>
          <li>256+ slice used: <strong>SAR 1.5M – 3M</strong></li>
        </ul>
        <p><em>Key value drivers:</em> tube life (in mAs counts), detector quality, software dose-reduction features.</p>

        <h3>Ultrasound Machines</h3>
        <ul>
          <li>Entry-level cart used: <strong>SAR 18K – 45K</strong></li>
          <li>Mid-range (Voluson E8, HD11, DC8): <strong>SAR 30K – 90K</strong></li>
          <li>High-end (Voluson E10, Aplio i800, EPIQ 7): <strong>SAR 80K – 250K</strong></li>
          <li>Portable/handheld used: <strong>SAR 8K – 30K</strong></li>
        </ul>
        <p><em>Key value drivers:</em> probe count and condition (probes are 30–50% of total system value), 4D capability, application licences.</p>

        <h3>X-Ray Systems</h3>
        <ul>
          <li>Mobile C-arm used: <strong>SAR 60K – 200K</strong></li>
          <li>Fixed digital radiography used: <strong>SAR 150K – 500K</strong></li>
          <li>Mammography used: <strong>SAR 200K – 700K</strong></li>
        </ul>

        <h2>Patient Monitoring &amp; ICU</h2>

        <h3>Patient Monitors</h3>
        <ul>
          <li>Mid-range used (IntelliVue MP5/MX400, Mindray uMEC, etc.): <strong>SAR 3K – 9K each</strong></li>
          <li>High-end used (IntelliVue MX800/MX700, B450): <strong>SAR 9K – 22K each</strong></li>
          <li>Central station used: <strong>SAR 20K – 80K</strong></li>
        </ul>

        <h3>ICU Ventilators</h3>
        <ul>
          <li>Used (Servo-i/u, Puritan Bennett 840, Hamilton G5, Drager Evita): <strong>SAR 25K – 70K</strong></li>
          <li>Refurbished w/ warranty: <strong>SAR 50K – 110K</strong></li>
          <li>Transport / emergency ventilators used: <strong>SAR 10K – 30K</strong></li>
        </ul>

        <h3>Defibrillators</h3>
        <ul>
          <li>AED used (Philips HeartStart, Zoll AED Plus): <strong>SAR 2.5K – 6K</strong></li>
          <li>Hospital defibrillator/monitor used (LifePak 20, R Series): <strong>SAR 8K – 22K</strong></li>
        </ul>

        <h2>Surgical &amp; Anesthesia</h2>

        <h3>Anesthesia Machines</h3>
        <ul>
          <li>Mid-range used (Drager Fabius, GE Aisys CS²): <strong>SAR 35K – 90K</strong></li>
          <li>High-end refurbished w/ warranty: <strong>SAR 80K – 180K</strong></li>
        </ul>

        <h3>Operating Tables &amp; Lights</h3>
        <ul>
          <li>Operating table used (Maquet, Mizuho, Steris): <strong>SAR 25K – 80K</strong></li>
          <li>Surgical lights (pair) used: <strong>SAR 12K – 40K</strong></li>
        </ul>

        <h2>Hospital Beds &amp; Furniture</h2>
        <ul>
          <li>Standard hospital bed used (Stryker, Hill-Rom): <strong>SAR 1.5K – 4K</strong></li>
          <li>ICU bed used: <strong>SAR 4K – 12K</strong></li>
          <li>Birthing/delivery bed used: <strong>SAR 6K – 18K</strong></li>
          <li>Wheelchair used: <strong>SAR 200 – 1,500</strong></li>
        </ul>

        <h2>Dialysis &amp; Renal Care</h2>
        <ul>
          <li>Dialysis machine used (Fresenius 4008, Nikkiso, B Braun): <strong>SAR 18K – 55K</strong></li>
          <li>RO water treatment system used: <strong>SAR 40K – 150K</strong></li>
        </ul>

        <h2>Dental</h2>
        <ul>
          <li>Dental chair unit used (Adec, Sirona, Castellini): <strong>SAR 6K – 30K</strong></li>
          <li>Intraoral X-ray used: <strong>SAR 3K – 12K</strong></li>
          <li>Panoramic / OPG X-ray used: <strong>SAR 25K – 90K</strong></li>
          <li>Dental CBCT used: <strong>SAR 80K – 280K</strong></li>
        </ul>

        <h2>Laboratory &amp; CSSD</h2>
        <ul>
          <li>Chemistry analyzer used (Cobas, Architect): <strong>SAR 60K – 250K</strong></li>
          <li>Hematology analyzer used: <strong>SAR 25K – 80K</strong></li>
          <li>Centrifuge used: <strong>SAR 2K – 15K</strong></li>
          <li>Autoclave (tabletop) used: <strong>SAR 5K – 20K</strong></li>
          <li>Large CSSD autoclave used: <strong>SAR 80K – 300K</strong></li>
        </ul>

        <h2>How to research a specific model price</h2>
        <ol>
          <li>Search MedeqX for the exact model — see what comparable units are listed at right now.</li>
          <li>Search global marketplaces (DOTmed, Bimedis) for the same model — adjust 10–20% upward for GCC import / installation premium.</li>
          <li>Get a quote from the OEM for the new replacement — the used ratio (20–40%) gives you a floor and ceiling.</li>
          <li>Ask 2–3 authorised dealers for trade-in value — represents the wholesale price.</li>
          <li>Triangulate: realistic asking = average of the above minus 10%.</li>
        </ol>

        <h2>Common pricing mistakes</h2>
        <ul>
          <li>Anchoring on original purchase price (the market doesn&apos;t care).</li>
          <li>Ignoring software/probe/accessory condition — these can be 30–50% of total value.</li>
          <li>Pricing &quot;to negotiate down&quot; — listings 20%+ above market die from lack of inquiries.</li>
          <li>Not factoring in transport / decommission / re-install costs (10–25% of equipment value for large items).</li>
        </ul>

        <h2>Frequently asked questions</h2>
        {faqSchema.mainEntity.map((q, i) => (
          <div key={i}>
            <h3>{q.name}</h3>
            <p>{q.acceptedAnswer.text}</p>
          </div>
        ))}

        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 my-8 not-prose">
          <p className="text-sm text-amber-900 leading-relaxed">
            <strong>Disclaimer:</strong> Prices in this guide are approximate ranges based on GCC market observations as of 2026 and are not a quote, valuation, or guarantee. Actual selling price depends on specific brand, model, configuration, condition, service history, and current market liquidity. For a formal valuation of high-value equipment, email <a href="mailto:info@medeqx.com" className="font-semibold underline">info@medeqx.com</a>.
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 mt-8 not-prose">
          <p className="font-bold text-[#0D1B3E] mb-1">Want to validate a price?</p>
          <p className="text-sm text-slate-600 mb-3">Browse what&apos;s currently listed for your equipment type.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/categories" className="rounded-lg bg-[#0057FF] px-4 py-2 text-xs font-semibold text-white no-underline">Browse Categories →</Link>
            <Link href="/manufacturers" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 no-underline">Browse by Brand →</Link>
          </div>
        </div>
      </ContentShell>
    </>
  );
}
