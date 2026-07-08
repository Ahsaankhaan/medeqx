'use client';

import { TrendingUp, Package, MapPin, DollarSign, Tag, ShoppingBag, ClipboardList } from 'lucide-react';
import { AdminNav } from '@/components/admin/admin-nav';

function StatCard({ icon: Icon, label, value, hint, color = '#0057FF' }: { icon: React.ElementType; label: string; value: string; hint?: string; color?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
        <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-extrabold text-[#0D1B3E]">{value}</div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

function BarRow({ label, count, max, color = '#0057FF', extra }: { label: string; count: number; max: number; color?: string; extra?: string }) {
  const pct = max > 0 ? Math.max(2, (count / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="font-medium text-[#0D1B3E] truncate">{label}</span>
        <span className="text-slate-500 text-xs ml-3 whitespace-nowrap">
          {count}{extra ? ` · ${extra}` : ''}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Icon size={16} className="text-[#0057FF]" />
        <h3 className="font-bold text-[#0D1B3E]">{title}</h3>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

const CONDITION_COLORS: Record<string, string> = {
  new: '#10b981', refurbished: '#06b6d4', used: '#f59e0b', parts: '#dc2626',
};
const TYPE_COLORS: Record<string, string> = { for_sale: '#0057FF', wanted: '#8B5CF6' };
const STATUS_COLORS: Record<string, string> = { approved: '#10b981', pending: '#f59e0b', suspended: '#dc2626', sold: '#64748b' };

export function AnalyticsClient({
  totals, categoryRows, cityRows, manufacturerRows, byCondition, byType, priceBands,
}: {
  totals: { listings: number; approved: number; pending: number; suspended: number; sold: number; inquiries: number; totalValue: number; soldValue: number };
  categoryRows: { slug: string; name: string; count: number; sold: number; value: number }[];
  cityRows: { name: string; count: number; sold: number; value: number }[];
  manufacturerRows: { name: string; count: number }[];
  byCondition: Record<string, number>;
  byType: Record<string, number>;
  priceBands: Record<string, number>;
}) {
  const fmt = (n: number) => n.toLocaleString();
  const sar = (n: number) => `SAR ${fmt(Math.round(n))}`;
  const maxCat = Math.max(1, ...categoryRows.map((r) => r.count));
  const maxCity = Math.max(1, ...cityRows.map((r) => r.count));
  const maxMfr = Math.max(1, ...manufacturerRows.map((r) => r.count));
  const condTotal = Math.max(1, Object.values(byCondition).reduce((a, b) => a + b, 0));
  const typeTotal = Math.max(1, Object.values(byType).reduce((a, b) => a + b, 0));
  const priceMax = Math.max(1, ...Object.values(priceBands));

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#0D1B3E]">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Marketplace insights — categories, cities, equipment types, and pricing</p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Package} label="Total Listings" value={fmt(totals.listings)} color="#0057FF" />
          <StatCard icon={TrendingUp} label="Live" value={fmt(totals.approved)} hint={`${totals.pending} pending`} color="#10b981" />
          <StatCard icon={ShoppingBag} label="Sold" value={fmt(totals.sold)} hint={sar(totals.soldValue)} color="#64748b" />
          <StatCard icon={ClipboardList} label="Total Inquiries" value={fmt(totals.inquiries)} color="#8B5CF6" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon={DollarSign} label="Total Listed Value" value={sar(totals.totalValue)} color="#0057FF" />
          <StatCard icon={DollarSign} label="Sold Value" value={sar(totals.soldValue)} color="#10b981" />
          <StatCard icon={Package} label="Suspended" value={fmt(totals.suspended)} color="#dc2626" />
          <StatCard icon={Package} label="Conversion" value={totals.approved + totals.sold > 0 ? `${Math.round((totals.sold / (totals.approved + totals.sold)) * 100)}%` : '—'} hint="sold / (live + sold)" color="#06b6d4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* By Category */}
          <Card title="By Category" icon={Tag}>
            {categoryRows.length === 0 && <p className="text-sm text-slate-400">No data</p>}
            {categoryRows.map((r) => (
              <BarRow key={r.slug} label={r.name} count={r.count} max={maxCat}
                extra={`${r.sold} sold · ${sar(r.value)}`} />
            ))}
          </Card>

          {/* By City */}
          <Card title="By City / Location" icon={MapPin}>
            {cityRows.length === 0 && <p className="text-sm text-slate-400">No data</p>}
            {cityRows.slice(0, 12).map((r) => (
              <BarRow key={r.name} label={r.name} count={r.count} max={maxCity} color="#06b6d4"
                extra={r.sold > 0 ? `${r.sold} sold` : undefined} />
            ))}
          </Card>

          {/* By Condition */}
          <Card title="By Condition" icon={Package}>
            {Object.entries(byCondition).map(([k, v]) => (
              <BarRow key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} count={v} max={condTotal}
                color={CONDITION_COLORS[k] || '#0057FF'}
                extra={`${Math.round((v / condTotal) * 100)}%`} />
            ))}
          </Card>

          {/* By Listing Type */}
          <Card title="By Listing Type" icon={Tag}>
            {Object.entries(byType).map(([k, v]) => (
              <BarRow key={k} label={k === 'for_sale' ? 'For Sale' : 'Wanted'} count={v} max={typeTotal}
                color={TYPE_COLORS[k] || '#0057FF'}
                extra={`${Math.round((v / typeTotal) * 100)}%`} />
            ))}
          </Card>

          {/* Price Bands */}
          <Card title="Price Bands" icon={DollarSign}>
            {Object.entries(priceBands).map(([k, v]) => (
              <BarRow key={k} label={k} count={v} max={priceMax} color="#0057FF" />
            ))}
          </Card>

          {/* Top Manufacturers */}
          <Card title="Top Manufacturers" icon={Package}>
            {manufacturerRows.length === 0 && <p className="text-sm text-slate-400">No data</p>}
            {manufacturerRows.map((r) => (
              <BarRow key={r.name} label={r.name} count={r.count} max={maxMfr} color="#8B5CF6" />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
