import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  return req.cookies.get('medeqx_admin')?.value === process.env.ADMIN_TOKEN;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.listing.update({ where: { id }, data: { status: 'suspended' } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Suspend failed' }, { status: 500 });
  }
}
