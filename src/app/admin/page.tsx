import { prisma } from '@/lib/db';
import { AdminDashboardClient } from '@/components/admin/dashboard-client';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [totalApproved, totalPending, totalSuspended, listings] = await Promise.all([
    prisma.listing.count({ where: { status: 'approved' } }),
    prisma.listing.count({ where: { status: 'pending' } }),
    prisma.listing.count({ where: { status: 'suspended' } }),
    prisma.listing.findMany({ where: { status: 'approved' }, select: { price: true, category: true } }),
  ]);

  const totalValue = listings.reduce((sum, l) => sum + (l.price ?? 0), 0);

  const byCategory = listings.reduce<Record<string, number>>((acc, l) => {
    acc[l.category] = (acc[l.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AdminDashboardClient
      stats={{ totalApproved, totalPending, totalSuspended, totalValue, byCategory }}
    />
  );
}
