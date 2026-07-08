import type { Metadata } from 'next';
import { CategoriesClient } from './categories-client';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: 'Medical Equipment Categories — Browse MedeqX',
  description: 'Browse medical equipment by category: diagnostic imaging (MRI, CT, X-Ray), patient monitoring, surgical equipment, lab equipment, sterilization, rehabilitation and parts. Verified listings across the GCC.',
  alternates: { canonical: `${SITE}/categories` },
  openGraph: {
    title: 'Medical Equipment Categories on MedeqX',
    description: 'Explore equipment across all clinical specialties.',
    url: `${SITE}/categories`,
    type: 'website',
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
