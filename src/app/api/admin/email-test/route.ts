import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  return req.cookies.get('medeqx_admin')?.value === process.env.ADMIN_TOKEN;
}

// GET diagnoses the SMTP config; POST sends a real test email to info@medeqx.com.
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cfg = {
    SMTP_HOST: process.env.SMTP_HOST || '(not set)',
    SMTP_PORT: process.env.SMTP_PORT || '(not set)',
    SMTP_USER: process.env.SMTP_USER || '(not set)',
    SMTP_PASS: process.env.SMTP_PASS ? '✓ set (' + String(process.env.SMTP_PASS).length + ' chars)' : '✗ NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  };

  let verify = 'not attempted';
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const t = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: parseInt(process.env.SMTP_PORT || '587') === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await t.verify();
      verify = '✓ SMTP server accepts connection + credentials';
    } catch (e) {
      verify = '✗ ' + (e instanceof Error ? e.message : String(e));
    }
  } else {
    verify = '✗ skipped — SMTP_USER or SMTP_PASS missing';
  }

  return NextResponse.json({ config: cfg, smtpVerify: verify });
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return NextResponse.json({ error: 'SMTP_USER or SMTP_PASS not set in cPanel env vars' }, { status: 500 });
  }
  try {
    const t = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: parseInt(process.env.SMTP_PORT || '587') === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const info = await t.sendMail({
      from: `"MedeqX Test" <${process.env.SMTP_USER}>`,
      to: 'info@medeqx.com',
      subject: 'MedeqX SMTP test — ' + new Date().toISOString(),
      text: 'This is a test email from the MedeqX admin panel to verify SMTP delivery. If you received this, email sending works correctly.',
    });
    return NextResponse.json({ success: true, messageId: info.messageId, accepted: info.accepted, rejected: info.rejected });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'send failed' }, { status: 500 });
  }
}
