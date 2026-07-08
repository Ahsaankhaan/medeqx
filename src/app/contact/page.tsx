import type { Metadata } from 'next';
import { ContactClient } from './contact-client';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: 'Contact MedeqX — Medical Equipment Marketplace Support',
  description: 'Get in touch with MedeqX for questions about listing, buying, or selling medical equipment in Saudi Arabia and the GCC. Email info@medeqx.com — we respond within 24 hours.',
  alternates: { canonical: `${SITE}/contact` },
  openGraph: {
    title: 'Contact MedeqX',
    description: 'Get in touch with the MedeqX team. We respond within 24 hours.',
    url: `${SITE}/contact`,
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
