import { prisma } from '@/lib/db';
import { SearchClient } from '@/components/search-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Search — MedeqX',
  description: 'Search medical equipment listings on MedeqX marketplace.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string; category?: string; condition?: string; manufacturer?: string;
    city?: string; minPrice?: string; maxPrice?: string; minYear?: string;
    type?: string;
  }>;
}) {
  const sp = await searchParams;
  const q = sp.q;
  const category = sp.category;
  const condition = sp.condition;
  const manufacturer = sp.manufacturer;
  const city = sp.city;
  const type = sp.type;
  const minPrice = sp.minPrice ? parseFloat(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? parseFloat(sp.maxPrice) : undefined;
  const minYear = sp.minYear ? parseInt(sp.minYear) : undefined;

  const where: Record<string, unknown> = { status: { in: ['approved', 'sold'] } };
  if (category) where.category = category;
  if (condition && condition !== 'all') where.condition = condition;
  if (manufacturer) where.manufacturer = { contains: manufacturer };
  if (city) where.location = { contains: city };
  if (type && type !== 'all') where.listingType = type;
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: Record<string, number> = {};
    if (minPrice !== undefined) priceFilter.gte = minPrice;
    if (maxPrice !== undefined) priceFilter.lte = maxPrice;
    where.price = priceFilter;
  }
  if (minYear !== undefined) where.year = { gte: minYear };
  if (q?.trim()) {
    where.OR = [
      { name: { contains: q } },
      { manufacturer: { contains: q } },
      { model: { contains: q } },
      { description: { contains: q } },
      { ref: { contains: q } },
    ];
  }

  const listings = await prisma.listing.findMany({
    where,
    orderBy: [{ status: 'asc' }, { approvedAt: 'desc' }],
    take: 100,
    include: { _count: { select: { inquiries: true } } },
  });

  return (
    <SearchClient
      listings={JSON.parse(JSON.stringify(listings))}
      query={q ?? ''}
      category={category ?? ''}
      condition={condition ?? ''}
      manufacturer={manufacturer ?? ''}
      city={city ?? ''}
      type={type ?? ''}
      minPrice={sp.minPrice ?? ''}
      maxPrice={sp.maxPrice ?? ''}
      minYear={sp.minYear ?? ''}
    />
  );
}
