'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, Phone, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { contactSchema, type ContactInput } from '@/lib/validations';
import { EmailTrustNote } from '@/components/ui/email-trust-note';
import { Recaptcha, RECAPTCHA_ENABLED } from '@/components/ui/recaptcha';

export function ContactClient() {
  const { t, lang } = useLanguage();
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', company: '', email: '', subject: '', message: '' },
  });

  const onSubmit = async (data: ContactInput) => {
    setSubmitError(null);
    if (RECAPTCHA_ENABLED && !captchaToken) {
      setSubmitError(lang === 'ar' ? 'يرجى إكمال التحقق (CAPTCHA).' : 'Please complete the CAPTCHA.');
      return;
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptchaToken: captchaToken }),
      });
      if (res.ok) {
        setSuccess(true);
        reset();
      } else {
        const j = await res.json().catch(() => ({}));
        setSubmitError(j.error || 'Failed to send. Please try again.');
      }
    } catch (e) {
      setSubmitError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <main className="bg-[#F8FAFF] min-h-screen pt-20">
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-2">{t.contact.getInTouch}</p>
          <h1 className="text-4xl font-extrabold text-[#0D1B3E] mb-4">{t.contact.title}</h1>
          <p className="text-slate-500 mb-8">{t.contact.subtitle}</p>
          <div className="flex flex-col gap-4">
            <a href="mailto:info@medeqx.com" className="flex items-center gap-3 text-slate-600 hover:text-[#0057FF]">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center"><Mail size={16} className="text-[#0057FF]" /></div>
              info@medeqx.com
            </a>
            <a href="tel:+966505565761" className="flex items-center gap-3 text-slate-600 hover:text-[#0057FF]">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center"><Phone size={16} className="text-[#0057FF]" /></div>
              +966 50 556 5761
            </a>
            <a href="https://wa.me/966505565761" target="_blank" rel="noopener" className="flex items-center gap-3 text-slate-600 hover:text-[#25D366]">
              <div className="h-10 w-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center"><MessageCircle size={16} className="text-[#25D366]" /></div>
              WhatsApp +966 50 556 5761
            </a>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center"><MapPin size={16} className="text-[#0057FF]" /></div>
              {lang === 'ar' ? 'الدمام، المملكة العربية السعودية' : 'Dammam, Saudi Arabia'}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {success ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center gap-3">
              <CheckCircle2 size={40} className="text-emerald-500" />
              <p className="font-bold text-[#0D1B3E] text-lg">{t.contact.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {(['name', 'company', 'email', 'subject'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.contact.fields[field]}</label>
                  <input {...register(field)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0D1B3E] outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/10 transition-all" />
                  {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]?.message}</p>}
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t.contact.fields.message}</label>
                <textarea {...register('message')} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0D1B3E] outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/10 resize-none transition-all" />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
              </div>
              <Recaptcha onChange={setCaptchaToken} />
              {submitError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{submitError}</div>
              )}
              <button type="submit" disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0057FF] py-3 text-sm font-semibold text-white hover:bg-[#1a6aff] disabled:opacity-60 transition-colors">
                {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> {t.contact.sending}</> : t.contact.send}
              </button>
              <EmailTrustNote />
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
