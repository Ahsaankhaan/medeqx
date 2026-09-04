'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Handshake, Search, Plus, Phone, Mail, MessageCircle, Trash2, X, Loader2,
  ArrowLeftRight, Package, Building2, MapPin, Flame, Pencil, ChevronDown,
  ChevronsDownUp, ChevronsUpDown,
} from 'lucide-react';
import { AdminNav } from '@/components/admin/admin-nav';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';
import { DealFormModal, type DealFields } from '@/components/admin/deal-form-modal';

// ── Types ─────────────────────────────────────────────────────────────
interface ListingRow {
  id: string; ref: string; name: string; category: string; manufacturer: string;
  model: string; price: number | null; currency: string; location: string;
  description: string; status: string; listingType: string;
  sellerName: string; sellerEmail: string; sellerPhone: string; sellerCompany: string;
  createdAt: string;
}
interface InquiryRow {
  id: string; ref: string | null; buyerName: string; buyerEmail: string;
  buyerPhone: string; buyerCompany: string; message: string; createdAt: string;
  listing: { ref: string; name: string; category: string } | null;
}
interface Party {
  kind: 'seller' | 'buyer';
  id: string; ref: string; category: string; equipment: string; detail: string;
  manufacturer: string; model: string;
  price: number | null; currency: string; location: string; status: string;
  contactName: string; contactCompany: string; contactPhone: string; contactEmail: string;
  note: string; date: number; isLead: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────
const ms = (x: string) => { const t = new Date(x).getTime(); return isNaN(t) ? 0 : t; };
const fmtDate = (t: number) => t ? new Date(t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const catName = (slug: string) => getCategoryBySlug(slug)?.nameEn ?? (slug ? slug.replace(/-/g, ' ') : 'Uncategorised');

function waLink(phone: string): string | null {
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) return null;
  let intl = digits;
  if (intl.startsWith('00')) intl = intl.slice(2);
  else if (intl.startsWith('0')) intl = '966' + intl.slice(1); // default Saudi
  return `https://wa.me/${intl}`;
}

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  approved:  { label: 'Live',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  sold:      { label: 'Sold',      cls: 'bg-slate-100 text-slate-500 border-slate-200' },
  suspended: { label: 'Suspended', cls: 'bg-red-50 text-red-600 border-red-200' },
  lead:      { label: 'Lead',      cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  inquiry:   { label: 'Inquiry',   cls: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
};
const activeRank = (s: string) => (s === 'sold' || s === 'suspended') ? 1 : 0;

// ── Contact buttons ───────────────────────────────────────────────────
function Contact({ p }: { p: Party }) {
  const wa = waLink(p.contactPhone);
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      {p.contactPhone && wa && (
        <a href={wa} target="_blank" rel="noopener"
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 transition-colors">
          <MessageCircle size={11} /> WhatsApp
        </a>
      )}
      {p.contactPhone && (
        <a href={`tel:${p.contactPhone}`}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors">
          <Phone size={11} /> {p.contactPhone}
        </a>
      )}
      {p.contactEmail && (
        <a href={`mailto:${p.contactEmail}`}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors">
          <Mail size={11} /> Email
        </a>
      )}
    </div>
  );
}

// ── Party card ────────────────────────────────────────────────────────
function PartyCard({ p, onEdit, onDelete, onRecordDeal }: { p: Party; onEdit: (p: Party) => void; onDelete: (id: string) => void; onRecordDeal: (p: Party) => void }) {
  const st = STATUS_STYLE[p.status] ?? { label: p.status, cls: 'bg-slate-100 text-slate-500 border-slate-200' };
  const dim = p.status === 'sold' || p.status === 'suspended';
  const isInquiry = p.status === 'inquiry';
  const listingEditHref = (!p.isLead && !isInquiry) ? `/admin/listings/${p.id}/edit` : null;
  return (
    <div className={`rounded-xl border p-3 ${dim ? 'border-slate-100 bg-slate-50/50 opacity-75' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-[#0D1B3E] leading-snug">{p.equipment || '—'}</p>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${st.cls}`}>{st.label}</span>
      </div>
      {p.detail && <p className="text-xs text-slate-500 mt-0.5">{p.detail}</p>}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-[11px] text-slate-500">
        {p.price != null && <span className="font-semibold text-[#0057FF]">{p.currency || 'SAR'} {p.price.toLocaleString()}</span>}
        {p.location && <span className="inline-flex items-center gap-0.5"><MapPin size={10} /> {p.location}</span>}
        <span>{fmtDate(p.date)}</span>
      </div>
      <div className="mt-2 border-t border-dashed border-slate-200 pt-2">
        <p className="text-xs font-semibold text-[#0D1B3E] flex items-center gap-1">
          {p.contactName || 'Unknown contact'}
          {p.contactCompany && <span className="font-normal text-slate-400 inline-flex items-center gap-0.5"><Building2 size={10} /> {p.contactCompany}</span>}
        </p>
        <Contact p={p} />
        <button onClick={() => onRecordDeal(p)}
          className="mt-2 inline-flex items-center gap-1 rounded-lg border border-[#0057FF]/30 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#0057FF] hover:bg-blue-100 transition-colors">
          <Handshake size={11} /> Record deal
        </button>
      </div>
      {p.note && <p className="mt-2 rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600 italic">“{p.note}”</p>}
      {(p.isLead || listingEditHref) && (
        <div className="mt-2 flex items-center gap-3">
          {p.isLead && (
            <button onClick={() => onEdit(p)}
              className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-[#0057FF] transition-colors">
              <Pencil size={10} /> Edit
            </button>
          )}
          {listingEditHref && (
            <a href={listingEditHref} target="_blank" rel="noopener"
              className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-[#0057FF] transition-colors">
              <Pencil size={10} /> Edit listing
            </a>
          )}
          {p.isLead && (
            <button onClick={() => onDelete(p.id)}
              className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 size={10} /> Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────
export function MatchmakingClient({ forSale, wanted, inquiries }: {
  forSale: ListingRow[]; wanted: ListingRow[]; inquiries: InquiryRow[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Party | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [dealPrefill, setDealPrefill] = useState<Partial<DealFields> | null>(null);

  const recordDeal = (p: Party) => {
    const contact = [p.contactPhone, p.contactEmail].filter(Boolean).join(' / ');
    setDealPrefill(p.kind === 'seller'
      ? { equipment: p.equipment, category: p.category, sellerName: p.contactName, sellerContact: contact, sellerListingRef: p.ref }
      : { equipment: p.equipment, category: p.category, buyerName: p.contactName, buyerContact: contact });
  };

  const toggleCat = (slug: string) => setCollapsed((s) => {
    const n = new Set(s); n.has(slug) ? n.delete(slug) : n.add(slug); return n;
  });

  // Normalise everything into a flat list of parties
  const parties = useMemo<Party[]>(() => {
    const sellers: Party[] = forSale.map((l) => ({
      kind: 'seller', id: l.id, ref: l.ref, category: l.category,
      equipment: l.name, detail: [l.manufacturer, l.model].filter(Boolean).join(' '),
      manufacturer: l.manufacturer, model: l.model,
      price: l.price, currency: l.currency, location: l.location, status: l.status,
      contactName: l.sellerName, contactCompany: l.sellerCompany,
      contactPhone: l.sellerPhone, contactEmail: l.sellerEmail,
      note: l.status === 'lead' ? l.description : '', date: ms(l.createdAt),
      isLead: l.status === 'lead',
    }));
    const wantedBuyers: Party[] = wanted.map((l) => ({
      kind: 'buyer', id: l.id, ref: l.ref, category: l.category,
      equipment: l.name, detail: [l.manufacturer, l.model].filter(Boolean).join(' '),
      manufacturer: l.manufacturer, model: l.model,
      price: l.price, currency: l.currency, location: l.location, status: l.status,
      contactName: l.sellerName, contactCompany: l.sellerCompany,
      contactPhone: l.sellerPhone, contactEmail: l.sellerEmail,
      note: l.description, date: ms(l.createdAt), isLead: l.status === 'lead',
    }));
    const inquiryBuyers: Party[] = inquiries.map((q) => ({
      kind: 'buyer', id: q.id, ref: q.ref ?? q.id, category: q.listing?.category ?? '',
      equipment: q.listing?.name ?? 'General inquiry',
      detail: q.listing ? `Inquired about ${q.listing.ref}` : '',
      manufacturer: '', model: '',
      price: null, currency: 'SAR', location: '', status: 'inquiry',
      contactName: q.buyerName, contactCompany: q.buyerCompany,
      contactPhone: q.buyerPhone, contactEmail: q.buyerEmail,
      note: q.message, date: ms(q.createdAt), isLead: false,
    }));
    return [...sellers, ...wantedBuyers, ...inquiryBuyers];
  }, [forSale, wanted, inquiries]);

  // Search filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parties;
    return parties.filter((p) =>
      [p.equipment, p.detail, p.contactName, p.contactCompany, p.location, p.note, catName(p.category)]
        .join(' ').toLowerCase().includes(q)
    );
  }, [parties, query]);

  // Group by category
  const groups = useMemo(() => {
    const map = new Map<string, { sellers: Party[]; buyers: Party[] }>();
    for (const p of filtered) {
      const key = p.category || 'other';
      if (!map.has(key)) map.set(key, { sellers: [], buyers: [] });
      map.get(key)![p.kind === 'seller' ? 'sellers' : 'buyers'].push(p);
    }
    const sortParties = (a: Party, b: Party) => activeRank(a.status) - activeRank(b.status) || b.date - a.date;
    const arr = Array.from(map.entries()).map(([slug, v]) => ({
      slug,
      sellers: v.sellers.sort(sortParties),
      buyers: v.buyers.sort(sortParties),
      hot: v.sellers.length > 0 && v.buyers.length > 0,
    }));
    // Hot categories first, then by total activity
    arr.sort((a, b) => Number(b.hot) - Number(a.hot) || (b.sellers.length + b.buyers.length) - (a.sellers.length + a.buyers.length));
    return arr;
  }, [filtered]);

  const hotGroups = groups.filter((g) => g.hot);
  const totalSellers = parties.filter((p) => p.kind === 'seller').length;
  const totalBuyers = parties.filter((p) => p.kind === 'buyer').length;

  const collapseAll = () => setCollapsed(new Set(groups.map((g) => g.slug)));
  const expandAll = () => setCollapsed(new Set());
  const allCollapsed = groups.length > 0 && groups.every((g) => collapsed.has(g.slug));

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this lead from the pool? This cannot be undone.')) return;
    await fetch('/api/admin/leads', {
      method: 'DELETE', credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
    });
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <AdminNav />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0D1B3E] flex items-center gap-2">
              <Handshake size={24} className="text-[#0057FF]" /> Matchmaking
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Connect buyers and sellers across time — no lead left behind.</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#0057FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a6aff] shadow-sm transition-colors">
            <Plus size={16} /> Add Lead
          </button>
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-extrabold text-[#0D1B3E]">{totalSellers}</p>
            <p className="text-xs text-slate-400 mt-0.5">Sellers in pool</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-extrabold text-[#0D1B3E]">{totalBuyers}</p>
            <p className="text-xs text-slate-400 mt-0.5">Buyers in pool</p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
            <p className="text-2xl font-extrabold text-orange-600 flex items-center gap-1"><Flame size={20} /> {hotGroups.length}</p>
            <p className="text-xs text-orange-500/80 mt-0.5">Hot categories (buyer + seller)</p>
          </div>
        </div>

        {/* Search + collapse control */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search equipment, brand, person, company, city…"
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#0057FF] shadow-sm" />
          </div>
          {groups.length > 0 && (
            <button onClick={allCollapsed ? expandAll : collapseAll}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 hover:border-[#0057FF] hover:text-[#0057FF] shadow-sm transition-colors">
              {allCollapsed ? <><ChevronsUpDown size={14} /> Expand all</> : <><ChevronsDownUp size={14} /> Collapse all</>}
            </button>
          )}
        </div>

        {/* Hot match chips */}
        {!query && hotGroups.length > 0 && (
          <div className="mb-6 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
            <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Flame size={13} /> Deals you can broker right now
            </p>
            <div className="flex flex-wrap gap-2">
              {hotGroups.map((g) => (
                <a key={g.slug} href={`#cat-${g.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-white px-3 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors">
                  {catName(g.slug)}
                  <span className="text-[10px] text-orange-500">{g.sellers.length}🟢 · {g.buyers.length}🔵</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Category sections */}
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <Handshake size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">{query ? 'No matches for your search.' : 'No buyers or sellers yet.'}</p>
            <p className="text-slate-400 text-sm mt-1">{query ? 'Try a different keyword.' : 'Add your first phone/WhatsApp lead to start building the pool.'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {groups.map((g) => {
              const isOpen = !collapsed.has(g.slug);
              return (
              <div key={g.slug} id={`cat-${g.slug}`} className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${g.hot ? 'border-orange-300 ring-1 ring-orange-200' : 'border-slate-200'}`}>
                <button onClick={() => toggleCat(g.slug)}
                  className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors ${g.hot ? 'bg-orange-50 hover:bg-orange-100' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <h2 className="font-bold text-[#0D1B3E] flex items-center gap-2">
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                    {g.hot && <Flame size={15} className="text-orange-500" />}
                    {catName(g.slug)}
                  </h2>
                  <span className="text-xs font-semibold text-slate-500">
                    {g.sellers.length} selling · {g.buyers.length} buying
                  </span>
                </button>
                {isOpen && (
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  {/* Sellers */}
                  <div className="p-4">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3 flex items-center gap-1">
                      <Package size={12} /> Selling ({g.sellers.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {g.sellers.length === 0
                        ? <p className="text-xs text-slate-400 italic">No sellers in this category.</p>
                        : g.sellers.map((p) => <PartyCard key={p.id} p={p} onEdit={setEditing} onDelete={handleDelete} onRecordDeal={recordDeal} />)}
                    </div>
                  </div>
                  {/* Buyers */}
                  <div className="p-4">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-1">
                      <ArrowLeftRight size={12} /> Buying ({g.buyers.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {g.buyers.length === 0
                        ? <p className="text-xs text-slate-400 italic">No buyers in this category.</p>
                        : g.buyers.map((p) => <PartyCard key={p.id} p={p} onEdit={setEditing} onDelete={handleDelete} onRecordDeal={recordDeal} />)}
                    </div>
                  </div>
                </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>

      {(showAdd || editing) && (
        <AddLeadModal
          existing={editing}
          onClose={() => { setShowAdd(false); setEditing(null); }}
          onSaved={() => { setShowAdd(false); setEditing(null); router.refresh(); }}
        />
      )}
      {dealPrefill && (
        <DealFormModal
          prefill={dealPrefill}
          onClose={() => setDealPrefill(null)}
          onSaved={() => { setDealPrefill(null); router.refresh(); }}
        />
      )}
    </div>
  );
}

// ── Add-lead modal ────────────────────────────────────────────────────
function AddLeadModal({ existing, onClose, onSaved }: { existing?: Party | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!existing;
  const [side, setSide] = useState<'for_sale' | 'wanted'>(existing ? (existing.kind === 'buyer' ? 'wanted' : 'for_sale') : 'for_sale');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [f, setF] = useState({
    name: existing?.equipment ?? '', category: existing?.category ?? '',
    manufacturer: existing?.manufacturer ?? '', model: existing?.model ?? '',
    price: existing?.price != null ? String(existing.price) : '', location: existing?.location ?? '',
    contactName: existing?.contactName ?? '', contactCompany: existing?.contactCompany ?? '',
    contactPhone: existing?.contactPhone ?? '', contactEmail: existing?.contactEmail ?? '',
    note: existing?.note ?? '',
  });
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    setBusy(true); setErr(null);
    try {
      const res = await fetch('/api/admin/leads', {
        method: isEdit ? 'PATCH' : 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(isEdit ? { id: existing!.id } : {}), side, ...f }),
      });
      const j = await res.json();
      if (!res.ok) { setErr(j.error || 'Failed to save'); return; }
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to save');
    } finally { setBusy(false); }
  };

  const input = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0057FF]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 sticky top-0 bg-white">
          <h3 className="font-bold text-[#0D1B3E]">{isEdit ? 'Edit lead' : 'Add a lead to the pool'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          {/* Side toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setSide('for_sale')}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${side === 'for_sale' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500'}`}>
              🟢 Has equipment (Seller)
            </button>
            <button onClick={() => setSide('wanted')}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${side === 'wanted' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'}`}>
              🔵 Wants equipment (Buyer)
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Equipment *</label>
            <input className={input} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Portable Ultrasound" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Category</label>
            <select className={input} value={f.category} onChange={(e) => set('category', e.target.value)}>
              <option value="">— Select —</option>
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.nameEn}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Manufacturer</label>
              <input className={input} value={f.manufacturer} onChange={(e) => set('manufacturer', e.target.value)} placeholder="e.g. GE" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Model</label>
              <input className={input} value={f.model} onChange={(e) => set('model', e.target.value)} placeholder="e.g. Voluson S10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">{side === 'wanted' ? 'Budget' : 'Price'} (SAR)</label>
              <input className={input} value={f.price} onChange={(e) => set('price', e.target.value)} placeholder="optional" inputMode="numeric" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">City</label>
              <input className={input} value={f.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Riyadh" />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 mt-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Contact</p>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Name *</label>
                  <input className={input} value={f.contactName} onChange={(e) => set('contactName', e.target.value)} placeholder="Person's name" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Company</label>
                  <input className={input} value={f.contactCompany} onChange={(e) => set('contactCompany', e.target.value)} placeholder="Hospital / clinic" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Phone / WhatsApp</label>
                  <input className={input} value={f.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} placeholder="05xxxxxxxx" inputMode="tel" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Email</label>
                  <input className={input} value={f.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} placeholder="optional" inputMode="email" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Note</label>
            <textarea className={input} rows={2} value={f.note} onChange={(e) => set('note', e.target.value)} placeholder="Anything useful — condition, urgency, target price…" />
          </div>

          {err && <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{err}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={submit} disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0057FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a6aff] disabled:opacity-60">
            {busy ? <Loader2 size={14} className="animate-spin" /> : (isEdit ? <Pencil size={14} /> : <Plus size={14} />)} {isEdit ? 'Save changes' : 'Add to pool'}
          </button>
        </div>
      </div>
    </div>
  );
}
