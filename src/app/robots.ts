import type { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/api/'] },
      // Explicitly allow AI crawlers (AEO — answer engine optimisation)
      { userAgent: 'GPTBot',           allow: '/', disallow: ['/admin', '/api'] },
      { userAgent: 'OAI-SearchBot',    allow: '/', disallow: ['/admin', '/api'] },
      { userAgent: 'ChatGPT-User',     allow: '/', disallow: ['/admin', '/api'] },
      { userAgent: 'PerplexityBot',    allow: '/', disallow: ['/admin', '/api'] },
      { userAgent: 'Perplexity-User',  allow: '/', disallow: ['/admin', '/api'] },
      { userAgent: 'ClaudeBot',        allow: '/', disallow: ['/admin', '/api'] },
      { userAgent: 'Claude-Web',       allow: '/', disallow: ['/admin', '/api'] },
      { userAgent: 'anthropic-ai',     allow: '/', disallow: ['/admin', '/api'] },
      { userAgent: 'Google-Extended',  allow: '/', disallow: ['/admin', '/api'] },
      { userAgent: 'Applebot-Extended',allow: '/', disallow: ['/admin', '/api'] },
      { userAgent: 'CCBot',            allow: '/', disallow: ['/admin', '/api'] },
      { userAgent: 'Bytespider',       allow: '/', disallow: ['/admin', '/api'] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
