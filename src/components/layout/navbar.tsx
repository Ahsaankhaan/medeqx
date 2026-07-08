'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Globe, PlusCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { t, toggleLang, lang } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Admin section has its own dedicated nav — hide the public navbar entirely there
  if (pathname?.startsWith('/admin')) return null;

  // On the homepage hero (deep blue background) the navbar overlays transparently
  // with a white logo. On every other page (and after scroll) it switches to solid white.
  const isHome = pathname === '/';
  const transparent = isHome && !scrolled;
  const elevated = scrolled;

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/categories', label: t.nav.categories },
    { href: '/faq', label: t.nav.faq },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        elevated
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm'
          : 'bg-white/80 backdrop-blur-md border-b border-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={transparent ? '/logo-white.svg' : '/logo.svg'}
            alt="MedeqX"
            className="h-12 w-auto transition-all"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === l.href
                  ? transparent ? 'bg-white/15 text-white' : 'bg-blue-50 text-[#0057FF]'
                  : transparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-[#0057FF] hover:bg-blue-50'
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
              transparent ? 'text-white/70 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            <Globe size={13} />
            {lang === 'en' ? 'عربي' : 'English'}
          </button>

          <Link
            href="/post-listing"
            className="hidden sm:flex items-center gap-1.5 rounded-xl bg-[#0057FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1a6aff] transition-colors shadow-sm"
            style={{ boxShadow: '0 0 16px rgba(0,87,255,0.35)' }}
          >
            <PlusCircle size={13} />
            {t.nav.postListing}
          </Link>

          <button
            className={cn('md:hidden p-2 rounded-lg', transparent ? 'text-white' : 'text-slate-700')}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pb-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-slate-700 border-b border-slate-50"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/post-listing"
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#0057FF] py-2.5 text-sm font-semibold text-white"
          >
            <PlusCircle size={14} />
            {t.nav.postListing}
          </Link>
        </div>
      )}
    </header>
  );
}
