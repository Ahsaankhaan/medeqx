'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Upload, X, Loader2, CheckCircle2, Camera } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { listingSchema, type ListingInput } from '@/lib/validations';
import { CATEGORIES, LOCATIONS } from '@/lib/categories';
import { EXTRA_SERVICES } from '@/lib/services';
import { EmailTrustNote } from '@/components/ui/email-trust-note';
import { Recaptcha, RECAPTCHA_ENABLED } from '@/components/ui/recaptcha';

const CONDITIONS = [
  { value: 'new', labelEn: 'New', labelAr: 'جديد', color: '#10B981' },
  { value: 'refurbished', labelEn: 'Refurbished', labelAr: 'مجدد', color: '#0057FF' },
  { value: 'used', labelEn: 'Used', labelAr: 'مستعمل', color: '#F59E0B' },
  { value: 'parts', labelEn: 'For Parts / Defective', labelAr: 'للقطع / معيب', color: '#EF4444' },
];

const PAYMENT_OPTIONS = [
  { value: 'bank_transfer', labelEn: 'Bank Transfer', labelAr: 'تحويل بنكي' },
  { value: 'cash', labelEn: 'Cash', labelAr: 'نقدي' },
  { value: 'installment', labelEn: 'Installment', labelAr: 'بالتقسيط' },
  { value: 'negotiable', labelEn: 'Negotiable', labelAr: 'قابل للتفاوض' },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-slate-600 mb-1.5">{children}</label>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function inputCls(hasError?: boolean) {
  return `w-full rounded-xl border ${hasError ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-2.5 text-sm text-[#0D1B3E] outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/10 transition-all`;
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX_W = 1200, MAX_H = 900;
      let { width, height } = img;
      if (width > MAX_W) { height = Math.round(height * MAX_W / width); width = MAX_W; }
      if (height > MAX_H) { width = Math.round(width * MAX_H / height); height = MAX_H; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };
    img.src = url;
  });
}

export function PostListingClient() {
  const { t, lang } = useLanguage();
  const [images, setImages] = useState<string[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [success, setSuccess] = useState<{ ref: string } | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      name: '', category: '', manufacturer: '', model: '', serial: '', year: '',
      condition: 'used', warranty: 'none', listingType: 'for_sale',
      price: '', payment: '', location: '', description: '', specs: '',
      sellerName: '', sellerEmail: '', sellerPhone: '', sellerCompany: '',
      images: '[]', services: '[]',
    },
  });

  const condition = watch('condition');
  const listingType = watch('listingType');

  const handleImages = async (files: FileList | null) => {
    if (!files || images.length >= 6) return;
    setCompressing(true);
    const slots = Math.min(files.length, 6 - images.length);
    const compressed: string[] = [];
    for (let i = 0; i < slots; i++) {
      compressed.push(await compressImage(files[i]));
    }
    const next = [...images, ...compressed];
    setImages(next);
    setValue('images', JSON.stringify(next));
    setCompressing(false);
  };

  const removeImage = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    setImages(next);
    setValue('images', JSON.stringify(next));
  };

  const onSubmit = async (data: ListingInput) => {
    setSubmitError('');
    if (!consentChecked) { setConsentError(true); return; }
    setConsentError(false);
    if (RECAPTCHA_ENABLED && !captchaToken) {
      setSubmitError('Please complete the CAPTCHA before submitting.');
      return;
    }
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        images: JSON.stringify(images),
        services: JSON.stringify(selectedServices),
        recaptchaToken: captchaToken,
      }),
    });
    const json = await res.json();
    if (res.ok && json.ref) {
      setSuccess({ ref: json.ref });
    } else {
      setSubmitError(json.error || 'Submission failed. Please try again.');
    }
  };

  if (success) {
    return (
      <main className="bg-[#F8FAFF] min-h-screen pt-20 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-white border border-slate-200 shadow-sm p-12 text-center max-w-md w-full">
          <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-[#0D1B3E] mb-2">Listing Submitted!</h2>
          <p className="text-slate-500 mb-4">Your equipment has been submitted for review. You will be notified once approved.</p>
          <div className="rounded-xl bg-blue-50 px-6 py-3 inline-block">
            <span className="text-xs text-slate-500 block mb-1">Reference Number</span>
            <span className="text-xl font-bold text-[#0057FF]">{success.ref}</span>
          </div>
          <div className="mt-6 flex gap-3 justify-center">
            <a href="/post-listing" className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:border-blue-200 transition-colors">Post Another</a>
            <a href="/" className="rounded-xl bg-[#0057FF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a6aff] transition-colors">Back to Home</a>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="bg-[#F8FAFF] min-h-screen pt-20">
      <section className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-2">List Equipment</p>
          <h1 className="text-3xl font-extrabold text-[#0D1B3E] mb-1">{t.post.title}</h1>
          <p className="text-slate-500 mb-8 text-sm">{t.post.subtitle}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

            {/* Listing Type */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#0D1B3E] mb-4">Listing Type</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'for_sale', labelEn: 'For Sale', labelAr: 'للبيع' },
                  { value: 'wanted', labelEn: 'Wanted / Looking to Buy', labelAr: 'مطلوب / أبحث عن شراء' },
                ].map((opt) => (
                  <button key={opt.value} type="button"
                    onClick={() => setValue('listingType', opt.value as 'for_sale' | 'wanted')}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all text-left ${listingType === opt.value ? 'border-[#0057FF] bg-blue-50 text-[#0057FF]' : 'border-slate-200 text-slate-600 hover:border-blue-200'}`}>
                    {lang === 'ar' ? opt.labelAr : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#0D1B3E] mb-5">Equipment Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FieldLabel>{t.post.fields.name}</FieldLabel>
                  <input {...register('name')} placeholder="e.g. Siemens SOMATOM Definition AS CT Scanner"
                    className={inputCls(!!errors.name)} />
                  <FieldError message={errors.name?.message} />
                </div>

                <div>
                  <FieldLabel>{t.post.fields.category}</FieldLabel>
                  <select {...register('category')} className={inputCls(!!errors.category)}>
                    <option value="">Select category…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{lang === 'ar' ? c.nameAr : c.nameEn}</option>
                    ))}
                  </select>
                  <FieldError message={errors.category?.message} />
                </div>

                <div>
                  <FieldLabel>{t.post.fields.manufacturer}</FieldLabel>
                  <input {...register('manufacturer')} placeholder="e.g. Siemens, GE, Philips"
                    className={inputCls(!!errors.manufacturer)} />
                  <FieldError message={errors.manufacturer?.message} />
                </div>

                <div>
                  <FieldLabel>Model Number</FieldLabel>
                  <input {...register('model')} placeholder="e.g. SOMATOM Definition AS+" className={inputCls()} />
                </div>

                <div>
                  <FieldLabel>Serial Number</FieldLabel>
                  <input {...register('serial')} placeholder="Optional" className={inputCls()} />
                </div>

                <div>
                  <FieldLabel>Production Year</FieldLabel>
                  <input {...register('year')} placeholder="e.g. 2019" className={inputCls()} />
                </div>

                <div>
                  <FieldLabel>Location</FieldLabel>
                  <select {...register('location')} className={inputCls(!!errors.location)}>
                    <option value="">Select location…</option>
                    {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <FieldError message={errors.location?.message} />
                </div>
              </div>
            </div>

            {/* Condition */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#0D1B3E] mb-4">Operating Condition</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CONDITIONS.map((c) => (
                  <button key={c.value} type="button"
                    onClick={() => setValue('condition', c.value as ListingInput['condition'])}
                    className={`rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-all ${condition === c.value ? 'border-transparent text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    style={condition === c.value ? { background: c.color, borderColor: c.color } : {}}>
                    {lang === 'ar' ? c.labelAr : c.labelEn}
                  </button>
                ))}
              </div>
              <FieldError message={errors.condition?.message} />

              <div className="mt-4">
                <FieldLabel>Warranty Status</FieldLabel>
                <select {...register('warranty')} className={inputCls()}>
                  <option value="none">No Warranty</option>
                  <option value="active">Active Warranty</option>
                  <option value="expired">Expired Warranty</option>
                  <option value="extendable">Extendable Warranty Available</option>
                </select>
              </div>
            </div>

            {/* Pricing */}
            {listingType === 'for_sale' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-bold text-[#0D1B3E] mb-5">Pricing</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Asking Price (SAR)</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">SAR</span>
                      <input {...register('price')} placeholder="Leave blank for &quot;By Inquiry&quot;"
                        className={`${inputCls()} pl-12`} />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Payment Method</FieldLabel>
                    <select {...register('payment')} className={inputCls()}>
                      <option value="">Any / Not specified</option>
                      {PAYMENT_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>{lang === 'ar' ? p.labelAr : p.labelEn}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Description & Specs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#0D1B3E] mb-5">Description</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>Equipment Description</FieldLabel>
                  <textarea {...register('description')} rows={4}
                    placeholder="Describe the equipment, its history, reason for selling, and any relevant information…"
                    className={`${inputCls(!!errors.description)} resize-none`} />
                  <FieldError message={errors.description?.message} />
                </div>
                <div>
                  <FieldLabel>Technical Specifications</FieldLabel>
                  <textarea {...register('specs')} rows={3}
                    placeholder="List key technical specs, parameters, and included accessories…"
                    className={`${inputCls()} resize-none`} />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#0D1B3E] mb-1">Images</h2>
              <p className="text-xs text-slate-400 mb-4">Up to 6 photos. Automatically compressed to under 1MB each.</p>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                {images.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}
                {images.length < 6 && (
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:border-[#0057FF] hover:bg-blue-50 transition-all">
                    {compressing ? <Loader2 size={18} className="animate-spin text-slate-400" /> : <Camera size={18} className="text-slate-400" />}
                    <span className="text-[10px] text-slate-400">Add</span>
                  </button>
                )}
              </div>

              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => handleImages(e.target.files)} />

              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm text-slate-500 hover:border-[#0057FF] hover:text-[#0057FF] transition-all">
                <Upload size={14} /> Upload Photos
              </button>
            </div>

            {/* Seller Info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#0D1B3E] mb-5">Your Contact Details</h2>
              <p className="text-xs text-slate-400 mb-4 -mt-2">Your contact information is kept private. Buyers will inquire via MedeqX and we will forward their details to you.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Your Name</FieldLabel>
                  <input {...register('sellerName')} placeholder="Full name"
                    className={inputCls(!!errors.sellerName)} />
                  <FieldError message={errors.sellerName?.message} />
                </div>
                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <input {...register('sellerEmail')} type="email" placeholder="you@hospital.com"
                    className={inputCls(!!errors.sellerEmail)} />
                  <FieldError message={errors.sellerEmail?.message} />
                </div>
                <div>
                  <FieldLabel>Phone / WhatsApp</FieldLabel>
                  <input {...register('sellerPhone')} placeholder="+966 5X XXX XXXX" className={inputCls()} />
                </div>
                <div>
                  <FieldLabel>Hospital / Company Name</FieldLabel>
                  <input {...register('sellerCompany')} placeholder="Optional" className={inputCls()} />
                </div>
              </div>
            </div>

            {/* Extra Services — only relevant for "Wanted / Looking to Buy" listings */}
            {listingType === 'wanted' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-bold text-[#0D1B3E] mb-1">
                  {lang === 'ar' ? 'خدمات إضافية مطلوبة' : 'Additional Services Needed'}
                  <span className="text-slate-400 font-normal text-xs ml-2">{lang === 'ar' ? '(اختياري)' : '(Optional)'}</span>
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  {lang === 'ar' ? 'حدد أي خدمات إضافية تحتاجها مع المعدة.' : 'Select any services you need along with the equipment you are looking to buy.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EXTRA_SERVICES.map((svc) => {
                    const checked = selectedServices.includes(svc.id);
                    return (
                      <label key={svc.id}
                        className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all ${checked ? 'border-[#0057FF] bg-blue-50' : 'border-slate-200 hover:border-blue-200'}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleService(svc.id)}
                          className="mt-0.5 accent-[#0057FF]"
                        />
                        <div>
                          <p className={`text-sm font-semibold ${checked ? 'text-[#0057FF]' : 'text-slate-700'}`}>
                            {lang === 'ar' ? svc.labelAr : svc.labelEn}
                          </p>
                          <p className="text-xs text-slate-400">{lang === 'ar' ? (svc.descAr || svc.desc) : svc.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Commission Notice */}
            <div className="rounded-2xl bg-blue-50 border border-blue-100 px-6 py-4 text-sm text-slate-600">
              <strong className="text-[#0057FF]">Commission:</strong> MedeqX charges 4% of the confirmed sale value (minimum SAR 500), collected only after a successful transaction.
            </div>

            {/* Consent */}
            <div className={`rounded-2xl border-2 p-5 ${consentError ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => { setConsentChecked(e.target.checked); if (e.target.checked) setConsentError(false); }}
                  className="mt-1 h-4 w-4 accent-[#0057FF] shrink-0"
                />
                <p className="text-xs text-slate-600 leading-relaxed">
                  I confirm that: <strong className="text-slate-800">I am authorized to sell this equipment</strong> · All information and photos are accurate · I will mark this listing as Sold immediately once the equipment is sold · I agree to pay MedeqX a <strong className="text-slate-800">4% commission (min SAR 500)</strong> upon a successful sale · I have read and agree to the{' '}
                  <a href="/terms" target="_blank" className="text-[#0057FF] underline font-semibold">Terms &amp; Conditions</a>.
                </p>
              </label>
              {consentError && <p className="mt-2 text-xs text-red-500 font-medium">You must confirm the above before submitting.</p>}
            </div>

            <Recaptcha onChange={setCaptchaToken} />

            {submitError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{submitError}</div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#0057FF] py-3.5 text-sm font-bold text-white hover:bg-[#1a6aff] disabled:opacity-60 transition-colors shadow-sm">
              {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : t.post.submit}
            </button>

            <EmailTrustNote />
          </form>
        </motion.div>
      </section>
    </main>
  );
}
