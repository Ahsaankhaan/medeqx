'use client';

import { Mail, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

/**
 * Compact note shown at the bottom of every form (post-listing, inquiry, contact)
 * to nudge users to whitelist info@medeqx.com and check spam folders. Reduces
 * "I didn't get any email" support tickets significantly.
 */
export function EmailTrustNote() {
  const { lang } = useLanguage();
  return (
    <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex items-start gap-2.5 text-xs leading-relaxed text-slate-600">
      <ShieldCheck size={16} className="text-[#0057FF] shrink-0 mt-0.5" />
      <p>
        {lang === 'ar' ? (
          <>
            <strong className="text-[#0D1B3E]">ملاحظة:</strong> سترسل التأكيدات والردود من{' '}
            <a href="mailto:info@medeqx.com" className="font-semibold text-[#0057FF] underline-offset-2 hover:underline">
              <Mail size={11} className="inline mr-0.5" /> info@medeqx.com
            </a>
            . الرجاء إضافة هذا العنوان إلى جهات الاتصال الموثوقة وفحص مجلد الرسائل غير المرغوب فيها (Spam/Junk) إذا لم تصلك الرسالة خلال 10 دقائق.
          </>
        ) : (
          <>
            <strong className="text-[#0D1B3E]">Note:</strong> Confirmation emails are sent from{' '}
            <a href="mailto:info@medeqx.com" className="font-semibold text-[#0057FF] underline-offset-2 hover:underline">
              <Mail size={11} className="inline mr-0.5" /> info@medeqx.com
            </a>
            . Please add this address to your trusted contacts and check your <strong className="text-[#0D1B3E]">Spam / Junk folder</strong> if you don&apos;t see our message within 10 minutes.
          </>
        )}
      </p>
    </div>
  );
}
