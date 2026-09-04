import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  return req.cookies.get('medeqx_admin')?.value === process.env.ADMIN_TOKEN;
}

const VALID = ['open', 'closed', 'cancelled'];

// Update an inquiry's status (open | closed | cancelled).
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, status } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    if (!VALID.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    await prisma.inquiry.update({ where: { id }, data: { status } });
    return NextResponse.json({ success: true, status });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update inquiry' },
      { status: 400 }
    );
  }
}

// Permanently delete an inquiry.
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await prisma.inquiry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete inquiry' },
      { status: 400 }
    );
  }
}
