import nodemailer from 'nodemailer';

const FROM = '"MedeqX Marketplace" <info@medeqx.com>';
const ADMIN_EMAIL = 'info@medeqx.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.medeqx.com';

function createTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[EMAIL] SMTP_USER or SMTP_PASS missing — emails disabled.');
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT || '587') === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function send(to: string, subject: string, html: string, label: string) {
  const t = createTransporter();
  if (!t) {
    console.log(`[EMAIL SKIP ${label}] would send to ${to}: ${subject}`);
    return;
  }
  try {
    const info = await t.sendMail({ from: FROM, to, subject, html });
    console.log(`[EMAIL SENT ${label}] to ${to}: ${info.messageId}`);
  } catch (err) {
    console.error(`[EMAIL ERROR ${label}] to ${to}:`, err);
    throw err;
  }
}

const wrap = (body: string) => `<!DOCTYPE html><html><body style="font-family:Arial,Helvetica,sans-serif;background:#f5f7ff;padding:24px;color:#0d1b3e">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:32px;box-shadow:0 2px 10px rgba(0,0,0,.06)">
    <div style="text-align:center;margin-bottom:24px"><span style="font-size:22px;font-weight:800;color:#0d1b3e">Medeq<span style="color:#0057FF">X</span></span></div>
    ${body}
    <hr style="border:0;border-top:1px solid #eee;margin:28px 0">
    <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0">MedeqX — B2B Medical Equipment Exchange · Saudi Arabia &amp; GCC<br/>
    <a href="${SITE_URL}" style="color:#0057FF;text-decoration:none">${SITE_URL}</a></p>
  </div></body></html>`;

// ──────────────────────────────────────────────────────────────────────
// LISTING SUBMITTED (pending review)
// ──────────────────────────────────────────────────────────────────────
export async function sendListingSubmitted(listing: {
  ref: string; name: string; sellerName: string; sellerEmail: string;
}) {
  // 1) Seller confirmation
  await send(listing.sellerEmail,
    `MedeqX — Listing ${listing.ref} received & under review`,
    wrap(`<p>Dear ${listing.sellerName},</p>
      <p>Thank you for submitting your equipment to <strong>MedeqX</strong>. Your listing has been received and is under review by our team.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px;color:#64748b">Reference</td><td style="padding:6px;font-weight:700;color:#0057FF">${listing.ref}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Equipment</td><td style="padding:6px">${listing.name}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Status</td><td style="padding:6px">Under Review</td></tr>
      </table>
      <p>We will email you again once your listing is approved and live on the marketplace (usually within 24 hours).</p>
      <p style="font-size:12px;color:#64748b">A 4% commission applies on confirmed sale value (minimum SAR 500), charged only on successful sale.</p>`),
    'LISTING_SUBMITTED_SELLER').catch(() => {});

  // 2) Admin notification
  await send(ADMIN_EMAIL,
    `[New Listing] ${listing.ref} — ${listing.name}`,
    wrap(`<p><strong>New listing pending approval:</strong></p>
      <table style="width:100%;border-collapse:collapse;margin:12px 0">
        <tr><td style="padding:6px;color:#64748b">Ref</td><td style="padding:6px;font-weight:700">${listing.ref}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Name</td><td style="padding:6px">${listing.name}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Seller</td><td style="padding:6px">${listing.sellerName}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Email</td><td style="padding:6px">${listing.sellerEmail}</td></tr>
      </table>
      <p><a href="${SITE_URL}/admin/listings" style="display:inline-block;background:#0057FF;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">Review in Admin Panel →</a></p>`),
    'LISTING_SUBMITTED_ADMIN').catch(() => {});
}

// ──────────────────────────────────────────────────────────────────────
// LISTING APPROVED (now live)
// ──────────────────────────────────────────────────────────────────────
export async function sendListingApproved(listing: {
  ref: string; name: string; sellerName: string; sellerEmail: string;
}) {
  await send(listing.sellerEmail,
    `MedeqX — Your listing ${listing.ref} is now LIVE`,
    wrap(`<p>Dear ${listing.sellerName},</p>
      <p>Great news — your listing has been approved and is now live on the MedeqX marketplace.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px;color:#64748b">Reference</td><td style="padding:6px;font-weight:700;color:#0057FF">${listing.ref}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Equipment</td><td style="padding:6px">${listing.name}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Status</td><td style="padding:6px"><span style="color:#10b981;font-weight:600">● Live</span></td></tr>
      </table>
      <p>Buyers across Saudi Arabia and the GCC can now discover your equipment. We&#39;ll forward any inquiry directly to you by email.</p>
      <p><a href="${SITE_URL}" style="display:inline-block;background:#0057FF;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">View on Marketplace →</a></p>`),
    'LISTING_APPROVED_SELLER').catch(() => {});

  await send(ADMIN_EMAIL,
    `[Listing Approved] ${listing.ref} — ${listing.name}`,
    wrap(`<p>Listing <strong>${listing.ref}</strong> (${listing.name}) was approved and is now live.</p>
      <p>Seller: ${listing.sellerName} (${listing.sellerEmail})</p>`),
    'LISTING_APPROVED_ADMIN').catch(() => {});
}

// ──────────────────────────────────────────────────────────────────────
// INQUIRY (buyer → seller, with copies to buyer and admin)
// ──────────────────────────────────────────────────────────────────────
export async function sendInquiryForwarded(data: {
  inquiryRef: string;
  listingRef: string; listingName: string;
  sellerName: string; sellerEmail: string;
  buyerName: string; buyerEmail: string;
  buyerPhone: string; buyerCompany: string; message: string;
  services?: string[];
}) {
  const buyerLine = `${data.buyerName}${data.buyerCompany ? ` (${data.buyerCompany})` : ''}`;
  const servicesHtml = data.services && data.services.length > 0
    ? `<p><strong>Additional Services Requested:</strong></p><ul style="margin:0 0 12px 18px;color:#0d1b3e">${data.services.map((s) => `<li>${s}</li>`).join('')}</ul>`
    : '';

  // 1) Seller — gets buyer's contact details
  await send(data.sellerEmail,
    `MedeqX — New inquiry ${data.inquiryRef} for ${data.listingRef}`,
    wrap(`<p>Dear ${data.sellerName},</p>
      <p>You have received a new inquiry on your listing <strong>${data.listingName}</strong> (${data.listingRef}).</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px;color:#64748b">Inquiry Ref</td><td style="padding:6px;font-weight:700;color:#0057FF">${data.inquiryRef}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Buyer</td><td style="padding:6px">${buyerLine}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Email</td><td style="padding:6px"><a href="mailto:${data.buyerEmail}" style="color:#0057FF">${data.buyerEmail}</a></td></tr>
        <tr><td style="padding:6px;color:#64748b">Phone</td><td style="padding:6px">${data.buyerPhone || '—'}</td></tr>
      </table>
      ${servicesHtml}
      ${data.message ? `<p><strong>Message:</strong></p><div style="background:#f5f7ff;padding:12px;border-radius:8px;font-size:14px;line-height:1.6">${data.message.replace(/\n/g, '<br>')}</div>` : ''}
      <p style="margin-top:18px">Please contact the buyer directly to proceed.</p>`),
    'INQUIRY_SELLER').catch(() => {});

  // 2) Buyer — confirmation of their inquiry
  await send(data.buyerEmail,
    `MedeqX — Inquiry confirmation ${data.inquiryRef}`,
    wrap(`<p>Dear ${data.buyerName},</p>
      <p>Thank you for your inquiry on <strong>${data.listingName}</strong> via MedeqX.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px;color:#64748b">Your Reference</td><td style="padding:6px;font-weight:700;color:#0057FF">${data.inquiryRef}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Listing</td><td style="padding:6px">${data.listingName} (${data.listingRef})</td></tr>
      </table>
      <p>We&#39;ve forwarded your contact details to the seller. They will reach out directly to you, usually within 24 hours.</p>
      <p style="font-size:12px;color:#64748b">If you don&#39;t hear back within 48 hours, please contact us at info@medeqx.com quoting reference <strong>${data.inquiryRef}</strong>.</p>`),
    'INQUIRY_BUYER_CONFIRM').catch(() => {});

  // 3) Admin — copy
  await send(ADMIN_EMAIL,
    `[New Inquiry] ${data.inquiryRef} → ${data.listingRef}`,
    wrap(`<p><strong>New inquiry received:</strong></p>
      <table style="width:100%;border-collapse:collapse;margin:12px 0">
        <tr><td style="padding:6px;color:#64748b">Inquiry</td><td style="padding:6px">${data.inquiryRef}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Listing</td><td style="padding:6px">${data.listingRef} — ${data.listingName}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Seller</td><td style="padding:6px">${data.sellerName} (${data.sellerEmail})</td></tr>
        <tr><td style="padding:6px;color:#64748b">Buyer</td><td style="padding:6px">${buyerLine} — ${data.buyerEmail} — ${data.buyerPhone || '—'}</td></tr>
      </table>
      ${servicesHtml}
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}`),
    'INQUIRY_ADMIN').catch(() => {});
}

// ──────────────────────────────────────────────────────────────────────
// CONTACT FORM (visitor → admin, with confirmation to visitor)
// ──────────────────────────────────────────────────────────────────────
export async function sendContactMessage(data: {
  name: string; email: string; company: string; subject: string; message: string;
}) {
  // 1) Admin
  await send(ADMIN_EMAIL,
    `[Contact] ${data.subject} — ${data.name}`,
    wrap(`<p><strong>New contact form message:</strong></p>
      <table style="width:100%;border-collapse:collapse;margin:12px 0">
        <tr><td style="padding:6px;color:#64748b">From</td><td style="padding:6px">${data.name}${data.company ? ` — ${data.company}` : ''}</td></tr>
        <tr><td style="padding:6px;color:#64748b">Email</td><td style="padding:6px"><a href="mailto:${data.email}" style="color:#0057FF">${data.email}</a></td></tr>
        <tr><td style="padding:6px;color:#64748b">Subject</td><td style="padding:6px">${data.subject}</td></tr>
      </table>
      <p><strong>Message:</strong></p>
      <div style="background:#f5f7ff;padding:12px;border-radius:8px;font-size:14px;line-height:1.6">${data.message.replace(/\n/g, '<br>')}</div>`),
    'CONTACT_ADMIN').catch(() => {});

  // 2) Visitor confirmation
  await send(data.email,
    `MedeqX — We received your message`,
    wrap(`<p>Dear ${data.name},</p>
      <p>Thank you for contacting MedeqX. We&#39;ve received your message and will respond within 24 hours.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px;color:#64748b">Subject</td><td style="padding:6px">${data.subject}</td></tr>
      </table>`),
    'CONTACT_CONFIRM').catch(() => {});
}
