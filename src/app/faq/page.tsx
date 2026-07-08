import type { Metadata } from 'next';
import { FaqClient } from './faq-client';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: 'FAQ — Medical Equipment Marketplace Questions Answered',
  description: 'Frequently asked questions about buying and selling medical equipment on MedeqX. Learn about listing, commission, payment, delivery, and how the marketplace works in Saudi Arabia and the GCC.',
  alternates: { canonical: `${SITE}/faq` },
  openGraph: {
    title: 'MedeqX FAQ',
    description: 'Answers to common questions about the MedeqX medical equipment marketplace.',
    url: `${SITE}/faq`,
    type: 'website',
  },
};

export default function FaqPage() {
  return <FaqClient />;
}
