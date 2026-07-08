'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, ShieldCheck, Activity, Tag, PlusCircle, Zap, CheckCircle2, Sparkles, Lock, Users, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { ListingCard } from '@/components/ui/listing-card';
import { TrustSignals } from '@/components/home/trust-signals';
import { TeamSection } from '@/components/home/team-section';
import { useLanguage } from '@/contexts/language-context';
import { CATEGORIES, LOCATIONS } from '@/lib/categories';
import type { Listing } from '@/types';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: 'easeOut' as const },
});

export function HomeClient({ listings, stats }: { listings: Listing[]; stats: { total: number; pending: number } }) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterCondition, setFilterCondition] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (filterCategory) params.set('category', filterCategory);
    if (filterCity) params.set('city', filterCity);
    if (filterCondition) params.set('condition', filterCondition);
    const qs = params.toString();
    window.location.href = qs ? `/search?${qs}` : '/search';
  };

  return (
    <main>
      {/* ── HERO ───────────────────────────────────────────────────────────
          Clean, professional all-blue hero using the brand color (#0057FF).
          Centred copy, strong CTAs, no decorative right-side imagery.
      ─────────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background: 'linear-gradient(135deg, #0A1530 0%, #0D1B3E 45%, #0057FF 100%)',
        }}
      >
        {/* Subtle depth — single soft highlight, no flashy gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-48 -right-48 h-[40rem] w-[40rem] rounded-full opacity-25 blur-3xl"
            style={{ background: 'radial-gradient(circle, #0057FF 0%, transparent 60%)' }} />
          {/* Faint grid for engineering-grade texture */}
          <div className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-20 lg:pt-36 lg:pb-28 flex flex-col items-center text-center">
          <motion.div {...fadeUp(0.05)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold text-white">
            <Sparkles size={12} /> {t.hero.badge}
          </motion.div>

          <motion.h1 {...fadeUp(0.15)}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-5 max-w-4xl">
            {t.hero.title1}{' '}
            <span className="text-[#7ED4FF]">{t.hero.title2}</span>
            <br className="hidden sm:block" />
            <span className="text-white"> {t.hero.title3}</span>
          </motion.h1>

          <motion.p {...fadeUp(0.25)}
            className="text-base sm:text-lg text-white/85 max-w-2xl mb-8 leading-relaxed">
            {t.hero.subtitle}
          </motion.p>

          {/* Trust signals */}
          <motion.div {...fadeUp(0.32)} className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-9 text-sm text-white/85">
            {[
              { icon: CheckCircle2, text: lang === 'ar' ? 'بائعون موثّقون' : 'Verified sellers' },
              { icon: Lock,         text: lang === 'ar' ? 'خصوصية تامة' : 'Full privacy' },
              { icon: Users,        text: lang === 'ar' ? 'B2B فقط' : 'B2B only' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon size={14} className="text-[#7ED4FF]" /> {text}
              </div>
            ))}
          </motion.div>

          {/* CTA buttons — aggressive visibility with three actions */}
          <motion.div {...fadeUp(0.4)} className="flex flex-wrap justify-center gap-3 mb-12">
            <Link href="/post-listing"
              className="flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#0057FF] hover:bg-blue-50 active:scale-95 transition-all shadow-lg">
              <PlusCircle size={15} /> {t.nav.postListing}
            </Link>
            <Link href="/categories"
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/20 active:scale-95 transition-all">
              {t.common.browseCategories} <ArrowRight size={15} />
            </Link>
            <a href={`https://wa.me/966505565761?text=${encodeURIComponent(lang === 'ar' ? 'مرحباً MedeqX، أرغب بالاستفسار' : "Hello MedeqX, I'd like to inquire")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#1ebe5d] active:scale-95 transition-all shadow-lg">
              <MessageCircle size={15} /> {lang === 'ar' ? 'تواصل واتساب' : 'Talk to Us on WhatsApp'}
            </a>
          </motion.div>

          {/* Stats — clean horizontal divider style on the blue background */}
          <motion.div {...fadeUp(0.5)} className="grid grid-cols-3 gap-6 sm:gap-12 max-w-2xl w-full">
            {[
              { icon: Activity,    value: stats.total || '0', label: t.hero.statsListings },
              { icon: ShieldCheck, value: '340+',             label: t.hero.statsSellers },
              { icon: Tag,         value: '7',                label: t.hero.statsCategories },
            ].map(({ icon: Icon, value, label }, i) => (
              <div key={label} className={`flex flex-col items-center ${i < 2 ? 'sm:border-r sm:border-white/15 sm:pr-6' : ''}`}>
                <Icon size={16} className="text-[#7ED4FF] mb-1" />
                <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none">{value}</span>
                <span className="text-[11px] sm:text-xs text-white/70 font-medium mt-1.5 text-center">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES STRIP ─────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#0D1B3E]">{t.categories.title}</h2>
            <Link href="/categories" className="text-sm font-semibold text-[#0057FF] hover:underline flex items-center gap-1">
              {t.categories.viewAll} <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center hover:border-[#0057FF] hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="h-14 w-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: cat.colorLight }}>
                  <Zap size={26} style={{ color: cat.color }} />
                </div>
                <span className="text-sm font-bold text-[#0D1B3E] group-hover:text-[#0057FF] leading-snug">
                  {lang === 'ar' ? cat.nameAr : cat.nameEn}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LISTINGS GRID ────────────────────────────────── */}
      <section className="bg-[#F8FAFF] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-1">{t.listings.featured}</p>
              <h2 className="text-2xl font-extrabold text-[#0D1B3E]">{t.listings.available}</h2>
            </div>
            <Link href="/categories"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#0057FF]/20 bg-white px-4 py-2 text-sm font-semibold text-[#0057FF] hover:bg-blue-50 transition-colors">
              {t.listings.viewAll} <ArrowRight size={13} />
            </Link>
          </div>

          {/* Search + quick-filters bar — above Available Equipment */}
          <form onSubmit={handleSearch}
            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm mb-8">
            <div className="flex flex-wrap items-stretch gap-2">
              {/* Main search */}
              <div className="flex-1 min-w-[240px] flex items-center bg-slate-50 rounded-xl border border-slate-200 focus-within:border-[#0057FF] focus-within:bg-white transition-colors">
                <Search className="ml-3 shrink-0 text-slate-400" size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder={t.hero.searchPlaceholder}
                  className="flex-1 bg-transparent text-sm text-[#0D1B3E] placeholder:text-slate-400 outline-none py-2.5 px-2"
                />
              </div>

              {/* Category */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="min-w-[150px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#0057FF] focus:bg-white transition-colors"
              >
                <option value="">{lang === 'ar' ? 'كل الفئات' : 'All Categories'}</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{lang === 'ar' ? c.nameAr : c.nameEn}</option>
                ))}
              </select>

              {/* City */}
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="min-w-[130px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#0057FF] focus:bg-white transition-colors"
              >
                <option value="">{lang === 'ar' ? 'كل المدن' : 'All Cities'}</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>

              {/* Condition */}
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="min-w-[130px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#0057FF] focus:bg-white transition-colors"
              >
                <option value="">{lang === 'ar' ? 'كل الحالات' : 'Any Condition'}</option>
                <option value="new">{lang === 'ar' ? 'جديد' : 'New'}</option>
                <option value="refurbished">{lang === 'ar' ? 'مجدد' : 'Refurbished'}</option>
                <option value="used">{lang === 'ar' ? 'مستعمل' : 'Used'}</option>
                <option value="parts">{lang === 'ar' ? 'للقطع' : 'For Parts'}</option>
              </select>

              <button
                type="submit"
                className="flex shrink-0 items-center gap-2 rounded-xl bg-[#0057FF] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1a6aff] active:scale-95 transition-all"
              >
                {t.hero.searchBtn} <ArrowRight size={14} />
              </button>
            </div>
          </form>

          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-2xl bg-white border border-slate-200 p-8 mb-4">
                <ShieldCheck size={32} className="text-slate-300 mx-auto" />
              </div>
              <p className="text-slate-500 font-medium">{t.listings.noListings}</p>
              <Link href="/post-listing"
                className="mt-4 flex items-center gap-2 rounded-xl bg-[#0057FF] px-5 py-2.5 text-sm font-semibold text-white">
                <PlusCircle size={14} /> {t.nav.postListing}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TRUST SIGNALS (Trusted By, Recent Transactions, Why Trust Us) ── */}
      <TrustSignals />

      {/* ── TEAM / FOUNDER ── */}
      <TeamSection />

      {/* ── CITIES & SEO CONTENT — improves ranking for city-specific buyer searches ── */}
      <section className="bg-white py-16 px-6 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-2">
              {lang === 'ar' ? 'تغطية' : 'Coverage'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3E] mb-3">
              {lang === 'ar'
                ? 'بيع وشراء المعدات الطبية المستعملة في جميع أنحاء المملكة'
                : 'Buy & Sell Used Medical Equipment Across Saudi Arabia'}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
              {lang === 'ar'
                ? 'تربط MedeqX المستشفيات والعيادات والموردين في الرياض وجدة والدمام ومكة والمدينة والخبر وتبوك وجميع مدن المملكة العربية السعودية ودول الخليج. اكتشف أجهزة الرنين المغناطيسي والأشعة المقطعية والسونار وأسرّة المستشفيات وكراسي الأسنان وأجهزة التنفس وغسيل الكلى — جميعها مستعملة أو مجدّدة من بائعين موثّقين.'
                : 'MedeqX connects hospitals, clinics, and suppliers across Riyadh, Jeddah, Dammam, Mecca, Medina, Khobar, Tabuk, and every major city in Saudi Arabia and the GCC. Find refurbished MRI scanners, used CT scanners, ultrasound machines, X-ray equipment, ICU ventilators, dialysis machines, dental chairs, hospital beds, patient monitors, defibrillators, ECG monitors and more — all from verified sellers.'}
            </p>
          </div>

          {/* City pills — each is a clickable search shortcut */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { en: 'Riyadh', ar: 'الرياض' },
              { en: 'Jeddah', ar: 'جدة' },
              { en: 'Dammam', ar: 'الدمام' },
              { en: 'Mecca', ar: 'مكة' },
              { en: 'Medina', ar: 'المدينة' },
              { en: 'Khobar', ar: 'الخبر' },
              { en: 'Tabuk', ar: 'تبوك' },
              { en: 'Abha', ar: 'أبها' },
              { en: 'Hofuf', ar: 'الهفوف' },
              { en: 'Dubai', ar: 'دبي' },
              { en: 'Abu Dhabi', ar: 'أبو ظبي' },
              { en: 'Kuwait City', ar: 'الكويت' },
              { en: 'Doha', ar: 'الدوحة' },
              { en: 'Manama', ar: 'المنامة' },
              { en: 'Muscat', ar: 'مسقط' },
            ].map((city) => (
              <Link key={city.en} href={`/search?q=${encodeURIComponent(city.en)}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF] hover:bg-blue-50 transition-colors">
                {lang === 'ar' ? city.ar : city.en}
              </Link>
            ))}
          </div>

          {/* Equipment-type quick search grid — each link targets a high-volume keyword phrase */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {[
              { en: 'Used MRI Scanner',          ar: 'جهاز رنين مغناطيسي مستعمل',  q: 'MRI' },
              { en: 'Used CT Scanner',           ar: 'جهاز أشعة مقطعية مستعمل',    q: 'CT scanner' },
              { en: 'Used Ultrasound Machine',   ar: 'جهاز سونار مستعمل',           q: 'ultrasound' },
              { en: 'Used X-Ray Equipment',      ar: 'جهاز أشعة سينية مستعمل',     q: 'x-ray' },
              { en: 'Used Hospital Beds',        ar: 'سرير مستشفى مستعمل',          q: 'hospital bed' },
              { en: 'Used Dental Chair',         ar: 'كرسي أسنان مستعمل',            q: 'dental chair' },
              { en: 'Used ICU Ventilator',       ar: 'جهاز تنفس صناعي مستعمل',     q: 'ventilator' },
              { en: 'Used Dialysis Machine',     ar: 'جهاز غسيل كلى مستعمل',        q: 'dialysis' },
              { en: 'Used Patient Monitor',      ar: 'جهاز مراقبة المريض مستعمل',  q: 'patient monitor' },
              { en: 'Used Defibrillator',        ar: 'جهاز صدمات كهربائية مستعمل', q: 'defibrillator' },
              { en: 'Used ECG Monitor',          ar: 'جهاز ECG مستعمل',              q: 'ECG' },
              { en: 'Used Oxygen Concentrator',  ar: 'جهاز أكسجين مستعمل',           q: 'oxygen' },
            ].map((item) => (
              <Link key={item.q} href={`/search?q=${encodeURIComponent(item.q)}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:border-[#0057FF] hover:bg-blue-50 hover:text-[#0057FF] transition-colors group">
                <span>{lang === 'ar' ? item.ar : item.en}</span>
                <ArrowRight size={13} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMISSION INFO ───────────────────────────────── */}
      <section className="bg-[#0D1B3E] py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] font-bold tracking-widest text-[#00D4FF] uppercase mb-3">{t.howItWorks.label}</p>
          <h2 className="text-2xl font-extrabold text-white mb-4">{t.howItWorks.title}</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">{t.howItWorks.subtitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { step: '1', title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc },
              { step: '2', title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc },
              { step: '3', title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="w-8 h-8 rounded-full bg-[#0057FF] text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">{s.step}</div>
                <p className="font-bold text-white mb-1">{s.title}</p>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/post-listing"
              className="flex items-center gap-2 rounded-xl bg-[#0057FF] px-6 py-3 text-sm font-semibold text-white"
              style={{ boxShadow: '0 0 24px rgba(0,87,255,0.45)' }}>
              <PlusCircle size={14} /> {t.howItWorks.cta1}
            </Link>
            <Link href="/faq"
              className="flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5">
              {t.howItWorks.cta2}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
