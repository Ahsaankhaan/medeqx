import { NextRequest, NextResponse } from 'next/server';
import { prisma, generateListingRef } from '@/lib/db';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  return req.cookies.get('medeqx_admin')?.value === process.env.ADMIN_TOKEN;
}

// Quick-add a lead captured off the website (phone / WhatsApp / walk-in) into the
// matching pool. Stored as a Listing with status 'lead' so it never appears on the
// public site or in the normal Listings admin — it lives only in Matchmaking.
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const b = await req.json();
    const side = b.side === 'wanted' ? 'wanted' : 'for_sale'; // 'for_sale' = seller, 'wanted' = buyer
    const name = (b.name || '').trim();
    const contact = (b.contactName || '').trim();
    if (!name) return NextResponse.json({ error: 'Equipment name is required' }, { status: 400 });
    if (!contact) return NextResponse.json({ error: 'Contact name is required' }, { status: 400 });

    const ref = await generateListingRef();
    const listing = await prisma.listing.create({
      data: {
        ref,
        name,
        category: (b.category || '').trim() || 'other',
        manufacturer: (b.manufacturer || '').trim(),
        model: (b.model || '').trim(),
        condition: 'used',
        listingType: side,
        price: b.price ? parseFloat(b.price) : null,
        location: (b.location || '').trim(),
        description: (b.note || '').trim(),
        status: 'lead',
        sellerName: contact,
        sellerEmail: (b.contactEmail || '').trim(),
        sellerPhone: (b.contactPhone || '').trim(),
        sellerCompany: (b.contactCompany || '').trim(),
      },
      select: { id: true, ref: true },
    });

    return NextResponse.json({ success: true, ...listing }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to add lead' },
      { status: 400 }
    );
  }
}

// Delete a lead (only status 'lead' rows can be removed here — protects real listings).
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const row = await prisma.listing.findUnique({ where: { id }, select: { status: true } });
    if (!row || row.status !== 'lead') {
      return NextResponse.json({ error: 'Not a deletable lead' }, { status: 400 });
    }
    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete' },
      { status: 400 }
    );
  }
}
