import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  const cookie = req.cookies.get('medeqx_admin');
  return cookie?.value === process.env.ADMIN_TOKEN;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const listing = await prisma.listing.findUnique({ where: { id }, include: { inquiries: true } });
    if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (listing.status !== 'approved' && listing.status !== 'sold') return NextResponse.json({ error: 'Not available' }, { status: 403 });
    return NextResponse.json({ listing });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const data: Record<string, unknown> = {
      name: body.name,
      category: body.category,
      manufacturer: body.manufacturer,
      model: body.model,
      serial: body.serial ?? '',
      year: body.year ? parseInt(body.year) : null,
      condition: body.condition,
      warranty: body.warranty ?? 'none',
      listingType: body.listingType ?? 'for_sale',
      price: body.price ? parseFloat(body.price) : null,
      payment: body.payment ?? '',
      location: body.location,
      description: body.description,
      specs: body.specs,
      status: body.status,
    };
    if (typeof body.images === 'string') data.images = body.images;
    if (body.status === 'approved' || body.status === 'sold') {
      // Set approvedAt if not previously set
      const existing = await prisma.listing.findUnique({ where: { id }, select: { approvedAt: true } });
      if (!existing?.approvedAt) data.approvedAt = new Date();
    }
    const listing = await prisma.listing.update({ where: { id }, data });
    return NextResponse.json({ listing });
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
