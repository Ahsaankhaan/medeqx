import { NextRequest, NextResponse } from 'next/server';
import { prisma, generateListingRef } from '@/lib/db';
import { CATEGORY_SLUGS } from '@/lib/categories';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  return req.cookies.get('medeqx_admin')?.value === process.env.ADMIN_TOKEN;
}

// Parse a CSV row respecting quoted fields with embedded commas / double-quote escapes
function parseCSVRow(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cur += c;
    } else {
      if (c === ',') { out.push(cur); cur = ''; }
      else if (c === '"') inQuotes = true;
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];
  const headers = parseCSVRow(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = parseCSVRow(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (cells[i] ?? '').trim(); });
    return row;
  });
}

// Normalise different field naming conventions into our schema fields
function normalize(row: Record<string, unknown>): Record<string, unknown> {
  const get = (...keys: string[]) => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') return row[k];
    }
    return undefined;
  };
  return {
    name: get('name', 'Name', 'Equipment', 'equipment_name'),
    category: get('category', 'Category'),
    manufacturer: get('manufacturer', 'Manufacturer') ?? '',
    model: get('model', 'Model') ?? '',
    serial: get('serial', 'Serial') ?? '',
    year: get('year', 'Year'),
    condition: get('condition', 'Condition') ?? 'used',
    warranty: get('warranty', 'Warranty') ?? 'none',
    listingType: get('listingType', 'listing_type', 'Type') ?? 'for_sale',
    price: get('price', 'Price', 'Price (SAR)'),
    payment: get('payment', 'Payment') ?? '',
    location: get('location', 'Location', 'City') ?? '',
    country: get('country', 'Country') ?? 'Saudi Arabia',
    description: get('description', 'Description') ?? '',
    specs: get('specs', 'Specs', 'Specifications') ?? '',
    images: get('images', 'Images') ?? '[]',
    services: get('services', 'Services') ?? '[]',
    sellerName: get('sellerName', 'seller_name', 'Seller Name', 'Seller') ?? '',
    sellerEmail: get('sellerEmail', 'seller_email', 'Seller Email', 'Email') ?? '',
    sellerPhone: get('sellerPhone', 'seller_phone', 'Seller Phone', 'Phone') ?? '',
    sellerCompany: get('sellerCompany', 'seller_company', 'Seller Company', 'Company') ?? '',
    status: get('status', 'Status') ?? 'pending',
  };
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const contentType = req.headers.get('content-type') || '';
    const body = await req.text();

    let rows: Record<string, unknown>[];
    if (contentType.includes('application/json')) {
      const parsed = JSON.parse(body);
      rows = Array.isArray(parsed) ? parsed : parsed.listings || [];
    } else {
      rows = parseCSV(body);
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No rows to import' }, { status: 400 });
    }

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const d = normalize(rows[i] as Record<string, unknown>);
      try {
        // Minimum validation
        if (!d.name || !d.sellerName || !d.sellerEmail) {
          skipped++;
          errors.push(`Row ${i + 2}: missing name/sellerName/sellerEmail`);
          continue;
        }
        if (d.category && !CATEGORY_SLUGS.includes(d.category as string)) {
          // Allow unknown category but warn
          errors.push(`Row ${i + 2}: unknown category "${d.category}" — saved as-is`);
        }

        const ref = await generateListingRef();

        await prisma.listing.create({
          data: {
            ref,
            name: String(d.name),
            category: String(d.category || 'parts-accessories'),
            manufacturer: String(d.manufacturer || ''),
            model: String(d.model || ''),
            serial: String(d.serial || ''),
            year: d.year ? parseInt(String(d.year)) : null,
            condition: String(d.condition || 'used'),
            warranty: String(d.warranty || 'none'),
            listingType: String(d.listingType || 'for_sale'),
            price: d.price ? parseFloat(String(d.price)) : null,
            payment: String(d.payment || ''),
            location: String(d.location || ''),
            country: String(d.country || 'Saudi Arabia'),
            description: String(d.description || ''),
            specs: String(d.specs || ''),
            images: String(d.images || '[]'),
            services: String(d.services || '[]'),
            sellerName: String(d.sellerName),
            sellerEmail: String(d.sellerEmail),
            sellerPhone: String(d.sellerPhone || ''),
            sellerCompany: String(d.sellerCompany || ''),
            status: String(d.status || 'pending'),
            approvedAt: ['approved', 'sold'].includes(String(d.status || '')) ? new Date() : null,
          },
        });
        created++;
      } catch (err) {
        skipped++;
        errors.push(`Row ${i + 2}: ${err instanceof Error ? err.message : 'unknown error'}`);
      }
    }

    return NextResponse.json({ success: true, created, skipped, errors: errors.slice(0, 20) });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Import failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
