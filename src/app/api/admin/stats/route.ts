import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  return req.cookies.get('medeqx_admin')?.value === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const [allListings, approved, pending, suspended] = await Promise.all([
      prisma.listing.findMany({ select: { status: true, category: true, price: true } }),
      prisma.listing.count({ where: { status: 'approved' } }),
      prisma.listing.count({ where: { status: 'pending' } }),
      prisma.listing.count({ where: { status: 'suspended' } }),
    ]);

    const totalValue = allListings
      .filter((l) => l.status === 'approved' && l.price)
      .reduce((sum, l) => sum + (l.price ?? 0), 0);

    const byCategory: Record<string, number> = {};
    for (const l of allListings.filter((l) => l.status === 'approved')) {
      byCategory[l.category] = (byCategory[l.category] ?? 0) + 1;
    }

    return NextResponse.json({ totalApproved: approved, totalPending: pending, totalSuspended: suspended, totalValue, byCategory });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
