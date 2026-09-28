import { prisma } from '@/lib/db';

export type MatchRow = {
  ref: string;
  name: string;
  location: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

/**
 * Find opposite-side listings that match a newly posted one, so the broker can
 * connect buyer & seller immediately instead of losing the lead (#5).
 *
 *   - a new `for_sale` listing  → matched against `wanted` requests (buyers)
 *   - a new `wanted` request     → matched against `for_sale` listings (sellers)
 *
 * within the same category. Admin-entered leads (`status: 'lead'`) and pending
 * posts are included so the whole known demand/supply pool is considered.
 * Results are ranked so manufacturer overlaps surface first.
 */
export async function findListingMatches(listing: {
  id: string;
  category: string;
  listingType: string;
  manufacturer?: string | null;
}): Promise<MatchRow[]> {
  const oppositeType = listing.listingType === 'wanted' ? 'for_sale' : 'wanted';

  const candidates = await prisma.listing.findMany({
    where: {
      id: { not: listing.id },
      category: listing.category,
      listingType: oppositeType,
      status: { in: ['approved', 'pending', 'lead'] },
    },
    orderBy: { createdAt: 'desc' },
    take: 25,
    select: {
      ref: true, name: true, location: true, manufacturer: true,
      sellerName: true, sellerEmail: true, sellerPhone: true,
    },
  });

  const mfr = (listing.manufacturer || '').toLowerCase().trim();
  const scored = candidates.map((c) => {
    let score = 1; // same category, opposite side
    if (mfr && (c.manufacturer || '').toLowerCase().includes(mfr)) score += 2;
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 10).map(({ c }) => ({
    ref: c.ref,
    name: c.name,
    location: c.location,
    contactName: c.sellerName,
    contactEmail: c.sellerEmail,
    contactPhone: c.sellerPhone,
  }));
}
