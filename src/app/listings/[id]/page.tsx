import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ListingDetailClient } from '@/components/listing-detail-client';
import Script from 'next/script';
import type { Metadata } from 'next';
import { getCategoryBySlug } from '@/lib/categories';

export const dynamic = 'force-dynamic';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

async function fetchListing(id: string) {
  return prisma.listing.findFirst({
    where: { OR: [{ id }, { ref: id }], status: { in: ['approved', 'sold', 'pending'] } },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListing(id);
  if (!listing) return { title: 'Listing Not Found' };

  const cat = getCategoryBySlug(listing.category);
  const priceText = listing.price ? `SAR ${listing.price.toLocaleString()}` : 'Price by inquiry';
  const title = `${listing.name} — ${listing.manufacturer || cat?.nameEn || 'Medical Equipment'} | ${listing.ref}`;
  const desc = [
    listing.name,
    listing.manufacturer && `by ${listing.manufacturer}`,
    listing.model && `model ${listing.model}`,
    listing.year && `(${listing.year})`,
    listing.location && `in ${listing.location}`,
    '·', priceText,
    '·', listing.condition,
  ].filter(Boolean).join(' ') + '. Buy verified medical equipment on MedeqX — the GCC\'s B2B marketplace.';

  let images: string[] = [];
  try { const a = JSON.parse(listing.images || '[]'); if (Array.isArray(a)) images = a.slice(0, 4); } catch {}

  return {
    title,
    description: desc.slice(0, 160),
    keywords: [listing.name, listing.manufacturer, listing.model, cat?.nameEn, 'medical equipment', listing.location].filter(Boolean) as string[],
    alternates: { canonical: `${SITE}/listings/${listing.id}` },
    openGraph: {
      type: 'website',
      title,
      description: desc.slice(0, 200),
      url: `${SITE}/listings/${listing.id}`,
      siteName: 'MedeqX',
      images: images.length > 0
        ? images.map((src) => ({ url: src.startsWith('data:') ? `${SITE}/logo.svg` : src }))
        : [{ url: `${SITE}/logo.svg` }],
    },
    twitter: { card: 'summary_large_image', title, description: desc.slice(0, 200) },
    robots: { index: listing.status === 'approved', follow: true },
  };
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await fetchListing(id);
  if (!listing) notFound();

  const cat = getCategoryBySlug(listing.category);
  let images: string[] = [];
  try { const a = JSON.parse(listing.images || '[]'); if (Array.isArray(a)) images = a; } catch {}

  // Product schema for rich-result eligibility + AI answer engines
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.name,
    description: listing.description || `${listing.name} — ${cat?.nameEn ?? 'Medical Equipment'}`,
    sku: listing.ref,
    brand: listing.manufacturer ? { '@type': 'Brand', name: listing.manufacturer } : undefined,
    model: listing.model || undefined,
    productionDate: listing.year ? String(listing.year) : undefined,
    category: cat?.nameEn,
    image: images.length > 0 && !images[0].startsWith('data:') ? images.slice(0, 4) : `${SITE}/logo.svg`,
    itemCondition: {
      new: 'https://schema.org/NewCondition',
      refurbished: 'https://schema.org/RefurbishedCondition',
      used: 'https://schema.org/UsedCondition',
      parts: 'https://schema.org/DamagedCondition',
    }[listing.condition] ?? 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      url: `${SITE}/listings/${listing.id}`,
      priceCurrency: listing.currency || 'SAR',
      price: listing.price ?? '0',
      availability: listing.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      areaServed: { '@type': 'AdministrativeArea', name: listing.country || 'Saudi Arabia' },
      seller: { '@type': 'Organization', name: 'MedeqX', url: SITE },
      // Used equipment is sold as-is via direct buyer–seller inquiry; MedeqX
      // charges no shipping and accepts no returns. These accurately describe
      // the marketplace model and satisfy Google's merchant-listing fields.
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: listing.country === 'Saudi Arabia' || !listing.country ? 'SA' : undefined,
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: listing.currency || 'SAR' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'SA' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 2, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 14, unitCode: 'DAY' },
        },
      },
    },
  };

  return (
    <>
      <Script id="listing-schema" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <ListingDetailClient listing={JSON.parse(JSON.stringify(listing))} />
    </>
  );
}
