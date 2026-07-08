import { CITIES, getCityBySlug } from './cities';
import { MANUFACTURERS, getManufacturerBySlug } from './manufacturers';

/**
 * Programmatic SEO landing-page system.
 *
 * URL patterns supported (all at root, e.g. /used-mri-machine-riyadh):
 *
 *   • /used-medical-equipment-{city}              → city general
 *   • /medical-equipment-marketplace-{city}        → city general (alt phrasing)
 *   • /used-{equipment}-{city}                    → equipment-in-city
 *   • /used-{equipment}-saudi-arabia              → equipment-in-country
 *   • /{brand}-medical-equipment-saudi            → brand-in-country
 *   • /{brand}-{equipment}-used                   → brand-equipment
 *   • /{brand}-{equipment}-saudi                  → brand-equipment-in-country
 *
 * Each generated page renders with:
 *   - Unique keyword-rich title + meta description (canonical = this URL)
 *   - Filtered listings matching the parsed dimensions
 *   - BreadcrumbList + (when applicable) ItemList schema
 *   - Internal links back to category / brand / city hubs
 */

export type SeoPageKind =
  | 'city'
  | 'equipment-city'
  | 'equipment-country'
  | 'brand-country'
  | 'brand-equipment'
  | 'price-equipment-country'
  | 'price-equipment-city';

export interface SeoPage {
  slug: string;
  kind: SeoPageKind;
  city?: { slug: string; nameEn: string; nameAr: string; searchTerm: string };
  brand?: { slug: string; name: string; aliases: string[]; nameAr: string };
  equipment?: { slug: string; nameEn: string; nameAr: string; keywords: string[]; categorySlug?: string };
}

/** Equipment-type keywords used both in URL slugs and to filter listings. */
export const EQUIPMENT_TYPES = [
  { slug: 'mri-machine',          nameEn: 'MRI Machine',          nameAr: 'جهاز رنين مغناطيسي',  keywords: ['MRI', 'magnetic resonance'],          categorySlug: 'diagnostic-imaging' },
  { slug: 'ct-scanner',           nameEn: 'CT Scanner',           nameAr: 'جهاز أشعة مقطعية',     keywords: ['CT', 'computed tomography', 'scanner'], categorySlug: 'diagnostic-imaging' },
  { slug: 'ultrasound-machine',   nameEn: 'Ultrasound Machine',   nameAr: 'جهاز سونار',            keywords: ['ultrasound', 'sonography'],            categorySlug: 'diagnostic-imaging' },
  { slug: 'xray-machine',         nameEn: 'X-Ray Machine',        nameAr: 'جهاز أشعة سينية',       keywords: ['X-ray', 'xray', 'radiography'],         categorySlug: 'diagnostic-imaging' },
  { slug: 'hospital-bed',         nameEn: 'Hospital Bed',         nameAr: 'سرير مستشفى',           keywords: ['hospital bed', 'icu bed', 'patient bed'] },
  { slug: 'dental-chair',         nameEn: 'Dental Chair',         nameAr: 'كرسي أسنان',             keywords: ['dental chair', 'dental unit', 'dental equipment'] },
  { slug: 'icu-ventilator',       nameEn: 'ICU Ventilator',       nameAr: 'جهاز تنفس صناعي',       keywords: ['ventilator', 'respirator', 'ICU vent'],  categorySlug: 'patient-monitoring' },
  { slug: 'dialysis-machine',     nameEn: 'Dialysis Machine',     nameAr: 'جهاز غسيل كلى',         keywords: ['dialysis', 'hemodialysis'] },
  { slug: 'patient-monitor',      nameEn: 'Patient Monitor',      nameAr: 'جهاز مراقبة المريض',    keywords: ['patient monitor', 'monitor', 'vital signs'], categorySlug: 'patient-monitoring' },
  { slug: 'defibrillator',        nameEn: 'Defibrillator',        nameAr: 'جهاز صدمات كهربائية',   keywords: ['defibrillator', 'AED'],                  categorySlug: 'patient-monitoring' },
  { slug: 'ecg-monitor',          nameEn: 'ECG Monitor',          nameAr: 'جهاز ECG',                keywords: ['ECG', 'EKG', 'electrocardiogram'],       categorySlug: 'patient-monitoring' },
  { slug: 'oxygen-concentrator',  nameEn: 'Oxygen Concentrator',  nameAr: 'مكثّف أكسجين',           keywords: ['oxygen concentrator', 'oxygen'] },
  { slug: 'anesthesia-machine',   nameEn: 'Anesthesia Machine',   nameAr: 'جهاز تخدير',             keywords: ['anesthesia', 'anaesthesia'],             categorySlug: 'surgical-equipment' },
  { slug: 'autoclave',            nameEn: 'Autoclave',            nameAr: 'جهاز تعقيم',             keywords: ['autoclave', 'sterilizer', 'CSSD'],       categorySlug: 'sterilization' },
  { slug: 'cssd-equipment',       nameEn: 'CSSD Equipment',       nameAr: 'معدات التعقيم المركزي',  keywords: ['CSSD', 'sterilization', 'autoclave'],   categorySlug: 'sterilization' },
  { slug: 'icu-equipment',        nameEn: 'ICU Equipment',        nameAr: 'معدات العناية المركزة',  keywords: ['ICU', 'intensive care'],                  categorySlug: 'patient-monitoring' },
  { slug: 'dental-equipment',     nameEn: 'Dental Equipment',     nameAr: 'معدات الأسنان',          keywords: ['dental'] },
  { slug: 'lab-equipment',        nameEn: 'Lab Equipment',        nameAr: 'معدات المختبرات',        keywords: ['laboratory', 'analyzer', 'centrifuge'], categorySlug: 'laboratory-equipment' },
  { slug: 'medical-equipment',    nameEn: 'Medical Equipment',    nameAr: 'المعدات الطبية',         keywords: [] /* matches all */ },
];

export const EQUIPMENT_TYPE_SLUGS = EQUIPMENT_TYPES.map((e) => e.slug);

export function getEquipmentTypeBySlug(slug: string) {
  return EQUIPMENT_TYPES.find((e) => e.slug === slug);
}

// ──────────────────────────────────────────────────────────
// Slug parser — given a URL slug, return the SeoPage or null
// ──────────────────────────────────────────────────────────
export function parseSlug(slug: string): SeoPage | null {
  const s = slug.toLowerCase().trim();

  // 0a. used-{equipment}-price-saudi-arabia → equipment-country, price-focused
  {
    const m = s.match(/^used-(.+)-price-saudi-arabia$/);
    if (m) {
      const eq = getEquipmentTypeBySlug(m[1]);
      if (eq) return { slug: s, kind: 'price-equipment-country', equipment: eq };
    }
  }

  // 0b. used-{equipment}-price-{city} → equipment-city, price-focused
  for (const eq of EQUIPMENT_TYPES) {
    const prefix = `used-${eq.slug}-price-`;
    if (s.startsWith(prefix)) {
      const citySlug = s.slice(prefix.length);
      const city = getCityBySlug(citySlug);
      if (city) return { slug: s, kind: 'price-equipment-city', equipment: eq, city };
    }
  }

  // 0c. {equipment}-price-saudi-arabia  (without "used-" prefix, captures direct searches)
  {
    const m = s.match(/^(.+)-price-saudi-arabia$/);
    if (m) {
      const eq = getEquipmentTypeBySlug(m[1]);
      if (eq) return { slug: s, kind: 'price-equipment-country', equipment: eq };
    }
  }

  // 0d. {equipment}-price-{city}
  for (const eq of EQUIPMENT_TYPES) {
    const prefix = `${eq.slug}-price-`;
    if (s.startsWith(prefix)) {
      const citySlug = s.slice(prefix.length);
      const city = getCityBySlug(citySlug);
      if (city) return { slug: s, kind: 'price-equipment-city', equipment: eq, city };
    }
  }

  // 1. used-medical-equipment-{city}
  let m = s.match(/^used-medical-equipment-(.+)$/);
  if (m) {
    const city = getCityBySlug(m[1]);
    if (city) return { slug: s, kind: 'city', city };
  }

  // 1b. buy-sell-medical-equipment-{city}  /  buy-and-sell-medical-equipment-{city}
  m = s.match(/^buy-(?:and-)?sell-medical-equipment-(.+)$/);
  if (m) {
    const city = getCityBySlug(m[1]);
    if (city) return { slug: s, kind: 'city', city };
  }

  // 1c. buy-and-sell-medical-devices-{city}
  m = s.match(/^buy-(?:and-)?sell-medical-devices-(.+)$/);
  if (m) {
    const city = getCityBySlug(m[1]);
    if (city) return { slug: s, kind: 'city', city };
  }

  // 1d. used-equipment-{city}  (shorter generic variant)
  m = s.match(/^used-equipment-(.+)$/);
  if (m) {
    const city = getCityBySlug(m[1]);
    if (city) return { slug: s, kind: 'city', city };
  }

  // 1e. sell-used-hospital-equipment-saudi-arabia  /  buy-used-hospital-equipment-saudi-arabia
  if (s === 'sell-used-hospital-equipment-saudi-arabia' || s === 'buy-used-hospital-equipment-saudi-arabia') {
    const eq = getEquipmentTypeBySlug('medical-equipment')!;
    return { slug: s, kind: 'equipment-country', equipment: eq };
  }

  // 2. medical-equipment-marketplace-{city}
  m = s.match(/^medical-equipment-marketplace-(.+)$/);
  if (m) {
    const city = getCityBySlug(m[1]);
    if (city) return { slug: s, kind: 'city', city };
  }

  // 3. used-{equipment}-saudi-arabia  (must check before equipment-city since "saudi-arabia" looks like a city)
  m = s.match(/^used-(.+)-saudi-arabia$/);
  if (m) {
    const eq = getEquipmentTypeBySlug(m[1]);
    if (eq) return { slug: s, kind: 'equipment-country', equipment: eq };
  }

  // 4. used-{equipment}-{city}
  m = s.match(/^used-(.+)-([^-]+)$/);
  if (m) {
    // Try to match the longest possible equipment slug, with the rest as city
    for (const eq of EQUIPMENT_TYPES) {
      const prefix = `used-${eq.slug}-`;
      if (s.startsWith(prefix)) {
        const citySlug = s.slice(prefix.length);
        const city = getCityBySlug(citySlug);
        if (city) return { slug: s, kind: 'equipment-city', equipment: eq, city };
      }
    }
  }

  // 5. {brand}-medical-equipment-saudi
  m = s.match(/^(.+)-medical-equipment-saudi$/);
  if (m) {
    const brand = getManufacturerBySlug(m[1]);
    if (brand) return { slug: s, kind: 'brand-country', brand };
  }

  // 6. {brand}-{equipment}-used  OR  {brand}-{equipment}-saudi
  for (const brand of MANUFACTURERS) {
    for (const eq of EQUIPMENT_TYPES) {
      if (s === `${brand.slug}-${eq.slug}-used` || s === `${brand.slug}-${eq.slug}-saudi`) {
        return { slug: s, kind: 'brand-equipment', brand, equipment: eq };
      }
    }
  }

  return null;
}

// ──────────────────────────────────────────────────────────
// generateStaticParams — every URL we expose
// ──────────────────────────────────────────────────────────
export function generateAllSeoSlugs(): string[] {
  const slugs: string[] = [];

  // Top cities × general
  for (const c of CITIES) {
    slugs.push(`used-medical-equipment-${c.slug}`);
    slugs.push(`medical-equipment-marketplace-${c.slug}`);
    slugs.push(`buy-and-sell-medical-equipment-${c.slug}`);
    slugs.push(`buy-and-sell-medical-devices-${c.slug}`);
    slugs.push(`used-equipment-${c.slug}`);
  }
  // Special direct-intent country pages
  slugs.push('sell-used-hospital-equipment-saudi-arabia');
  slugs.push('buy-used-hospital-equipment-saudi-arabia');

  // Equipment × Saudi Arabia
  for (const eq of EQUIPMENT_TYPES) {
    slugs.push(`used-${eq.slug}-saudi-arabia`);
  }

  // Equipment × top 6 KSA cities (combinatorial — keep tight)
  const topCities = CITIES.filter((c) => ['riyadh', 'jeddah', 'dammam', 'mecca', 'medina', 'khobar'].includes(c.slug));
  for (const eq of EQUIPMENT_TYPES) {
    for (const c of topCities) {
      slugs.push(`used-${eq.slug}-${c.slug}`);
    }
  }

  // Brand × Saudi Arabia
  for (const b of MANUFACTURERS) {
    slugs.push(`${b.slug}-medical-equipment-saudi`);
  }

  // PRICE pages — high-intent buyer queries ("how much does an MRI cost in Riyadh")
  // Equipment × price × Saudi Arabia
  for (const eq of EQUIPMENT_TYPES) {
    slugs.push(`used-${eq.slug}-price-saudi-arabia`);
    slugs.push(`${eq.slug}-price-saudi-arabia`);
  }
  // Equipment × price × top KSA cities
  for (const eq of EQUIPMENT_TYPES) {
    for (const c of topCities) {
      slugs.push(`used-${eq.slug}-price-${c.slug}`);
    }
  }

  // Brand × top equipment (only meaningful pairings)
  const brandEqPairs: { brand: string; equipment: string }[] = [
    { brand: 'philips-healthcare',     equipment: 'patient-monitor' },
    { brand: 'philips-healthcare',     equipment: 'mri-machine' },
    { brand: 'philips-healthcare',     equipment: 'ct-scanner' },
    { brand: 'philips-healthcare',     equipment: 'defibrillator' },
    { brand: 'ge-healthcare',          equipment: 'mri-machine' },
    { brand: 'ge-healthcare',          equipment: 'ct-scanner' },
    { brand: 'ge-healthcare',          equipment: 'ultrasound-machine' },
    { brand: 'siemens-healthineers',   equipment: 'ct-scanner' },
    { brand: 'siemens-healthineers',   equipment: 'mri-machine' },
    { brand: 'siemens-healthineers',   equipment: 'xray-machine' },
    { brand: 'mindray',                equipment: 'patient-monitor' },
    { brand: 'mindray',                equipment: 'ultrasound-machine' },
    { brand: 'mindray',                equipment: 'icu-ventilator' },
    { brand: 'drager',                 equipment: 'anesthesia-machine' },
    { brand: 'drager',                 equipment: 'icu-ventilator' },
    { brand: 'medtronic',              equipment: 'defibrillator' },
    { brand: 'medtronic',              equipment: 'icu-ventilator' },
    { brand: 'stryker',                equipment: 'hospital-bed' },
    { brand: 'fresenius',              equipment: 'dialysis-machine' },
  ];
  for (const p of brandEqPairs) {
    slugs.push(`${p.brand}-${p.equipment}-used`);
    slugs.push(`${p.brand}-${p.equipment}-saudi`);
  }

  return Array.from(new Set(slugs));
}

/** Build a Prisma `where` clause for a parsed SEO page. */
export function buildWhereForSeoPage(p: SeoPage): Record<string, unknown> {
  const where: Record<string, unknown> = { status: { in: ['approved', 'sold'] } };
  const ANDs: Record<string, unknown>[] = [];

  if (p.city) ANDs.push({ location: { contains: p.city.searchTerm } });

  if (p.brand) {
    ANDs.push({ OR: p.brand.aliases.map((a) => ({ manufacturer: { contains: a } })) });
  }

  if (p.equipment && p.equipment.keywords.length > 0) {
    // Match equipment keyword in name OR description OR category
    const equipmentOr: Record<string, unknown>[] = [];
    for (const kw of p.equipment.keywords) {
      equipmentOr.push({ name: { contains: kw } });
      equipmentOr.push({ description: { contains: kw } });
    }
    if (p.equipment.categorySlug) equipmentOr.push({ category: p.equipment.categorySlug });
    ANDs.push({ OR: equipmentOr });
  }

  if (ANDs.length > 0) where.AND = ANDs;
  return where;
}

/** Minimal listing shape needed to test whether a page has matching inventory. */
export interface SeoMatchListing {
  category: string;
  location: string | null;
  manufacturer: string | null;
  name: string;
  description: string | null;
}

/**
 * In-memory equivalent of `buildWhereForSeoPage` — true when a listing matches
 * the page's city/brand/equipment dimensions. Used to gate empty programmatic
 * pages out of the sitemap (status filtering is handled by the caller's query).
 */
export function listingMatchesSeoPage(l: SeoMatchListing, p: SeoPage): boolean {
  if (p.city) {
    if (!(l.location ?? '').toLowerCase().includes(p.city.searchTerm.toLowerCase())) return false;
  }
  if (p.brand) {
    const mfr = (l.manufacturer ?? '').toLowerCase();
    if (!p.brand.aliases.some((a) => mfr.includes(a.toLowerCase()))) return false;
  }
  if (p.equipment && p.equipment.keywords.length > 0) {
    const name = (l.name ?? '').toLowerCase();
    const desc = (l.description ?? '').toLowerCase();
    const kwOk = p.equipment.keywords.some((kw) => name.includes(kw.toLowerCase()) || desc.includes(kw.toLowerCase()));
    const catOk = p.equipment.categorySlug ? l.category === p.equipment.categorySlug : false;
    if (!kwOk && !catOk) return false;
  }
  return true;
}

/** Title + description copy for a parsed page. */
export function seoCopyFor(p: SeoPage, lang: 'en' | 'ar' = 'en') {
  const eq = p.equipment;
  const city = p.city;
  const brand = p.brand;

  if (p.kind === 'city' && city) {
    return lang === 'ar' ? {
      h1: `بيع وشراء المعدات الطبية المستعملة في ${city.nameAr}`,
      title: `معدات طبية مستعملة في ${city.nameAr} | MedeqX`,
      description: `تصفّح المعدات الطبية المستعملة والمجدّدة المعروضة للبيع في ${city.nameAr}، السعودية. أجهزة الرنين، السونار، أسرّة المستشفيات، كراسي الأسنان، أجهزة التنفس وغيرها. عمولة 4% فقط عند البيع.`,
    } : {
      h1: `Used Medical Equipment in ${city.nameEn}`,
      title: `Used Medical Equipment for Sale in ${city.nameEn} — MedeqX`,
      description: `Browse used and refurbished medical equipment for sale in ${city.nameEn}, Saudi Arabia. MRI, CT, ultrasound, X-ray, hospital beds, dental chairs, ventilators and more from verified sellers. 4% commission only on sale.`,
    };
  }

  if (p.kind === 'equipment-city' && eq && city) {
    return lang === 'ar' ? {
      h1: `${eq.nameAr} مستعمل للبيع في ${city.nameAr}`,
      title: `${eq.nameAr} مستعمل في ${city.nameAr} | MedeqX`,
      description: `اشترِ ${eq.nameAr} مستعمل أو مجدّد في ${city.nameAr}، السعودية. قوائم موثّقة من المستشفيات والعيادات. خصوصية تامة، عمولة 4% عند البيع فقط.`,
    } : {
      h1: `Used ${eq.nameEn} for Sale in ${city.nameEn}`,
      title: `Used ${eq.nameEn} in ${city.nameEn}, Saudi Arabia — MedeqX`,
      description: `Buy used and refurbished ${eq.nameEn} in ${city.nameEn}, Saudi Arabia. Verified listings from hospitals and clinics. Full privacy, 4% commission only on successful sale.`,
    };
  }

  if (p.kind === 'equipment-country' && eq) {
    return lang === 'ar' ? {
      h1: `${eq.nameAr} مستعمل للبيع في السعودية`,
      title: `${eq.nameAr} مستعمل في السعودية | MedeqX`,
      description: `سوق ${eq.nameAr} المستعمل والمجدّد في المملكة العربية السعودية. قوائم نشطة في الرياض، جدة، الدمام والمدن الرئيسية.`,
    } : {
      h1: `Used ${eq.nameEn} for Sale in Saudi Arabia`,
      title: `Used ${eq.nameEn} for Sale in Saudi Arabia — MedeqX`,
      description: `Saudi Arabia's marketplace for used and refurbished ${eq.nameEn}. Active listings across Riyadh, Jeddah, Dammam and other major cities. Verified sellers, transparent pricing.`,
    };
  }

  if (p.kind === 'brand-country' && brand) {
    return lang === 'ar' ? {
      h1: `معدات ${brand.nameAr} المستعملة في السعودية`,
      title: `معدات ${brand.nameAr} الطبية المستعملة في السعودية | MedeqX`,
      description: `اشترِ معدات ${brand.nameAr} الطبية المستعملة والمجدّدة في المملكة العربية السعودية. قوائم موثّقة.`,
    } : {
      h1: `${brand.name} Used Medical Equipment in Saudi Arabia`,
      title: `${brand.name} Used Medical Equipment in Saudi Arabia — MedeqX`,
      description: `Buy verified used and refurbished ${brand.name} medical equipment across Saudi Arabia. Hospital and clinic sellers in Riyadh, Jeddah, Dammam and the GCC.`,
    };
  }

  if (p.kind === 'price-equipment-country' && eq) {
    return lang === 'ar' ? {
      h1: `سعر ${eq.nameAr} المستعمل في السعودية`,
      title: `سعر ${eq.nameAr} مستعمل في السعودية 2026 | MedeqX`,
      description: `أسعار ${eq.nameAr} المستعمل والمجدّد في المملكة العربية السعودية. نطاقات الأسعار، عوامل التقييم، ومعدّلات الإهلاك. دليل تسعير 2026 من MedeqX.`,
    } : {
      h1: `Used ${eq.nameEn} Price in Saudi Arabia`,
      title: `Used ${eq.nameEn} Price in Saudi Arabia 2026 — MedeqX`,
      description: `Used and refurbished ${eq.nameEn} price ranges in Saudi Arabia. Market benchmarks, depreciation factors, and active listings. MedeqX 2026 pricing guide.`,
    };
  }

  if (p.kind === 'price-equipment-city' && eq && city) {
    return lang === 'ar' ? {
      h1: `سعر ${eq.nameAr} المستعمل في ${city.nameAr}`,
      title: `سعر ${eq.nameAr} مستعمل في ${city.nameAr} | MedeqX`,
      description: `أسعار ${eq.nameAr} المستعمل في ${city.nameAr}. نطاقات الأسعار وقوائم نشطة من بائعين موثّقين.`,
    } : {
      h1: `Used ${eq.nameEn} Price in ${city.nameEn}`,
      title: `Used ${eq.nameEn} Price in ${city.nameEn}, Saudi Arabia — MedeqX`,
      description: `Current asking prices for used and refurbished ${eq.nameEn} in ${city.nameEn}, Saudi Arabia. Compare active listings from verified sellers.`,
    };
  }

  if (p.kind === 'brand-equipment' && brand && eq) {
    return lang === 'ar' ? {
      h1: `${brand.nameAr} ${eq.nameAr} مستعمل`,
      title: `${brand.nameAr} ${eq.nameAr} مستعمل في السعودية | MedeqX`,
      description: `اشترِ ${brand.nameAr} ${eq.nameAr} مستعمل أو مجدّد. قوائم موثّقة في المملكة العربية السعودية.`,
    } : {
      h1: `Used ${brand.name} ${eq.nameEn} for Sale`,
      title: `Used ${brand.name} ${eq.nameEn} in Saudi Arabia — MedeqX`,
      description: `Buy used and refurbished ${brand.name} ${eq.nameEn}. Verified listings across Saudi Arabia and the GCC. Free to post, 4% commission only on confirmed sale.`,
    };
  }

  return {
    h1: 'Medical Equipment Marketplace',
    title: 'MedeqX — Medical Equipment Marketplace',
    description: 'Buy and sell medical equipment in Saudi Arabia and the GCC.',
  };
}

/** SEO keywords array for metadata. */
export function seoKeywordsFor(p: SeoPage): string[] {
  const kw: string[] = ['medical equipment marketplace', 'used medical equipment Saudi Arabia'];
  if (p.equipment) {
    kw.push(`used ${p.equipment.nameEn}`, `refurbished ${p.equipment.nameEn}`, `${p.equipment.nameEn} for sale`);
    kw.push(`${p.equipment.nameAr} مستعمل`, `${p.equipment.nameAr} للبيع`);
  }
  if (p.city) {
    kw.push(`medical equipment ${p.city.nameEn}`, `used medical equipment ${p.city.nameEn}`);
    kw.push(`معدات طبية ${p.city.nameAr}`, `معدات مستعملة ${p.city.nameAr}`);
    if (p.equipment) {
      kw.push(`used ${p.equipment.nameEn} ${p.city.nameEn}`, `${p.equipment.nameEn} ${p.city.nameEn}`);
    }
  }
  if (p.brand) {
    kw.push(`used ${p.brand.name}`, `${p.brand.name} for sale`, `${p.brand.name} Saudi Arabia`, `${p.brand.name} GCC`);
    kw.push(`${p.brand.nameAr} مستعمل`);
    if (p.equipment) {
      kw.push(`used ${p.brand.name} ${p.equipment.nameEn}`, `${p.brand.name} ${p.equipment.nameEn} for sale`);
    }
  }
  // Price-specific keywords — high commercial intent
  if (p.kind === 'price-equipment-country' && p.equipment) {
    kw.push(
      `${p.equipment.nameEn} price Saudi Arabia`, `used ${p.equipment.nameEn} price KSA`,
      `${p.equipment.nameEn} cost`, `how much does a used ${p.equipment.nameEn} cost`,
      `${p.equipment.nameEn} SAR price`, `refurbished ${p.equipment.nameEn} price`,
      `سعر ${p.equipment.nameAr}`, `أسعار ${p.equipment.nameAr} مستعمل`,
    );
  }
  if (p.kind === 'price-equipment-city' && p.equipment && p.city) {
    kw.push(
      `${p.equipment.nameEn} price ${p.city.nameEn}`, `used ${p.equipment.nameEn} cost ${p.city.nameEn}`,
      `سعر ${p.equipment.nameAr} في ${p.city.nameAr}`,
    );
  }
  return Array.from(new Set(kw));
}
