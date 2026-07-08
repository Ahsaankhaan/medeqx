'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, ArrowLeft, Camera, X, ImagePlus } from 'lucide-react';
import Link from 'next/link';
import { CATEGORIES, LOCATIONS } from '@/lib/categories';
import type { Listing } from '@/types';

function inputCls() {
  return 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0D1B3E] outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/10 transition-all';
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-slate-600 mb-1.5">{children}</label>;
}

const MAX_W = 1200;
const MAX_H = 900;

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_W) { height = Math.round(height * MAX_W / width); width = MAX_W; }
      if (height > MAX_H) { width = Math.round(width * MAX_H / height); height = MAX_H; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };
    img.src = url;
  });
}

function parseImages(raw: string | undefined | null): string[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch { return []; }
}

export function AdminEditClient({ listing }: { listing: Listing }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [compressing, setCompressing] = useState(false);
  const [images, setImages] = useState<string[]>(parseImages(listing.images as unknown as string));

  const [form, setForm] = useState({
    name: listing.name,
    category: listing.category,
    manufacturer: listing.manufacturer,
    model: listing.model ?? '',
    serial: listing.serial ?? '',
    year: listing.year?.toString() ?? '',
    condition: listing.condition,
    warranty: listing.warranty ?? 'none',
    listingType: listing.listingType,
    price: listing.price?.toString() ?? '',
    payment: listing.payment ?? '',
    location: listing.location,
    description: listing.description,
    specs: listing.specs ?? '',
    status: listing.status,
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setCompressing(true);
    const maxAdd = Math.min(files.length, 10 - images.length); // cap at 10
    const next: string[] = [];
    for (let i = 0; i < maxAdd; i++) {
      next.push(await compressImage(files[i]));
    }
    setImages((prev) => [...prev, ...next]);
    setCompressing(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDeleteImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true); setError('');
    const res = await fetch(`/api/listings/${listing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, images: JSON.stringify(images) }),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => { router.push('/admin/listings'); router.refresh(); }, 1200); }
    else { const j = await res.json().catch(() => ({})); setError(j.error ?? 'Save failed'); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <nav className="bg-[#0D1B3E] text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/listings" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to Listings
        </Link>
        <span className="text-slate-600">|</span>
        <span className="font-bold text-white">Edit Listing</span>
        <span className="text-slate-400 font-mono text-xs">{listing.ref}</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-5">

          {/* Images section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-[#0D1B3E] mb-1">Images</h2>
            <p className="text-xs text-slate-400 mb-4">Up to 10 photos. Automatically compressed.</p>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
              {images.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(i)}
                    className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/70 hover:bg-red-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete image"
                  >
                    <X size={12} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-[#0057FF] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase">Cover</span>
                  )}
                </div>
              ))}
              {images.length < 10 && (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:border-[#0057FF] hover:bg-blue-50 transition-all">
                  {compressing
                    ? <Loader2 size={20} className="animate-spin text-slate-400" />
                    : <ImagePlus size={20} className="text-slate-400" />}
                  <span className="text-[10px] text-slate-400 font-semibold">Add</span>
                </button>
              )}
            </div>

            <input ref={fileRef} type="file" multiple accept="image/*"
              onChange={(e) => handleUpload(e.target.files)} className="hidden" />

            {images.length === 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                <Camera size={12} /> No images yet — click + to upload.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-[#0D1B3E] mb-5">Equipment Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Equipment Name</Label>
                <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls()} />
              </div>
              <div>
                <Label>Category</Label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls()}>
                  {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.nameEn}</option>)}
                </select>
              </div>
              <div>
                <Label>Manufacturer</Label>
                <input value={form.manufacturer} onChange={(e) => set('manufacturer', e.target.value)} className={inputCls()} />
              </div>
              <div>
                <Label>Model</Label>
                <input value={form.model} onChange={(e) => set('model', e.target.value)} className={inputCls()} />
              </div>
              <div>
                <Label>Serial</Label>
                <input value={form.serial} onChange={(e) => set('serial', e.target.value)} className={inputCls()} />
              </div>
              <div>
                <Label>Year</Label>
                <input value={form.year} onChange={(e) => set('year', e.target.value)} className={inputCls()} />
              </div>
              <div>
                <Label>Location</Label>
                <select value={form.location} onChange={(e) => set('location', e.target.value)} className={inputCls()}>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-[#0D1B3E] mb-4">Condition & Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Condition</Label>
                <select value={form.condition} onChange={(e) => set('condition', e.target.value)} className={inputCls()}>
                  <option value="new">New</option>
                  <option value="refurbished">Refurbished</option>
                  <option value="used">Used</option>
                  <option value="parts">For Parts / Defective</option>
                </select>
              </div>
              <div>
                <Label>Listing Type</Label>
                <select value={form.listingType} onChange={(e) => set('listingType', e.target.value)} className={inputCls()}>
                  <option value="for_sale">For Sale</option>
                  <option value="wanted">Wanted</option>
                </select>
              </div>
              <div>
                <Label>Warranty</Label>
                <select value={form.warranty} onChange={(e) => set('warranty', e.target.value)} className={inputCls()}>
                  <option value="none">None</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="extendable">Extendable</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-[#0D1B3E] mb-4">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Price (SAR)</Label>
                <input value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="Leave blank for By Inquiry" className={inputCls()} />
              </div>
              <div>
                <Label>Payment Method</Label>
                <select value={form.payment} onChange={(e) => set('payment', e.target.value)} className={inputCls()}>
                  <option value="">Not specified</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="installment">Installment</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-[#0D1B3E] mb-4">Description & Specs</h2>
            <div className="flex flex-col gap-4">
              <div>
                <Label>Description</Label>
                <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
                  rows={4} className={`${inputCls()} resize-none`} />
              </div>
              <div>
                <Label>Technical Specifications</Label>
                <textarea value={form.specs} onChange={(e) => set('specs', e.target.value)}
                  rows={3} className={`${inputCls()} resize-none`} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-[#0D1B3E] mb-4">Listing Status</h2>
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls()}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="suspended">Suspended</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}

          <div className="flex gap-3">
            <Link href="/admin/listings"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:border-slate-300 transition-colors">
              Cancel
            </Link>
            <button onClick={handleSave} disabled={saving || saved}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0057FF] py-3 text-sm font-bold text-white hover:bg-[#1a6aff] disabled:opacity-60 transition-colors">
              {saved ? <><CheckCircle2 size={14} /> Saved!</> : saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
