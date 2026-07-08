export interface Category {
  slug: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  icon: string;
  color: string;
  colorLight: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: 'diagnostic-imaging',
    nameEn: 'Diagnostic Imaging',
    nameAr: 'التصوير التشخيصي',
    descEn: 'MRI, CT scanners, X-Ray, Ultrasound, PET systems',
    descAr: 'التصوير بالرنين المغناطيسي، الأشعة المقطعية، الأشعة السينية، الموجات الفوق صوتية',
    icon: 'scan',
    color: '#0057FF',
    colorLight: '#EEF3FF',
  },
  {
    slug: 'patient-monitoring',
    nameEn: 'Patient Monitoring',
    nameAr: 'مراقبة المريض',
    descEn: 'Vital signs monitors, ECG, pulse oximeters, ventilators',
    descAr: 'أجهزة مراقبة العلامات الحيوية، رسم القلب، أجهزة التنفس الاصطناعي',
    icon: 'activity',
    color: '#10B981',
    colorLight: '#ECFDF5',
  },
  {
    slug: 'surgical-equipment',
    nameEn: 'Surgical / Treatment Equipment',
    nameAr: 'المعدات الجراحية',
    descEn: 'Operating tables, surgical lights, laparoscopy, cauterization',
    descAr: 'طاولات العمليات، المناظير الجراحية، أجهزة الكي',
    icon: 'scissors',
    color: '#8B5CF6',
    colorLight: '#F5F3FF',
  },
  {
    slug: 'laboratory-equipment',
    nameEn: 'Laboratory Equipment',
    nameAr: 'معدات المختبر',
    descEn: 'Analyzers, centrifuges, microscopes, PCR systems',
    descAr: 'أجهزة التحليل، أجهزة الطرد المركزي، المجاهر، أنظمة PCR',
    icon: 'flask-conical',
    color: '#F59E0B',
    colorLight: '#FFFBEB',
  },
  {
    slug: 'sterilization',
    nameEn: 'Sterilization',
    nameAr: 'التعقيم',
    descEn: 'Autoclaves, UV sterilizers, washer-disinfectors',
    descAr: 'أجهزة التعقيم بالبخار، أجهزة الأشعة فوق البنفسجية، غسالات التعقيم',
    icon: 'shield-check',
    color: '#06B6D4',
    colorLight: '#ECFEFF',
  },
  {
    slug: 'rehabilitation',
    nameEn: 'Rehabilitation',
    nameAr: 'إعادة التأهيل',
    descEn: 'Physiotherapy, electrotherapy, hydrotherapy equipment',
    descAr: 'أجهزة العلاج الطبيعي، العلاج الكهربائي، العلاج المائي',
    icon: 'heart-pulse',
    color: '#EC4899',
    colorLight: '#FDF2F8',
  },
  {
    slug: 'parts-accessories',
    nameEn: 'Parts & Accessories',
    nameAr: 'القطع والملحقات',
    descEn: 'Spare parts, consumables, accessories for all medical equipment',
    descAr: 'قطع الغيار، المستهلكات، الملحقات لجميع المعدات الطبية',
    icon: 'settings',
    color: '#64748B',
    colorLight: '#F8FAFC',
  },
  {
    slug: 'others',
    nameEn: 'Others',
    nameAr: 'أخرى',
    descEn: 'Other medical equipment not listed in the above categories',
    descAr: 'معدات طبية أخرى غير مدرجة في الفئات أعلاه',
    icon: 'more-horizontal',
    color: '#6B7280',
    colorLight: '#F9FAFB',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export const LOCATIONS = [
  'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina',
  'Khobar', 'Tabuk', 'Abha', 'Hofuf', 'Najran',
  'Dubai', 'Abu Dhabi', 'Kuwait City', 'Doha', 'Manama', 'Muscat',
];
