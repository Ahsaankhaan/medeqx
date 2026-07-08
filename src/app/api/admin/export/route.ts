import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toCSV, toJSON } from '@/lib/export';
import type { Listing } from '@/types';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  return req.cookies.get('medeqx_admin')?.value === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const format = new URL(req.url).searchParams.get('format') ?? 'json';
  const listings = (await prisma.listing.findMany({ orderBy: { createdAt: 'desc' } })) as unknown as Listing[];

  if (format === 'csv') {
    return new NextResponse(toCSV(listings), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="medeqx-listings.csv"',
      },
    });
  }

  return new NextResponse(toJSON(listings), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="medeqx-listings.json"',
    },
  });
}
