'use client';

import Link from 'next/link';
import { MapPin, ChevronRight, ArrowRight, Zap, PlusCircle, ShieldCheck } from 'lucide-react';
import { ListingCard } from '@/components/ui/listing-card';
import { useLanguage } from '@/contexts/language-context';
import type { Listing } from '@/types';
import type { City } from '@/lib/cities';

type CategoryLite = { slug: string; nameEn: string; nameAr: string; color: string; colorLight: string };

export function CityClient({
  city, listings, categoryCounts, allCategories, allCities,
}: {
  city: City;
  listings: Listing[];
  categoryCounts: Record<string, number>;
  allCategories: CategoryLite[];
  allCities: City[];
}) {
  const { t, lang } = useLanguage();
  const name = lang === 'ar' ? city.nameAr : city.nameEn;
  const country = lang === 'ar' ? city.countryAr : city.country;

  return (
    <main className="bg-[#F8FAFF] min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-[#0057FF]">{t.nav.home}</Link>
          <ChevronRight size={13} />
          <span className="text-[#0D1B3E] font-medium">
            {lang === 'ar' ? `معدات طبية في ${name}` : `Medical Equipment in ${name}`}
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white border-b border-slate-100 px-6 py-14">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex-1 min-w-[260px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 mb-4">
                <MapPin size={12} className="text-[#0057FF]" /> {name}, {country}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D1B3E] mb-3 leading-tight">
                {lang === 'ar'
                  ? `بيع وشراء المعدات الطبية المستعملة في ${name}`
                  : `Buy & Sell Used Medical Equipment in ${name}`}
              </h1>
              <p className="text-slate-500 max-w-2xl text-sm sm:text-base leading-relaxed">
                {lang === 'ar'
                  ? `استكشف المعدات الطبية المستعملة والمجدّدة المتاحة في ${name}: أجهزة الرنين المغناطيسي والأشعة المقطعية والسونار، أسرّة المستشفيات وكراسي الأسنان وأجهزة التنفس وغسيل الكلى وغيرها. جميع الإعلانات مراجَعة من قبل فريق MedeqX، وعمولة 4% فقط عند إتمام البيع.`
                  : `Browse verified used and refurbished medical equipment listings in ${name} — MRI scanners, CT scanners, ultrasound machines, X-ray equipment, hospital beds, dental chairs, ICU ventilators, dialysis machines and more. Every listing reviewed by the MedeqX team. Free to post; 4% commission only on successful sale.`}
              </p>
            </div>
            <Link href="/post-listing"
              className="flex items-center gap-2 rounded-xl bg-[#0057FF] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1a6aff] transition-colors">
              <PlusCircle size={14} /> {t.nav.postListing}
            </Link>
          </div>

          {/* Category breakdown chips */}
          <div className="flex flex-wrap gap-2 mt-7">
            {allCategories.map((c) => {
              const count = categoryCounts[c.slug] ?? 0;
              return (
                <Link key={c.slug} href={`/categories/${c.slug}`}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                  {lang === 'ar' ? c.nameAr : c.nameEn}
                  {count > 0 && <span className="text-slate-400 font-bold">({count})</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Listings grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-extrabold text-[#0D1B3E]">
            {lang === 'ar' ? `المعدات المتاحة في ${name}` : `Available Equipment in ${name}`}
            <span className="ml-2 text-sm font-normal text-slate-400">({listings.length})</span>
          </h2>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <Zap size={28} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium mb-1">
              {lang === 'ar' ? `لا توجد قوائم في ${name} حالياً` : `No listings in ${name} yet`}
            </p>
            <p className="text-slate-400 text-sm mb-4">
              {lang === 'ar' ? `كن أول من ينشر معدة طبية للبيع في ${name}` : `Be the first to post used medical equipment for sale in ${name}.`}
            </p>
            <Link href="/post-listing" className="inline-flex items-center gap-2 rounded-xl bg-[#0057FF] px-5 py-2.5 text-sm font-semibold text-white">
              <PlusCircle size={14} /> {t.nav.postListing}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>

      {/* SEO body text — naturally embeds high-volume keyword variants */}
      <section className="bg-white border-y border-slate-100 px-6 py-14">
        <div className="max-w-3xl mx-auto prose prose-slate text-sm sm:text-base text-slate-600 leading-relaxed">
          <h2 className="text-xl font-bold text-[#0D1B3E] mb-3">
            {lang === 'ar' ? `سوق المعدات الطبية المستعملة في ${name}` : `The Used Medical Equipment Marketplace in ${name}`}
          </h2>
          <p>
            {lang === 'ar'
              ? `يخدم MedeqX المستشفيات والعيادات والموردين الطبيين في ${name} وجميع أنحاء ${country}. سواء كنت تبحث عن شراء جهاز رنين مغناطيسي مستعمل، جهاز سونار مجدّد، سرير مستشفى ثانٍ، كرسي أسنان مستعمل، أو جهاز تنفس صناعي مستعمل — ستجد إعلانات موثّقة من بائعين تم التحقق منهم.`
              : `MedeqX serves hospitals, clinics, and medical suppliers in ${name} and across ${country}. Whether you're looking to buy a used MRI scanner, refurbished ultrasound machine, second hand hospital bed, used dental chair, or used ICU ventilator — you'll find verified listings from sellers we've reviewed.`}
          </p>
          <h3 className="text-base font-bold text-[#0D1B3E] mt-5 mb-2">
            {lang === 'ar' ? `كيف يعمل ${name} MedeqX` : `How MedeqX works in ${name}`}
          </h3>
          <p>
            {lang === 'ar'
              ? `النشر مجاني تماماً — أنشئ قائمة بمعدتك، ويراجعها فريقنا خلال 24 ساعة. عند إتمام البيع، نأخذ عمولة شفافة قدرها 4% (بحد أدنى 500 ريال) فقط من قيمة الصفقة المؤكدة. تظل بيانات الاتصال الخاصة بك سرية حتى يصلك استفسار من مشترٍ حقيقي.`
              : `Posting is completely free — list your equipment and our team reviews it within 24 hours. When you make a sale, we take a transparent 4% commission (minimum SAR 500) on confirmed sale value only. Your contact details remain private until a real buyer sends an inquiry.`}
          </p>
          <h3 className="text-base font-bold text-[#0D1B3E] mt-5 mb-2">
            {lang === 'ar' ? `أنواع المعدات الشائعة في ${name}` : `Popular equipment categories in ${name}`}
          </h3>
          <p>
            {lang === 'ar'
              ? `تشمل الفئات الأكثر طلباً في ${name}: التصوير التشخيصي (الرنين المغناطيسي، الأشعة المقطعية، السونار، الأشعة السينية)، مراقبة المرضى (أجهزة ECG، أجهزة التنفس)، المعدات الجراحية وأضواء العمليات، معدات المختبرات، التعقيم، إعادة التأهيل، وقطع الغيار والملحقات.`
              : `The most-requested categories in ${name} include diagnostic imaging (MRI, CT, ultrasound, X-Ray), patient monitoring (ECG, ventilators), surgical equipment and operating lights, laboratory equipment, sterilization, rehabilitation, and parts & accessories.`}
          </p>
        </div>
      </section>

      {/* Related cities */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck size={16} className="text-[#0057FF]" />
          <h2 className="text-lg font-bold text-[#0D1B3E]">
            {lang === 'ar' ? 'مدن أخرى نخدمها' : 'Other cities we serve'}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {allCities.map((c) => (
            <Link key={c.slug} href={`/cities/${c.slug}`}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF] hover:bg-blue-50 transition-colors">
              <MapPin size={12} /> {lang === 'ar' ? c.nameAr : c.nameEn}
              <ArrowRight size={12} className="opacity-50" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
