'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Mail, Phone, Building2, MessageSquare, ExternalLink, Eye, Tag, Calendar } from 'lucide-react';
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

export function AdminInquiriesClient({ inquiries }: { inquiries: InquiryWithListing[] }) {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inquiries;
    return inquiries.filter((i) =>
      i.ref?.toLowerCase().includes(q) ||
      i.buyerName?.toLowerCase().includes(q) ||
      i.buyerEmail?.toLowerCase().includes(q) ||
      i.buyerPhone?.toLowerCase().includes(q) ||
      i.buyerCompany?.toLowerCase().includes(q) ||
      i.listing?.ref?.toLowerCase().includes(q) ||
      i.listing?.name?.toLowerCase().includes(q) ||
      i.listing?.sellerName?.toLowerCase().includes(q)
    );
  }, [inquiries, search]);

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

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <MessageSquare size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No inquiries yet</p>
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
                    <Eye size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/40 px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
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
