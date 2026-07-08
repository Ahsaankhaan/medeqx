'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, Search, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

/**
 * Sticky bottom action bar shown on mobile only. Three quick actions:
 *   • Post Equipment
 *   • Browse / Search
 *   • WhatsApp inquiry (only if NEXT_PUBLIC_WHATSAPP_NUMBER is set)
 *
 * Hidden on /admin and on the post-listing / contact flows themselves.
 */
export function MobileBottomBar() {
  const pathname = usePathname() ?? '';
  const { lang } = useLanguage();

  if (pathname.startsWith('/admin')) return null;
  if (pathname.startsWith('/post-listing')) return null;
  if (pathname.startsWith('/admin/login')) return null;

  const waRaw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966505565761';
  const waNumber = waRaw ? String(waRaw).replace(/[^\d]/g, '') : '';
  const waGreeting = lang === 'ar'
    ? 'مرحباً MedeqX، أرغب بالاستفسار عن'
    : "Hello MedeqX, I'd like to inquire about";
  const waHref = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waGreeting)}` : null;

  const items: { href: string; label: string; icon: React.ElementType; external?: boolean; accent?: boolean }[] = [
    { href: '/search', label: lang === 'ar' ? 'تصفّح' : 'Browse', icon: Search },
    { href: '/post-listing', label: lang === 'ar' ? 'انشر' : 'Post', icon: PlusCircle, accent: true },
  ];
  if (waHref) {
    items.push({ href: waHref, label: 'WhatsApp', icon: MessageCircle, external: true });
  }

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="flex items-stretch">
        {items.map((it) => {
          const Icon = it.icon;
          const inner = (
            <span className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-colors ${it.accent ? 'bg-[#0057FF] text-white' : 'text-slate-700 hover:bg-slate-50'}`}>
              <Icon size={18} className={it.accent ? 'text-white' : ''} />
              {it.label}
            </span>
          );
          return it.external ? (
            <a key={it.label} href={it.href} target="_blank" rel="noopener" className="flex-1 flex">{inner}</a>
          ) : (
            <Link key={it.label} href={it.href} className="flex-1 flex">{inner}</Link>
          );
        })}
      </div>
    </nav>
  );
}
