'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Mail, Phone, Building2, MessageSquare, ExternalLink, Eye, Tag, Calendar, CheckCircle2, XCircle, RotateCcw, Trash2, Loader2 } from 'lucide-react';
import { AdminNav } from '@/components/admin/admin-nav';
import { Badge } from '@/components/ui/badge';
import type { ListingStatus } from '@/types';

type InquiryWithListing = {
  id: string;
  ref: string | null;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCompany: string;
  message: string;
  services?: string;
  status?: string;
  createdAt: string;
  listing: {
    id: string;
    ref: string;
    name: string;
    category: string;
    manufacturer: string;
    model: string;
    price: number | null;
    location: string;
    status: string;
    sellerName: string;
    sellerEmail: string;
    sellerPhone: string;
    services: string;
  };
};

function parseServices(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const a = JSON.parse(raw);
    return Array.isArray(a) ? a.filter((x) => typeof x === 'string') : [];
  } catch { return []; }
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
  open:      { label: 'Open',      cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  closed:    { label: 'Closed',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
};
function StatusPill({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META.open;
  return <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${m.cls}`}>{m.label}</span>;
}

const FILTERS = ['all', 'open', 'closed', 'cancelled'] as const;

export function AdminInquiriesClient({ inquiries }: { inquiries: InquiryWithListing[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<(typeof FILTERS)[number]>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const st = (i: InquiryWithListing) => i.status || 'open';

  const setStatus = async (id: string, status: string) => {
    setBusyId(id);
    try {
      await fetch('/api/admin/inquiries', {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }),
      });
      router.refresh();
    } finally { setBusyId(null); }
  };
  const remove = async (id: string) => {
    if (!confirm('Permanently delete this inquiry? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await fetch('/api/admin/inquiries', {
        method: 'DELETE', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
      });
      router.refresh();
    } finally { setBusyId(null); }
  };

  const counts = useMemo(() => {
    const c = { all: inquiries.length, open: 0, closed: 0, cancelled: 0 } as Record<string, number>;
    for (const i of inquiries) c[st(i)] = (c[st(i)] ?? 0) + 1;
    return c;
  }, [inquiries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((i) => {
      if (tab !== 'all' && st(i) !== tab) return false;
      if (!q) return true;
      return (
        i.ref?.toLowerCase().includes(q) ||
        i.buyerName?.toLowerCase().includes(q) ||
        i.buyerEmail?.toLowerCase().includes(q) ||
        i.buyerPhone?.toLowerCase().includes(q) ||
        i.buyerCompany?.toLowerCase().includes(q) ||
        i.listing?.ref?.toLowerCase().includes(q) ||
        i.listing?.name?.toLowerCase().includes(q) ||
        i.listing?.sellerName?.toLowerCase().includes(q)
      );
    });
  }, [inquiries, search, tab]);

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0D1B3E]">Inquiries</h1>
            <p className="text-sm text-slate-500 mt-1">{filtered.length} buyer inquiry{filtered.length === 1 ? '' : 'ies'}</p>
          </div>
          <div className="relative min-w-[280px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by INQ ref, buyer, email, REF, listing, seller…"
              className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-4 py-2 text-sm outline-none focus:border-[#0057FF] shadow-sm transition-colors" />
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setTab(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors border ${
                tab === f ? 'bg-[#0057FF] text-white border-[#0057FF]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#0057FF]'
              }`}>
              {f} <span className={tab === f ? 'text-white/80' : 'text-slate-400'}>({counts[f] ?? 0})</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <MessageSquare size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No inquiries {tab === 'all' ? 'yet' : `marked "${tab}"`}</p>
            <p className="text-slate-400 text-sm mt-1">When buyers submit an inquiry, it will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((inq) => {
              const services = parseServices(inq.services);
              const listingServices = parseServices(inq.listing?.services);
              const isOpen = openId === inq.id;

              return (
                <div key={inq.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  {/* Header row — always visible */}
                  <button onClick={() => setOpenId(isOpen ? null : inq.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50/50 transition-colors">
                    <div className="font-mono text-xs font-bold text-[#0057FF] shrink-0 w-20">
                      {inq.ref || '—'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#0D1B3E] truncate">{inq.buyerName}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {inq.buyerEmail}
                        {inq.buyerCompany && <> · {inq.buyerCompany}</>}
                      </div>
                    </div>
                    <div className="hidden md:flex flex-col items-end min-w-[180px]">
                      <div className="text-xs text-slate-400">Listing</div>
                      <div className="text-sm font-semibold text-[#0D1B3E] truncate max-w-[200px]">
                        {inq.listing?.name || '— (deleted)'}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">{inq.listing?.ref}</div>
                    </div>
                    <div className="hidden sm:block text-xs text-slate-400 whitespace-nowrap min-w-[100px] text-right">
                      {new Date(inq.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </div>
                    <StatusPill status={st(inq)} />
                    <Eye size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                   <div className="border-t border-slate-100 bg-slate-50/40">
                    {/* Action bar */}
                    <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-slate-100">
                      <span className="text-xs font-semibold text-slate-400 mr-1">Mark as:</span>
                      {st(inq) !== 'closed' && (
                        <button onClick={() => setStatus(inq.id, 'closed')} disabled={busyId === inq.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-60">
                          {busyId === inq.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />} Closed
                        </button>
                      )}
                      {st(inq) !== 'cancelled' && (
                        <button onClick={() => setStatus(inq.id, 'cancelled')} disabled={busyId === inq.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-60">
                          <XCircle size={12} /> Cancelled
                        </button>
                      )}
                      {st(inq) !== 'open' && (
                        <button onClick={() => setStatus(inq.id, 'open')} disabled={busyId === inq.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-60">
                          <RotateCcw size={12} /> Reopen
                        </button>
                      )}
                      <button onClick={() => remove(inq.id)} disabled={busyId === inq.id}
                        className="ml-auto inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                    <div className="px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Buyer details */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Buyer Information</h3>
                        <div className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col gap-2 text-sm">
                          <div className="font-semibold text-[#0D1B3E]">{inq.buyerName}</div>
                          <a href={`mailto:${inq.buyerEmail}`} className="flex items-center gap-2 text-[#0057FF] hover:underline">
                            <Mail size={13} /> {inq.buyerEmail}
                          </a>
                          {inq.buyerPhone && (
                            <a href={`tel:${inq.buyerPhone}`} className="flex items-center gap-2 text-slate-700 hover:text-[#0057FF]">
                              <Phone size={13} /> {inq.buyerPhone}
                            </a>
                          )}
                          {inq.buyerCompany && (
                            <div className="flex items-center gap-2 text-slate-700">
                              <Building2 size={13} /> {inq.buyerCompany}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                            <Calendar size={11} /> {new Date(inq.createdAt).toLocaleString('en-GB')}
                          </div>
                        </div>

                        {inq.message && (
                          <>
                            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mt-4 mb-2">Message</h3>
                            <div className="rounded-xl bg-white border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {inq.message}
                            </div>
                          </>
                        )}

                        {services.length > 0 && (
                          <>
                            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mt-4 mb-2">Additional Services Requested</h3>
                            <div className="flex flex-wrap gap-1.5">
                              {services.map((s) => (
                                <span key={s} className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                                  <Tag size={10} className="inline mr-1" /> {s}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Listing details */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Listing</h3>
                        {inq.listing ? (
                          <div className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col gap-2 text-sm">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-semibold text-[#0D1B3E]">{inq.listing.name}</div>
                                <div className="text-xs text-slate-400 font-mono">{inq.listing.ref}</div>
                              </div>
                              <Badge variant={inq.listing.status as ListingStatus} />
                            </div>
                            <div className="text-xs text-slate-500">{inq.listing.manufacturer} {inq.listing.model}</div>
                            <div className="flex items-center justify-between text-sm mt-2">
                              <span className="font-bold text-[#0057FF]">
                                {inq.listing.price ? `SAR ${inq.listing.price.toLocaleString()}` : 'By Inquiry'}
                              </span>
                              <span className="text-xs text-slate-400">{inq.listing.location}</span>
                            </div>
                            <div className="border-t border-slate-100 pt-3 mt-2">
                              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Seller</div>
                              <div className="text-sm text-[#0D1B3E]">{inq.listing.sellerName}</div>
                              <a href={`mailto:${inq.listing.sellerEmail}`} className="text-xs text-[#0057FF] hover:underline block">{inq.listing.sellerEmail}</a>
                              {inq.listing.sellerPhone && (
                                <a href={`tel:${inq.listing.sellerPhone}`} className="text-xs text-slate-600 hover:text-[#0057FF] block">{inq.listing.sellerPhone}</a>
                              )}
                            </div>
                            {listingServices.length > 0 && (
                              <div className="border-t border-slate-100 pt-3 mt-2">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Services Offered on Listing</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {listingServices.map((s) => (
                                    <span key={s} className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-medium text-[#0057FF]">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="flex gap-2 mt-3">
                              <Link href={`/listings/${inq.listing.id}`} target="_blank"
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors">
                                View Listing <ExternalLink size={11} />
                              </Link>
                              <Link href={`/admin/listings/${inq.listing.id}/edit`}
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#0057FF] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1a6aff] transition-colors">
                                Edit Listing
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl bg-white border border-slate-200 p-4 text-sm text-slate-400">
                            Listing was deleted.
                          </div>
                        )}
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
    </div>
  );
}
