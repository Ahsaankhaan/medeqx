import { prisma } from '@/lib/db';
import { AdminInquiriesClient } from '@/components/admin/inquiries-client';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      listing: {
        select: {
          id: true, ref: true, name: true, category: true,
          manufacturer: true, model: true, price: true, location: true,
          status: true, sellerName: true, sellerEmail: true, sellerPhone: true,
          services: true,
        },
      },
    },
  });

  return <AdminInquiriesClient inquiries={JSON.parse(JSON.stringify(inquiries))} />;
}
