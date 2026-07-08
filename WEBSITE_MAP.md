# MedeqX Website Map

Multi-page classifieds structure for a B2B medical equipment marketplace serving Saudi Arabia and the GCC region.

---

## Page Structure Overview

```
/
├── index.html
├── categories/
│   ├── index.html
│   ├── diagnostic-imaging.html
│   ├── patient-monitoring.html
│   ├── surgical-equipment.html
│   ├── laboratory-equipment.html
│   ├── sterilization.html
│   ├── rehabilitation.html
│   └── parts-accessories.html
├── post-listing.html
├── how-it-works.html
├── faq.html
└── contact.html
```

---

## Pages

### 1. Home
**Path:** `/index.html` → served as `/`
**Primary SEO target:** `Used medical equipment exchange Saudi Arabia`
**Supporting keywords:** medical equipment marketplace KSA, hospital equipment resale GCC, buy sell medical devices Saudi Arabia

**Purpose:**
Entry point for all buyer and seller traffic. Surfaces live listings, condition filters (New / Used / Defective / Wanted), search, and key trust signals (total listings, active sellers, categories covered). Drives users toward browsing categories or posting a listing.

**Key sections:**
- Hero with search bar and live listing stats
- Featured / recent listings grid
- Category shortcuts
- How-it-works summary (3-step) with CTA to `how-it-works.html`
- Trust indicators (commission model, private seller info, reference tracking)

---

### 2. Categories Hub
**Path:** `/categories/index.html` → served as `/categories/`
**Primary SEO target:** `Buy used hospital equipment` | `Refurbished clinical devices`
**Supporting keywords:** refurbished medical equipment suppliers KSA, used diagnostic equipment for sale, second-hand hospital devices GCC

**Purpose:**
Landing page for buyers browsing by equipment type. Links out to each category sub-page. Provides an overview of available inventory counts per category for credibility.

**Key sections:**
- Category grid with icon, name, listing count, and link
- Short description of the marketplace's category coverage
- CTA to post a listing

---

### 2a–2h. Category Sub-pages

Each sub-page filters the main listing feed by category and is independently indexable.

| File | URL | Category | Example SEO focus |
|---|---|---|---|
| `diagnostic-imaging.html` | `/categories/diagnostic-imaging` | Diagnostic Imaging | "used MRI machines for sale Saudi Arabia" |
| `patient-monitoring.html` | `/categories/patient-monitoring` | Patient Monitoring | "refurbished patient monitors KSA" |
| `surgical-equipment.html` | `/categories/surgical-equipment` | Surgical Equipment | "used surgical equipment Saudi hospitals" |
| `laboratory-equipment.html` | `/categories/laboratory-equipment` | Laboratory Equipment | "buy used lab analyzers GCC" |
| `sterilization.html` | `/categories/sterilization` | Sterilization | "used autoclave sterilizers Saudi Arabia" |
| `rehabilitation.html` | `/categories/rehabilitation` | Rehabilitation | "refurbished physiotherapy equipment KSA" |
| `parts-accessories.html` | `/categories/parts-accessories` | Parts & Accessories | "medical equipment spare parts Saudi Arabia" |

**Key sections (each sub-page):**
- Category description and typical use cases
- Filtered live listing grid (condition chips, search)
- Related categories sidebar
- CTA to post equipment in this category

---

### 3. Post a Listing
**Path:** `/post-listing.html`
**Primary SEO target:** `Sell hospital surplus inventory`
**Supporting keywords:** list medical equipment for sale KSA, hospital asset liquidation Saudi Arabia, post used medical device GCC

**Purpose:**
Dedicated seller flow for creating a new listing (for-sale or wanted request). Moves the upload modal currently in `index.html` into a full dedicated page, improving both SEO discoverability and UX for sellers arriving from search.

**Key sections:**
- Listing type toggle (For Sale / Wanted)
- Full listing form: equipment details, condition, warranty, price, images
- Commission disclosure callout (4% on sale value, min 200 SAR)
- Privacy notice (seller contact kept private until inquiry match)
- Form submission → success screen with reference number

---

### 4. How It Works & Commission
**Path:** `/how-it-works.html`
**Primary SEO target:** `Medical equipment liquidation commission`
**Supporting keywords:** medical equipment consignment KSA, hospital surplus liquidation service, B2B equipment resale commission Saudi Arabia

**Purpose:**
Explains the full marketplace flow for both buyers and sellers. Addresses the commission model transparently. Targets mid-funnel users evaluating whether to list or inquire.

**Key sections:**
- Step-by-step seller flow (Post → Match → Confirm → Receive payment)
- Step-by-step buyer flow (Browse → Inquire → Receive seller contact → Purchase)
- Commission table:
  - 4% of sale value
  - Minimum fee: 200 SAR
  - Collected on confirmed sale only
- What MedeqX handles (inquiry forwarding, reference tracking, email notifications)
- What sellers handle (negotiation, logistics, final invoice)
- CTA to post a listing

---

### 5. FAQ
**Path:** `/faq.html`
**Primary SEO target:** `B2B medical marketplace rules`
**Supporting keywords:** medical equipment marketplace terms Saudi Arabia, GCC equipment resale FAQ, B2B hospital equipment exchange rules

**Purpose:**
Reduces pre-sales friction by answering common objections from both buyers and sellers. Structured with schema-friendly Q&A markup for Google featured snippet eligibility.

**Suggested FAQ groups:**

**For Sellers**
- Who can list equipment on MedeqX?
- Is my contact information shared publicly?
- How is the commission calculated and when is it charged?
- Can I list equipment parts or items in poor condition?
- How do I mark a listing as sold?

**For Buyers**
- How do I contact a seller?
- Are listings verified or inspected?
- Can I request equipment I'm looking to buy?
- What countries does MedeqX serve?

**Platform & Process**
- What is a reference number?
- How does the email inquiry system work?
- Is there a minimum or maximum listing price?
- What equipment categories are supported?

---

### 6. Contact
**Path:** `/contact.html`
**Primary SEO target:** `MedeqX support Saudi Arabia`
**Supporting keywords:** MedeqX contact, medical equipment marketplace support KSA, reach MedeqX team

**Purpose:**
Single point of contact for general inquiries, listing disputes, and partnership requests. Reinforces trust with a visible business presence in Saudi Arabia.

**Key sections:**
- Contact form (name, company, email, subject, message)
- Direct email: info@medeqx.com
- Business location / region served (Saudi Arabia / GCC)
- Response time expectation
- Links to FAQ and How It Works for self-service

---

## URL Conventions

- All URLs lowercase, hyphen-separated (no underscores, no query strings for static pages)
- Category sub-pages live under `/categories/` to preserve hierarchy for breadcrumbs and crawling
- Static `.html` extensions kept for compatibility with simple PHP/Apache hosting (no rewrite rules required unless clean URLs are configured)
- Each page should carry a unique `<title>`, `<meta name="description">`, and `<link rel="canonical">` pointing to its own URL

---

## Internal Linking Map

```
Home  ──────────────────────────────────────────────────────────────────────
  │── Categories Hub ── Category Sub-pages (×7)
  │── Post a Listing
  │── How It Works
  └── Contact (via footer)

How It Works ── Post a Listing (CTA)
FAQ          ── How It Works / Contact (cross-links)
Category Sub ── Post a Listing (CTA) / Categories Hub (breadcrumb)
Post Listing ── How It Works (commission callout link)
```

---

## Implementation Notes

- The current `index.html` upload modal and detail modal logic will be refactored into `post-listing.html` and category sub-page listing cards as the site is built out — **do not modify `index.html` until the new pages are scaffolded**.
- All pages share the same `api.php` backend; no new endpoints are needed for the static pages.
- The listing grid component (JS + CSS) should be extracted into a shared `assets/listings.js` and `assets/style.css` once multi-page build begins, so it can be reused across category sub-pages and the home page without duplication.
