# MedeqX — Self-Editing Quick Reference

Most copy / text edits live in **3–4 files**. Pick the section below for the change you want to make.

> **After editing:** rebuild the standalone bundle locally and upload only the changed files, or upload the next `medeqx-update-vN.zip` we ship. Direct edits in cPanel File Manager work too for plain text/copy changes — restart the Node.js app after saving.

---

## 1. Commission amount (e.g. "4% min SAR 500")

Search and replace **`SAR 500`** in these files. Update all occurrences in one go (use VS Code → Edit → Replace in Files):

| File | Where it appears |
|---|---|
| `src/lib/translations.ts`            | Footer / hero / post-listing strings |
| `src/lib/email.ts`                   | Listing-submitted / approved email templates |
| `src/app/post-listing/post-listing-client.tsx` | Consent line on the listing form |
| `src/app/about/page.tsx`             | About content |
| `src/app/verification/page.tsx`      | Verification page content |
| `src/app/guides/*/page.tsx`          | Buyer/Seller/Pricing guides |
| `src/app/manufacturers/[slug]/page.tsx` | SEO body text |
| `src/app/[slug]/page.tsx`            | Programmatic SEO body text |
| `src/components/home/trust-signals.tsx` | "Pay only on confirmed sale" card |
| `src/components/home-client.tsx`     | How-It-Works section |
| `src/components/admin/edit-client.tsx` | Admin edit page (legacy mention) |
| `src/app/terms/page.tsx`             | Legal terms |
| `src/app/faq/faq-client.tsx`         | FAQ Q&A |

**Quick search command** (VS Code → Search):
```
SAR 500
```
And replace with the new amount, then do the same for `500 ريال` (Arabic).

---

## 2. SEO keywords (English + Arabic)

Two places:

**Site-wide keywords (every page inherits these):**
- File: `src/app/layout.tsx`
- Look for: `keywords: [` (around line ~54)
- Add your new keywords as quoted strings in the array

**Per-SEO-landing-page keywords:**
- File: `src/lib/seo-pages.ts`
- Function: `seoKeywordsFor(p)` — controls what each `/used-mri-machine-riyadh`-style page returns
- Add city/equipment-specific phrases inside the relevant `if (p.kind === '...')` block

**To add a brand-new URL pattern** (e.g. a new equipment type):
1. Open `src/lib/seo-pages.ts`
2. Find `EQUIPMENT_TYPES` array at the top — add your new entry:
   ```ts
   { slug: 'my-new-equipment', nameEn: 'My New Equipment', nameAr: '...', keywords: ['keyword1', 'keyword2'] }
   ```
3. Pages auto-generate next build at `/used-my-new-equipment-saudi-arabia`, `/used-my-new-equipment-riyadh`, etc.

---

## 3. Footer (links, phone, email, address)

File: `src/components/layout/footer.tsx`

| What to change | Where |
|---|---|
| **Equipment links** in left column | `EQUIPMENT_LINKS` array (top of file) |
| **City links** | `LOCATION_LINKS` array |
| **Company links** | `COMPANY_LINKS` array |
| **Resource links** | `RESOURCE_LINKS` array |
| **Phone / WhatsApp / Email** | Inside the brand column `<div className="col-span-2 md:col-span-1">` |
| **Address** | Same brand column, look for `Dammam, Saudi Arabia` |
| **Copyright line** | Bottom strip, near `{new Date().getFullYear()}` |

Every link entry is `{ href, en, ar }` — fill all three so Arabic-language users see the right label.

---

## 4. Phone numbers (WhatsApp + Call)

The number `+966 50 556 5761` is **hardcoded in 4 places** as a safety net so the buttons always work:

| File | What it powers |
|---|---|
| `src/components/layout/whatsapp-fab.tsx` (`DEFAULT_WA` constant) | Floating WhatsApp button |
| `src/components/layout/mobile-bottom-bar.tsx` | Mobile sticky bar |
| `src/components/layout/footer.tsx` | Footer Phone + WhatsApp rows |
| `src/app/contact/contact-client.tsx` | Contact page contact info |
| `src/components/home-client.tsx` | Hero "Talk to Us on WhatsApp" CTA |

**To change the number across all of these in one step:** VS Code → Replace in Files →
- Find: `966505565761`
- Replace: your new number (digits only, no `+` or spaces)

For the display text "+966 50 556 5761" (with spaces), do a second pass.

You can also override the WhatsApp number at runtime via the cPanel env var `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits only).

---

## 5. Favicon

- File: `src/app/icon.svg`
- Edit the SVG directly. Next.js auto-generates the favicon, apple-touch-icon, and shortcut icon from this single file.

---

## 6. Logo

- Files: `public/logo.svg` (color version, on light bg) + `public/logo-white.svg` (white text, on dark bg)
- Footer uses `logo-white.svg`; navbar + team section use `logo.svg`.

---

## 7. Hero (homepage)

File: `src/components/home-client.tsx`

| Change | Where |
|---|---|
| Hero title (3 lines) | `t.hero.title1`, `t.hero.title2`, `t.hero.title3` — defined in `src/lib/translations.ts` |
| Subtitle | `t.hero.subtitle` (translations.ts) |
| Trust-signal bullets ("Verified sellers" etc.) | Hardcoded inline in the JSX, search for `Verified sellers` |
| CTA buttons | Search for `Post Your Equipment` / `Talk to Us` / `Browse Categories` |
| Stats numbers (340+ etc.) | Search for `'340+'` |

---

## 8. Categories (the 7 sections)

File: `src/lib/categories.ts`

Edit the `CATEGORIES` array. Each entry:
```ts
{ slug, nameEn, nameAr, descEn, descAr, icon, color, colorLight }
```

Changing `slug` will break existing URLs — only do it before you go live publicly.

---

## 9. Founder / Team section

- Photo file: `public/team.png` (replace this image — any 400×400 square works)
- Text (name, bio, title): `src/components/home/team-section.tsx`

---

## 10. "Trusted By" + "Recent Activity" sections

File: `src/components/home/trust-signals.tsx`

- `transactions` array — placeholder recent-deal feed
- `trustedSegments` array — institution types (replace with real hospital logos when permitted)

---

## 11. Email templates

File: `src/lib/email.ts`

Functions to edit:
- `sendListingSubmitted` — Seller "received & under review" + Admin notification
- `sendListingApproved` — Seller "now live" + Admin notification
- `sendInquiryForwarded` — Seller / Buyer / Admin emails
- `sendContactMessage` — Admin + Visitor confirmation

The `wrap()` function controls the email HTML shell (header, footer, font, MedeqX branding).

---

## 12. Admin

| Page | Component file |
|---|---|
| Dashboard | `src/components/admin/dashboard-client.tsx` |
| Listings table | `src/components/admin/listings-client.tsx` |
| Inquiries list | `src/components/admin/inquiries-client.tsx` |
| Analytics | `src/components/admin/analytics-client.tsx` |
| Edit listing | `src/components/admin/edit-client.tsx` |
| Top navigation | `src/components/admin/admin-nav.tsx` |

---

## 13. Manufacturers list

File: `src/lib/manufacturers.ts`

Add a new brand:
```ts
{ slug: 'my-brand', name: 'My Brand', nameAr: '...', aliases: ['Brand', 'My Brand'],
  description: '...', descriptionAr: '...', modalities: ['MRI', 'CT'] }
```

The slug becomes the URL: `/manufacturers/my-brand` (auto-generated) and `/my-brand-medical-equipment-saudi` (SEO page, auto-generated).

---

## 14. Cities list

File: `src/lib/cities.ts`

Add a new city:
```ts
{ slug: 'new-city', nameEn: 'New City', nameAr: '...', country: 'Saudi Arabia', countryAr: '...', searchTerm: 'New City' }
```

The slug becomes `/cities/new-city` + the SEO variants like `/used-medical-equipment-new-city` and `/used-mri-machine-new-city`.

---

## 15. Translations (everything bilingual)

File: `src/lib/translations.ts`

Two top-level objects: `en` and `ar`. Mirror any new key in both languages. Used throughout components via `useLanguage()` → `t.hero.title1` etc.

---

## 16. Deploying a small text-only edit

If you change just text (not code/structure), you can edit the file directly in cPanel:

1. cPanel File Manager → navigate to `/home/medeccom/medeqx/.next/server/app/...` — this is the **compiled** output. **DO NOT EDIT** these directly; they're machine-generated.
2. Instead, edit your local copy → run `next build` → upload the new `.next` folder, OR
3. Send us the change and we'll ship a fresh `medeqx-update-vN.zip`.

For **runtime config changes** (no code edit needed):
- Email: cPanel → Setup Node.js App → Env vars (`SMTP_*`)
- WhatsApp number override: env var `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Site URL: env var `NEXT_PUBLIC_SITE_URL`

Restart the Node.js app from cPanel after any env-var change.
