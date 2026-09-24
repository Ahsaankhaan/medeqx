import { NextRequest, NextResponse } from 'next/server';

// Middleware runs as an EDGE FUNCTION on every matched request. Scope it to
// /admin ONLY — otherwise it fires on every public page + crawler hit and burns
// tens of thousands of edge-function invocations (the main Netlify credit sink).
// The apex → www canonical redirect is handled at the edge by Netlify's primary
// domain setting, so it no longer needs to run here.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin auth check
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('medeqx_admin')?.value;
    if (!token || token !== process.env.ADMIN_TOKEN) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only run on admin routes — NOT on public pages or crawler traffic.
  matcher: ['/admin/:path*'],
};
