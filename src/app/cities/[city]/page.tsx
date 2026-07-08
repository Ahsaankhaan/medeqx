import { prisma } from '@/lib/db';
import { getCityBySlug, CITIES } from '@/lib/cities';
import { CATEGORIES } from '@/lib/categories';
import { CityClient } from '@/components/city-client';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { Metadata } from 'next';

// Cache for 10 minutes (rendered on-demand from the live DB, then reused).
export const revalidate = 600;

// Empty = nothing prerendered at build; pages generate on-demand and cache.
export function generateStaticParams() {
  return [] as { city: string }[];
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const c = getCityBySlug(city);
  if (!c) return { title: 'City Not Found' };

  const hasListings = (await prisma.listing.count({
    where: { status: { in: ['approved', 'sold'] }, location: { contains: c.searchTerm } },
  })) > 0;

  const title = `Buy & Sell Used Medical Equipment in ${c.nameEn} — MedeqX`;
  const description = `Browse used and refurbished medical equipment for sale in ${c.nameEn}, ${c.country}. MRI, CT, ultrasound, X-ray, hospital beds, dental chairs, ventilators and more from verified hospital and clinic sellers in ${c.nameEn}. Post your equipment free; 4% commission only on sale.`;

  return {
    title,
    description,
    keywords: [
      `used medical equipment ${c.nameEn}`,
      `buy used medical equipment ${c.nameEn}`,
      `sell used medical equipment ${c.nameEn}`,
      `refurbished medical equipment ${c.nameEn}`,
      `second hand medical equipment ${c.nameEn}`,
      `hospital equipment ${c.nameEn}`,
      `used MRI ${c.nameEn}`,
      `used ultrasound machine ${c.nameEn}`,
      `used X-ray ${c.nameEn}`,
      `used hospital beds ${c.nameEn}`,
      `used dental chair ${c.nameEn}`,
      `معدات طبية مستعملة ${c.nameAr}`,
      `شراء معدات طبية مستعملة ${c.nameAr}`,
      `بيع معدات طبية مستعملة ${c.nameAr}`,
      `أجهزة طبية مستعملة ${c.nameAr}`,
    ],
    alternates: { canonical: `${SITE}/cities/${c.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE}/cities/${c.slug}`,
      type: 'website',
      siteName: 'MedeqX',
    },
    robots: { index: hasListings, follow: true },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = getCityBySlug(city);
  if (!c) notFound();

  // Equipment in this city
  const listings = await prisma.listing.findMany({
    where: {
      status: { in: ['approved', 'sold'] },
      location: { contains: c.searchTerm },
    },
    orderBy: [{ status: 'asc' }, { approvedAt: 'desc' }],
    take: 60,
  });

  // Category breakdown for this city
  const counts: Record<string, number> = {};
  for (const l of listings) counts[l.category] = (counts[l.category] ?? 0) + 1;

  // LocalBusiness + BreadcrumbList schema for AI/SEO
  const localSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Used Medical Equipment Marketplace in ${c.nameEn}`,
    serviceType: 'Medical Equipment Marketplace',
    provider: { '@type': 'Organization', name: 'MedeqX', url: SITE },
    areaServed: { '@type': 'City', name: c.nameEn, containedInPlace: { '@type': 'Country', name: c.country } },
    description: `MedeqX is the leading online marketplace for buying and selling used, refurbished, and new medical equipment in ${c.nameEn}, ${c.country}.`,
    url: `${SITE}/cities/${c.slug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: c.country, item: `${SITE}/cities/${c.slug}` },
      { '@type': 'ListItem', position: 3, name: c.nameEn, item: `${SITE}/cities/${c.slug}` },
    ],
  };

  return (
    <>
      <Script id="city-schema" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <Script id="city-breadcrumb" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <CityClient
        city={c}
        listings={JSON.parse(JSON.stringify(listings))}
        categoryCounts={counts}
        allCategories={CATEGORIES.map((cat) => ({ slug: cat.slug, nameEn: cat.nameEn, nameAr: cat.nameAr, color: cat.color, colorLight: cat.colorLight }))}
        allCities={CITIES.filter((x) => x.slug !== c.slug).slice(0, 8)}
      />
    </>
  );
}
