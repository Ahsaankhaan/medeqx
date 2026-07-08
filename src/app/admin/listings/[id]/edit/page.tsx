import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AdminEditClient } from '@/components/admin/edit-client';

export const dynamic = 'force-dynamic';

export default async function AdminEditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) notFound();
  return <AdminEditClient listing={JSON.parse(JSON.stringify(listing))} />;
}
