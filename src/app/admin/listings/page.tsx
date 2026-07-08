import { prisma } from '@/lib/db';
import { AdminListingsClient } from '@/components/admin/listings-client';

export const dynamic = 'force-dynamic';

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  // Load ALL listings — filtering happens client-side for instant tab switching
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <AdminListingsClient listings={JSON.parse(JSON.stringify(listings))} initialStatus={status ?? ''} initialQ={q ?? ''} />;
}
