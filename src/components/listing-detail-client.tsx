'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera, Send, CheckCircle2, Loader2, MapPin, Tag, Calendar, Building2, Wrench, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-context';
import { inquirySchema, type InquiryInput } from '@/lib/validations';
import { getCategoryBySlug } from '@/lib/categories';
import { EXTRA_SERVICES } from '@/lib/services';
import { EmailTrustNote } from '@/components/ui/email-trust-note';
import { ShareButton } from '@/components/ui/share-button';
import { Recaptcha, RECAPTCHA_ENABLED } from '@/components/ui/recaptcha';
import type { Listing, ListingCondition } from '@/types';

function inputCls(hasError?: boolean) {
  return `w-full rounded-xl border ${hasError ? 'border-red-400' : 'border-slate-200'} bg-slate-50 px-4 py-2.5 text-sm text-[#0D1B3E] outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/10 transition-all`;
}

function MetaRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-[#0057FF]" />
      </div>
      <div>
        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-sm text-[#0D1B3E] font-medium">{value}</p>
      </div>
    </div>
  );
}

export function ListingDetailClient({ listing }: { listing: Listing }) {
  const { t, lang } = useLanguage();
  const [imgIdx, setImgIdx] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const isSold = listing.status === 'sold';

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const images: string[] = (() => {
    try { return JSON.parse(listing.images as unknown as string) as string[]; } catch { return []; }
  })();

  const category = getCategoryBySlug(listing.category);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { listingId: listing.id, buyerName: '', buyerEmail: '', buyerPhone: '', buyerCompany: '', message: '' },
  });

  const onInquiry = async (data: InquiryInput) => {
    if (RECAPTCHA_ENABLED && !captchaToken) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);
    await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, services: JSON.stringify(selectedServices), recaptchaToken: captchaToken }),
    });
    setInquirySent(true);
    setSelectedServices([]);
    setCaptchaToken(null);
    reset();
  };

  const priceDisplay = listing.price
    ? `SAR ${(listing.price as number).toLocaleString()}`
    : 'By Inquiry';

  return (
    <main className="bg-[#F8FAFF] min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-[#0057FF]">{t.nav.home}</Link>
          <ChevronRight size={13} />
          {category && <Link href={`/categories/${category.slug}`} className="hover:text-[#0057FF]">{lang === 'ar' ? category.nameAr : category.nameEn}</Link>}
          {category && <ChevronRight size={13} />}
          <span className="text-[#0D1B3E] font-medium truncate max-w-[200px]">{listing.name}</span>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left col: images + details */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Image viewer */}
          <div className={`rounded-2xl overflow-hidden bg-slate-100 aspect-video relative ${isSold ? 'opacity-90' : ''}`}>
            {isSold && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 pointer-events-none">
                <span className="rounded-xl bg-slate-700 px-6 py-3 text-lg font-extrabold uppercase tracking-widest text-white shadow-xl">
                  {lang === 'ar' ? 'مباع' : 'Sold'}
                </span>
              </div>
            )}
            {images.length > 0 ? (
              <>
                <img src={images[imgIdx]} alt={listing.name}
                  onClick={() => setLightbox(true)}
                  className="w-full h-full object-contain cursor-zoom-in" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors">
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setImgIdx(i)}
                          className={`rounded-full transition-all ${i === imgIdx ? 'w-5 h-2 bg-[#0057FF]' : 'w-2 h-2 bg-white/60'}`} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera size={48} className="text-slate-300" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-[#0057FF]' : 'border-transparent'}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-[#0D1B3E] mb-3">{t.listingDetail.description}</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
          </div>

          {/* Specs */}
          {listing.specs && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[#0D1B3E] mb-3">{t.listingDetail.specs}</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-mono">{listing.specs}</p>
            </div>
          )}
        </div>

        {/* Right col: meta + inquiry */}
        <div className="flex flex-col gap-5">
          {/* Main info card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-2 mb-3 flex-wrap">
              <Badge variant={listing.condition as ListingCondition} />
              {listing.listingType === 'wanted' && <Badge variant="wanted" />}
            </div>
            <h1 className="text-xl font-extrabold text-[#0D1B3E] mb-1">{listing.name}</h1>
            <p className="text-xs text-slate-400 mb-4">{listing.ref}</p>

            <div className="text-2xl font-extrabold text-[#0057FF] mb-5">{priceDisplay}</div>

            <div className="flex flex-col gap-3 mb-6">
              <MetaRow icon={Building2} label={t.listingDetail.manufacturer} value={listing.manufacturer} />
              {listing.model && <MetaRow icon={Wrench} label={t.listingDetail.model} value={listing.model} />}
              {listing.year && <MetaRow icon={Calendar} label={t.listingDetail.year} value={String(listing.year)} />}
              <MetaRow icon={MapPin} label={t.listingDetail.location} value={listing.location} />
              {category && <MetaRow icon={Tag} label={t.listingDetail.category} value={lang === 'ar' ? category.nameAr : category.nameEn} />}
              {listing.warranty && listing.warranty !== 'none' && (
                <MetaRow icon={ShieldCheck} label={t.listingDetail.warranty} value={listing.warranty.replace('_', ' ')} />
              )}
            </div>

            {isSold ? (
              <div className="w-full rounded-xl bg-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-500 cursor-not-allowed">
                {lang === 'ar' ? 'تم بيع هذا العنصر — الاستفسارات مغلقة' : 'This item has been sold — inquiries closed'}
              </div>
            ) : (
              <button onClick={() => setInquiryOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0057FF] py-3 text-sm font-bold text-white hover:bg-[#1a6aff] transition-colors shadow-sm">
                <Send size={14} /> {t.listingDetail.sendInquiry}
              </button>
            )}

            {/* Share this listing */}
            <div className="mt-3">
              <ShareButton path={`/listings/${listing.id}`} title={listing.name} />
            </div>
          </div>

          {/* Trust badge */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm">
            <p className="font-bold text-emerald-700 mb-1">{t.listingDetail.verifiedTitle}</p>
            <p className="text-emerald-600 text-xs leading-relaxed">{t.listingDetail.verifiedDesc}</p>
          </div>
        </div>
      </section>

      {/* Back navigation at the bottom */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) window.history.back();
            else window.location.href = '/';
          }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors shadow-sm"
        >
          <ArrowLeft size={14} /> {lang === 'ar' ? 'العودة إلى الصفحة السابقة' : 'Back to previous page'}
        </button>
      </div>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {inquiryOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8"
            onClick={(e) => { if (e.target === e.currentTarget) setInquiryOpen(false); }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6">

              {inquirySent ? (
                <div className="text-center py-6">
                  <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
                  <h3 className="font-bold text-[#0D1B3E] text-lg mb-1">{t.listingDetail.inquirySentTitle}</h3>
                  <p className="text-slate-500 text-sm mb-4">{t.listingDetail.inquirySentDesc}</p>
                  <button onClick={() => { setInquiryOpen(false); setInquirySent(false); }}
                    className="rounded-xl bg-[#0057FF] px-5 py-2.5 text-sm font-semibold text-white">{t.common.done}</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-[#0D1B3E]">{t.listingDetail.inquiryFormTitle} — {listing.ref}</h3>
                    <button onClick={() => setInquiryOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>
                  <form onSubmit={handleSubmit(onInquiry)} className="flex flex-col gap-3">
                    <input type="hidden" {...register('listingId')} />
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.listingDetail.fields.yourName}</label>
                      <input {...register('buyerName')} placeholder={t.listingDetail.fields.namePlaceholder} className={inputCls(!!errors.buyerName)} />
                      {errors.buyerName && <p className="mt-1 text-xs text-red-500">{errors.buyerName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.listingDetail.fields.email}</label>
                      <input {...register('buyerEmail')} type="email" placeholder={t.listingDetail.fields.emailPlaceholder} className={inputCls(!!errors.buyerEmail)} />
                      {errors.buyerEmail && <p className="mt-1 text-xs text-red-500">{errors.buyerEmail.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.listingDetail.fields.phone}</label>
                      <input {...register('buyerPhone')} placeholder={t.listingDetail.fields.phonePlaceholder} className={inputCls()} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.listingDetail.fields.company}</label>
                      <input {...register('buyerCompany')} placeholder={t.listingDetail.fields.companyPlaceholder} className={inputCls()} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.listingDetail.fields.message}</label>
                      <textarea {...register('message')} rows={3} placeholder={t.listingDetail.fields.messagePlaceholder}
                        className={`${inputCls()} resize-none`} />
                    </div>

                    {/* Additional services the buyer needs from the seller */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        {lang === 'ar' ? 'خدمات إضافية تحتاجها (اختياري)' : 'Additional Services You Need (Optional)'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {EXTRA_SERVICES.map((svc) => {
                          const checked = selectedServices.includes(svc.id);
                          return (
                            <label key={svc.id}
                              className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer text-xs transition-all ${checked ? 'border-[#0057FF] bg-blue-50 text-[#0057FF] font-semibold' : 'border-slate-200 text-slate-600 hover:border-blue-200'}`}>
                              <input type="checkbox" checked={checked} onChange={() => toggleService(svc.id)}
                                className="accent-[#0057FF]" />
                              {lang === 'ar' ? svc.labelAr : svc.labelEn}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <Recaptcha onChange={(tok) => { setCaptchaToken(tok); if (tok) setCaptchaError(false); }} />
                    {captchaError && (
                      <p className="text-xs text-red-500">{lang === 'ar' ? 'يرجى إكمال التحقق (CAPTCHA).' : 'Please complete the CAPTCHA.'}</p>
                    )}

                    <button type="submit" disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#0057FF] py-3 text-sm font-semibold text-white hover:bg-[#1a6aff] disabled:opacity-60 transition-colors mt-1">
                      {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> {t.listingDetail.sending}</> : <><Send size={14} /> {t.listingDetail.sendInquiry}</>}
                    </button>

                    <EmailTrustNote />
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image lightbox — click any photo to view it full-screen */}
      <AnimatePresence>
        {lightbox && images.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightbox(false)}>
            <button onClick={() => setLightbox(false)} aria-label="Close"
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white text-lg flex items-center justify-center hover:bg-white/20 transition-colors">
              ✕
            </button>
            <img src={images[imgIdx]} alt={listing.name}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[95vw] object-contain select-none" />
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + images.length) % images.length); }}
                  aria-label="Previous"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                  <ChevronLeft size={22} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % images.length); }}
                  aria-label="Next"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                  <ChevronRight size={22} />
                </button>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
                  {imgIdx + 1} / {images.length}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
