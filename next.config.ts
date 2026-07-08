import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Netlify builds and hosts Next.js with its own runtime — no `output: standalone`
  // and no Prisma engine tracing needed (Turso uses the JS libSQL driver adapter).
  // Note: the `prisma` CLI is build-time only — keeping it OUT of external packages
  // stops ~200MB of CLI + engines from being bundled into the runtime function.
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-libsql', '@libsql/client'],
  // Keep leftover copies/backups in the project root out of the traced bundle.
  outputFileTracingExcludes: {
    '*': [
      'website/**', 'medeqx-deploy/**', 'next-module/**', '_legacy/**',
      'swc-helpers/**', '**/*.zip', '**/*.db', 'backup*/**',
      'node_modules/prisma/**', 'node_modules/@prisma/engines/**',
      'node_modules/netlify-cli/**',
    ],
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [],
    // 1 year cache for Next.js optimised images
    minimumCacheTTL: 31_536_000,
  },
  // Long-cache static assets and the public/ folder
  async headers() {
    return [
      {
        // Next.js build assets (already content-hashed → safe to cache forever, immutable)
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // Images served from /public — long cache, but allow revalidation
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
      {
        // Fonts and CSS in /public
        source: '/:all*(woff|woff2|ttf|otf|eot|css)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // Security + SEO headers on every response
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options',        value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
  // Defense-in-depth: redirect apex → www even if middleware doesn't run
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'medeqx.com' }],
        destination: 'https://www.medeqx.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
