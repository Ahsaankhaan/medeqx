'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import Script from 'next/script';

const FAQ_ITEMS = [
  {
    q: 'Who can list equipment on MedeqX?',
    a: 'Any hospital, clinic, medical facility, or supplier operating in Saudi Arabia or the GCC can list equipment. We serve both public and private sector healthcare institutions.',
    qAr: 'من يمكنه إدراج المعدات على MedeqX؟',
    aAr: 'يمكن لأي مستشفى أو عيادة أو منشأة طبية أو مورد يعمل في المملكة العربية السعودية أو دول مجلس التعاون الخليجي إدراج المعدات.',
    group: 'sellers',
  },
  {
    q: 'Is my contact information shared publicly?',
    a: 'No. Your phone number, email address, and hospital name are kept completely private. Buyer inquiries are forwarded by MedeqX, and seller contact details are only revealed after a confirmed match.',
    qAr: 'هل يتم مشاركة معلومات الاتصال الخاصة بي علنًا؟',
    aAr: 'لا. يتم الحفاظ على رقم هاتفك وبريدك الإلكتروني واسم مستشفاك بشكل خاص تمامًا.',
    group: 'sellers',
  },
  {
    q: 'How is the commission calculated?',
    a: 'MedeqX charges 4% of the confirmed sale value, with a minimum fee of SAR 500. The commission is only collected after a successful, confirmed sale — not on listing or inquiry.',
    qAr: 'كيف يتم احتساب العمولة؟',
    aAr: 'تفرض MedeqX عمولة بنسبة 4% من قيمة البيع المؤكدة، بحد أدنى 500 ريال سعودي.',
    group: 'sellers',
  },
  {
    q: 'Can I list equipment in poor or defective condition?',
    a: 'Yes. MedeqX supports all four condition classifications: New, Refurbished, Used, and For Parts / Defective. Each appears with clearly labeled condition badges on the marketplace.',
    qAr: 'هل يمكنني إدراج معدات في حالة سيئة أو معيبة؟',
    aAr: 'نعم. يدعم MedeqX جميع تصنيفات الحالة الأربعة: جديد، مجدد، مستعمل، وللقطع / معيب.',
    group: 'sellers',
  },
  {
    q: 'How do I contact a seller?',
    a: 'Click "Inquire" on any listing and fill out the inquiry form. MedeqX will forward your details to the seller, who will contact you directly. Your inquiry is tracked by a unique reference number.',
    qAr: 'كيف يمكنني التواصل مع البائع؟',
    aAr: 'انقر على "استفسر" في أي قائمة واملأ نموذج الاستفسار. ستقوم MedeqX بإعادة توجيه تفاصيلك إلى البائع.',
    group: 'buyers',
  },
  {
    q: 'Are listings verified or inspected?',
    a: 'Each listing is reviewed by the MedeqX team before going live. We verify the legitimacy of the listing information. Physical inspection is the responsibility of the buyer and seller.',
    qAr: 'هل يتم التحقق من القوائم أو فحصها؟',
    aAr: 'تتم مراجعة كل قائمة من قبل فريق MedeqX قبل النشر.',
    group: 'buyers',
  },
  {
    q: 'Can I request equipment I am looking to buy?',
    a: 'Yes. Use the "Wanted" listing type when posting. Your request will appear in the marketplace and sellers with matching equipment can respond.',
    qAr: 'هل يمكنني طلب معدة أبحث عن شرائها؟',
    aAr: 'نعم. استخدم نوع القائمة "مطلوب" عند النشر.',
    group: 'buyers',
  },
  {
    q: 'What countries does MedeqX serve?',
    a: 'MedeqX primarily serves Saudi Arabia but covers all GCC countries: UAE, Kuwait, Qatar, Bahrain, and Oman. Listings are visible to verified buyers across the region.',
    qAr: 'ما الدول التي تخدمها MedeqX؟',
    aAr: 'تخدم MedeqX المملكة العربية السعودية بشكل أساسي وتغطي جميع دول مجلس التعاون الخليجي.',
    group: 'buyers',
  },
  {
    q: 'What is a reference number?',
    a: 'Every listing and inquiry on MedeqX receives a unique reference number (e.g., REF-1042). Use this number to track your listing status, communicate with the MedeqX team, or resolve any disputes.',
    qAr: 'ما هو رقم المرجع؟',
    aAr: 'تتلقى كل قائمة واستفسار على MedeqX رقم مرجعي فريدًا.',
    group: 'platform',
  },
  {
    q: 'Is there a minimum or maximum listing price?',
    a: 'There is no minimum or maximum price requirement. You may also list without a price and mark it as "By Inquiry" — common for large equipment lots or negotiable items.',
    qAr: 'هل هناك حد أدنى أو أقصى لسعر القائمة؟',
    aAr: 'لا يوجد حد أدنى أو أقصى للسعر.',
    group: 'platform',
  },
];

const GROUPS = [
  { id: 'sellers', labelEn: 'For Sellers', labelAr: 'للبائعين' },
  { id: 'buyers', labelEn: 'For Buyers', labelAr: 'للمشترين' },
  { id: 'platform', labelEn: 'Platform & Process', labelAr: 'المنصة والعملية' },
];

function FaqItem({ q, a, qAr, aAr }: { q: string; a: string; qAr: string; aAr: string }) {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left gap-4">
        <span className="font-semibold text-[#0D1B3E] text-[15px]">{lang === 'ar' ? qAr : q}</span>
        <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="pb-5 text-[14px] text-slate-500 leading-relaxed">{lang === 'ar' ? aAr : a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqClient() {
  const { t, lang } = useLanguage();
  const [activeGroup, setActiveGroup] = useState('sellers');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="bg-[#F8FAFF] min-h-screen pt-20">
        <section className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-2">Support</p>
            <h1 className="text-4xl font-extrabold text-[#0D1B3E] mb-3">{t.faq.title}</h1>
            <p className="text-slate-500">{t.faq.subtitle}</p>
          </div>

          {/* Group tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {GROUPS.map((g) => (
              <button key={g.id} onClick={() => setActiveGroup(g.id)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${activeGroup === g.id ? 'bg-[#0057FF] text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-200'}`}>
                {lang === 'ar' ? g.labelAr : g.labelEn}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {FAQ_ITEMS.filter((f) => f.group === activeGroup).map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-[#0057FF] p-6 text-white flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-blue-200" />
              <div>
                <p className="font-bold">Still have questions?</p>
                <p className="text-blue-200 text-sm">Contact our team at info@medeqx.com</p>
              </div>
            </div>
            <a href="mailto:info@medeqx.com"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0057FF] hover:bg-blue-50 transition-colors">
              Email Us
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
