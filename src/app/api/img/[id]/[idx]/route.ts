import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Cached image endpoint. Serves the Nth image of a listing, decoded from the
// base64 stored in the DB, as a real image response with a 1-year immutable
// cache. This is the single biggest bandwidth/credit fix: pages no longer embed
// the (huge) base64 blobs directly in their HTML — they reference this route,
// which the Netlify CDN caches at the edge after the first fetch (no function
// on repeat hits). The image data itself never changes for a given (id, idx),
// hence `immutable`.

// A missing image / bad index shouldn't be cached forever, so we keep the route
// dynamic and let the response headers drive CDN caching for the 200 case only.
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; idx: string }> },
) {
  const { id, idx } = await params;
  const n = Number.parseInt(idx, 10);
  if (Number.isNaN(n) || n < 0) {
    return new NextResponse('Bad index', { status: 400 });
  }

  const listing = await prisma.listing.findFirst({
    where: { OR: [{ id }, { ref: id }] },
    select: { images: true },
  });
  if (!listing) return new NextResponse('Not found', { status: 404 });

  let images: string[] = [];
  try {
    const a = JSON.parse(listing.images || '[]');
    if (Array.isArray(a)) images = a;
  } catch {
    /* malformed images column — treat as none */
  }

  const src = images[n];
  if (!src) return new NextResponse('Not found', { status: 404 });

  // Already an externally hosted URL — redirect to it (still avoids embedding).
  if (!src.startsWith('data:')) {
    return NextResponse.redirect(src, 308);
  }

  // data:<mime>;base64,<payload>
  const match = /^data:([^;]+);base64,([\s\S]*)$/.exec(src);
  if (!match) return new NextResponse('Bad image', { status: 400 });
  const mime = match[1] || 'image/jpeg';
  const bytes = new Uint8Array(Buffer.from(match[2], 'base64'));

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': mime,
      // Fetched once, then served from the CDN edge for a year.
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Netlify-CDN-Cache-Control': 'public, durable, max-age=31536000, immutable',
      'Content-Length': String(bytes.length),
    },
  });
}
