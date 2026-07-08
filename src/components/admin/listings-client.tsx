'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Trash2, Edit2, Eye, Search, Loader2, ShoppingBag, Download, Upload, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AdminNav } from '@/components/admin/admin-nav';
import type { Listing, ListingCondition, ListingStatus } from '@/types';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'sold', label: 'Sold' },
] as const;

export function AdminListingsClient({
  listings: initial,
  initialStatus,
  initialQ,
}: {
  listings: Listing[];
  initialStatus: string;
  initialQ: string;
}) {
  const [listings, setListings] = useState<Listing[]>(initial);
  const [search, setSearch] = useState(initialQ);
  const [activeStatus, setActiveStatus] = useState(initialStatus);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side filtering — instant tab switching
  const filtered = useMemo(() => {
    let arr = listings;
    if (activeStatus) arr = arr.filter((l) => l.status === activeStatus);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      arr = arr.filter((l) =>
        l.name?.toLowerCase().includes(q) ||
        l.ref?.toLowerCase().includes(q) ||
        l.sellerEmail?.toLowerCase().includes(q) ||
        l.sellerName?.toLowerCase().includes(q) ||
        l.sellerPhone?.toLowerCase().includes(q) ||
        l.manufacturer?.toLowerCase().includes(q) ||
        l.model?.toLowerCase().includes(q) ||
        l.location?.toLowerCase().includes(q)
      );
    }
    return arr;
  }, [listings, activeStatus, search]);

  // Counts per status (always reflect full dataset)
  const counts = useMemo(() => {
    const map: Record<string, number> = { '': listings.length };
    for (const l of listings) map[l.status] = (map[l.status] ?? 0) + 1;
    return map;
  }, [listings]);

  const doAction = async (id: string, action: 'approve' | 'suspend' | 'sold' | 'delete') => {
    setLoadingId(id);
    if (action === 'delete') {
      if (!confirm('Delete this listing permanently?')) { setLoadingId(null); return; }
      await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      setListings((prev) => prev.filter((l) => l.id !== id));
    } else {
      const res = await fetch(`/api/listings/${id}/${action}`, { method: 'POST' });
      if (res.ok) {
        const newStatus = action === 'approve' ? 'approved' : action === 'suspend' ? 'suspended' : 'sold';
        setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
      }
    }
    setLoadingId(null);
  };

  const handleExport = (format: 'csv' | 'json') => {
    window.location.href = `/api/admin/export?format=${format}`;
  };

  const handleImport = async (file: File) => {
    setImporting(true);
    setImportMessage(null);
    try {
      const text = await file.text();
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': file.name.endsWith('.json') ? 'application/json' : 'text/csv' },
        body: text,
      });
      const j = await res.json();
      if (res.ok) {
        setImportMessage(`✓ Imported ${j.created} listings (${j.skipped} skipped)`);
        // Refresh by reloading
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportMessage(`✗ ${j.error || 'Import failed'}`);
      }
    } catch (e) {
      setImportMessage('✗ Failed to read file');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-extrabold text-[#0D1B3E]">Listings</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 mr-2">{filtered.length} shown</span>
            <button onClick={() => handleExport('csv')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
              <Download size={13} /> Export CSV
            </button>
            <button onClick={() => handleExport('json')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
              <Download size={13} /> Export JSON
            </button>
            <button onClick={() => fileInputRef.current?.click()} disabled={importing}
              className="flex items-center gap-1.5 rounded-xl bg-[#0057FF] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1a6aff] disabled:opacity-60 transition-colors">
              {importing ? <><Loader2 size={13} className="animate-spin" /> Importing…</> : <><Upload size={13} /> Import</>}
            </button>
            <input ref={fileInputRef} type="file" accept=".csv,.json"
              onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
              className="hidden" />
          </div>
        </div>

        {importMessage && (
          <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${importMessage.startsWith('✓') ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
            {importMessage}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {STATUS_TABS.map((tab) => (
              <button key={tab.value}
                onClick={() => setActiveStatus(tab.value)}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${activeStatus === tab.value ? 'bg-[#0057FF] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                {tab.label}
                <span className={`ml-1.5 text-[10px] font-bold ${activeStatus === tab.value ? 'opacity-80' : 'opacity-60'}`}>
                  {counts[tab.value] ?? 0}
                </span>
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[200px] relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, REF, email, phone, manufacturer, location…"
              className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-4 py-2 text-sm outline-none focus:border-[#0057FF] shadow-sm transition-colors" />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">REF</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Equipment</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Condition</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Price</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Seller</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-slate-400 text-sm">No listings found.</td>
                  </tr>
                )}
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{l.ref}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#0D1B3E] max-w-[200px] truncate">{l.name}</div>
                      <div className="text-xs text-slate-400">{l.manufacturer} {l.model}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={l.condition as ListingCondition} />
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[#0D1B3E]">
                      {l.price ? `SAR ${(l.price as number).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={l.status as ListingStatus} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-xs font-semibold text-[#0D1B3E]">{l.sellerName}</div>
                      <div className="text-xs text-slate-400 truncate max-w-[160px]">{l.sellerEmail}</div>
                      {l.sellerPhone && (
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone size={10} /> {l.sellerPhone}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {loadingId === l.id ? (
                          <Loader2 size={16} className="animate-spin text-slate-400" />
                        ) : (
                          <>
                            <a href={`/listings/${l.id}`} target="_blank"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#0057FF] hover:bg-blue-50 transition-colors" title="View">
                              <Eye size={14} />
                            </a>
                            <Link href={`/admin/listings/${l.id}/edit`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors" title="Edit">
                              <Edit2 size={14} />
                            </Link>
                            {l.status !== 'approved' && l.status !== 'sold' && (
                              <button onClick={() => doAction(l.id, 'approve')}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Approve">
                                <CheckCircle size={14} />
                              </button>
                            )}
                            {l.status !== 'suspended' && l.status !== 'sold' && (
                              <button onClick={() => doAction(l.id, 'suspend')}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Suspend">
                                <XCircle size={14} />
                              </button>
                            )}
                            {l.status !== 'sold' && (
                              <button onClick={() => doAction(l.id, 'sold')}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="Mark as Sold">
                                <ShoppingBag size={14} />
                              </button>
                            )}
                            <button onClick={() => doAction(l.id, 'delete')}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
