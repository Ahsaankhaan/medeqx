'use client';

import Link from 'next/link';
import { MapPin, Camera, Building2, Sparkles, Flame, Calendar } from 'lucide-react';
import type { Listing, ListingCondition } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { getCategoryBySlug } from '@/lib/categories';
import { ShareButton } from '@/components/ui/share-button';

interface ListingCardProps {
  listing: Listing & { _count?: { inquiries?: number } };
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const CONDITION_STYLES: Record<string, { bg: string; text: string; border: string; en: string; ar: string }> = {
  new:         { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', en: 'New',         ar: 'جديد' },
  refurbished: { bg: 'bg-blue-50',    text: 'text-[#0057FF]',   border: 'border-blue-200',    en: 'Refurbished', ar: 'مجدد' },
  used:        { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   en: 'Used',        ar: 'مستعمل' },
  parts:       { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     en: 'For Parts',   ar: 'للقطع' },
};

export function ListingCard({ listing }: ListingCardProps) {
  const { lang } = useLanguage();
  const images: string[] = JSON.parse(listing.images || '[]');
  const category = getCategoryBySlug(listing.category);
  const isSold = listing.status === 'sold';

  const createdAt = new Date(listing.createdAt);
  const isRecentlyAdded = !isSold && (Date.now() - createdAt.getTime() < SEVEN_DAYS_MS);
  const inquiryCount = listing._count?.inquiries ?? 0;
  const isPopular = !isSold && inquiryCount >= 3;
  const cond = CONDITION_STYLES[listing.condition as string] ?? CONDITION_STYLES['used'];

  return (
    <Link
      href={`/listings/${listing.id}`}
      className={`group block rounded-2xl border bg-white shadow-sm hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col h-full ${isSold ? 'border-slate-300' : 'border-slate-200 hover:border-[#0057FF]/40'}`}
    >
      {/* IMAGE AREA — clean, no badges overlay (badges moved to meta row below) */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[0]}
            alt={listing.name}
            className={`w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ${isSold ? 'grayscale' : ''}`}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-50">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <Camera size={32} className="text-slate-300" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-300">Equipment Photo</p>
          </div>
        )}

        {/* Sold overlay only — no other badges */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
            <span className="rounded-lg bg-slate-700 px-6 py-2.5 text-base font-extrabold uppercase tracking-widest text-white shadow-lg">
              {lang === 'ar' ? 'مباع' : 'Sold'}
            </span>
          </div>
        )}

        {/* Share button (top-left) */}
        <div className="absolute top-3 left-3 z-10">
          <ShareButton path={`/listings/${listing.id}`} title={listing.name} variant="icon" />
        </div>

        {/* Subtle urgency badges (top-right) — kept minimal & only when relevant */}
        <div className="absolute top-3 right-3 flex gap-1.5 flex-col items-end">
          {isRecentlyAdded && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white/95 backdrop-blur border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 shadow-sm">
              <Sparkles size={9} /> {lang === 'ar' ? 'جديد' : 'NEW'}
            </span>
          )}
          {isPopular && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white/95 backdrop-blur border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700 shadow-sm">
              <Flame size={9} /> {inquiryCount} {lang === 'ar' ? 'استفسار' : 'inquiries'}
            </span>
          )}
        </div>

        {/* Price overlay at bottom */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent px-5 pt-14 pb-4">
          {listing.price ? (
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-0.5">
                  {lang === 'ar' ? 'السعر' : 'Asking'}
                </p>
                <p className={`text-xl sm:text-2xl font-extrabold leading-none ${isSold ? 'text-white/70 line-through' : 'text-white'}`}>
                  SAR {listing.price.toLocaleString()}
                </p>
              </div>
              {!isSold && (
                <span className="rounded-lg bg-white/95 backdrop-blur px-3 py-1.5 text-[11px] font-bold text-[#0057FF] uppercase tracking-wider whitespace-nowrap">
                  {lang === 'ar' ? 'استفسر' : 'Inquire'}
                </span>
              )}
            </div>
          ) : (
            <p className="text-base font-bold text-white">
              {lang === 'ar' ? 'حسب الطلب' : 'Price by Inquiry'}
            </p>
          )}
        </div>
      </div>

      {/* BODY — title, then condition chip + meta row (manufacturer · city · year) */}
      <div className="flex flex-col gap-3 p-5">
        <h3 className={`font-bold text-base leading-snug line-clamp-2 min-h-[2.6em] ${isSold ? 'text-slate-500' : 'text-[#0D1B3E]'}`}>
          {listing.name}
        </h3>

        {/* Pills row — condition + category + wanted */}
        <div className="flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center rounded-md ${cond.bg} ${cond.text} ${cond.border} border px-2 py-0.5 text-[11px] font-semibold`}>
            {lang === 'ar' ? cond.ar : cond.en}
          </span>
          {category && (
            <span
              className="inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold"
              style={{ background: category.colorLight, color: category.color, borderColor: `${category.color}33` }}
            >
              {lang === 'ar' ? category.nameAr : category.nameEn}
            </span>
          )}
          {listing.listingType === 'wanted' && (
            <span className="inline-flex items-center rounded-md bg-purple-50 border border-purple-200 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
              {lang === 'ar' ? 'مطلوب' : 'Wanted'}
            </span>
          )}
        </div>

        {/* Meta — Manufacturer · City · Year (the natural place for these details) */}
        <div className="flex items-center gap-2.5 text-xs text-slate-500 flex-wrap">
          {listing.manufacturer && (
            <span className="inline-flex items-center gap-1 font-medium truncate">
              <Building2 size={11} /> {listing.manufacturer}
            </span>
          )}
          {listing.location && (
            <>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} /> {listing.location}
              </span>
            </>
          )}
          {listing.year && (
            <>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1">
                <Calendar size={11} /> {listing.year}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
