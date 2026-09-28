'use client';

import { useMemo, useState } from 'react';
import { Search, ArrowRight, PlusCircle, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import { ListingCard } from '@/components/ui/listing-card';
import { useLanguage } from '@/contexts/language-context';
import { CATEGORIES, LOCATIONS } from '@/lib/categories';
import type { Listing } from '@/types';

// Client-side filtering only — the full approved inventory is passed in from the
// ISR-cached server page, so browsing/filtering never triggers a server
// function (unlike /search, which is dynamic). Keeps this page free to serve.
export function AllListingsClient({ listings }: { listings: Listing[] }) {
  const { t, lang } = useLanguage();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [condition, setCondition] = useState('');
  const [type, setType] = useState('');

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return listings.filter((l) => {
      if (category && l.category !== category) return false;
      if (condition && l.condition !== condition) return false;
      if (type && l.listingType !== type) return false;
      if (city && !(l.location ?? '').toLowerCase().includes(city.toLowerCase())) return false;
      if (term) {
        const hay = `${l.name} ${l.manufacturer ?? ''} ${l.model ?? ''} ${l.description ?? ''} ${l.ref ?? ''}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [listings, q, category, city, condition, type]);

  const selCls =
    'rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#0057FF] focus:bg-white transition-colors';

  return (
    <main className="bg-[#F8FAFF] min-h-screen pt-20">
      {/* Header */}
      <section className="bg-white border-b border-slate-100 px-6 py-10">
        <div className="max-w-6xl mx-auto flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-1">
              {lang === 'ar' ? 'كل المعدات' : 'All Equipment'}
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D1B3E] leading-tight">
              {lang === 'ar' ? 'تصفّح جميع القوائم' : 'Browse All Listings'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {listings.length} {lang === 'ar' ? 'قائمة متاحة' : 'listings available'}
            </p>
          </div>
          <Link href="/post-listing"
            className="flex items-center gap-2 rounded-xl bg-[#0057FF] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1a6aff] transition-colors">
            <PlusCircle size={14} /> {t.nav.postListing}
          </Link>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-6 pt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap items-stretch gap-2">
            <div className="flex-1 min-w-[220px] flex items-center bg-slate-50 rounded-xl border border-slate-200 focus-within:border-[#0057FF] focus-within:bg-white transition-colors">
              <Search className="ml-3 shrink-0 text-slate-400" size={16} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="text"
                placeholder={t.hero.searchPlaceholder}
                className="flex-1 bg-transparent text-sm text-[#0D1B3E] placeholder:text-slate-400 outline-none py-2.5 px-2"
              />
            </div>

            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selCls}>
              <option value="">{lang === 'ar' ? 'كل الفئات' : 'All Categories'}</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{lang === 'ar' ? c.nameAr : c.nameEn}</option>
              ))}
            </select>

            <select value={city} onChange={(e) => setCity(e.target.value)} className={selCls}>
              <option value="">{lang === 'ar' ? 'كل المدن' : 'All Cities'}</option>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>

            <select value={condition} onChange={(e) => setCondition(e.target.value)} className={selCls}>
              <option value="">{lang === 'ar' ? 'كل الحالات' : 'Any Condition'}</option>
              <option value="new">{lang === 'ar' ? 'جديد' : 'New'}</option>
              <option value="refurbished">{lang === 'ar' ? 'مجدد' : 'Refurbished'}</option>
              <option value="used">{lang === 'ar' ? 'مستعمل' : 'Used'}</option>
              <option value="parts">{lang === 'ar' ? 'للقطع' : 'For Parts'}</option>
            </select>

            <select value={type} onChange={(e) => setType(e.target.value)} className={selCls}>
              <option value="">{lang === 'ar' ? 'الكل' : 'All Types'}</option>
              <option value="for_sale">{lang === 'ar' ? 'للبيع' : 'For Sale'}</option>
              <option value="wanted">{lang === 'ar' ? 'مطلوب' : 'Wanted'}</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-2xl bg-white border border-slate-200 p-8 mb-4">
              <PackageSearch size={32} className="text-slate-300 mx-auto" />
            </div>
            <p className="text-slate-500 font-medium">
              {lang === 'ar' ? 'لا توجد قوائم مطابقة' : 'No matching listings'}
            </p>
            <Link href="/categories"
              className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#0057FF] hover:underline">
              {t.common.browseCategories} <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>
    </main>
  );
}
