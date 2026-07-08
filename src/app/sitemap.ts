import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { CATEGORY_SLUGS } from '@/lib/categories';
import { CITIES } from '@/lib/cities';
import { MANUFACTURERS } from '@/lib/manufacturers';
import {
  generateAllSeoSlugs,
  parseSlug,
  listingMatchesSeoPage,
  type SeoPage,
  type SeoMatchListing,
} from '@/lib/seo-pages';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE,                            lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE}/categories`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE}/post-listing`,          lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/search`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE}/contact`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${SITE}/faq`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/about`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/verification`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/privacy`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE}/terms`,                 lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE}/guides`,                lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/guides/buying`,         lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE}/guides/selling`,        lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE}/guides/pricing`,        lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  // Load all publicly-visible listings once. Everything below is GATED so that
  // only pages backed by real inventory appear in the sitemap. Empty programmatic
  // pages are excluded here (and noindexed in their own metadata) and auto-appear
  // the moment a matching listing is added.
  type Row = SeoMatchListing & { id: string; updatedAt: Date | null; approvedAt: Date | null };
  let listings: Row[] = [];
  try {
    listings = await prisma.listing.findMany({
      where: { status: { in: ['approved', 'sold'] } },
      select: {
        id: true, updatedAt: true, approvedAt: true,
        category: true, location: true, manufacturer: true, name: true, description: true,
      },
      take: 5000,
    });
  } catch { /* DB unavailable — fall back to static pages only */ }

  // Category pages — only those that currently have listings
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS
    .filter((slug) => listings.some((l) => l.category === slug))
    .map((slug) => ({
      url: `${SITE}/categories/${slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    }));

  // City pages — only those that currently have listings
  const cityPages: MetadataRoute.Sitemap = CITIES
    .filter((c) => listings.some((l) => (l.location ?? '').toLowerCase().includes(c.searchTerm.toLowerCase())))
    .map((c) => ({
      url: `${SITE}/cities/${c.slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    }));

  // Manufacturer pages — hub always; individual brands only when they have listings
  const manufacturerPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/manufacturers`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...MANUFACTURERS
      .filter((m) => listings.some((l) => {
        const mfr = (l.manufacturer ?? '').toLowerCase();
        return m.aliases.some((a) => mfr.includes(a.toLowerCase()));
      }))
      .map((m) => ({
        url: `${SITE}/manufacturers/${m.slug}`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
  ];

  // Programmatic SEO landing pages — only those with matching inventory
  const seoPages: MetadataRoute.Sitemap = generateAllSeoSlugs()
    .map((slug) => parseSlug(slug))
    .filter((p): p is SeoPage => p !== null)
    .filter((p) => listings.some((l) => listingMatchesSeoPage(l, p)))
    .map((p) => ({
      url: `${SITE}/${p.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

  // Listing detail pages (approved + sold)
  const listingPages: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${SITE}/listings/${l.id}`,
    lastModified: l.updatedAt ?? l.approvedAt ?? now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...cityPages, ...manufacturerPages, ...seoPages, ...listingPages];
}
