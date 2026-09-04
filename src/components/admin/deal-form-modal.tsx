'use client';

import { useState } from 'react';
import { X, Loader2, Handshake, Pencil } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

export interface DealFields {
  id?: string;
  equipment: string; category: string;
  sellerName: string; sellerContact: string; sellerListingRef: string;
  buyerName: string; buyerContact: string;
  salePrice: string; commission: string;
  status: 'brokered' | 'completed';
  notes: string;
}

const BLANK: DealFields = {
  equipment: '', category: '', sellerName: '', sellerContact: '', sellerListingRef: '',
  buyerName: '', buyerContact: '', salePrice: '', commission: '', status: 'brokered', notes: '',
};

export function DealFormModal({ existing, prefill, onClose, onSaved }: {
  existing?: DealFields | null;
  prefill?: Partial<DealFields> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!existing?.id;
  const [f, setF] = useState<DealFields>({ ...BLANK, ...(existing ?? {}), ...(prefill ?? {}) });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const set = (k: keyof DealFields, v: string) => setF((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    setBusy(true); setErr(null);
    try {
      const res = await fetch('/api/admin/deals', {
        method: isEdit ? 'PATCH' : 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(isEdit ? { id: existing!.id } : {}), ...f }),
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
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 sticky top-0 bg-white">
          <h3 className="font-bold text-[#0D1B3E] flex items-center gap-2">
            <Handshake size={16} className="text-[#0057FF]" /> {isEdit ? 'Edit deal' : 'Record a brokered deal'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
        </div>

        <div className="p-5 flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">Equipment *</label>
            <input className={input} value={f.equipment} onChange={(e) => set('equipment', e.target.value)} placeholder="e.g. GE Voluson S10 Ultrasound" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Category</label>
            <select className={input} value={f.category} onChange={(e) => set('category', e.target.value)}>
              <option value="">— Select —</option>
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.nameEn}</option>)}
            </select>
          </div>

          {/* Seller */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">Seller</p>
            <div className="grid grid-cols-2 gap-3">
              <input className={input} value={f.sellerName} onChange={(e) => set('sellerName', e.target.value)} placeholder="Seller name" />
              <input className={input} value={f.sellerContact} onChange={(e) => set('sellerContact', e.target.value)} placeholder="Phone / email" />
            </div>
            <input className={`${input} mt-3`} value={f.sellerListingRef} onChange={(e) => set('sellerListingRef', e.target.value)} placeholder="Listing ref (e.g. REF-1037) — which listing was sold" />
          </div>

          {/* Buyer */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">Buyer</p>
            <div className="grid grid-cols-2 gap-3">
              <input className={input} value={f.buyerName} onChange={(e) => set('buyerName', e.target.value)} placeholder="Buyer name" />
              <input className={input} value={f.buyerContact} onChange={(e) => set('buyerContact', e.target.value)} placeholder="Phone / email" />
            </div>
          </div>

          {/* Money */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Sale price (SAR)</label>
              <input className={input} value={f.salePrice} onChange={(e) => set('salePrice', e.target.value)} placeholder="e.g. 45000" inputMode="numeric" />
            </div>
            <div>
              <label className="text-xs font-semibold text-emerald-700">Your commission (SAR)</label>
              <input className={input} value={f.commission} onChange={(e) => set('commission', e.target.value)} placeholder="e.g. 1800" inputMode="numeric" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Status</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button type="button" onClick={() => set('status', 'brokered')}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold ${f.status === 'brokered' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-500'}`}>
                Brokered (in progress)
              </button>
              <button type="button" onClick={() => set('status', 'completed')}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold ${f.status === 'completed' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500'}`}>
                Completed (paid)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Notes</label>
            <textarea className={input} rows={2} value={f.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Delivery, payment terms, anything to remember…" />
          </div>

          {err && <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{err}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={submit} disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0057FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a6aff] disabled:opacity-60">
            {busy ? <Loader2 size={14} className="animate-spin" /> : (isEdit ? <Pencil size={14} /> : <Handshake size={14} />)} {isEdit ? 'Save changes' : 'Record deal'}
          </button>
        </div>
      </div>
    </div>
  );
}
