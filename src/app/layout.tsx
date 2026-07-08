import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '@/contexts/language-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFab } from '@/components/layout/whatsapp-fab';
import { MobileBottomBar } from '@/components/layout/mobile-bottom-bar';

// IBM Plex — engineering-grade, clinical, used by serious B2B brands.
// Pairs Plex Sans (Latin) with Plex Sans Arabic so Arabic renders in a
// matching weight family. Mono is used for REF/code-like text.
const plexSans = IBM_Plex_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});
const plexSansArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-sans-ar',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';
const TITLE_EN = 'MedeqX — Buy & Sell Used Medical Equipment in Saudi Arabia | Riyadh · Jeddah · Dammam';
const TITLE_AR = 'ميديك إكس — شراء وبيع المعدات الطبية المستعملة في السعودية | الرياض · جدة · الدمام';
const DESC_EN = 'MedeqX is Saudi Arabia\'s leading marketplace for used and refurbished medical equipment. Buy and sell second-hand hospital beds, MRI, CT, ultrasound, X-ray, ventilators, dialysis machines, dental chairs, patient monitors, defibrillators and more across Riyadh, Jeddah, Dammam and the GCC. Verified sellers, transparent commission.';
const DESC_AR = 'ميديك إكس هي السوق الإلكتروني الرائد في المملكة العربية السعودية لبيع وشراء المعدات الطبية المستعملة والمجدّدة — أسرّة المستشفيات، أجهزة الرنين المغناطيسي والأشعة المقطعية، الموجات فوق الصوتية، أجهزة التنفس وغسيل الكلى، كراسي الأسنان، أجهزة مراقبة المرضى. خدماتنا تغطي الرياض وجدة والدمام وجميع دول الخليج. بائعون موثّقون وعمولة شفافة.';

export const viewport: Viewport = {
  themeColor: '#0057FF',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE_EN,
    template: '%s | MedeqX',
  },
  description: DESC_EN,
  applicationName: 'MedeqX',
  category: 'business',
  keywords: [
    // English — head terms (broad intent)
    'medical equipment for sale', 'used equipment for sale', 'used medical equipment',
    'sell medical equipment', 'sell used hospital equipment',
    'buy hospital equipment', 'medical equipment marketplace Saudi Arabia',
    'used medical equipment for sale Saudi Arabia',
    'buy second hand medical devices KSA', 'buy used medical equipment Riyadh',
    'sell used medical equipment Jeddah', 'refurbished medical equipment Riyadh',
    'used hospital equipment Saudi', 'second hand medical equipment',
    // City-specific buy/sell phrases
    'used equipment in Riyadh', 'used equipment in Jeddah', 'used equipment in Dammam', 'used equipment in Khobar',
    'buy and sell used equipment Riyadh', 'buy and sell used equipment Jeddah',
    'buy and sell used equipment Dammam', 'buy and sell used equipment Khobar',
    'buy and sell medical devices Saudi Arabia', 'buy and sell medical devices Riyadh',
    'buy and sell medical devices Jeddah', 'buy and sell medical devices Dammam',
    'buy and sell medical devices Khobar',
    // Location-based "near me" + city/country
    'medical equipment near me', 'medical devices near me',
    'medical equipment company near me', 'home healthcare equipment near me',
    'orthopedic supplies near me', 'medical equipment rental near me',
    'medical equipment in Riyadh', 'medical equipment store Dammam',
    'medical supplies Khobar', 'medical equipment Jeddah company',
    'medical device suppliers Medina', 'medical supplies Makkah',
    'medical equipment company Saudi Arabia', 'medical equipment in KSA',
    'medical devices company in Saudi Arabia',
    // Transactional & sales
    'buy medical devices online KSA', 'used medical devices Saudi Arabia',
    'refurbished medical equipment KSA', 'medical supplies online shopping',
    'affordable medical equipment', 'medical equipment price in KSA',
    // B2B / industry
    'medical healthcare supplies', 'hospital equipment suppliers KSA',
    'clinic medical devices Saudi Arabia', 'wholesale medical supplies KSA',
    'medical equipment distributor Saudi', 'certified medical device company',
    'SFDA approved medical equipment',
    // Product-specific
    'wheelchairs for sale KSA', 'portable oxygen concentrator Saudi Arabia',
    'patient beds for home use Dammam', 'blood pressure monitor online KSA',
    // Long-tail informational
    'where to buy medical equipment in Riyadh', 'best medical equipment company in KSA',
    'how to import medical devices to Saudi Arabia',
    // Arabic — new additions from latest batch
    'مستلزمات طبية الرياض', 'شركات اجهزة طبية جدة', 'محل مستلزمات طبية الدمام',
    'اجهزة طبية للبيع', 'مستلزمات طبية رخيصة', 'شركات توريد مستلزمات طبية',
    'اسرة طبية للمرضى', 'كراسي متحركة الرياض',
    // English — modality + city long-tail
    'refurbished MRI machine Saudi', 'sell used MRI machine Riyadh',
    'used X-ray machine for sale Riyadh', 'used ultrasound machine Jeddah',
    'refurbished ultrasound machine price KSA', 'used dental chair for sale Riyadh',
    'used dental X-ray machine', 'second hand hospital beds for sale KSA',
    'cheap used hospital beds Saudi', 'used ICU ventilator for sale',
    'used anesthesia machine Jeddah', 'used dialysis machine Saudi',
    'used dialysis machine for sale KSA', 'buy used defibrillator Saudi Arabia',
    'sell used defibrillator', 'used ECG monitors for sale Saudi',
    'second hand patient monitor Saudi Arabia', 'used oxygen concentrator price Saudi Arabia',
    'used wheelchair for sale Jeddah', 'buy used medical carts Riyadh',
    'second hand surgery lights Riyadh', 'sell old ultrasound machine',
    // Cities (geo)
    'Saudi Arabia', 'KSA', 'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina',
    'Khobar', 'Tabuk', 'GCC', 'UAE', 'Kuwait', 'Qatar', 'Bahrain', 'Oman',
    // Arabic — head terms
    'أجهزة طبية مستعملة للبيع السعودية', 'معدات طبية مستعملة للبيع',
    'شراء معدات طبية مستعملة الرياض', 'بيع معدات طبية مستعملة الرياض',
    'بيع اجهزة طبية مستعملة في السعودية', 'حراج اجهزة طبية مستعملة',
    'سوق المعدات الطبية', 'معدات مستعملة رخيصة الرياض',
    // Arabic — long-tail + cities
    'أجهزة طبية مستعملة الرياض', 'بيع أجهزة طبية مستعملة جده',
    'سعر الاجهزة الطبية المستعملة جدة', 'أسعار معدات طبية مستعملة الرياض',
    'شراء جهاز أشعة مقطعية مستعمل', 'شراء جهاز رنين مغناطيسي مستعمل',
    'شراء معدات الفحص المقطعي مستعملة', 'جهاز سونار مستعمل للبيع جدة',
    'بيع جهاز ألتراساوند مستعمل', 'سرير طبي مستعمل للبيع الرياض',
    'شراء سرير مستشفى مستعمل', 'كراسي اسنان مستعملة للبيع السعودية',
    'تجهيز عيادات اسنان مستعمل', 'كرسي متحرك مستعمل للبيع',
    'جهاز اكسجين مستعمل للبيع', 'جهاز تنفس صناعي مستعمل للبيع',
    'بيع جهاز تنفس مستعمل', 'شراء جهاز غسيل كلى مستعمل',
    'بيع جهاز ECG مستعمل', 'بيع ضوء عمليات مستعمل الرياض',
    'بيع أنظمة مراقبة المرضى مستعملة', 'سماعات طبية مستعملة للبيع',
    'بيع مستلزمات طبية مستعملة', 'أجهزة طبية مستعملة للعيادات السعودية',
    'شراء وحدة عناية مستمرة مستعملة',
  ],
  authors: [{ name: 'MedeqX', url: SITE }],
  creator: 'MedeqX',
  publisher: 'MedeqX',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: SITE,
    languages: { 'en': SITE, 'ar': SITE, 'x-default': SITE },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_SA'],
    url: SITE,
    siteName: 'MedeqX',
    title: TITLE_EN,
    description: DESC_EN,
    images: [{ url: `${SITE}/logo.svg`, width: 1200, height: 630, alt: 'MedeqX — Medical Equipment Marketplace' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE_EN,
    description: DESC_EN,
    images: [`${SITE}/logo.svg`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  verification: { /* add Google Search Console / Bing verification IDs here when available */ },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MedeqX',
  alternateName: 'ميديك إكس',
  url: SITE,
  logo: `${SITE}/logo.svg`,
  email: 'info@medeqx.com',
  description: DESC_EN,
  foundingLocation: { '@type': 'Place', name: 'Saudi Arabia' },
  areaServed: [
    { '@type': 'Country', name: 'Saudi Arabia' },
    { '@type': 'Country', name: 'United Arab Emirates' },
    { '@type': 'Country', name: 'Kuwait' },
    { '@type': 'Country', name: 'Qatar' },
    { '@type': 'Country', name: 'Bahrain' },
    { '@type': 'Country', name: 'Oman' },
  ],
  contactPoint: [{ '@type': 'ContactPoint', email: 'info@medeqx.com', contactType: 'customer service', availableLanguage: ['English', 'Arabic'] }],
  sameAs: [],
};

const siteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MedeqX',
  url: SITE,
  inLanguage: ['en', 'ar'],
  description: DESC_EN,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

// FAQ schema (answer engine optimization — surfaces well in AI Overviews & ChatGPT-style answers)
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where can I buy used medical equipment in Saudi Arabia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MedeqX (medeqx.com) is the leading marketplace to buy used and refurbished medical equipment in Saudi Arabia, with active listings in Riyadh, Jeddah, Dammam, Mecca, Medina, Khobar, and Tabuk. Every listing is reviewed by our team and seller contact details are kept private until you submit an inquiry.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I sell used medical equipment in Saudi Arabia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can sell used medical equipment by creating a free listing on MedeqX. Visit medeqx.com/post-listing, add equipment details and photos, and our team will approve your listing within 24 hours. There is no listing fee — you pay only a 4% commission (minimum SAR 500) when the equipment sells.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of used medical equipment can I find on MedeqX?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MedeqX lists used and refurbished MRI scanners, CT scanners, ultrasound machines, X-ray equipment, ventilators, ICU monitors, defibrillators, ECG monitors, dialysis machines, dental chairs and X-ray, hospital beds, wheelchairs, oxygen concentrators, anesthesia machines, surgery lights, autoclaves, lab analyzers and centrifuges, and other clinical equipment across seven categories.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is MedeqX?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MedeqX is a B2B marketplace where hospitals, clinics, and medical suppliers in Saudi Arabia and the GCC can buy and sell new, refurbished, and used medical equipment. Every listing is reviewed by our team before going live.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does MedeqX charge?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MedeqX charges a 4% commission on confirmed sale value (minimum SAR 500). The fee is collected only after a successful transaction; posting a listing and receiving inquiries is free.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which countries does MedeqX serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MedeqX serves the GCC region: Saudi Arabia (Riyadh, Jeddah, Dammam, Mecca, Medina, Khobar, Tabuk and other cities), United Arab Emirates (Dubai, Abu Dhabi), Kuwait, Qatar, Bahrain, and Oman.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does listing approval take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Listings are typically reviewed and approved within 24 hours. Sellers receive an email confirmation with their listing reference number once approved.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are seller contact details kept private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Contact details remain private until a buyer submits an inquiry. We then forward verified buyer details directly to the seller.',
      },
    },
    // Arabic Q&A — boosts ranking for Arabic AI Overviews + organic results
    {
      '@type': 'Question',
      name: 'أين أشتري معدات طبية مستعملة في السعودية؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MedeqX (medeqx.com) هو السوق الإلكتروني الرائد لشراء وبيع المعدات الطبية المستعملة والمجدّدة في المملكة العربية السعودية، مع قوائم نشطة في الرياض وجدة والدمام ومكة والمدينة والخبر وتبوك. جميع القوائم مراجَعة من قِبل فريقنا قبل النشر، وتُحفَظ بيانات البائع بسرية حتى يقدِّم المشتري استفساراً.',
      },
    },
    {
      '@type': 'Question',
      name: 'كيف أبيع جهازي الطبي المستعمل في السعودية؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'يمكنك بيع المعدات الطبية المستعملة عبر إنشاء قائمة مجانية على MedeqX. ادخل إلى medeqx.com/post-listing وأضف تفاصيل المعدة وصورها، وسيقوم فريقنا بالموافقة خلال 24 ساعة. لا توجد رسوم نشر — تدفع فقط عمولة 4% (بحد أدنى 500 ريال) عند إتمام البيع.',
      },
    },
    {
      '@type': 'Question',
      name: 'ما هي أنواع المعدات الطبية المستعملة المتوفّرة على MedeqX؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'يضم MedeqX قوائم لأجهزة الرنين المغناطيسي (MRI) والأشعة المقطعية (CT) والموجات فوق الصوتية (السونار) والأشعة السينية، أجهزة التنفس الاصطناعي ومراقبة المرضى وأجهزة ECG، أجهزة غسيل الكلى والتخدير، كراسي وأشعة الأسنان، أسرّة المستشفيات والكراسي المتحرّكة، مكثّفات الأكسجين، أضواء العمليات وأجهزة التعقيم، ومعدات المختبرات والقطع والملحقات.',
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexSansArabic.variable} ${plexMono.variable} h-full antialiased`}>
      <head>
        <link rel="alternate" hrefLang="en" href={SITE} />
        <link rel="alternate" hrefLang="ar" href={SITE} />
        <link rel="alternate" hrefLang="x-default" href={SITE} />
        <Script id="org-schema" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <Script id="site-schema" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
        <Script id="faq-schema" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-R93PK735R7" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-R93PK735R7');`}
        </Script>
        {/* Bilingual title fallback for crawlers that don't process metadata */}
        <meta property="og:title:ar" content={TITLE_AR} />
        <meta property="og:description:ar" content={DESC_AR} />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Navbar />
          <div className="flex-1 pb-16 sm:pb-0">{children}</div>
          <Footer />
          <WhatsAppFab />
          <MobileBottomBar />
        </LanguageProvider>
      </body>
    </html>
  );
}
