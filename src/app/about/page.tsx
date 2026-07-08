import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ShieldCheck, Eye, Award, Users, Building2, MapPin, ArrowRight } from 'lucide-react';
import { ContentShell } from '@/components/content-shell';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: 'About MedeqX — The Trusted GCC Medical Equipment Marketplace',
  description: 'Learn about MedeqX, the Dammam-based B2B marketplace connecting hospitals, clinics and biomedical engineers across Saudi Arabia and the GCC to trade used and refurbished medical equipment safely.',
  keywords: ['About MedeqX', 'medical equipment marketplace Saudi Arabia', 'B2B medical equipment GCC', 'verified medical equipment seller', 'hospital equipment trading'],
  alternates: { canonical: `${SITE}/about` },
  openGraph: {
    title: 'About MedeqX — Saudi Arabia&apos;s B2B Medical Equipment Marketplace',
    description: 'A Dammam-based platform built to make trading used medical equipment safer, faster and more transparent across the GCC.',
    url: `${SITE}/about`,
    type: 'website',
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About MedeqX',
  url: `${SITE}/about`,
  mainEntity: {
    '@type': 'Organization',
    name: 'MedeqX',
    url: SITE,
    description: 'B2B marketplace for used and refurbished medical equipment in Saudi Arabia and the GCC.',
    foundingLocation: { '@type': 'Place', name: 'Dammam, Saudi Arabia' },
  },
};

export default function AboutPage() {
  return (
    <>
      <Script id="about-schema" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />

      <ContentShell
        eyebrow="About Us"
        title="The Trusted GCC Medical Equipment Marketplace"
        intro="MedeqX is a Dammam-based B2B platform that connects hospitals, clinics, biomedical engineers and refurbishment specialists across Saudi Arabia and the GCC to trade pre-owned medical equipment with confidence."
        breadcrumb={[{ href: '/about', label: 'About' }]}
      >
        <h2>Why MedeqX exists</h2>
        <p>
          Every year, hospitals across Saudi Arabia and the GCC retire millions of riyals worth of medical equipment that still has years of useful life. At the same time, new and growing facilities — clinics, day-surgery centres, rehab units — need that exact equipment but struggle to find verified sellers without paying full OEM list prices.
        </p>
        <p>
          The traditional way of trading this equipment — informal broker networks, classified ads, word of mouth — is slow, opaque, and risky. Buyers worry about counterfeit or non-functional units; sellers waste time on tyre-kickers and unqualified leads.
        </p>
        <p>
          <strong>MedeqX exists to fix that.</strong> We give hospitals and suppliers a single, reviewed marketplace where every listing is checked, every contact is verified, and pricing is transparent.
        </p>

        <h2>How we&apos;re different</h2>
        <ul>
          <li><strong>Every listing reviewed.</strong> Our team manually approves each listing before it goes live — no anonymous postings.</li>
          <li><strong>Contact details stay private.</strong> Seller and buyer information is never published. We forward verified inquiries by email only.</li>
          <li><strong>Pay only on confirmed sale.</strong> No subscription, no listing fees. A transparent 4% commission (minimum SAR 500) charged only after a successful transaction.</li>
          <li><strong>Bilingual platform.</strong> Full English + Arabic interface, designed for the GCC healthcare procurement workflow.</li>
          <li><strong>Brokerage on large deals.</strong> For high-value transactions or full hospital decommissions, we offer hands-on brokering, valuation, and cross-border facilitation.</li>
        </ul>

        <h2>Who we serve</h2>
        <ul>
          <li>Public and private hospitals managing equipment lifecycle and budget</li>
          <li>Clinics and day-surgery centres sourcing affordable diagnostic and treatment equipment</li>
          <li>Biomedical engineers and procurement teams</li>
          <li>Equipment refurbishment partners, OEM service providers, and resellers</li>
          <li>Dental, dialysis, and specialty practices across the GCC</li>
        </ul>

        <h2>Where we operate</h2>
        <p>
          Headquartered in Dammam, MedeqX serves the full GCC region: Saudi Arabia (Riyadh, Jeddah, Dammam, Mecca, Medina, Khobar, Tabuk and other cities), the United Arab Emirates, Kuwait, Qatar, Bahrain, and Oman.
        </p>

        <h2>The opportunity</h2>
        <p>
          Used medical equipment trading in the GCC has historically been fragmented and inefficient. We&apos;re building the trusted layer that this sector has been missing — combining marketplace liquidity, biomedical engineering expertise, and the GCC&apos;s relationship-driven business culture.
        </p>

        {/* Stats / trust blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-10">
          {[
            { icon: ShieldCheck, label: 'Verified Sellers' },
            { icon: Eye,          label: 'Reviewed Listings' },
            { icon: Award,        label: 'Hospital-Grade' },
            { icon: Users,        label: 'B2B Only' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-2">
                <Icon size={18} className="text-[#0057FF]" />
              </div>
              <p className="text-xs font-semibold text-[#0D1B3E]">{label}</p>
            </div>
          ))}
        </div>

        <h2>Get in touch</h2>
        <p>
          Have a large equipment deal, a full hospital decommission, or a sourcing requirement we can help with? Talk to our team directly.
        </p>
        <div className="flex flex-wrap gap-3 mt-4 not-prose">
          <Link href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0057FF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1a6aff] no-underline">
            <Users size={14} /> Talk to Us
          </Link>
          <Link href="/post-listing"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#0D1B3E] hover:border-[#0057FF] hover:text-[#0057FF] no-underline">
            Post Equipment <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 mt-8 not-prose">
          <MapPin size={12} /> Dammam, Saudi Arabia &nbsp;·&nbsp; <Building2 size={12} /> Serving Saudi Arabia &amp; the GCC
        </div>
      </ContentShell>
    </>
  );
}
