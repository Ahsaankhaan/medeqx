'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

/**
 * Founder / team trust block.
 *
 * Replace the placeholder name, photo URL, and bio with real content before
 * marketing the site. Hospitals in the GCC strongly prefer to know who they
 * are dealing with — even one real photo dramatically improves conversion.
 *
 * To replace the photo:
 *   1) Upload a 400×400 square photo to public/team/ (e.g. founder.jpg)
 *   2) Change the `src` below to `/team/founder.jpg`
 */
export function TeamSection() {
  const { lang } = useLanguage();

  return (
    <section className="bg-[#F8FAFF] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          {/* Company logo above the heading */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="MedeqX" className="h-12 w-auto mb-4 opacity-90" />
          <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-2">
            {lang === 'ar' ? 'الفريق' : 'Our Team'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D1B3E]">
            {lang === 'ar' ? 'الأشخاص خلف MedeqX' : 'The People Behind MedeqX'}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6 items-center">
            {/* Photo — replace public/team.png with the real photo file when ready */}
            <div className="flex justify-center sm:justify-start">
              <div className="h-32 w-32 sm:h-44 sm:w-44 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-gradient-to-br from-blue-100 to-blue-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/team.png"
                  alt={lang === 'ar' ? 'فريق MedeqX' : 'MedeqX Team'}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <p className="text-xs font-bold tracking-widest text-[#0057FF] uppercase mb-1">
                {lang === 'ar' ? 'المؤسس والرئيس التنفيذي' : 'Founder & CEO'}
              </p>
              <h3 className="text-xl font-extrabold text-[#0D1B3E] mb-2">
                {/* Replace with real founder name */}
                {lang === 'ar' ? 'فريق MedeqX' : 'The MedeqX Team'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 max-w-prose">
                {lang === 'ar'
                  ? 'فريق متخصّص في تجارة المعدات الطبية مقره المملكة العربية السعودية، يجمع بين خبرة هندسية طبية وعلاقات قوية مع المستشفيات والموردين في دول الخليج. مهمتنا: جعل تداول المعدات الطبية المستعملة آمناً وشفافاً وفعّالاً.'
                  : 'A Saudi-based team specialising in medical equipment trading, combining biomedical engineering expertise with strong hospital and supplier relationships across the GCC. Our mission: make used medical equipment trade safe, transparent, and efficient.'}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#0057FF]" />
                  {lang === 'ar' ? 'الدمام، المملكة العربية السعودية' : 'Dammam, Saudi Arabia'}
                </span>
                <a href="mailto:info@medeqx.com" className="flex items-center gap-1.5 hover:text-[#0057FF]">
                  <Mail size={12} /> info@medeqx.com
                </a>
                {/* Add LinkedIn URL when available */}
                {/* <a href="https://www.linkedin.com/company/medeqx" target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:text-[#0057FF]">
                  <Linkedin size={12} /> LinkedIn
                </a> */}
              </div>
            </div>
          </div>

          {/* Talk-to-us CTA bar */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3 items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-5 py-4">
            <p className="text-sm text-slate-600 text-center sm:text-left">
              {lang === 'ar'
                ? 'لديك صفقة كبيرة أو معدات لتصفية المخزون؟ نقدّم خدمة الوساطة والتقييم.'
                : 'Have a large deal or surplus inventory to dispose? We also offer brokering and valuation services.'}
            </p>
            <Link href="/contact"
              className="shrink-0 flex items-center gap-2 rounded-xl bg-[#0057FF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a6aff] transition-colors">
              <Phone size={13} /> {lang === 'ar' ? 'تواصل معنا' : 'Talk to Us'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
