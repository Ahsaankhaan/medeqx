'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Handshake, Plus, Search, Pencil, Trash2, CheckCircle2, RotateCcw, TrendingUp,
  Package, Loader2, ArrowRight,
} from 'lucide-react';
import { AdminNav } from '@/components/admin/admin-nav';
import { getCategoryBySlug } from '@/lib/categories';
import { DealFormModal, type DealFields } from '@/components/admin/deal-form-modal';

interface Deal {
  id: string; ref: string | null; equipment: string; category: string;
  sellerName: string; sellerContact: string; sellerListingRef: string;
  buyerName: string; buyerContact: string;
  salePrice: number | null; commission: number | null; currency: string;
  status: string; notes: string; closedAt: string;
}

const catName = (s: string) => getCategoryBySlug(s)?.nameEn ?? (s ? s.replace(/-/g, ' ') : '');
const money = (n: number | null, c = 'SAR') => n != null ? `${c} ${n.toLocaleString()}` : '—';
const fmtDate = (s: string) => { const t = new Date(s).getTime(); return isNaN(t) ? '—' : new Date(t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); };

const FILTERS = ['all', 'brokered', 'completed'] as const;

function toFields(d: Deal): DealFields {
  return {
    id: d.id, equipment: d.equipment, category: d.category,
    sellerName: d.sellerName, sellerContact: d.sellerContact, sellerListingRef: d.sellerListingRef,
    buyerName: d.buyerName, buyerContact: d.buyerContact,
    salePrice: d.salePrice != null ? String(d.salePrice) : '',
    commission: d.commission != null ? String(d.commission) : '',
    status: d.status === 'completed' ? 'completed' : 'brokered',
    notes: d.notes,
  };
}

export function DealsClient({ deals }: { deals: Deal[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<(typeof FILTERS)[number]>('all');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<DealFields | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = { all: deals.length, brokered: 0, completed: 0 } as Record<string, number>;
    for (const d of deals) c[d.status] = (c[d.status] ?? 0) + 1;
    return c;
  }, [deals]);

  const totalCommission = useMemo(() => deals.reduce((s, d) => s + (d.commission ?? 0), 0), [deals]);
  const totalSales = useMemo(() => deals.reduce((s, d) => s + (d.salePrice ?? 0), 0), [deals]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return deals.filter((d) => {
      if (tab !== 'all' && d.status !== tab) return false;
      if (!q) return true;
      return [d.ref, d.equipment, d.sellerName, d.buyerName, d.sellerListingRef, catName(d.category)]
        .join(' ').toLowerCase().includes(q);
    });
  }, [deals, search, tab]);

  const setStatus = async (id: string, status: string) => {
    setBusyId(id);
    try {
      await fetch('/api/admin/deals', {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, statusOnly: true, status }),
      });
      router.refresh();
    } finally { setBusyId(null); }
  };
  const remove = async (id: string) => {
    if (!confirm('Delete this deal record? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await fetch('/api/admin/deals', {
        method: 'DELETE', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
      });
      router.refresh();
    } finally { setBusyId(null); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <AdminNav />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0D1B3E] flex items-center gap-2">
              <Handshake size={24} className="text-[#0057FF]" /> Deals
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Every brokered deal, tracked — with the listing, the parties, and your commission.</p>
          </div>
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#0057FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a6aff] shadow-sm transition-colors">
            <Plus size={16} /> Record Deal
          </button>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-extrabold text-[#0D1B3E]">{deals.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Deals recorded</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-2xl font-extrabold text-emerald-600 flex items-center gap-1"><TrendingUp size={18} /> SAR {totalCommission.toLocaleString()}</p>
            <p className="text-xs text-emerald-600/80 mt-0.5">Total commission earned</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-extrabold text-[#0D1B3E]">SAR {totalSales.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-0.5">Total value brokered</p>
          </div>
        </div>

        {/* Search + tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deals — equipment, party, listing ref…"
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#0057FF] shadow-sm" />
          </div>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setTab(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors border ${
                  tab === f ? 'bg-[#0057FF] text-white border-[#0057FF]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#0057FF]'
                }`}>
                {f} <span className={tab === f ? 'text-white/80' : 'text-slate-400'}>({counts[f] ?? 0})</span>
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Handshake size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">{search || tab !== 'all' ? 'No deals match.' : 'No deals recorded yet.'}</p>
            <p className="text-slate-400 text-sm mt-1">When you broker a match, record it here to track your commission.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((d) => {
              const done = d.status === 'completed';
              return (
                <div key={d.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#0057FF]">{d.ref || '—'}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${done ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {done ? 'Completed' : 'Brokered'}
                        </span>
                        {d.category && <span className="text-[11px] text-slate-400">{catName(d.category)}</span>}
                        <span className="text-[11px] text-slate-400">· {fmtDate(d.closedAt)}</span>
                      </div>
                      <p className="font-bold text-[#0D1B3E] mt-1">{d.equipment}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-extrabold text-emerald-600">{money(d.commission, d.currency)}</p>
                      <p className="text-[11px] text-slate-400">commission{d.salePrice != null ? ` · sale ${money(d.salePrice, d.currency)}` : ''}</p>
                    </div>
                  </div>

                  {/* Parties */}
                  <div className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-3 mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 flex items-center gap-1"><Package size={10} /> Seller</p>
                      <p className="text-sm font-semibold text-[#0D1B3E]">{d.sellerName || '—'}</p>
                      {d.sellerContact && <p className="text-xs text-slate-500">{d.sellerContact}</p>}
                      {d.sellerListingRef && <p className="text-[11px] font-mono text-slate-400 mt-0.5">from {d.sellerListingRef}</p>}
                    </div>
                    <ArrowRight size={16} className="text-slate-300 hidden sm:block mx-auto" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-blue-700">Buyer</p>
                      <p className="text-sm font-semibold text-[#0D1B3E]">{d.buyerName || '—'}</p>
                      {d.buyerContact && <p className="text-xs text-slate-500">{d.buyerContact}</p>}
                    </div>
                  </div>

                  {d.notes && <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 italic">“{d.notes}”</p>}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {done ? (
                      <button onClick={() => setStatus(d.id, 'brokered')} disabled={busyId === d.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-60">
                        {busyId === d.id ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />} Reopen
                      </button>
                    ) : (
                      <button onClick={() => setStatus(d.id, 'completed')} disabled={busyId === d.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                        {busyId === d.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />} Mark completed
                      </button>
                    )}
                    <button onClick={() => setEditing(toFields(d))}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#0057FF] hover:text-[#0057FF]">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => remove(d.id)} disabled={busyId === d.id}
                      className="ml-auto inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {(adding || editing) && (
        <DealFormModal
          existing={editing}
          onClose={() => { setAdding(false); setEditing(null); }}
          onSaved={() => { setAdding(false); setEditing(null); router.refresh(); }}
        />
      )}
    </div>
  );
}
