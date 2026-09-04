import { prisma } from '@/lib/db';
import { DealsClient } from '@/components/admin/deals-client';

export const dynamic = 'force-dynamic';

export default async function AdminDealsPage() {
  const deals = await prisma.deal.findMany({ orderBy: { closedAt: 'desc' } });
  return <DealsClient deals={JSON.parse(JSON.stringify(deals))} />;
}
