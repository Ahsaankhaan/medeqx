import type { Metadata } from 'next';
import Link from 'next/link';
import { MANUFACTURERS } from '@/lib/manufacturers';
import { Building2, ArrowRight, ChevronRight } from 'lucide-react';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.medeqx.com';

export const metadata: Metadata = {
  title: 'Medical Equipment Manufacturers — Philips, GE, Siemens & More',
  description: 'Browse used and refurbished medical equipment by manufacturer on MedeqX: Philips, GE Healthcare, Siemens Healthineers, Mindray, Dräger, Medtronic, Stryker, Fresenius, Olympus, Roche, Abbott and more — across Saudi Arabia and the GCC.',
  alternates: { canonical: `${SITE}/manufacturers` },
};

export default function ManufacturersIndex() {
  return (
    <main className="bg-[#F8FAFF] min-h-screen pt-20">
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-[#0057FF]">Home</Link>
          <ChevronRight size={13} />
          <span className="text-[#0D1B3E] font-medium">Manufacturers</span>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-2">Brands</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D1B3E] mb-3">Medical Equipment Manufacturers</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm">
            Browse used and refurbished equipment from the world&#39;s leading medical device brands. Verified listings across the GCC.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MANUFACTURERS.map((m) => (
            <Link key={m.slug} href={`/manufacturers/${m.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#0057FF] hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Building2 size={18} className="text-[#0057FF]" />
                </div>
                <div>
                  <h2 className="font-extrabold text-[#0D1B3E] text-lg">{m.name}</h2>
                  <p className="text-[11px] text-slate-400">{m.nameAr}</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">{m.description}</p>
              <div className="flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1">
                  {m.modalities.slice(0, 3).map((mod) => (
                    <span key={mod} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{mod}</span>
                  ))}
                </div>
                <span className="flex items-center gap-1 font-semibold text-[#0057FF] group-hover:gap-2 transition-all">
                  View <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
