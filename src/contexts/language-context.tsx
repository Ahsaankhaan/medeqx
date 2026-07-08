'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Translations } from '@/lib/translations';
import type { Language } from '@/types';

interface LanguageContextType {
  lang: Language;
  t: Translations;
  toggleLang: () => void;
  setLang: (l: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  t: translations.en,
  toggleLang: () => {},
  setLang: () => {},
  isRTL: false,
});

const STORAGE_KEY = 'medeqx_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage on first client render
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'ar' || stored === 'en') setLangState(stored);
    } catch { /* SSR / blocked storage — fall through */ }
    setHydrated(true);
  }, []);

  // Update <html> attrs + persist whenever lang changes
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
  }, [lang, hydrated]);

  const setLang = (l: Language) => setLangState(l);
  const toggleLang = () => setLangState((prev) => (prev === 'en' ? 'ar' : 'en'));

  return (
    <LanguageContext.Provider
      value={{ lang, t: translations[lang], toggleLang, setLang, isRTL: lang === 'ar' }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
