'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Package, Clock, Ban, TrendingUp, Download, ListChecks, Mail, Send, Loader2, Database, UploadCloud } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { AdminNav } from '@/components/admin/admin-nav';

interface Stats {
  totalApproved: number;
  totalPending: number;
  totalSuspended: number;
  totalValue: number;
  byCategory: Record<string, number>;
}

function StatCard({ icon: Icon, value, label, sub, color }: {
  icon: React.ElementType; value: string; label: string; sub?: string; color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {sub && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{sub}</span>}
      </div>
      <p className="text-3xl font-extrabold text-[#0D1B3E]">{value}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
  );
}

export function AdminDashboardClient({ stats }: { stats: Stats }) {
  const [emailDiag, setEmailDiag] = useState<string | null>(null);
  const [emailBusy, setEmailBusy] = useState<'check' | 'send' | null>(null);
  const [dbMsg, setDbMsg] = useState<string | null>(null);
  const [dbBusy, setDbBusy] = useState<'backup' | 'restore' | null>(null);
  const dbFileRef = useRef<HTMLInputElement>(null);

  const handleExport = (format: 'json' | 'csv') => {
    window.open(`/api/admin/export?format=${format}`, '_blank');
  };

  const handleDbBackup = () => {
    // Direct link download — browser handles the file save dialog
    setDbBusy('backup');
    setDbMsg(null);
    try {
      const link = document.createElement('a');
      link.href = '/api/admin/db-backup';
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDbMsg('✓ Backup download started — check your browser downloads folder.');
    } catch (e) {
      setDbMsg('✗ ' + (e instanceof Error ? e.message : 'Backup failed'));
    } finally {
      setTimeout(() => setDbBusy(null), 800);
    }
  };

  const handleDbRestore = async (file: File) => {
    if (!confirm(
      `RESTORE DATABASE FROM "${file.name}"?\n\n` +
      `This will REPLACE your current database with the uploaded file. ` +
      `A safety snapshot of the current DB will be saved on the server first.\n\n` +
      `Continue?`
    )) {
      if (dbFileRef.current) dbFileRef.current.value = '';
      return;
    }
    setDbBusy('restore');
    setDbMsg(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/db-restore', { method: 'POST', body: fd, credentials: 'include' });
      const j = await res.json();
      if (res.ok) {
        setDbMsg(
          `✓ ${j.message}\n` +
          `Listings after restore: ${j.listingCountAfterRestore}\n` +
          `Safety snapshot saved on server: ${j.snapshotKept || '(none — server had no existing DB)'}\n\n` +
          `Restart the Node.js app from cPanel for changes to fully take effect.`
        );
      } else {
        setDbMsg(`✗ ${j.error}${j.detail ? `\n${j.detail}` : ''}`);
      }
    } catch (e) {
      setDbMsg('✗ ' + (e instanceof Error ? e.message : 'Restore failed'));
    } finally {
      setDbBusy(null);
      if (dbFileRef.current) dbFileRef.current.value = '';
    }
  };

  const handleEmailCheck = async () => {
    setEmailBusy('check'); setEmailDiag(null);
    try {
      const res = await fetch('/api/admin/email-test', { credentials: 'include' });
      const j = await res.json();
      setEmailDiag(JSON.stringify(j, null, 2));
    } catch (e) {
      setEmailDiag('Error: ' + (e instanceof Error ? e.message : 'request failed'));
    } finally { setEmailBusy(null); }
  };

  const handleEmailSend = async () => {
    setEmailBusy('send'); setEmailDiag(null);
    try {
      const res = await fetch('/api/admin/email-test', { method: 'POST', credentials: 'include' });
      const j = await res.json();
      setEmailDiag(res.ok
        ? `✓ Test email sent to info@medeqx.com\nMessage ID: ${j.messageId}\nAccepted: ${(j.accepted || []).join(', ')}\nRejected: ${(j.rejected || []).join(', ') || '(none)'}`
        : '✗ ' + (j.error || 'Send failed'));
    } catch (e) {
      setEmailDiag('Error: ' + (e instanceof Error ? e.message : 'request failed'));
    } finally { setEmailBusy(null); }
  };

  const maxCat = Math.max(...Object.values(stats.byCategory), 1);

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <AdminNav />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0D1B3E]">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-0.5">Real-time marketplace metrics</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleExport('csv')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-blue-200 shadow-sm transition-colors">
              <Download size={14} /> CSV
            </button>
            <button onClick={() => handleExport('json')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-blue-200 shadow-sm transition-colors">
              <Download size={14} /> JSON
            </button>
          </div>
        </div>

        {/* Email diagnostic panel */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-[#0057FF]" />
              <h3 className="font-bold text-[#0D1B3E]">Email Diagnostics</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={handleEmailCheck} disabled={!!emailBusy}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors disabled:opacity-60">
                {emailBusy === 'check' ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />} Check SMTP Config
              </button>
              <button onClick={handleEmailSend} disabled={!!emailBusy}
                className="flex items-center gap-1.5 rounded-lg bg-[#0057FF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1a6aff] transition-colors disabled:opacity-60">
                {emailBusy === 'send' ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Send Test Email
              </button>
            </div>
          </div>
          {emailDiag ? (
            <pre className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap">{emailDiag}</pre>
          ) : (
            <p className="text-xs text-slate-500">
              Check that SMTP credentials are configured. &quot;Send Test Email&quot; will deliver a real email to <strong>info@medeqx.com</strong>.
            </p>
          )}
        </div>

        {/* Database backup & restore panel */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-[#0057FF]" />
              <h3 className="font-bold text-[#0D1B3E]">Database Backup &amp; Restore</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={handleDbBackup} disabled={!!dbBusy}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors disabled:opacity-60">
                {dbBusy === 'backup' ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} Download Backup
              </button>
              <button onClick={() => dbFileRef.current?.click()} disabled={!!dbBusy}
                className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-60">
                {dbBusy === 'restore' ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />} Restore From Backup
              </button>
              <input ref={dbFileRef} type="file" accept=".db,.sqlite,.sqlite3,application/octet-stream"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDbRestore(f); }}
                className="hidden" />
            </div>
          </div>
          {dbMsg ? (
            <pre className={`rounded-lg border p-3 text-xs overflow-x-auto whitespace-pre-wrap ${dbMsg.startsWith('✓') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'}`}>{dbMsg}</pre>
          ) : (
            <p className="text-xs text-slate-500">
              <strong className="text-slate-700">Backup</strong> downloads a <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">.db</code> file containing every listing, inquiry, and counter — your complete database in one file.
              {' '}<strong className="text-slate-700">Restore</strong> replaces the live database with the file you upload (a safety snapshot is automatically saved on the server first).
              Restart the Node.js app from cPanel after a restore.
            </p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Package} value={stats.totalApproved.toString()} label="Live Listings" color="#0057FF" />
          <StatCard icon={TrendingUp} value={`SAR ${(stats.totalValue / 1_000_000).toFixed(1)}M`}
            label="Total Exchange Value" sub="Approved" color="#10B981" />
          <StatCard icon={Clock} value={stats.totalPending.toString()} label="Pending Approval"
            sub={stats.totalPending > 0 ? 'Action needed' : undefined} color="#F59E0B" />
          <StatCard icon={Ban} value={stats.totalSuspended.toString()} label="Suspended" color="#EF4444" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-[#0D1B3E] mb-5">Category Distribution</h2>
            <div className="flex flex-col gap-3">
              {CATEGORIES.map((cat) => {
                const count = stats.byCategory[cat.slug] ?? 0;
                const pct = maxCat > 0 ? Math.round((count / maxCat) * 100) : 0;
                return (
                  <div key={cat.slug}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-600">{cat.nameEn}</span>
                      <span className="text-xs font-bold text-[#0D1B3E]">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: cat.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-[#0D1B3E] mb-5">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <Link href="/admin/listings?status=pending"
                className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 hover:bg-amber-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">Review Pending Listings</span>
                </div>
                <span className="rounded-full bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5">{stats.totalPending}</span>
              </Link>
              <Link href="/admin/listings"
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <ListChecks size={16} className="text-[#0057FF]" />
                  <span className="text-sm font-semibold text-slate-700">All Listings</span>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-[#0057FF]">→</span>
              </Link>
              <a href="/post-listing" target="_blank"
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <Package size={16} className="text-[#0057FF]" />
                  <span className="text-sm font-semibold text-slate-700">Post New Listing</span>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-[#0057FF]">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
