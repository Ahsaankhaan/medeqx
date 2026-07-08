import { NextRequest, NextResponse } from 'next/server';

const CANONICAL_HOST = 'www.medeqx.com';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const host = req.headers.get('host') || '';

  // 1. Canonical-host redirect — force https://www.medeqx.com for SEO consistency.
  //    Only redirect production hostnames (skip localhost, IPs, preview deploys).
  if (host && host !== CANONICAL_HOST && /medeqx\.com$/i.test(host)) {
    const target = `https://${CANONICAL_HOST}${pathname}${search}`;
    return NextResponse.redirect(target, 301);
  }

  // 2. Admin auth check
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('medeqx_admin')?.value;
    const expected = process.env.ADMIN_TOKEN;
    if (!token || token !== expected) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match everything except Next.js internal asset paths and well-known static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.svg|logo-white.svg|robots.txt|sitemap.xml).*)'],
};
