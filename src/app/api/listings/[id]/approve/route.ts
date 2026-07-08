import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendListingApproved } from '@/lib/email';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  return req.cookies.get('medeqx_admin')?.value === process.env.ADMIN_TOKEN;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const listing = await prisma.listing.update({
      where: { id },
      data: { status: 'approved', approvedAt: new Date() },
    });
    sendListingApproved({
      ref: listing.ref, name: listing.name,
      sellerName: listing.sellerName, sellerEmail: listing.sellerEmail,
    }).catch(console.error);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Approve failed' }, { status: 500 });
  }
}
