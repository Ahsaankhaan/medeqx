import { prisma } from '@/lib/db';
import { HomeClient } from '@/components/home-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'MedeqX — Buy & Sell Used Medical Equipment Saudi Arabia',
  description: 'MedeqX is Saudi Arabia\'s premier B2B medical equipment exchange marketplace. Buy, sell, and trade used, refurbished, and new medical devices across the GCC.',
};

export default async function Home() {
  // Run all three queries in parallel (not sequentially) so a remote Turso DB
  // doesn't stack three round-trips and blow the function timeout.
  const [listings, total, pending] = await Promise.all([
    prisma.listing.findMany({
      where: { status: { in: ['approved', 'sold'] } },
      orderBy: [{ status: 'asc' }, { approvedAt: 'desc' }],
      take: 8,
    }),
    prisma.listing.count({ where: { status: 'approved' } }),
    prisma.listing.count({ where: { status: 'pending' } }),
  ]);

  return <HomeClient listings={JSON.parse(JSON.stringify(listings))} stats={{ total, pending }} />;
}
