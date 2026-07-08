'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

/**
 * Share a listing link. Uses the native Web Share API on supported devices
 * (mobile = WhatsApp/Telegram/etc. sheet); falls back to copying the link to
 * the clipboard, and finally to a prompt() if clipboard is blocked.
 *
 *  - variant="full"  → full-width labelled button (listing detail page)
 *  - variant="icon"  → compact circular icon (listing cards)
 */
export function ShareButton({
  path,
  title,
  variant = 'full',
}: {
  path: string;
  title: string;
  variant?: 'full' | 'icon';
}) {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    // Listing cards are wrapped in a <Link>; stop the click from navigating.
    e.preventDefault();
    e.stopPropagation();

    const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;

    // Native share sheet (mobile + some desktops)
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({ title, text: title, url });
        return;
      }
    } catch {
      /* user dismissed the sheet or it failed — fall through to copy */
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(lang === 'ar' ? 'انسخ هذا الرابط:' : 'Copy this link:', url);
    }
  };

  const label = copied
    ? lang === 'ar' ? 'تم النسخ' : 'Copied!'
    : lang === 'ar' ? 'مشاركة' : 'Share';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={label}
        title={label}
        className="h-9 w-9 rounded-full bg-white/95 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm hover:text-[#0057FF] hover:border-[#0057FF] transition-colors"
      >
        {copied ? <Check size={15} /> : <Share2 size={15} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors"
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />} {label}
    </button>
  );
}
