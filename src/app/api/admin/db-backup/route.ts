import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  return req.cookies.get('medeqx_admin')?.value === process.env.ADMIN_TOKEN;
}

/**
 * Resolve the SQLite file path from DATABASE_URL (handles both absolute and
 * relative file: URLs). Falls back to the conventional path next to the app root.
 */
function resolveDbPath(): string {
  const url = process.env.DATABASE_URL ?? '';
  const m = url.match(/^file:(.+)$/);
  if (m) {
    const raw = m[1];
    return path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
  }
  return path.resolve(process.cwd(), 'prisma/prod.db');
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dbPath = resolveDbPath();
  try {
    const stat = fs.statSync(dbPath);
    const buf = fs.readFileSync(dbPath);
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19); // 2026-05-17T14-32-08
    const filename = `medeqx-backup-${ts}.db`;

    return new NextResponse(buf as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(stat.size),
        'X-DB-Path': dbPath,
        'X-DB-Size': String(stat.size),
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return NextResponse.json({
      error: 'Backup failed',
      path: dbPath,
      detail: e instanceof Error ? e.message : 'unknown',
    }, { status: 500 });
  }
}
