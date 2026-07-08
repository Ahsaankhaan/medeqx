import type { Metadata } from 'next';
import { PostListingClient } from './post-listing-client';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: 'Post Medical Equipment for Sale — List on MedeqX',
  description: 'List surplus or used medical equipment for sale on MedeqX. Reach verified hospital and clinic buyers across Saudi Arabia and the GCC. Free to post; 4% commission only on successful sale.',
  keywords: ['list medical equipment for sale', 'sell hospital equipment GCC', 'post medical equipment Saudi Arabia', 'list used medical devices', 'sell MRI', 'sell CT scanner', 'wanted medical equipment'],
  alternates: { canonical: `${SITE}/post-listing` },
  openGraph: {
    title: 'Post Your Medical Equipment on MedeqX',
    description: 'Reach verified GCC hospital buyers in 24 hours.',
    url: `${SITE}/post-listing`,
    type: 'website',
  },
};

export default function PostListingPage() {
  return <PostListingClient />;
}
