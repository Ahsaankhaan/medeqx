import { NextRequest, NextResponse } from 'next/server';
import { prisma, generateListingRef } from '@/lib/db';
import { listingSchema } from '@/lib/validations';
import { sendListingSubmitted } from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const search = searchParams.get('search');
    const take = parseInt(searchParams.get('take') || '24');

    const where: Record<string, unknown> = { status: { in: ['approved', 'sold'] } };
    if (category) where.category = category;
    if (condition && condition !== 'all') where.condition = condition;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { manufacturer: { contains: search } },
        { model: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy: [{ status: 'asc' }, { approvedAt: 'desc' }],
      take,
    });

    return NextResponse.json({ listings });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!(await verifyRecaptcha(body.recaptchaToken))) {
      return NextResponse.json({ error: 'CAPTCHA verification failed. Please try again.' }, { status: 400 });
    }
    const data = listingSchema.parse(body);

    const ref = await generateListingRef();

    const listing = await prisma.listing.create({
      data: {
        ref,
        name: data.name,
        category: data.category,
        manufacturer: data.manufacturer,
        model: data.model,
        serial: data.serial,
        year: data.year ? parseInt(data.year) : null,
        condition: data.condition,
        warranty: data.warranty,
        listingType: data.listingType,
        price: data.price ? parseFloat(data.price) : null,
        payment: data.payment,
        location: data.location,
        description: data.description,
        specs: data.specs,
        images: data.images,
        services: data.services,
        sellerName: data.sellerName,
        sellerEmail: data.sellerEmail,
        sellerPhone: data.sellerPhone,
        sellerCompany: data.sellerCompany,
        status: 'pending',
      },
    });

    // Await the email — on serverless (Netlify), fire-and-forget work is killed
    // when the function returns, so the mail would never actually send. A mail
    // failure must not block the listing from being created, hence try/catch.
    try {
      await sendListingSubmitted({
        ref: listing.ref,
        name: listing.name,
        sellerName: listing.sellerName,
        sellerEmail: listing.sellerEmail,
      });
    } catch (e) {
      console.error('[email error listing]', e);
    }

    return NextResponse.json({ success: true, ref: listing.ref, id: listing.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Validation error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
