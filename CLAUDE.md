# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MedeqX is a medical equipment exchange marketplace for the GCC region (primarily Saudi Arabia), allowing hospitals and clinics to buy, sell, or request medical equipment.

## Development Setup

There is **no build system, package manager, or test suite**. The frontend is a single `index.html` file that runs directly in a browser.

- **Frontend only**: Open `index.html` in a browser.
- **Full stack**: Serve via a PHP-capable web server (e.g., XAMPP, Laravel Herd). The PHP backend at `api.php` handles database writes and email dispatch. Without it, all API calls will fail silently.
- There are no lint, test, or build commands.

## Architecture

### File Structure

```
index.html   — entire frontend: HTML structure, embedded <style>, and <script>
api.php      — PHP backend: DB operations + email queue
```

Everything visible to the user lives in `index.html`. The CSS (~first third of `<style>`) is minified and inline. The JS (~second half of `<script>`) is plain vanilla.

### UI: Modal System

Three overlay modals drive all user interactions:
- **Upload modal** (`#upload-modal`) — sellers post equipment for sale or create "wanted" requests
- **Detail modal** (`#detail-modal`) — view full listing specs and images
- **Inquiry modal** (`#inquiry-modal`) — buyers submit purchase inquiries

Modals are toggled via `openModal(id)` / `closeModal(id)`.

### State

All client-side state lives in plain JS variables at the top of `<script>`:
- `allListings` — cached array from the last `get_listings` fetch
- `currentFilter` — active condition filter (`all`, `new`, `used`, `defective`, `wanted`)
- `uploadedImages` — base64 strings for images being staged in the upload form
- `chosenCondition`, `chosenWarranty` — form state during listing creation

### API

All calls go to `api.php?action=<name>`. GET for reads, POST (JSON body) for writes.

| Action | Method | Purpose |
|---|---|---|
| `get_listings` | GET | Returns `{listings: [...]}` — cached in `allListings` |
| `get_stats` | GET | Returns `{total, new, used, defective, wanted}` for hero section |
| `add_listing` | POST | Creates listing; returns `{success, ref}` or `{error}` |
| `add_inquiry` | POST | Sends buyer inquiry; returns `{success}` |
| `process_email_queue` | GET | Fire-and-forget; called after submissions to flush email queue |

### Listing Data Shape

```js
{
  id, ref,                  // "REF-XXX"
  name, category, manufacturer, model, serial,
  condition,                // "new" | "used" | "defective"
  warranty,                 // "yes" | "no"
  listing_type,             // "for_sale" | "wanted"
  price, payment,
  dop, doe,                 // date of purchase / end of use
  location, country, desc,
  images,                   // array of base64 strings
  status,                   // "active" | "sold"
  seller_name, seller_hospital, seller_email, seller_phone
}
```

## Key Conventions

**XSS prevention** — always use `esc(s)` before inserting user content into innerHTML. It sets `textContent` on a temp `<div>` and returns `innerHTML`, which the browser escapes.

**Input helper** — `val(id)` gets and trims the value of an `<input>`/`<select>` by ID.

**Image compression** — `compressAll(images)` runs canvas-based JPEG encoding at quality 0.72, capped at 1200×900px, reducing payload by ~70%. Always compress before POSTing images to avoid PHP `post_max_size` rejections.

**CSS tokens** — all colors are CSS custom properties in `:root`. Update there, not inline:
- `--primary: #0057FF` (blue), `--cyan: #00D4FF` (accent)
- `--green: #1A7A4A` (new), `--amber: #B45309` (used), `--red: #C0392B` (defective)
- `--midnight: #00040F` (dark text), `--ice: #F5F7FF` (light bg)

**RTL/i18n** — `toggleLang()` flips `document.documentElement.dir` between `ltr` and `rtl`. Flexbox containers that need reversal on RTL must be handled via CSS `[dir=rtl]` selectors.

**Responsive grid** — the equipment grid uses `repeat(auto-fill, minmax(270px, 1fr))`. The mobile breakpoint is 600px.

## Adding Features

To add a new listing field:
1. Add the form control to the upload modal section in `index.html`
2. Read it in `submitListing()` using `val()`
3. Include it in the POST body to `add_listing`
4. Render it in `cardHTML(item)` or the detail modal template

To add a new condition filter: update the `.chip` buttons in the toolbar and the filter logic in `renderGrid()`.
