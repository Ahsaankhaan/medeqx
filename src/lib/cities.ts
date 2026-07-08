export interface City {
  slug: string;        // URL-safe ASCII slug, e.g. "riyadh"
  nameEn: string;
  nameAr: string;
  country: string;     // EN country name for breadcrumbs / schema
  countryAr: string;
  searchTerm: string;  // the term used to filter listings (matches Listing.location)
}

export const CITIES: City[] = [
  // Saudi Arabia (KSA) — highest-priority cities for SEO
  { slug: 'riyadh',      nameEn: 'Riyadh',      nameAr: 'الرياض',     country: 'Saudi Arabia', countryAr: 'المملكة العربية السعودية', searchTerm: 'Riyadh' },
  { slug: 'jeddah',      nameEn: 'Jeddah',      nameAr: 'جدة',        country: 'Saudi Arabia', countryAr: 'المملكة العربية السعودية', searchTerm: 'Jeddah' },
  { slug: 'dammam',      nameEn: 'Dammam',      nameAr: 'الدمام',     country: 'Saudi Arabia', countryAr: 'المملكة العربية السعودية', searchTerm: 'Dammam' },
  { slug: 'mecca',       nameEn: 'Mecca',       nameAr: 'مكة المكرمة', country: 'Saudi Arabia', countryAr: 'المملكة العربية السعودية', searchTerm: 'Mecca' },
  { slug: 'medina',      nameEn: 'Medina',      nameAr: 'المدينة',    country: 'Saudi Arabia', countryAr: 'المملكة العربية السعودية', searchTerm: 'Medina' },
  { slug: 'khobar',      nameEn: 'Khobar',      nameAr: 'الخبر',      country: 'Saudi Arabia', countryAr: 'المملكة العربية السعودية', searchTerm: 'Khobar' },
  { slug: 'tabuk',       nameEn: 'Tabuk',       nameAr: 'تبوك',       country: 'Saudi Arabia', countryAr: 'المملكة العربية السعودية', searchTerm: 'Tabuk' },
  { slug: 'abha',        nameEn: 'Abha',        nameAr: 'أبها',       country: 'Saudi Arabia', countryAr: 'المملكة العربية السعودية', searchTerm: 'Abha' },
  { slug: 'hofuf',       nameEn: 'Hofuf',       nameAr: 'الهفوف',     country: 'Saudi Arabia', countryAr: 'المملكة العربية السعودية', searchTerm: 'Hofuf' },
  { slug: 'najran',      nameEn: 'Najran',      nameAr: 'نجران',      country: 'Saudi Arabia', countryAr: 'المملكة العربية السعودية', searchTerm: 'Najran' },
  // Other GCC
  { slug: 'dubai',       nameEn: 'Dubai',       nameAr: 'دبي',        country: 'UAE',          countryAr: 'الإمارات',                  searchTerm: 'Dubai' },
  { slug: 'abu-dhabi',   nameEn: 'Abu Dhabi',   nameAr: 'أبو ظبي',    country: 'UAE',          countryAr: 'الإمارات',                  searchTerm: 'Abu Dhabi' },
  { slug: 'kuwait-city', nameEn: 'Kuwait City', nameAr: 'مدينة الكويت', country: 'Kuwait',     countryAr: 'الكويت',                    searchTerm: 'Kuwait City' },
  { slug: 'doha',        nameEn: 'Doha',        nameAr: 'الدوحة',     country: 'Qatar',        countryAr: 'قطر',                       searchTerm: 'Doha' },
  { slug: 'manama',      nameEn: 'Manama',      nameAr: 'المنامة',    country: 'Bahrain',      countryAr: 'البحرين',                   searchTerm: 'Manama' },
  { slug: 'muscat',      nameEn: 'Muscat',      nameAr: 'مسقط',       country: 'Oman',         countryAr: 'عُمان',                     searchTerm: 'Muscat' },
];

export const CITY_SLUGS = CITIES.map((c) => c.slug);

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug.toLowerCase());
}
