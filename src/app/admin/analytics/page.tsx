import { prisma } from '@/lib/db';
import { AnalyticsClient } from '@/components/admin/analytics-client';
import { CATEGORIES } from '@/lib/categories';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const listings = await prisma.listing.findMany({
    select: {
      id: true, status: true, category: true, location: true, country: true,
      condition: true, listingType: true, price: true, manufacturer: true,
      createdAt: true, approvedAt: true,
    },
  });
  const inquiries = await prisma.inquiry.findMany({
    select: { id: true, listingId: true, createdAt: true },
  });

  // Aggregate by various dimensions
  const byCategory: Record<string, { count: number; sold: number; value: number }> = {};
  const byCity: Record<string, { count: number; sold: number; value: number }> = {};
  const byCondition: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byManufacturer: Record<string, number> = {};

  let totalValue = 0;
  let soldValue = 0;

  for (const l of listings) {
    // Category
    if (!byCategory[l.category]) byCategory[l.category] = { count: 0, sold: 0, value: 0 };
    byCategory[l.category].count++;
    if (l.status === 'sold') byCategory[l.category].sold++;
    if (l.price) byCategory[l.category].value += l.price;

    // City
    const city = l.location || 'Unknown';
    if (!byCity[city]) byCity[city] = { count: 0, sold: 0, value: 0 };
    byCity[city].count++;
    if (l.status === 'sold') byCity[city].sold++;
    if (l.price) byCity[city].value += l.price;

    byCondition[l.condition] = (byCondition[l.condition] ?? 0) + 1;
    byType[l.listingType] = (byType[l.listingType] ?? 0) + 1;
    byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
    if (l.manufacturer) byManufacturer[l.manufacturer] = (byManufacturer[l.manufacturer] ?? 0) + 1;

    if (l.price) totalValue += l.price;
    if (l.status === 'sold' && l.price) soldValue += l.price;
  }

  // Pre-resolve category names (so client doesn't need lookups)
  const categoryName = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.nameEn ?? slug;
  const categoryRows = Object.entries(byCategory)
    .map(([slug, stats]) => ({ slug, name: categoryName(slug), ...stats }))
    .sort((a, b) => b.count - a.count);

  const cityRows = Object.entries(byCity)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.count - a.count);

  const manufacturerRows = Object.entries(byManufacturer)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Price bands
  const priceBands = { '< 10K': 0, '10K–50K': 0, '50K–250K': 0, '250K–1M': 0, '> 1M': 0, 'No Price': 0 };
  for (const l of listings) {
    const p = l.price ?? 0;
    if (!l.price) priceBands['No Price']++;
    else if (p < 10000) priceBands['< 10K']++;
    else if (p < 50000) priceBands['10K–50K']++;
    else if (p < 250000) priceBands['50K–250K']++;
    else if (p < 1000000) priceBands['250K–1M']++;
    else priceBands['> 1M']++;
  }

  return (
    <AnalyticsClient
      totals={{
        listings: listings.length,
        approved: byStatus['approved'] ?? 0,
        pending: byStatus['pending'] ?? 0,
        suspended: byStatus['suspended'] ?? 0,
        sold: byStatus['sold'] ?? 0,
        inquiries: inquiries.length,
        totalValue,
        soldValue,
      }}
      categoryRows={categoryRows}
      cityRows={cityRows}
      manufacturerRows={manufacturerRows}
      byCondition={byCondition}
      byType={byType}
      priceBands={priceBands}
    />
  );
}
