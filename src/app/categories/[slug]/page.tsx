import { prisma } from '@/lib/db';
import { getCategoryBySlug } from '@/lib/categories';
import { CategoryClient } from '@/components/category-client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Cache for 10 minutes (rendered on-demand from the live DB, then reused).
export const revalidate = 600;

// Empty = nothing prerendered at build; pages generate on-demand and cache.
export function generateStaticParams() {
  return [] as { slug: string }[];
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategoryBySlug(slug);
  if (!c) return { title: 'Category Not Found' };
  const hasListings = (await prisma.listing.count({
    where: { status: { in: ['approved', 'sold'] }, category: slug },
  })) > 0;
  const title = `Used & Refurbished ${c.nameEn} for Sale in Saudi Arabia — Riyadh, Jeddah, Dammam`;
  const description = `${c.descEn} Buy and sell used and refurbished ${c.nameEn.toLowerCase()} on MedeqX. Verified listings across Riyadh, Jeddah, Dammam, Mecca, Medina, Khobar and the GCC. Free to post; 4% commission only on successful sale.`;
  return {
    title, description,
    keywords: [
      c.nameEn, c.nameAr,
      `used ${c.nameEn}`, `refurbished ${c.nameEn}`, `${c.nameEn} for sale`,
      `buy used ${c.nameEn} Riyadh`, `${c.nameEn} Jeddah`, `${c.nameEn} Dammam`,
      `${c.nameEn} Saudi Arabia`, `${c.nameEn} GCC`, `second hand ${c.nameEn} KSA`,
      `${c.nameAr} مستعمل`, `${c.nameAr} للبيع`, `شراء ${c.nameAr} مستعمل`,
      `${c.nameAr} الرياض`, `${c.nameAr} جدة`, 'medical equipment marketplace',
    ],
    alternates: { canonical: `${SITE}/categories/${slug}` },
    openGraph: { title, description, url: `${SITE}/categories/${slug}`, type: 'website' },
    robots: { index: hasListings, follow: true },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const listings = await prisma.listing.findMany({
    where: { status: { in: ['approved', 'sold'] }, category: slug },
    orderBy: [{ status: 'asc' }, { approvedAt: 'desc' }],
    include: { _count: { select: { inquiries: true } } },
  });

  return <CategoryClient category={category} listings={JSON.parse(JSON.stringify(listings))} />;
}
