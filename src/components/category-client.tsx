'use client';

import Link from 'next/link';
import { ChevronRight, PlusCircle, Zap } from 'lucide-react';
import { ListingCard } from '@/components/ui/listing-card';
import { useLanguage } from '@/contexts/language-context';
import type { Category } from '@/lib/categories';
import type { Listing } from '@/types';

export function CategoryClient({ category, listings }: { category: Category; listings: Listing[] }) {
  const { t, lang } = useLanguage();
  const name = lang === 'ar' ? category.nameAr : category.nameEn;
  const desc = lang === 'ar' ? category.descAr : category.descEn;

  return (
    <main className="bg-[#F8FAFF] min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-[#0057FF]">{t.nav.home}</Link>
          <ChevronRight size={13} />
          <Link href="/categories" className="hover:text-[#0057FF]">{t.nav.categories}</Link>
          <ChevronRight size={13} />
          <span className="text-[#0D1B3E] font-medium">{name}</span>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: category.colorLight }}>
              <Zap size={24} style={{ color: category.color }} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0D1B3E]">{name}</h1>
              <p className="text-sm text-slate-400 mt-0.5">{desc}</p>
            </div>
          </div>
          <Link href="/post-listing"
            className="flex items-center gap-2 rounded-xl bg-[#0057FF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
            <PlusCircle size={14} /> {t.nav.postListing}
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-slate-400 text-lg font-medium mb-2">{t.listings.noneInCategory}</p>
            <p className="text-slate-400 text-sm">{t.listings.beFirst}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>
    </main>
  );
}
