'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { CATEGORIES } from '@/lib/categories';

export function CategoriesClient() {
  const { t, lang } = useLanguage();
  return (
    <main className="bg-[#F8FAFF] min-h-screen pt-20">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12 text-center">
          <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-2">{t.categories.browse}</p>
          <h1 className="text-4xl font-extrabold text-[#0D1B3E] mb-3">{t.categories.title}</h1>
          <p className="text-slate-500 max-w-xl mx-auto">{t.categories.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.slug}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}>
              <Link href={`/categories/${cat.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110"
                  style={{ background: cat.colorLight }}>
                  <Zap size={22} style={{ color: cat.color }} />
                </div>
                <h2 className="font-bold text-[#0D1B3E] mb-1.5">
                  {lang === 'ar' ? cat.nameAr : cat.nameEn}
                </h2>
                <p className="text-[13px] text-slate-400 leading-relaxed flex-1">
                  {lang === 'ar' ? cat.descAr : cat.descEn}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0057FF]">
                  {t.categories.viewListings} <ArrowRight size={12} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
