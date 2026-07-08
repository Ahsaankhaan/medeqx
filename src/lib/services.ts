export interface ExtraService {
  id: string;
  labelEn: string;
  labelAr: string;
  desc: string;
  descAr?: string;
}

export const EXTRA_SERVICES: ExtraService[] = [
  { id: 'dismantling',  labelEn: 'Equipment Dismantling',           labelAr: 'فك وتركيب المعدات',     desc: 'Professional removal from current site',           descAr: 'إزالة احترافية من الموقع الحالي' },
  { id: 'packaging',    labelEn: 'Professional Packaging',          labelAr: 'التعبئة والتغليف',     desc: 'Custom crating and protective packaging',          descAr: 'تعبئة مخصصة وتغليف واقي' },
  { id: 'transport',    labelEn: 'Transportation / Delivery',       labelAr: 'النقل والتوصيل',       desc: 'Logistics within KSA & GCC',                       descAr: 'الخدمات اللوجستية داخل المملكة ودول الخليج' },
  { id: 'installation', labelEn: 'Installation & Commissioning',    labelAr: 'التركيب والتشغيل',     desc: "Professional setup at buyer's site",               descAr: 'إعداد احترافي في موقع المشتري' },
  { id: 'training',     labelEn: 'Operator Training',               labelAr: 'تدريب المشغلين',       desc: 'On-site equipment operation training',             descAr: 'تدريب على تشغيل المعدة في الموقع' },
  { id: 'amc',          labelEn: 'Service Contract / AMC',          labelAr: 'عقد صيانة سنوي',       desc: 'Annual maintenance contract available',            descAr: 'عقد صيانة سنوي متاح' },
  { id: 'inspection',   labelEn: 'Technical Inspection Report',     labelAr: 'تقرير الفحص الفني',    desc: 'Independent condition assessment certificate',     descAr: 'شهادة تقييم مستقلة لحالة المعدة' },
];

export function getServiceLabel(id: string, lang: 'en' | 'ar' = 'en'): string {
  const s = EXTRA_SERVICES.find((x) => x.id === id);
  if (!s) return id;
  return lang === 'ar' ? s.labelAr : s.labelEn;
}
