'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

const EQUIPMENT_LINKS = [
  { href: '/used-mri-machine-saudi-arabia',          en: 'MRI Scanners',           ar: 'أجهزة الرنين المغناطيسي' },
  { href: '/used-ct-scanner-saudi-arabia',           en: 'CT Scanners',            ar: 'أجهزة الأشعة المقطعية' },
  { href: '/used-ultrasound-machine-saudi-arabia',   en: 'Ultrasound Machines',    ar: 'أجهزة الموجات فوق الصوتية' },
  { href: '/used-icu-equipment-saudi-arabia',        en: 'ICU Equipment',          ar: 'معدات العناية المركزة' },
  { href: '/used-dental-equipment-saudi-arabia',     en: 'Dental Equipment',       ar: 'معدات الأسنان' },
  { href: '/used-cssd-equipment-saudi-arabia',       en: 'CSSD / Sterilization',   ar: 'التعقيم المركزي' },
  { href: '/categories',                              en: 'All Categories',         ar: 'كل الفئات' },
];

const LOCATION_LINKS = [
  { href: '/used-medical-equipment-riyadh', en: 'Riyadh',  ar: 'الرياض' },
  { href: '/used-medical-equipment-jeddah', en: 'Jeddah',  ar: 'جدة' },
  { href: '/used-medical-equipment-dammam', en: 'Dammam',  ar: 'الدمام' },
  { href: '/used-medical-equipment-medina', en: 'Medina',  ar: 'المدينة' },
  { href: '/used-medical-equipment-mecca',  en: 'Mecca',   ar: 'مكة' },
  { href: '/used-medical-equipment-tabuk',  en: 'Tabuk',   ar: 'تبوك' },
];

const COMPANY_LINKS = [
  { href: '/about',        en: 'About MedeqX',         ar: 'عن MedeqX' },
  { href: '/contact',      en: 'Contact Us',           ar: 'تواصل معنا' },
  { href: '/verification', en: 'Verification Process', ar: 'عملية التحقق' },
  { href: '/privacy',      en: 'Privacy Policy',       ar: 'سياسة الخصوصية' },
  { href: '/terms',        en: 'Terms of Service',     ar: 'الشروط والأحكام' },
];

const RESOURCE_LINKS = [
  { href: '/guides/buying',     en: "Buyer's Guide",          ar: 'دليل المشتري' },
  { href: '/guides/selling',    en: "Seller's Guide",         ar: 'دليل البائع' },
  { href: '/guides/pricing',    en: 'Pricing Guide',          ar: 'دليل الأسعار' },
  { href: '/faq',               en: 'FAQ',                    ar: 'الأسئلة الشائعة' },
  { href: '/manufacturers',     en: 'Browse by Brand',        ar: 'تصفح حسب الشركة' },
];

export function Footer() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const Column = ({ title, links }: { title: string; links: { href: string; en: string; ar: string }[] }) => (
    <div>
      <p className="text-[11px] font-bold tracking-widest text-[#00D4FF] uppercase mb-4">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
              {lang === 'ar' ? l.ar : l.en}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-[#0A1530] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Top brand + columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-10">
          {/* Brand col — spans 2 on tablet+ */}
          <div className="col-span-2 md:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.svg" alt="MedeqX" className="h-11 w-auto mb-4" />
            <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-xs">
              {lang === 'ar'
                ? 'منصة موثوقة لتداول المعدات الطبية المستعملة والمجدّدة في المملكة العربية السعودية ودول الخليج.'
                : 'The trusted B2B marketplace for used and refurbished medical equipment across Saudi Arabia and the GCC.'}
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <a href="mailto:info@medeqx.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={12} /> info@medeqx.com
              </a>
              <a href="tel:+966505565761" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={12} /> +966 50 556 5761
              </a>
              <a href="https://wa.me/966505565761" target="_blank" rel="noopener"
                className="flex items-center gap-2 hover:text-[#25D366] transition-colors">
                <MessageCircle size={12} /> WhatsApp +966 50 556 5761
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={12} /> {lang === 'ar' ? 'الدمام، المملكة العربية السعودية' : 'Dammam, Saudi Arabia'}
              </div>
            </div>
          </div>

          <Column title={lang === 'ar' ? 'فئات المعدات' : 'Equipment Categories'} links={EQUIPMENT_LINKS} />
          <Column title={lang === 'ar' ? 'المواقع' : 'Locations'}                links={LOCATION_LINKS} />
          <Column title={lang === 'ar' ? 'الشركة' : 'Company'}                    links={COMPANY_LINKS} />
          <Column title={lang === 'ar' ? 'الموارد' : 'Resources'}                 links={RESOURCE_LINKS} />
        </div>

        {/* Bottom strip — centred copyright + email */}
        <div className="border-t border-white/10 pt-6 flex flex-col items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <p>© {new Date().getFullYear()} MedeqX. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          <a href="mailto:info@medeqx.com" className="text-slate-400 hover:text-white transition-colors">
            info@medeqx.com
          </a>
        </div>
      </div>
    </footer>
  );
}
