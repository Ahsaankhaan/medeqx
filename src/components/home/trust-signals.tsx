'use client';

import { ShieldCheck, Eye, Award, Clock, MapPin, Building2, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

/**
 * Three-band trust section that addresses the "why should I trust you with
 * a SAR 1M deal?" question hospitals subconsciously ask. Replace the
 * placeholder hospital names, transaction examples, and team bios when real
 * data is available.
 */
export function TrustSignals() {
  const { lang } = useLanguage();

  // Placeholder anonymized transaction feed — replace via admin once you have real data
  const transactions = [
    { typeEn: 'CT Scanner',           typeAr: 'جهاز أشعة مقطعية',  fromEn: 'Riyadh', fromAr: 'الرياض',  toEn: 'Dammam',  toAr: 'الدمام',   priceText: 'SAR 580K', dayEn: '2 days ago',  dayAr: 'قبل يومين' },
    { typeEn: 'ICU Ventilators (×8)', typeAr: 'أجهزة تنفس (×8)',     fromEn: 'Jeddah', fromAr: 'جدة',     toEn: 'Mecca',   toAr: 'مكة',       priceText: 'SAR 240K', dayEn: '5 days ago',  dayAr: 'قبل 5 أيام' },
    { typeEn: 'Refurbished MRI 1.5T', typeAr: 'رنين مغناطيسي مجدد',   fromEn: 'Dubai',  fromAr: 'دبي',     toEn: 'Riyadh',  toAr: 'الرياض',    priceText: 'SAR 1.2M', dayEn: '1 week ago',  dayAr: 'قبل أسبوع' },
    { typeEn: 'Dental Chairs (×12)',  typeAr: 'كراسي أسنان (×12)',     fromEn: 'Khobar', fromAr: 'الخبر',   toEn: 'Medina',  toAr: 'المدينة',   priceText: 'SAR 96K',  dayEn: '2 weeks ago', dayAr: 'قبل أسبوعين' },
  ];

  // Placeholder trusted institution types — replace with real hospital logos when permitted
  const trustedSegments = [
    { en: 'Public Hospitals',        ar: 'مستشفيات حكومية',     icon: Building2 },
    { en: 'Private Clinics',          ar: 'عيادات خاصة',          icon: Stethoscope },
    { en: 'Biomedical Engineers',     ar: 'مهندسون طبيون',        icon: ShieldCheck },
    { en: 'Refurbishment Partners',   ar: 'شركاء التجديد',         icon: Award },
  ];

  return (
    <section className="bg-white py-16 px-6 border-b border-slate-100">
      <div className="max-w-6xl mx-auto">

        {/* Trusted by */}
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-2">
            {lang === 'ar' ? 'موثوقون من قبل' : 'Trusted By'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3E] mb-3">
            {lang === 'ar'
              ? 'محترفون من جميع أنحاء قطاع الرعاية الصحية في دول الخليج'
              : 'Healthcare Professionals Across the GCC'}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm">
            {lang === 'ar'
              ? 'تخدم MedeqX المستشفيات الحكومية والخاصة، العيادات، المهندسين الطبيين، وشركات التجديد عبر المملكة العربية السعودية ودول الخليج.'
              : 'MedeqX serves public and private hospitals, clinics, biomedical engineers, and equipment refurbishment partners across Saudi Arabia and the GCC region.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {trustedSegments.map((seg) => {
            const Icon = seg.icon;
            return (
              <div key={seg.en} className="flex flex-col items-center text-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-6">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200 mb-3">
                  <Icon size={20} className="text-[#0057FF]" />
                </div>
                <p className="text-sm font-semibold text-[#0D1B3E]">{lang === 'ar' ? seg.ar : seg.en}</p>
              </div>
            );
          })}
        </div>

        {/* Recent transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-1">
            <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-2">
              {lang === 'ar' ? 'نشاط حديث' : 'Recent Activity'}
            </p>
            <h3 className="text-xl font-extrabold text-[#0D1B3E] mb-3 leading-snug">
              {lang === 'ar' ? 'معدات تتحرك كل أسبوع' : 'Equipment Moving Every Week'}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {lang === 'ar'
                ? 'لمحة عامة مجهولة الهوية عن الصفقات الأخيرة على المنصة. يتم إخفاء هويات الأطراف لحماية خصوصيتهم.'
                : 'Anonymized snapshot of recent transactions on the platform. Party identities are hidden to protect their privacy.'}
            </p>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
                <div className="h-9 w-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <ShieldCheck size={15} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#0D1B3E] truncate">
                    {lang === 'ar' ? tx.typeAr : tx.typeEn}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin size={10} />
                    <span>
                      {lang === 'ar'
                        ? `من ${tx.fromAr} إلى ${tx.toAr}`
                        : `${tx.fromEn} → ${tx.toEn}`}
                    </span>
                    <span className="text-slate-300">·</span>
                    <Clock size={10} />
                    <span>{lang === 'ar' ? tx.dayAr : tx.dayEn}</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-[#0057FF] whitespace-nowrap">{tx.priceText}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why trust us — risk-reduction signals */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: Eye,
              en: 'Every listing reviewed',
              enDesc: 'Our team manually verifies every equipment listing before it goes live — no anonymous postings.',
              ar: 'مراجعة كل قائمة',
              arDesc: 'يقوم فريقنا بالتحقق يدوياً من كل قائمة معدات قبل النشر — لا توجد قوائم مجهولة.',
            },
            {
              icon: ShieldCheck,
              en: 'Contact details stay private',
              enDesc: 'Buyer and seller details are never published. We forward verified inquiries directly by email.',
              ar: 'بيانات الاتصال سرية',
              arDesc: 'لا يتم نشر بيانات المشتري أو البائع. نوجّه الاستفسارات الموثّقة بالبريد الإلكتروني.',
            },
            {
              icon: Award,
              en: 'Pay only on confirmed sale',
              enDesc: 'No subscription, no listing fees. 4% commission (min SAR 500) charged only after a successful sale.',
              ar: 'الدفع فقط عند البيع',
              arDesc: 'لا اشتراك ولا رسوم نشر. عمولة 4% (الحد الأدنى 500 ريال) عند إتمام البيع فقط.',
            },
          ].map(({ icon: Icon, en, enDesc, ar, arDesc }) => (
            <div key={en} className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-7">
              <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#0057FF]" />
              </div>
              <p className="font-bold text-[#0D1B3E] mb-1.5">{lang === 'ar' ? ar : en}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{lang === 'ar' ? arDesc : enDesc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
