import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  return req.cookies.get('medeqx_admin')?.value === process.env.ADMIN_TOKEN;
}

/**
 * Returns counts used by the admin nav red badges:
 *  - pendingListings  → number of listings awaiting approval
 *  - latestInquiryAt  → epoch ms of the most-recent inquiry; client compares
 *                       against localStorage `lastInquiryView` to compute the
 *                       "unread" count, then clears it when admin opens
 *                       /admin/inquiries.
 *  - totalInquiries   → fallback total (always >= unread)
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [pendingListings, totalInquiries, latestInquiry] = await Promise.all([
      prisma.listing.count({ where: { status: 'pending' } }),
      prisma.inquiry.count(),
      prisma.inquiry.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
    ]);

    return NextResponse.json({
      pendingListings,
      totalInquiries,
      latestInquiryAt: latestInquiry?.createdAt ? new Date(latestInquiry.createdAt).getTime() : 0,
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'failed' }, { status: 500 });
  }
}
