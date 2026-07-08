import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { ChevronRight, MapPin, Building2, PlusCircle, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/db';
import { ListingCard } from '@/components/ui/listing-card';
import { parseSlug, buildWhereForSeoPage, seoCopyFor, seoKeywordsFor } from '@/lib/seo-pages';

// Cache each rendered page for 10 minutes (rendered on-demand from the live DB,
// then reused) instead of re-rendering on every crawler/visitor hit. Drastically
// cuts server load. A page auto-updates within ~10 min of inventory changing.
export const revalidate = 600;

// Empty list = nothing prerendered at build (avoids baking local-DB data);
// pages are generated on-demand from the live DB and then cached per revalidate.
export function generateStaticParams() {
  return [] as { slug: string }[];
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = parseSlug(slug);
  if (!p) return { title: 'Page Not Found' };

  const copy = seoCopyFor(p, 'en');

  // Only let Google index this programmatic page once it has matching inventory.
  // Empty pages stay crawlable (follow) and auto-activate when a listing matches.
  const hasListings = (await prisma.listing.count({ where: buildWhereForSeoPage(p) })) > 0;

  return {
    title: copy.title,
    description: copy.description,
    keywords: seoKeywordsFor(p),
    alternates: { canonical: `${SITE}/${slug}` },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${SITE}/${slug}`,
      type: 'website',
      siteName: 'MedeqX',
    },
    twitter: { card: 'summary_large_image', title: copy.title, description: copy.description },
    robots: { index: hasListings, follow: true },
  };
}

export default async function SeoLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = parseSlug(slug);
  if (!p) notFound();

  const where = buildWhereForSeoPage(p);
  const listings = await prisma.listing.findMany({
    where,
    orderBy: [{ status: 'asc' }, { approvedAt: 'desc' }],
    take: 60,
    include: { _count: { select: { inquiries: true } } },
  });

  const copy = seoCopyFor(p, 'en');
  const copyAr = seoCopyFor(p, 'ar');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: SITE },
      { '@type': 'ListItem', position: 2, name: copy.h1, item: `${SITE}/${slug}` },
    ],
  };

  // ItemList schema — eligible for rich results
  const itemListSchema = listings.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: listings.slice(0, 20).map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/listings/${l.id}`,
      name: l.name,
    })),
  } : null;

  const heroIcon = p.brand ? Building2 : MapPin;
  const HeroIcon = heroIcon;

  return (
    <>
      <Script id="seo-breadcrumb" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && (
        <Script id="seo-itemlist" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}

      <main className="bg-[#F8FAFF] min-h-screen pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-100 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-[#0057FF]">Home</Link>
            <ChevronRight size={13} />
            <span className="text-[#0D1B3E] font-medium truncate">{copy.h1}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-white border-b border-slate-100 px-6 py-14">
          <div className="max-w-6xl mx-auto flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-4 max-w-3xl">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <HeroIcon size={26} className="text-[#0057FF]" />
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-1">
                  {p.kind === 'brand-country' || p.kind === 'brand-equipment' ? 'Brand' : p.kind === 'city' || p.kind === 'equipment-city' ? 'Location' : 'Equipment'}
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D1B3E] leading-tight mb-2">{copy.h1}</h1>
                <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{copy.description}</p>
              </div>
            </div>
            <Link href="/post-listing"
              className="flex items-center gap-2 rounded-xl bg-[#0057FF] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1a6aff] transition-colors">
              <PlusCircle size={14} /> Post Equipment
            </Link>
          </div>
        </section>

        {/* Listings */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-xl font-extrabold text-[#0D1B3E] mb-5">
            Available Equipment
            <span className="ml-2 text-sm font-normal text-slate-400">({listings.length})</span>
          </h2>

          {listings.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-500 font-medium mb-1">No matching listings yet</p>
              <p className="text-slate-400 text-sm mb-4">Be the first to post or browse adjacent categories.</p>
              <div className="flex gap-2 justify-center">
                <Link href="/post-listing" className="rounded-xl bg-[#0057FF] px-5 py-2.5 text-sm font-semibold text-white">
                  Post Listing
                </Link>
                <Link href="/categories" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700">
                  Browse Categories
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((l) => <ListingCard key={l.id} listing={JSON.parse(JSON.stringify(l))} />)}
            </div>
          )}
        </section>

        {/* SEO body */}
        <section className="bg-white border-y border-slate-100 px-6 py-14">
          <div className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            <h2 className="text-xl font-bold text-[#0D1B3E] mb-3">{copy.h1}</h2>
            <p className="mb-4">{copy.description}</p>

            {/* Arabic equivalent block — feeds rankings for Arabic queries */}
            <div dir="rtl" lang="ar" className="rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 my-5">
              <p className="font-semibold text-[#0D1B3E] mb-1">{copyAr.h1}</p>
              <p className="text-slate-600 text-sm">{copyAr.description}</p>
            </div>

            <h3 className="text-base font-bold text-[#0D1B3E] mt-5 mb-2">How MedeqX works</h3>
            <p>
              MedeqX is Saudi Arabia&#39;s trusted B2B marketplace for used and refurbished medical equipment. Listings are reviewed by our team, contact details stay private, and our 4% commission is charged only on confirmed sale (minimum SAR 500).
            </p>
          </div>
        </section>

        {/* Cross-links to other useful pages */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h3 className="text-lg font-bold text-[#0D1B3E] mb-4">Explore related pages</h3>
          <div className="flex flex-wrap gap-2">
            {p.city && (
              <Link href={`/cities/${p.city.slug}`} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF]">
                All equipment in {p.city.nameEn} <ArrowRight size={11} className="inline" />
              </Link>
            )}
            {p.brand && (
              <Link href={`/manufacturers/${p.brand.slug}`} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF]">
                All {p.brand.name} equipment <ArrowRight size={11} className="inline" />
              </Link>
            )}
            <Link href="/categories" className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF]">
              Browse categories
            </Link>
            <Link href="/manufacturers" className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF]">
              Browse manufacturers
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
