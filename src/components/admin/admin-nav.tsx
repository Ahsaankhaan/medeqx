'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, ListChecks, BarChart3, MessageSquare, LogOut, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/admin',           label: 'Dashboard', icon: LayoutDashboard, match: (p: string) => p === '/admin' },
  { href: '/admin/listings',  label: 'Listings',  icon: ListChecks,      match: (p: string) => p.startsWith('/admin/listings') },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare,   match: (p: string) => p.startsWith('/admin/inquiries') },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3,       match: (p: string) => p.startsWith('/admin/analytics') },
];

const INQUIRY_LAST_VIEW_KEY = 'medeqx_admin_lastInquiryView';

function RedBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none animate-pulse">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function AdminNav() {
  const pathname = usePathname() ?? '';
  const [pendingListings, setPendingListings] = useState(0);
  const [newInquiries, setNewInquiries] = useState(0);

  // Poll the counts API on mount + every 30 seconds
  useEffect(() => {
    let cancelled = false;
    const lastView = parseInt(
      (typeof window !== 'undefined' ? window.localStorage.getItem(INQUIRY_LAST_VIEW_KEY) : '') || '0',
      10
    );

    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/admin/nav-counts', { credentials: 'include', cache: 'no-store' });
        if (!res.ok) return;
        const j = await res.json();
        if (cancelled) return;
        setPendingListings(j.pendingListings ?? 0);
        // Count inquiries newer than last viewed timestamp
        const latest = j.latestInquiryAt || 0;
        if (lastView === 0 && j.totalInquiries > 0) {
          // Never viewed before — show total
          setNewInquiries(j.totalInquiries);
        } else if (latest > lastView) {
          // Some new ones — approximate count as the diff; reload if user wants exact
          // We don't have a "count since X" endpoint, so fall back to total - we'll clear when they visit the page
          setNewInquiries(j.totalInquiries);
        } else {
          setNewInquiries(0);
        }
      } catch {/* ignore */}
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 30_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [pathname]);

  // Clear inquiry badge when admin visits the inquiries page
  useEffect(() => {
    if (pathname.startsWith('/admin/inquiries')) {
      try {
        window.localStorage.setItem(INQUIRY_LAST_VIEW_KEY, String(Date.now()));
        setNewInquiries(0);
      } catch {/* ignore */}
    }
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.href = '/admin/login';
  };

  const badgeFor = (href: string): number => {
    if (href === '/admin/listings') return pendingListings;
    if (href === '/admin/inquiries') return newInquiries;
    return 0;
  };

  return (
    <nav className="bg-[#0D1B3E] text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-extrabold text-base tracking-tight uppercase">Admin Panel</span>
        <div className="flex items-center gap-1">
          {ITEMS.map((it) => {
            const active = it.match(pathname);
            const Icon = it.icon;
            const count = badgeFor(it.href);
            return (
              <Link key={it.href} href={it.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  active ? 'bg-white/10 font-semibold' : 'hover:bg-white/5 text-slate-300'
                )}>
                <Icon size={14} /> {it.label}
                <RedBadge count={count} />
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <a href="/" target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
          View Site <ExternalLink size={11} />
        </a>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors">
          <LogOut size={13} /> Logout
        </button>
      </div>
    </nav>
  );
}
