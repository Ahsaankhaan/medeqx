import { NextResponse } from 'next/server';
import { prisma, generateInquiryRef } from '@/lib/db';
import { inquirySchema } from '@/lib/validations';
import { sendInquiryForwarded } from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!(await verifyRecaptcha(body.recaptchaToken))) {
      return NextResponse.json({ error: 'CAPTCHA verification failed. Please try again.' }, { status: 400 });
    }
    const data = inquirySchema.parse(body);
    const rawServices = typeof body.services === 'string' ? body.services : '[]';

    const listing = await prisma.listing.findUnique({ where: { id: data.listingId } });
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    if (listing.status === 'sold') {
      return NextResponse.json({ error: 'This listing is sold' }, { status: 400 });
    }

    const ref = await generateInquiryRef();

    const inquiry = await prisma.inquiry.create({
      data: {
        ref,
        listingId: data.listingId,
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        buyerPhone: data.buyerPhone ?? '',
        buyerCompany: data.buyerCompany ?? '',
        message: data.message ?? '',
        services: rawServices,
      },
    });

    // Parse services if present
    let parsedServices: string[] = [];
    try {
      const s = JSON.parse(inquiry.services || '[]');
      if (Array.isArray(s)) parsedServices = s.filter((x) => typeof x === 'string');
    } catch {}

    await sendInquiryForwarded({
      inquiryRef: inquiry.ref ?? '',
      listingRef: listing.ref,
      listingName: listing.name,
      sellerName: listing.sellerName,
      sellerEmail: listing.sellerEmail,
      buyerName: inquiry.buyerName,
      buyerEmail: inquiry.buyerEmail,
      buyerPhone: inquiry.buyerPhone,
      buyerCompany: inquiry.buyerCompany,
      message: inquiry.message,
      services: parsedServices,
    }).catch((e) => console.error('[email error]', e));

    return NextResponse.json({ success: true, id: inquiry.id, ref: inquiry.ref });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
