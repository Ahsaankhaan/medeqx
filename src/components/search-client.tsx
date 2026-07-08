'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { ListingCard } from '@/components/ui/listing-card';
import { useLanguage } from '@/contexts/language-context';
import { CATEGORIES, LOCATIONS } from '@/lib/categories';
import { MANUFACTURERS } from '@/lib/manufacturers';
import type { Listing } from '@/types';

type Props = {
  listings: (Listing & { _count?: { inquiries?: number } })[];
  query: string;
  category: string;
  condition: string;
  manufacturer: string;
  city: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
};

export function SearchClient({
  listings, query, category, condition, manufacturer, city, type, minPrice, maxPrice, minYear,
}: Props) {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const [q, setQ] = useState(query);
  const [cat, setCat] = useState(category);
  const [cond, setCond] = useState(condition || 'all');
  const [mfr, setMfr] = useState(manufacturer);
  const [cty, setCty] = useState(city);
  const [typ, setTyp] = useState(type || 'all');
  const [minP, setMinP] = useState(minPrice);
  const [maxP, setMaxP] = useState(maxPrice);
  const [minY, setMinY] = useState(minYear);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (cat) params.set('category', cat);
    if (cond && cond !== 'all') params.set('condition', cond);
    if (mfr) params.set('manufacturer', mfr);
    if (cty) params.set('city', cty);
    if (typ && typ !== 'all') params.set('type', typ);
    if (minP) params.set('minPrice', minP);
    if (maxP) params.set('maxPrice', maxP);
    if (minY) params.set('minYear', minY);
    router.push(`/search?${params.toString()}`);
  };

  const clearAll = () => {
    setQ(''); setCat(''); setCond('all'); setMfr(''); setCty(''); setTyp('all');
    setMinP(''); setMaxP(''); setMinY('');
    router.push('/search');
  };

  const CONDITIONS = [
    { value: 'all',         en: 'All Conditions',  ar: 'كل الحالات' },
    { value: 'new',         en: 'New',             ar: 'جديد' },
    { value: 'refurbished', en: 'Refurbished',     ar: 'مجدد' },
    { value: 'used',        en: 'Used',            ar: 'مستعمل' },
    { value: 'parts',       en: 'For Parts',       ar: 'للقطع' },
  ];

  const TYPES = [
    { value: 'all',      en: 'For Sale + Wanted', ar: 'للبيع ومطلوب' },
    { value: 'for_sale', en: 'For Sale',          ar: 'للبيع' },
    { value: 'wanted',   en: 'Wanted',            ar: 'مطلوب' },
  ];

  // Count active filters (excluding the main search box)
  const activeFilterCount = [cat, cond !== 'all' ? cond : '', mfr, cty, typ !== 'all' ? typ : '', minP, maxP, minY].filter(Boolean).length;

  return (
    <main className="bg-[#F8FAFF] min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-[#0057FF]">{t.nav.home}</Link>
          <ChevronRight size={13} />
          <span className="text-[#0D1B3E] font-medium">{lang === 'ar' ? 'البحث' : 'Search'}</span>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-10">
        {/* Search bar + filters toggle */}
        <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[220px] relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحث عن معدة، شركة مصنعة، موديل، رقم REF…' : 'Search equipment, manufacturer, model, REF#…'}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#0057FF] focus:bg-white transition-all"
              />
            </div>
            <button type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#0057FF] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1a6aff] transition-colors">
              {lang === 'ar' ? 'بحث' : 'Search'} <ArrowRight size={13} />
            </button>
            <button type="button" onClick={() => setFiltersOpen((o) => !o)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${activeFilterCount > 0 || filtersOpen ? 'border-[#0057FF] bg-blue-50 text-[#0057FF]' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
              <SlidersHorizontal size={14} /> {lang === 'ar' ? 'فلاتر' : 'Filters'}
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-[#0057FF] text-white text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center">{activeFilterCount}</span>
              )}
            </button>
          </div>

          {/* Expanded filters */}
          {filtersOpen && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{lang === 'ar' ? 'الفئة' : 'Category'}</label>
                  <select value={cat} onChange={(e) => setCat(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#0057FF]">
                    <option value="">{lang === 'ar' ? 'كل الفئات' : 'All Categories'}</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{lang === 'ar' ? c.nameAr : c.nameEn}</option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{lang === 'ar' ? 'الحالة' : 'Condition'}</label>
                  <select value={cond} onChange={(e) => setCond(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#0057FF]">
                    {CONDITIONS.map((c) => (
                      <option key={c.value} value={c.value}>{lang === 'ar' ? c.ar : c.en}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{lang === 'ar' ? 'نوع القائمة' : 'Listing Type'}</label>
                  <select value={typ} onChange={(e) => setTyp(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#0057FF]">
                    {TYPES.map((c) => (
                      <option key={c.value} value={c.value}>{lang === 'ar' ? c.ar : c.en}</option>
                    ))}
                  </select>
                </div>

                {/* Manufacturer */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{lang === 'ar' ? 'الشركة المصنعة' : 'Manufacturer'}</label>
                  <select value={mfr} onChange={(e) => setMfr(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#0057FF]">
                    <option value="">{lang === 'ar' ? 'كل الشركات' : 'All Manufacturers'}</option>
                    {MANUFACTURERS.map((m) => (
                      <option key={m.slug} value={m.name}>{lang === 'ar' ? m.nameAr : m.name}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{lang === 'ar' ? 'المدينة' : 'City'}</label>
                  <select value={cty} onChange={(e) => setCty(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#0057FF]">
                    <option value="">{lang === 'ar' ? 'كل المدن' : 'All Cities'}</option>
                    {LOCATIONS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Min Year */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{lang === 'ar' ? 'سنة الصنع (الحد الأدنى)' : 'Min Year'}</label>
                  <input type="number" inputMode="numeric" placeholder="e.g. 2018" min="1990" max="2030"
                    value={minY} onChange={(e) => setMinY(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#0057FF]" />
                </div>

                {/* Price range */}
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{lang === 'ar' ? 'نطاق السعر (ريال سعودي)' : 'Price Range (SAR)'}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" inputMode="numeric" placeholder={lang === 'ar' ? 'من' : 'Min'}
                      value={minP} onChange={(e) => setMinP(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#0057FF]" />
                    <input type="number" inputMode="numeric" placeholder={lang === 'ar' ? 'إلى' : 'Max'}
                      value={maxP} onChange={(e) => setMaxP(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#0057FF]" />
                  </div>
                </div>

                {/* Clear all */}
                <div className="flex items-end">
                  <button type="button" onClick={clearAll}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:border-red-200 hover:text-red-600 transition-colors">
                    <X size={13} /> {lang === 'ar' ? 'مسح الفلاتر' : 'Clear All Filters'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Active-filter chips (always visible if filters applied) */}
        {activeFilterCount > 0 && !filtersOpen && (
          <div className="flex flex-wrap gap-1.5 mb-5 -mt-2">
            {cat && <Chip label={lang === 'ar' ? 'فئة' : 'Category'} value={CATEGORIES.find((c) => c.slug === cat)?.[lang === 'ar' ? 'nameAr' : 'nameEn'] || cat} onClear={() => { setCat(''); setTimeout(submit, 0); }} />}
            {cond !== 'all' && cond && <Chip label={lang === 'ar' ? 'حالة' : 'Condition'} value={cond} onClear={() => { setCond('all'); setTimeout(submit, 0); }} />}
            {mfr && <Chip label={lang === 'ar' ? 'شركة' : 'Brand'} value={mfr} onClear={() => { setMfr(''); setTimeout(submit, 0); }} />}
            {cty && <Chip label={lang === 'ar' ? 'مدينة' : 'City'} value={cty} onClear={() => { setCty(''); setTimeout(submit, 0); }} />}
            {minP && <Chip label={lang === 'ar' ? 'من' : 'Min'} value={`SAR ${parseInt(minP).toLocaleString()}`} onClear={() => { setMinP(''); setTimeout(submit, 0); }} />}
            {maxP && <Chip label={lang === 'ar' ? 'إلى' : 'Max'} value={`SAR ${parseInt(maxP).toLocaleString()}`} onClear={() => { setMaxP(''); setTimeout(submit, 0); }} />}
            {minY && <Chip label={lang === 'ar' ? 'سنة' : 'Year'} value={`≥ ${minY}`} onClear={() => { setMinY(''); setTimeout(submit, 0); }} />}
          </div>
        )}

        {/* Results */}
        <div className="mb-5">
          <h1 className="text-xl font-extrabold text-[#0D1B3E]">
            {lang === 'ar' ? 'النتائج' : 'Results'}
            <span className="ml-2 text-sm font-normal text-slate-400">
              ({listings.length})
            </span>
          </h1>
          {query && (
            <p className="text-sm text-slate-500 mt-1">
              {lang === 'ar' ? `بحث عن: "${query}"` : `Showing results for "${query}"`}
            </p>
          )}
        </div>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Search size={32} className="text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium mb-1">
              {lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
            </p>
            <p className="text-slate-400 text-sm">
              {lang === 'ar' ? 'جرّب تخفيف الفلاتر أو تصفح الفئات' : 'Try loosening your filters or browse categories'}
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={clearAll}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700">
                {lang === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
              </button>
              <Link href="/categories" className="rounded-xl bg-[#0057FF] px-5 py-2.5 text-sm font-semibold text-white">
                {lang === 'ar' ? 'تصفّح الفئات' : 'Browse Categories'}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>
    </main>
  );
}

function Chip({ label, value, onClear }: { label: string; value: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-[#0057FF]">
      <span className="text-slate-500 font-normal">{label}:</span> {value}
      <button onClick={onClear} className="text-[#0057FF] hover:text-red-600 transition-colors">
        <X size={11} />
      </button>
    </span>
  );
}
