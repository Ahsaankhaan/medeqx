import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, Tag, DollarSign, ArrowRight } from 'lucide-react';
import { ContentShell } from '@/components/content-shell';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: 'Buyer, Seller & Pricing Guides — Used Medical Equipment KSA',
  description: "Practical guides for hospitals, clinics, and biomedical engineers on how to buy, sell, and price used medical equipment in Saudi Arabia and the GCC.",
  alternates: { canonical: `${SITE}/guides` },
};

export default function GuidesIndex() {
  const guides = [
    {
      href: '/guides/buying',
      icon: ShoppingBag,
      title: "Buyer's Guide",
      desc: 'How to vet sellers, inspect used medical equipment, negotiate, and avoid the most common buying mistakes in the GCC market.',
    },
    {
      href: '/guides/selling',
      icon: Tag,
      title: "Seller's Guide",
      desc: 'How to write a listing that sells, what photos to include, fair pricing, and what happens after a buyer inquires.',
    },
    {
      href: '/guides/pricing',
      icon: DollarSign,
      title: 'Pricing Guide',
      desc: 'How to estimate the resale value of used MRI, CT, ultrasound, hospital beds and other equipment. Depreciation, condition, and market factors.',
    },
  ];

  return (
    <ContentShell
      eyebrow="Resources"
      title="Buyer, Seller &amp; Pricing Guides"
      intro="Practical, GCC-specific advice for hospitals, clinics, biomedical engineers, and equipment traders. Written for professionals, not generalists."
      breadcrumb={[{ href: '/guides', label: 'Guides' }]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-6 not-prose">
        {guides.map((g) => {
          const Icon = g.icon;
          return (
            <Link key={g.href} href={g.href}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#0057FF] hover:shadow-lg transition-all no-underline">
              <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                <Icon size={18} className="text-[#0057FF]" />
              </div>
              <h2 className="font-extrabold text-[#0D1B3E] text-lg mb-1.5">{g.title}</h2>
              <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-3">{g.desc}</p>
              <span className="flex items-center gap-1 text-xs font-bold text-[#0057FF]">
                Read guide <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          );
        })}
      </div>

      <p className="text-sm text-slate-500 mt-8">
        Want a topic covered? Email <a href="mailto:info@medeqx.com">info@medeqx.com</a>.
      </p>
    </ContentShell>
  );
}
