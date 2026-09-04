import { NextRequest, NextResponse } from 'next/server';
import { prisma, generateDealRef } from '@/lib/db';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  return req.cookies.get('medeqx_admin')?.value === process.env.ADMIN_TOKEN;
}

const num = (v: unknown) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = parseFloat(String(v));
  return isNaN(n) ? null : n;
};

function payload(b: Record<string, unknown>) {
  return {
    equipment: String(b.equipment || '').trim(),
    category: String(b.category || '').trim(),
    sellerName: String(b.sellerName || '').trim(),
    sellerContact: String(b.sellerContact || '').trim(),
    sellerListingRef: String(b.sellerListingRef || '').trim(),
    buyerName: String(b.buyerName || '').trim(),
    buyerContact: String(b.buyerContact || '').trim(),
    salePrice: num(b.salePrice),
    commission: num(b.commission),
    status: b.status === 'completed' ? 'completed' : 'brokered',
    notes: String(b.notes || '').trim(),
  };
}

// Record a new brokered deal.
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const b = await req.json();
    const data = payload(b);
    if (!data.equipment) return NextResponse.json({ error: 'Equipment is required' }, { status: 400 });
    const ref = await generateDealRef();
    const deal = await prisma.deal.create({ data: { ref, ...data }, select: { id: true, ref: true } });
    return NextResponse.json({ success: true, ...deal }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to save deal' }, { status: 400 });
  }
}

// Update a deal (details or status).
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const b = await req.json();
    if (!b.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    // Status-only quick toggle
    if (b.statusOnly) {
      const status = b.status === 'completed' ? 'completed' : 'brokered';
      await prisma.deal.update({ where: { id: b.id }, data: { status } });
      return NextResponse.json({ success: true, status });
    }
    const data = payload(b);
    if (!data.equipment) return NextResponse.json({ error: 'Equipment is required' }, { status: 400 });
    await prisma.deal.update({ where: { id: b.id }, data });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to update deal' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await prisma.deal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to delete deal' }, { status: 400 });
  }
}
