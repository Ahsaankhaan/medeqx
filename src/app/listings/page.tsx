import { prisma } from '@/lib/db';
import { AllListingsClient } from '@/components/all-listings-client';
import { mapImageRefs } from '@/lib/listing-images';
import type { Metadata } from 'next';

// Cache for 5 minutes (ISR). The whole approved inventory is rendered once and
// filtered client-side, so browsing never runs a server function.
export const revalidate = 300;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: 'All Medical Equipment Listings — Buy & Sell in Saudi Arabia | MedeqX',
  description:
    'Browse every used, refurbished and new medical equipment listing on MedeqX — MRI, CT, ultrasound, X-ray, lab, surgical, spare parts and accessories from verified sellers across Saudi Arabia and the GCC.',
  alternates: { canonical: `${SITE}/listings` },
  openGraph: {
    title: 'All Medical Equipment Listings — MedeqX',
    description: 'Browse every medical equipment listing on MedeqX.',
    url: `${SITE}/listings`,
    type: 'website',
    siteName: 'MedeqX',
  },
};

export default async function AllListingsPage() {
  const listings = await prisma.listing.findMany({
    where: { status: { in: ['approved', 'sold'] } },
    orderBy: [{ status: 'asc' }, { approvedAt: 'desc' }],
    take: 500,
  });

  return <AllListingsClient listings={JSON.parse(JSON.stringify(mapImageRefs(listings)))} />;
}
