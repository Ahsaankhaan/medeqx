import { prisma } from '@/lib/db';
import { HomeClient } from '@/components/home-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'MedeqX — Buy & Sell Used Medical Equipment Saudi Arabia',
  description: 'MedeqX is Saudi Arabia\'s premier B2B medical equipment exchange marketplace. Buy, sell, and trade used, refurbished, and new medical devices across the GCC.',
};

export default async function Home() {
  const listings = await prisma.listing.findMany({
    where: { status: { in: ['approved', 'sold'] } },
    orderBy: [{ status: 'asc' }, { approvedAt: 'desc' }],
    take: 8,
    include: { _count: { select: { inquiries: true } } },
  });

  const stats = {
    total: await prisma.listing.count({ where: { status: 'approved' } }),
    pending: await prisma.listing.count({ where: { status: 'pending' } }),
  };

  return <HomeClient listings={JSON.parse(JSON.stringify(listings))} stats={stats} />;
}
