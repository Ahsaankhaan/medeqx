import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ChevronRight, Building2, ArrowRight, PlusCircle } from 'lucide-react';
import { prisma } from '@/lib/db';
import { ListingCard } from '@/components/ui/listing-card';
import { getManufacturerBySlug, manufacturerAliasFilter, MANUFACTURERS } from '@/lib/manufacturers';

// Cache for 10 minutes (rendered on-demand from the live DB, then reused).
export const revalidate = 600;

// Empty = nothing prerendered at build; pages generate on-demand and cache.
export function generateStaticParams() {
  return [] as { slug: string }[];
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getManufacturerBySlug(slug);
  if (!m) return { title: 'Manufacturer Not Found' };

  const hasListings = (await prisma.listing.count({
    where: { AND: [{ status: { in: ['approved', 'sold'] } }, manufacturerAliasFilter(m)] },
  })) > 0;

  const title = `Used & Refurbished ${m.name} Medical Equipment for Sale — Saudi Arabia & GCC`;
  const description = `Buy verified used and refurbished ${m.name} medical equipment in Saudi Arabia, UAE, Kuwait, Qatar, Bahrain and Oman. Featuring ${m.modalities.slice(0, 4).join(', ')} from hospital sellers across Riyadh, Jeddah and Dammam.`;

  return {
    title,
    description,
    keywords: [
      `used ${m.name}`, `refurbished ${m.name}`, `${m.name} for sale`,
      `${m.name} Saudi Arabia`, `${m.name} Riyadh`, `${m.name} Jeddah`, `${m.name} Dammam`,
      `${m.name} GCC`, `buy used ${m.name}`, `${m.name} medical equipment`,
      `${m.nameAr} مستعمل`, `أجهزة ${m.nameAr} مستعملة`,
      ...m.modalities.map((mod) => `used ${m.name} ${mod}`),
      ...m.aliases.map((a) => `${a} medical equipment`),
    ],
    alternates: { canonical: `${SITE}/manufacturers/${m.slug}` },
    openGraph: { title, description, url: `${SITE}/manufacturers/${m.slug}`, type: 'website', siteName: 'MedeqX' },
    robots: { index: hasListings, follow: true },
  };
}

export default async function ManufacturerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getManufacturerBySlug(slug);
  if (!m) notFound();

  // Match any listing whose manufacturer field contains any of the aliases
  const listings = await prisma.listing.findMany({
    where: {
      AND: [
        { status: { in: ['approved', 'sold'] } },
        manufacturerAliasFilter(m),
      ],
    },
    orderBy: [{ status: 'asc' }, { approvedAt: 'desc' }],
    take: 60,
    include: { _count: { select: { inquiries: true } } },
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',           item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Manufacturers',  item: `${SITE}/manufacturers` },
      { '@type': 'ListItem', position: 3, name: m.name,           item: `${SITE}/manufacturers/${m.slug}` },
    ],
  };

  const brandSchema = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: m.name,
    alternateName: [m.nameAr, ...m.aliases.filter((a) => a !== m.name)],
    description: m.description,
    url: `${SITE}/manufacturers/${m.slug}`,
  };

  return (
    <>
      <Script id="mfr-breadcrumb" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="mfr-brand" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }} />

      <main className="bg-[#F8FAFF] min-h-screen pt-20">
        <div className="bg-white border-b border-slate-100 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-[#0057FF]">Home</Link>
            <ChevronRight size={13} />
            <Link href="/manufacturers" className="hover:text-[#0057FF]">Manufacturers</Link>
            <ChevronRight size={13} />
            <span className="text-[#0D1B3E] font-medium">{m.name}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-white border-b border-slate-100 px-6 py-12">
          <div className="max-w-6xl mx-auto flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-4 max-w-2xl">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Building2 size={26} className="text-[#0057FF]" />
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-1">Manufacturer</p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D1B3E] leading-tight mb-2">
                  Used &amp; Refurbished {m.name} Equipment
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">{m.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {m.modalities.map((mod) => (
                    <span key={mod} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">{mod}</span>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/post-listing"
              className="flex items-center gap-2 rounded-xl bg-[#0057FF] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1a6aff] transition-colors">
              <PlusCircle size={14} /> Post Your {m.name} Equipment
            </Link>
          </div>
        </section>

        {/* Listings */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-xl font-extrabold text-[#0D1B3E] mb-5">
            Available {m.name} Equipment
            <span className="ml-2 text-sm font-normal text-slate-400">({listings.length})</span>
          </h2>

          {listings.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <Building2 size={28} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium mb-1">No {m.name} equipment listed yet</p>
              <p className="text-slate-400 text-sm mb-4">Be the first to list used or refurbished {m.name} equipment on MedeqX.</p>
              <Link href="/post-listing" className="inline-flex items-center gap-2 rounded-xl bg-[#0057FF] px-5 py-2.5 text-sm font-semibold text-white">
                <PlusCircle size={14} /> Post Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((l) => <ListingCard key={l.id} listing={JSON.parse(JSON.stringify(l))} />)}
            </div>
          )}
        </section>

        {/* SEO body */}
        <section className="bg-white border-y border-slate-100 px-6 py-14">
          <div className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            <h2 className="text-xl font-bold text-[#0D1B3E] mb-3">About {m.name} on MedeqX</h2>
            <p className="mb-4">
              {m.description} Hospitals and clinics across Saudi Arabia, the UAE, Kuwait, Qatar, Bahrain and Oman regularly buy and sell pre-owned and refurbished {m.name} equipment through MedeqX. Every listing is reviewed by our team and seller contact details remain private until a verified buyer submits an inquiry.
            </p>
            <h3 className="text-base font-bold text-[#0D1B3E] mt-5 mb-2">Typical {m.name} categories on MedeqX</h3>
            <ul className="list-disc pl-6 marker:text-[#0057FF]">
              {m.modalities.map((mod) => (
                <li key={mod}>Used &amp; refurbished {mod} from {m.name}</li>
              ))}
            </ul>
            <h3 className="text-base font-bold text-[#0D1B3E] mt-5 mb-2">Sell your {m.name} equipment</h3>
            <p>
              If you have surplus {m.name} equipment to sell — from a single dental chair to a full hospital decommission — list it free on MedeqX. We charge a transparent 4% commission (minimum SAR 500) only when the sale is confirmed.
            </p>
          </div>
        </section>

        {/* Related brands */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-lg font-bold text-[#0D1B3E] mb-4">Other manufacturers</h2>
          <div className="flex flex-wrap gap-2">
            {MANUFACTURERS.filter((x) => x.slug !== m.slug).map((other) => (
              <Link key={other.slug} href={`/manufacturers/${other.slug}`}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF] hover:bg-blue-50 transition-colors">
                <Building2 size={12} /> {other.name}
                <ArrowRight size={12} className="opacity-50" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
