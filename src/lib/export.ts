import type { Listing } from '@/types';

const CSV_FIELDS: { key: keyof Listing; header: string }[] = [
  { key: 'ref',           header: 'Ref' },
  { key: 'name',          header: 'Name' },
  { key: 'category',      header: 'Category' },
  { key: 'manufacturer',  header: 'Manufacturer' },
  { key: 'model',         header: 'Model' },
  { key: 'serial',        header: 'Serial' },
  { key: 'year',          header: 'Year' },
  { key: 'condition',     header: 'Condition' },
  { key: 'warranty',      header: 'Warranty' },
  { key: 'listingType',   header: 'Type' },
  { key: 'price',         header: 'Price' },
  { key: 'payment',       header: 'Payment' },
  { key: 'location',      header: 'Location' },
  { key: 'country',       header: 'Country' },
  { key: 'description',   header: 'Description' },
  { key: 'specs',         header: 'Specs' },
  { key: 'status',        header: 'Status' },
  { key: 'sellerName',    header: 'Seller Name' },
  { key: 'sellerEmail',   header: 'Seller Email' },
  { key: 'sellerPhone',   header: 'Seller Phone' },
  { key: 'sellerCompany', header: 'Seller Company' },
  { key: 'createdAt',     header: 'Created At' },
  { key: 'approvedAt',    header: 'Approved At' },
];

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString();
  const s = String(v);
  // Quote if contains comma, quote, or newline
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCSV(listings: Listing[]): string {
  const headers = CSV_FIELDS.map((f) => f.header).join(',');
  const rows = listings.map((l) =>
    CSV_FIELDS.map((f) => {
      const v = (l as unknown as Record<string, unknown>)[f.key as string];
      // Don't export images (too big for CSV)
      if (f.key === 'description' || f.key === 'specs') {
        return csvCell(typeof v === 'string' ? v.replace(/\n/g, ' ').slice(0, 500) : v);
      }
      return csvCell(v);
    }).join(',')
  );
  return [headers, ...rows].join('\n');
}

export function toJSON(listings: Listing[]): string {
  // Strip images (base64 blows up file size) — keep everything else
  return JSON.stringify(
    listings.map((l) => {
      const { images, ...rest } = l as unknown as Record<string, unknown> & { images?: string };
      void images;
      return rest;
    }),
    null,
    2
  );
}
