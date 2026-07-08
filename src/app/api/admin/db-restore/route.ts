import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Allow large file uploads (up to ~50 MB) — SQLite DBs are small but listings with
// embedded base64 images can balloon
export const maxDuration = 60;

function isAdmin(req: NextRequest) {
  return req.cookies.get('medeqx_admin')?.value === process.env.ADMIN_TOKEN;
}

function resolveDbPath(): string {
  const url = process.env.DATABASE_URL ?? '';
  const m = url.match(/^file:(.+)$/);
  if (m) {
    const raw = m[1];
    return path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
  }
  return path.resolve(process.cwd(), 'prisma/prod.db');
}

// SQLite magic header: "SQLite format 3\000" (16 bytes)
const SQLITE_MAGIC = Buffer.from('SQLite format 3\0', 'utf8');

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded — expected multipart field named "file"' }, { status: 400 });
    }

    const arrayBuf = await file.arrayBuffer();
    const incoming = Buffer.from(arrayBuf);

    // Validate: must be a SQLite file
    if (incoming.length < 16 || !incoming.subarray(0, 16).equals(SQLITE_MAGIC)) {
      return NextResponse.json({
        error: 'Invalid file — header does not match SQLite format. Make sure you upload a .db file created by MedeqX backup.',
      }, { status: 400 });
    }

    const dbPath = resolveDbPath();
    const dir = path.dirname(dbPath);

    // 1. Snapshot the current DB to a timestamped backup (safety net — never silently lose data)
    let snapshotPath: string | null = null;
    if (fs.existsSync(dbPath)) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      snapshotPath = path.join(dir, `prod-pre-restore-${ts}.db`);
      fs.copyFileSync(dbPath, snapshotPath);
    }

    // 2. Disconnect any active Prisma connections so we can replace the file cleanly
    try { await prisma.$disconnect(); } catch { /* ignore */ }

    // 3. Write the new file atomically (write to .tmp then rename)
    const tmpPath = dbPath + '.tmp';
    fs.writeFileSync(tmpPath, incoming);
    fs.renameSync(tmpPath, dbPath);

    // 4. Reconnect Prisma + verify by running a trivial count query
    let listingCount: number | string = 'unknown';
    try {
      await prisma.$connect();
      listingCount = await prisma.listing.count();
    } catch (e) {
      // Restore the snapshot if verification fails
      if (snapshotPath) fs.copyFileSync(snapshotPath, dbPath);
      try { await prisma.$connect(); } catch { /* ignore */ }
      return NextResponse.json({
        error: 'Restore failed — uploaded file is not compatible with the current schema. Reverted to pre-restore snapshot.',
        detail: e instanceof Error ? e.message : 'unknown',
        snapshot: snapshotPath,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Database restored successfully. Restart the app from cPanel for changes to fully take effect.',
      path: dbPath,
      size: incoming.length,
      snapshotKept: snapshotPath,
      listingCountAfterRestore: listingCount,
    });
  } catch (e) {
    return NextResponse.json({
      error: e instanceof Error ? e.message : 'Restore failed',
    }, { status: 500 });
  }
}
