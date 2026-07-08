import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/**
 * Shared wrapper for static content pages (about, privacy, verification, guides…).
 * Server component — no client hooks. Gives every page the same breadcrumb +
 * hero header + body container layout so they feel like one coherent site.
 */
export function ContentShell({
  eyebrow,
  title,
  intro,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  breadcrumb?: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <main className="bg-[#F8FAFF] min-h-screen pt-20">
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-slate-400 flex-wrap">
          <Link href="/" className="hover:text-[#0057FF]">Home</Link>
          {(breadcrumb ?? []).map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              <ChevronRight size={13} />
              {i < (breadcrumb!.length - 1) ? (
                <Link href={b.href} className="hover:text-[#0057FF]">{b.label}</Link>
              ) : (
                <span className="text-[#0D1B3E] font-medium">{b.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <section className="bg-white border-b border-slate-100 px-6 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          {eyebrow && (
            <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-2">{eyebrow}</p>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D1B3E] leading-tight mb-3">{title}</h1>
          {intro && <p className="text-slate-500 text-base leading-relaxed">{intro}</p>}
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 py-12 text-slate-700 text-[15px] leading-relaxed">
        <div
          className="
            [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-[#0D1B3E] [&_h2]:mt-10 [&_h2]:mb-3
            [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#0D1B3E] [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:marker:text-[#0057FF]
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:marker:text-[#0057FF]
            [&_li]:mb-1.5
            [&_a]:text-[#0057FF] [&_a]:font-semibold [&_a]:underline-offset-2 hover:[&_a]:underline
            [&_strong]:text-[#0D1B3E] [&_strong]:font-bold
          "
        >
          {children}
        </div>
      </article>
    </main>
  );
}
