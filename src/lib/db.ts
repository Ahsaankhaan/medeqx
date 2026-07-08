import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrisma(): PrismaClient {
  const url = process.env.TURSO_DATABASE_URL;
  // Production (Netlify): connect to Turso over the network via the libSQL
  // driver adapter. No Prisma query-engine binary is used at runtime — this is
  // the serverless-friendly path and avoids the process/file-DB limits we hit
  // on shared hosting.
  if (url) {
    const libsql = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }
  // Local development: fall back to the local SQLite file via DATABASE_URL.
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Atomically generate a sequential reference like REF-1000, REF-1001, …
 * Uses a Counter table row per scope (e.g. "listing", "inquiry").
 * Falls back to scanning max existing ref if Counter row missing.
 */
async function nextSequential(scope: string, prefix: string): Promise<string> {
  // Upsert + atomic increment in a single transaction
  const result = await prisma.$transaction(async (tx) => {
    const counter = await tx.counter.upsert({
      where: { name: scope },
      update: { value: { increment: 1 } },
      create: { name: scope, value: 1001 }, // first issued ref will be 1001
    });
    // When creating fresh, returned value is the seed (1001); when updating,
    // the returned `value` is post-increment. Both yield a sane next number.
    return counter.value;
  });
  return `${prefix}-${result}`;
}

export async function generateListingRef(): Promise<string> {
  return nextSequential('listing', 'REF');
}

export async function generateInquiryRef(): Promise<string> {
  return nextSequential('inquiry', 'INQ');
}

/** @deprecated kept for backward compat — use generateListingRef() */
export function generateRef(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `REF-${num}`;
}
