import { prisma } from '@/lib/db';
import { MatchmakingClient } from '@/components/admin/matchmaking-client';

export const dynamic = 'force-dynamic';

// Fields we need for matching — deliberately EXCLUDING images/specs (heavy base64)
// so this page stays fast even over a remote DB.
const listingSelect = {
  id: true, ref: true, name: true, category: true, manufacturer: true, model: true,
  price: true, currency: true, location: true, description: true, status: true,
  listingType: true, sellerName: true, sellerEmail: true, sellerPhone: true,
  sellerCompany: true, createdAt: true,
} as const;

export default async function AdminMatchmakingPage() {
  // Only AVAILABLE inventory belongs in the matching pool — hide sold & suspended
  // (they're gone / taken down). Keeps approved (live), pending, and manual leads.
  const availableStatus = { notIn: ['sold', 'suspended'] };
  const [forSale, wanted, inquiries] = await Promise.all([
    prisma.listing.findMany({
      where: { listingType: 'for_sale', status: availableStatus },
      select: listingSelect,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.listing.findMany({
      where: { listingType: 'wanted', status: availableStatus },
      select: listingSelect,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, ref: true, buyerName: true, buyerEmail: true, buyerPhone: true,
        buyerCompany: true, message: true, createdAt: true,
        listing: { select: { ref: true, name: true, category: true } },
      },
    }),
  ]);

  return (
    <MatchmakingClient
      forSale={JSON.parse(JSON.stringify(forSale))}
      wanted={JSON.parse(JSON.stringify(wanted))}
      inquiries={JSON.parse(JSON.stringify(inquiries))}
    />
  );
}
