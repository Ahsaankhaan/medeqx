export interface Manufacturer {
  slug: string;       // url-safe, e.g. "ge-healthcare"
  name: string;       // canonical display name
  aliases: string[];  // alternate spellings users might search/list
  nameAr: string;
  description: string;
  descriptionAr: string;
  modalities: string[]; // primary product categories they're known for
}

/**
 * Major medical-equipment OEMs commonly traded across the GCC.
 * Aliases let our DB search match listings even if the seller spelled the
 * brand slightly differently (e.g. "GE" vs "GE Healthcare" vs "General Electric").
 */
export const MANUFACTURERS: Manufacturer[] = [
  {
    slug: 'ge-healthcare', name: 'GE Healthcare', nameAr: 'جي إي للرعاية الصحية',
    aliases: ['GE', 'GE Healthcare', 'General Electric', 'GE Medical'],
    description: 'GE Healthcare manufactures CT scanners, MRI systems, ultrasound, patient monitors, and surgical equipment used in hospitals worldwide.',
    descriptionAr: 'جي إي للرعاية الصحية شركة رائدة في تصنيع أجهزة الأشعة المقطعية والرنين المغناطيسي والموجات فوق الصوتية وأجهزة مراقبة المرضى والمعدات الجراحية.',
    modalities: ['MRI', 'CT', 'Ultrasound', 'Patient Monitoring', 'ECG', 'Anesthesia'],
  },
  {
    slug: 'philips-healthcare', name: 'Philips Healthcare', nameAr: 'فيليبس للرعاية الصحية',
    aliases: ['Philips', 'Philips Healthcare', 'Philips Medical'],
    description: 'Philips Healthcare specializes in diagnostic imaging, patient monitoring (IntelliVue, MX series), ultrasound, and ICU equipment.',
    descriptionAr: 'فيليبس للرعاية الصحية متخصصة في التصوير التشخيصي وأجهزة مراقبة المرضى (IntelliVue, MX) والموجات فوق الصوتية ومعدات العناية المركزة.',
    modalities: ['MRI', 'CT', 'Ultrasound', 'Patient Monitoring', 'Defibrillators', 'ICU'],
  },
  {
    slug: 'siemens-healthineers', name: 'Siemens Healthineers', nameAr: 'سيمنز هيلثنيرز',
    aliases: ['Siemens', 'Siemens Healthineers', 'Siemens Medical'],
    description: 'Siemens Healthineers is a global leader in MRI scanners, CT systems, mammography, angiography, and laboratory diagnostics.',
    descriptionAr: 'سيمنز هيلثنيرز شركة عالمية رائدة في أجهزة الرنين المغناطيسي والأشعة المقطعية وأنظمة التصوير الإشعاعي وتشخيصات المختبرات.',
    modalities: ['MRI', 'CT', 'X-Ray', 'Mammography', 'Angiography', 'Lab Diagnostics'],
  },
  {
    slug: 'mindray', name: 'Mindray', nameAr: 'مينداري',
    aliases: ['Mindray', 'Shenzhen Mindray'],
    description: 'Mindray provides patient monitors, ultrasound systems, anesthesia machines, ventilators, and in-vitro diagnostic equipment popular in GCC hospitals.',
    descriptionAr: 'مينداري توفر أجهزة مراقبة المرضى والموجات فوق الصوتية وأجهزة التخدير والتنفس الاصطناعي وتشخيصات المختبرات، شائعة في مستشفيات دول الخليج.',
    modalities: ['Patient Monitoring', 'Ultrasound', 'Anesthesia', 'Ventilators', 'IVD'],
  },
  {
    slug: 'drager', name: 'Drager', nameAr: 'دريجر',
    aliases: ['Drager', 'Dräger', 'Draeger'],
    description: 'Dräger is renowned for anesthesia machines, ICU ventilators, neonatal incubators, and patient monitoring solutions.',
    descriptionAr: 'دريجر مشهورة بأجهزة التخدير وأجهزة التنفس للعناية المركزة وحاضنات الأطفال حديثي الولادة وحلول مراقبة المرضى.',
    modalities: ['Anesthesia', 'Ventilators', 'Neonatal Incubators', 'Patient Monitoring'],
  },
  {
    slug: 'medtronic', name: 'Medtronic', nameAr: 'ميدترونيك',
    aliases: ['Medtronic'],
    description: 'Medtronic produces cardiovascular devices, ventilators (Puritan Bennett), defibrillators, and surgical technologies for hospitals across the Middle East.',
    descriptionAr: 'ميدترونيك تنتج أجهزة القلب والأوعية الدموية وأجهزة التنفس (Puritan Bennett) وأجهزة الصدمات الكهربائية وتقنيات الجراحة لمستشفيات الشرق الأوسط.',
    modalities: ['Ventilators', 'Defibrillators', 'Surgical', 'Cardiology'],
  },
  {
    slug: 'stryker', name: 'Stryker', nameAr: 'سترايكر',
    aliases: ['Stryker'],
    description: 'Stryker manufactures hospital beds, surgical tables, endoscopy, orthopedic implants, and emergency equipment.',
    descriptionAr: 'سترايكر تصنع أسرّة المستشفيات وطاولات العمليات والمناظير الجراحية والأطراف الصناعية ومعدات الطوارئ.',
    modalities: ['Hospital Beds', 'Surgical', 'Endoscopy', 'Orthopedic'],
  },
  {
    slug: 'fresenius', name: 'Fresenius Medical Care', nameAr: 'فريزينيوس للرعاية الطبية',
    aliases: ['Fresenius', 'Fresenius Medical Care', 'Fresenius Kabi'],
    description: 'Fresenius is the global leader in dialysis machines, hemodialysis, and renal care equipment.',
    descriptionAr: 'فريزينيوس هي الرائد العالمي في أجهزة غسيل الكلى ومعدات رعاية الكلى.',
    modalities: ['Dialysis', 'Renal Care', 'Infusion Pumps'],
  },
  {
    slug: 'olympus', name: 'Olympus Medical', nameAr: 'أوليمبوس الطبية',
    aliases: ['Olympus', 'Olympus Medical'],
    description: 'Olympus Medical leads in endoscopy, GI scopes, surgical visualization, and microscopy used in clinics and hospitals.',
    descriptionAr: 'أوليمبوس الطبية رائدة في أجهزة التنظير الداخلي والمناظير الجراحية والمجاهر.',
    modalities: ['Endoscopy', 'GI Scopes', 'Microscopy', 'Surgical Visualization'],
  },
  {
    slug: 'roche', name: 'Roche Diagnostics', nameAr: 'روش للتشخيصات',
    aliases: ['Roche', 'Roche Diagnostics'],
    description: 'Roche Diagnostics produces laboratory analyzers, point-of-care testing, and in-vitro diagnostic instruments.',
    descriptionAr: 'روش للتشخيصات تنتج أجهزة تحليل المختبرات وفحوصات نقطة الرعاية وتشخيصات IVD.',
    modalities: ['Lab Analyzers', 'Point-of-Care', 'IVD'],
  },
  {
    slug: 'abbott', name: 'Abbott', nameAr: 'أبوت',
    aliases: ['Abbott', 'Abbott Diagnostics'],
    description: 'Abbott manufactures laboratory diagnostics, cardiovascular devices, and point-of-care testing equipment.',
    descriptionAr: 'أبوت تصنع تشخيصات المختبرات وأجهزة القلب والأوعية الدموية ومعدات الاختبار في موقع الرعاية.',
    modalities: ['Lab Diagnostics', 'Cardiology', 'Point-of-Care'],
  },
  {
    slug: 'mortara-instrument', name: 'Mortara Instrument', nameAr: 'مورتارا',
    aliases: ['Mortara', 'Mortara Instrument', 'Welch Allyn'],
    description: 'Mortara (now part of Hillrom/Baxter) is recognized for ECG monitors, Holter recorders, and cardiology diagnostics.',
    descriptionAr: 'مورتارا (جزء من Hillrom/Baxter) معروفة بأجهزة تخطيط القلب وأجهزة Holter وتشخيصات القلب.',
    modalities: ['ECG', 'Cardiology Diagnostics', 'Patient Monitoring'],
  },
];

export const MANUFACTURER_SLUGS = MANUFACTURERS.map((m) => m.slug);

export function getManufacturerBySlug(slug: string): Manufacturer | undefined {
  return MANUFACTURERS.find((m) => m.slug === slug.toLowerCase());
}

/** Build a Prisma `OR` clause matching any of the manufacturer's aliases (case-insensitive). */
export function manufacturerAliasFilter(m: Manufacturer) {
  return {
    OR: m.aliases.map((alias) => ({ manufacturer: { contains: alias } })),
  };
}
