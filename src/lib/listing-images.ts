// Helpers to keep heavy base64 image blobs OUT of the HTML we ship to the
// browser. Server pages read the base64 from the DB (to know how many images a
// listing has) but pass the client only lightweight URL references to the cached
// /api/img route. This dropped the homepage payload from ~1.75 MB to ~30 KB.
//
// The array LENGTH is preserved so all existing rendering logic (galleries,
// "has image?" checks, thumbnail strips) keeps working unchanged — each entry is
// simply a URL like `/api/img/<id>/0` instead of a `data:image/...;base64,...`.

type WithImages = { id: string; images: string };

/** Return a shallow copy of `listing` with `images` rewritten to route URLs. */
export function withImageRefs<T extends WithImages>(listing: T): T {
  let count = 0;
  try {
    const a = JSON.parse(listing.images || '[]');
    if (Array.isArray(a)) count = a.length;
  } catch {
    /* malformed — treat as no images */
  }
  const refs = Array.from({ length: count }, (_, i) => `/api/img/${listing.id}/${i}`);
  return { ...listing, images: JSON.stringify(refs) };
}

/** Map an array of listings through {@link withImageRefs}. */
export function mapImageRefs<T extends WithImages>(listings: T[]): T[] {
  return listings.map(withImageRefs);
}
