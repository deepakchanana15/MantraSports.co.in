# Mantra Sports India: Build Guide

**For:** Claude (or any developer) building **www.mantrasports.co.in**
**Reference site:** www.mantrasports.nl, the live Mantra Sports Netherlands site, source repo `github.com/deepakchanana15/MantraSports.NL`
**Prepared:** 31 October 2026

The goal is a new site for India that looks and works the same as the Netherlands site. It keeps the same design, structure and product range, and is adapted for India: English language, INR prices, Indian law and contact details. Treat it as a production commercial site, not a prototype.

This folder contains:

| File | What it is |
|---|---|
| `MANTRA-SPORTS-IN-BUILD-GUIDE.md` | This guide |
| `mantra-products-catalog.json` | Full product catalogue exported from the live NL database: 25 products, 6 categories, 69 Cloudinary image URLs, specs and flags |
| `logo.png` | Brand logo (orange phoenix emblem), used at `public/images/brand/logo.png` |

---

## 1. How to work with the owner

- The owner approves work in phases. Present the plan (section 3) and the open decisions (section 2) first, and wait for approval before building.
- Never invent business facts: prices, delivery times, discounts, company details, reviews, ratings or certifications. If a fact is missing, ask. Don't use a placeholder that would go live.
- After each phase, run the build and test the pages in a browser before saying the work is done.

---

## 2. Decisions to confirm with the owner before building

Ask these up front. The recommended default is in brackets.

1. **Operating company in India.** Is there an Indian entity (Pvt Ltd/LLP with GSTIN), or does the Australian parent operate the site? Indian e-commerce rules require the seller's legal name, address and contact details on the site. The NL site uses the Australian parent, *Mantra Corporation Pty Ltd, ABN 13 675 757 838, Unit 2, 5 Ford Court, Newnham TAS 7248, Australia, +61 46 624 2222*.
2. **Public email address.** [`info@mantrasports.co.in`]
3. **Phone and WhatsApp numbers.** [an Indian +91 number if one exists]
4. **Language.** [English only, `en-IN`] Hindi can be added later.
5. **Prices in INR.** The catalogue only has EUR reference prices. Ask whether prices include GST. [Show prices including GST, as Indian consumers expect]
6. **Where orders ship from.** India, or imported from Australia? This affects the shipping policy, delivery times and customs duty.
7. **How customers order.** The NL site has no checkout: customers request a quote and the team replies. [Keep quote-based at launch; Razorpay/UPI checkout can come later]
8. **Grievance Officer** (legally required in India, see section 10): name, email and phone.
9. **Hosting accounts.** A new Vercel project, a new Neon Postgres database, the same Cloudinary account (the product images already live there), SMTP credentials, and a MantraOS lead-intake key for the India company.
10. **Real customer reviews.** Only show reviews from real customers. Do **not** copy the NL homepage testimonials (see section 12).

---

## 3. Recommended approach: clone the NL codebase

The NL site was itself created by cloning the German site and adapting it. Do the same here; it's the fastest way to make the result identical.

1. Copy the repo `deepakchanana15/MantraSports.NL` (latest commit `0b0b1d5`) into a new repo, for example `MantraSports.IN`. Leave out `node_modules`, `.next`, `.env*` and `tsconfig.tsbuildinfo`.
2. Create a new Postgres database (Neon), set up `.env.local` (section 8), then run `npx prisma migrate deploy` (or `db push`) and `npm run db:seed`.
3. Adapt the content for India (sections 4, 9 and 10), then import the products (section 7).
4. Work through every item in section 12.
5. Deploy on Vercel with `www.mantrasports.co.in` as the main domain, and redirect `mantrasports.co.in` to it.

If the owner would rather build from scratch, use this guide as the specification and copy the design tokens exactly.

---

## 4. Site identity: what to change from NL to IN

Almost all region settings live in `lib/config/site.ts`, plus `app/layout.tsx`, `lib/utils/format.ts` and `prisma/seed.ts`.

| Setting | NL value | IN value |
|---|---|---|
| `SITE_CONFIG.name` | Mantra Sports NL | Mantra Sports India |
| `SITE_CONFIG.url` (canonical, hardcoded) | `https://www.mantrasports.nl` | `https://www.mantrasports.co.in` |
| `locale` / `<html lang>` | `nl-NL` / `nl` | `en-IN` / `en-IN` |
| OpenGraph locale | `nl_NL` | `en_IN` |
| `region` | `nl` | `in` |
| Currency | EUR, `€`, formatted with `nl-NL` | INR, `₹`, formatted with `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })` (gives lakh grouping, e.g. ₹1,49,999) |
| Brand sub-label (navbar/footer) | "Nederland" | "India" |
| Phone placeholders in forms | `+31 ...` | `+91 ...` |
| Country placeholder in wholesale form | "Nederland, België, ..." | "India, ..." |
| Email | info@mantrasports.nl | (decision 2) |
| Footer "Mantra Sports Worldwide" strip | links to AU/US/DE/IN/CA | replace India with Netherlands (`https://www.mantrasports.nl`) |
| Title template | `%s \| Mantra Sports NL` | `%s \| Mantra Sports India` |
| Admin seed email | admin@mantrasports.nl | admin@mantrasports.co.in |
| `Product.currency` default / `regions` | EUR / `["de"]` | INR / `["in"]` |

The admin panel stays in English. All public-facing text becomes English for the Indian market: Indian English spelling ("colour", "enquiry"), cricket-native terms and a confident, premium tone. Cricket is mainstream in India, so the copy can talk to knowledgeable players rather than explaining the game.

---

## 5. Tech stack (match it)

- **Next.js 16** (App Router, React 19, TypeScript). Server components; server actions in `lib/actions/*`.
- **Tailwind CSS v4** (`@import "tailwindcss"` with `@theme` tokens in `styles/globals.css`). The design also uses many inline `style={{}}` values; keep them.
- **Prisma 5** + **PostgreSQL** (Neon in production).
- **NextAuth v5** (credentials provider, JWT) for `/admin`. `proxy.ts` (the Next 16 name for middleware) protects `/admin/*`.
- **Cloudinary** for product and media images. Uploads go **directly from the browser** to Cloudinary using an unsigned preset, which avoids Vercel's 4.5 MB request limit. Allow `res.cloudinary.com` in `next.config.ts` → `images.remotePatterns`.
- **Nodemailer** (SMTP) emails enquiries to the team.
- **Tiptap** rich-text editor for blog posts in the admin.
- **react-hook-form + zod** for forms; **lucide-react** for icons.
- Hosting: **Vercel** behind **Cloudflare**. Ignore the old `apphosting.yaml` and the Firebase leftovers; they aren't used.
- Security headers in `next.config.ts`: X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy. `/admin` and `/api` are no-store.

---

## 6. Design system (copy exactly)

### Colours
| Token | Hex | Use |
|---|---|---|
| Mantra Orange (`brand-500`) | `#E85D1A` | Primary accent, CTAs, eyebrows, links, active tabs |
| Orange hover (`brand-600`) | `#C44B0F` | CTA hover |
| Orange tint (`brand-50`) | `#FFF5ED` | Icon tiles, highlight boxes |
| Near-black | `#111111` | Headings, hero/footer/announcement-bar background |
| Dark panel | `#1C1C1C` | Footer dividers, dark tiles |
| Body text | `#333333` | Paragraphs |
| Muted text | `#6B6B6B` / `#999999` / `#A0A0A0` (on dark) | Labels, meta, breadcrumbs |
| Border grey | `#E0DFDB` | All 1px borders and grid dividers |
| Off-white | `#F8F7F4` | Breadcrumb bar, soft panels |
| Light grey | `#F2F1EE` | Inputs, search field |
| WhatsApp green | `#25D366` | WhatsApp buttons |

The full orange scale (50–950) and neutrals are in `styles/globals.css` `@theme`. The site defaults to a **light theme** (white background); dark-mode tokens exist but light is the default.

### Typography
- **Headings / display:** **Oswald** (weights 300–700) via `next/font/google`, CSS var `--font-oswald`, Tailwind `font-display`. Headings are **UPPERCASE** with slight letter-spacing (0.01–0.04em) and bold weight.
- **Body:** **Inter**, var `--font-inter`.
- **Eyebrow labels:** 11px, Oswald, uppercase, tracking 0.22em, orange, shown above section headings.

### Layout language
- Sharp, editorial look: 1px `#E0DFDB` borders, **2px border radius** (`rounded-[2px]`), no heavy shadows.
- Desktop side padding **60px**; sections usually `64–80px` vertical padding; content max width about 1440px.
- Grids of bordered cells (categories, products, benefits) separated by 1px dividers instead of gaps.
- Buttons: uppercase Oswald, letter-spaced; orange fill (`#E85D1A`) or black fill (`#111`) that turns orange on hover.

### Page anatomy for info pages (`components/layout/ContentPage.tsx`)
1. Breadcrumb bar on `#F8F7F4` with a bottom border.
2. Dark hero on `#111`: orange eyebrow, large uppercase white title (`clamp(32px, 5vw, 60px)`), grey intro text.
3. Body with 64px/60px padding; long text uses the `.prose` class (max width 820px).

### Global chrome
- **Announcement bar** (black, 12px white text) above a **sticky white navbar** (72px high): logo + "MANTRA SPORTS / India" wordmark, menu with dropdowns, search field, orange "Request a quote" button, hamburger menu on mobile.
- **Footer** on `#111`: brand column (logo, description, social icons, email) plus 3 link columns (Products, Company, Help & Support), a "Mantra Sports Worldwide" country strip, and a bottom bar with copyright, payment badges and legal links.
- **Floating WhatsApp button** (only shown when a number is configured) and a **cookie banner** (saves the choice in localStorage).

### Homepage sections (in order, `components/home/HomePageClient.tsx`)
1. **Hero:** two-column split, headline + CTAs left, hero image/product right (uses the `hero_image_url` setting, falling back to the featured product image).
2. **Trust bar:** 5 icon items (shipping, secure payment, returns, authentic quality, personal service). Make every claim true for India.
3. **Categories grid:** 6 bordered tiles linking to `/categories/[slug]`.
4. **Featured products:** tabs (New Arrivals / Bestsellers / English Willow / On Sale) filled from the DB flags `isNewArrival`, `isBestSeller`, the cricket-bats category, and `salePrice`. Tabs with no products are hidden.
5. **English Willow feature:** dark section promoting the bat range.
6. **Why Mantra:** 4 columns.
7. **Reviews:** 3 cards. **Real reviews only.**
8. **Wholesale banner:** call to action to `/wholesale`.
9. **Newsletter** signup (saved to `NewsletterSubscriber`).

---

## 7. Products: same catalogue, English text, INR prices

`mantra-products-catalog.json` contains every active NL product. For each product you can **reuse as-is**: `sku`, `category`, `specifications`, the flags (`isFeatured`/`isNewArrival`/`isBestSeller`), `stockStatus` and **all image URLs** (public Cloudinary URLs).

**You must replace:**
- **Name, description, features, tags, alt text and meta title/description.** The NL text is Dutch. Write English copy using the matching products on **mantrasports.com.au** as the source (product sitemap: `https://mantrasports.com.au/product-sitemap.xml`), adapted for India.
- **Slugs:** use English, keyword-rich slugs (e.g. `magnitude-legend-english-willow-cricket-bat`). Never keep the Dutch ones.
- **Prices:** in INR, from the owner (decision 5). Don't convert the EUR reference prices automatically.

| SKU | Category | Product (English) | NL flags |
|---|---|---|---|
| EW-001 | cricket-bats | Magnitude Legend English Willow Cricket Bat | Featured |
| EW-002 | cricket-bats | Raptor Legend English Willow Cricket Bat | Featured |
| EW-003 | cricket-bats | Raptor English Willow Cricket Bat | New |
| EW-004 | cricket-bats | Magnitude Maxx English Willow Cricket Bat | New |
| EW-005 | cricket-bats | Cobra English Willow Cricket Bat | New |
| EW-006 | cricket-bats | Cobra Ultimate English Willow Cricket Bat | New |
| LG-001 | protective-gear | Challenger Cricket Leg Guards | – |
| LG-002 | protective-gear | Cobra Cricket Leg Guards | Bestseller |
| LG-003 | protective-gear | Magnitude Leg Guards | Featured |
| LG-004 | protective-gear | Raptor Batting Leg Guards | Featured |
| BG-001 | protective-gear | Cobra Batting Gloves | New |
| BG-002 | protective-gear | Raptor Batting Gloves | New |
| KG-001 | protective-gear | Limited Edition Wicket Keeping Gloves | New |
| KG-002 | protective-gear | Cobra Wicket Keeping Gloves | New |
| HL-001 | protective-gear | Cricket Helmet | New |
| CB-001 | balls | White Leather Cricket Ball | Bestseller |
| CB-002 | balls | Red Leather Cricket Ball | Bestseller |
| CB-003 | balls | Pink Leather Cricket Ball | Bestseller |
| CB-004 | balls | Yellow Leather Cricket Ball | Bestseller |
| AC-001 | accessories | Cricket Bat Mallet | New |
| AC-002 | accessories | Cricket Bat Grip Applicator (cone) | New |
| AC-003 | accessories | Cricket Bat Scuff Sheet | Bestseller |
| AC-004 | accessories | Cricket Bat Grip | New |
| KB-001 | accessories | Cricket Kit Bag | – |
| CA-001 | custom-apparel | Custom Cricket Teamwear | Featured, Bestseller |

Categories (slug, English name): `cricket-bats` Cricket Bats · `protective-gear` Protective Gear · `balls` Balls · `accessories` Accessories · `teamwear` Teamwear (no products yet) · `custom-apparel` Custom Apparel.

**Import:** write a one-off script (`scripts/import-products.ts`) that reads the JSON plus an English/INR copy sheet and **upserts by SKU**, so it can be re-run safely. Set the primary image (`isPrimary`) and `sortOrder` exactly as in the JSON. Also confirm the product-name translations with the owner, because some NL names were loosely translated.

---

## 8. Integrations and environment variables

Create `.env.local` (never commit it) and set the same variables in Vercel:

```
DATABASE_URL=                      # new Neon Postgres DB, e.g. mantra_sports_in
NEXTAUTH_URL=https://www.mantrasports.co.in
NEXTAUTH_SECRET=                   # openssl rand -base64 32
SMTP_HOST= SMTP_PORT= SMTP_SECURE= SMTP_USER= SMTP_PASS= SMTP_FROM=
EMAIL_TO=                          # internal inbox that receives enquiries
NEXT_PUBLIC_WHATSAPP_NUMBER=       # e.g. 91XXXXXXXXXX (no +), or leave unset to hide the button
CLOUDINARY_CLOUD_NAME=             # same account as NL (dgeaaga0s) so product images work
CLOUDINARY_API_KEY= CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME= NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
MANTRA_LEAD_INTAKE_KEY=            # MantraOS > Settings > Lead Intake > Create key, for the INDIA company
DEV_ADMIN_EMAIL= DEV_ADMIN_PASSWORD=   # used by the seed for the first admin user
```

**MantraOS** (head-office CRM): every enquiry is also sent to MantraOS as a lead (`POST https://mantra-os-api.vercel.app/v1/leads/intake`, header `x-intake-key`). See `sendToMantraOS` in `lib/actions/enquiries.ts`. It must never block or fail the visitor's enquiry. Keep this behaviour unchanged and use an India-specific key.

**Enquiry flow:** the forms (contact, wholesale, B2B, dealer) call `submitEnquiry`, which saves an `Enquiry` row (with IP for rate limiting), emails `EMAIL_TO` and mirrors the lead to MantraOS. Enquiry types: `GENERAL`, `WHOLESALE`, `QUOTE`.

**Site settings** (`SiteSetting` table, editable at `/admin/settings`) override the config defaults: `contact_email`, `contact_phone`, `contact_address`, `whatsapp_number`, `hero_image_url`, social links, meta title/description. Seed them with the India values.

---

## 9. Pages and routes to build

### Public pages (all must exist; every menu and footer link must work)
| Route | Purpose |
|---|---|
| `/` | Homepage (section 6) |
| `/shop` | All products: category filter pills, search (`?q=`), sort, pagination (24 per page) |
| `/shop/[slug]` | Product page: gallery, price/"Price on request", stock status, description, features, WhatsApp enquiry + "Request a quote" (links to `/contact?product=<slug>`, which pre-fills the message), related products |
| `/categories/[slug]` | Category listing with sort and pagination |
| `/collections`, `/collections/[slug]` | Curated collections (admin-managed) |
| `/contact` | Contact details + form (dynamic, reads site settings) |
| `/wholesale` | Wholesale & B2B enquiry form |
| `/b2b` | B2B partnerships for clubs, schools, academies and associations (custom club kit, volume pricing) + wholesale form |
| `/become-a-dealer` | Dealer programme for sports shops and resellers + wholesale form |
| `/about` | About Mantra Sports (adapt from mantrasports.com.au/about-us) |
| `/faq` | FAQ grouped by Ordering / Delivery / Returns / Payment, with `FAQPage` JSON-LD |
| `/blog`, `/blog/[slug]` | Blog from the `BlogPost` table (status `PUBLISHED`), `Article` JSON-LD. Start with the English **Cricket Bat Size Guide** from mantrasports.com.au (heights in cm and ft) |
| `/shipping-policy`, `/returns-policy`, `/privacy-policy`, `/terms-and-conditions` | Legal pages, adapted for India (section 10) |
| `/company-information` | Seller details page (India's equivalent of "Bedrijfsgegevens"/Impressum) including the **Grievance Officer** |
| `/sitemap.xml`, `/robots.txt` | Generated (section 11) |

### Admin (`/admin`, English, login required, `noindex`)
Dashboard · Products (create/edit, images, flags, SEO fields) · Collections · Enquiries (status workflow) · Newsletter subscribers · Blog (Tiptap) · Media library · Settings (site settings + password).

### Data model (Prisma, `prisma/schema.prisma`)
`Product` (+ `ProductImage`, `ProductVariant`), `Category` (tree via `parentId`), `Collection` + `CollectionProduct`, `Enquiry`, `BlogPost` (+ categories/tags), `SiteSetting`, `NewsletterSubscriber`, `Media`, `AdminUser`. Enums: `ProductStatus` (ACTIVE/HIDDEN/ARCHIVED/DRAFT), `StockStatus` (IN_STOCK/OUT_OF_STOCK/ON_REQUEST), `EnquiryType`, `EnquiryStatus`, `BlogStatus`. Only `ACTIVE` products are public.

---

## 10. India-specific legal and content requirements

Adapt the AU policies (mantrasports.com.au: refund_returns, shipping-policy, term-of-services, privacy-policy) to **Indian law**, the same way the NL pages were adapted to EU law. Show these to the owner and recommend a review by an Indian lawyer before launch.

- **Consumer Protection (E-Commerce) Rules, 2020.** Show the seller's legal name, geographic address, customer-care email and phone, and a **Grievance Officer** (name, designation, contact). The officer must acknowledge complaints within 48 hours and resolve them within one month. Clearly display return, refund, exchange, warranty, delivery and shipment terms, and the **country of origin** of products. Prices must show the total including all charges, with no hidden fees. Fake reviews are prohibited.
- **Digital Personal Data Protection Act, 2023 (DPDP).** The privacy notice must describe what personal data is collected (enquiry forms, newsletter, orders, IP addresses for anti-spam), the purposes, consent, the user's rights (access, correction, erasure, grievance redressal, nomination), and how to contact the Grievance Officer / data contact. It must also mention any data transfers outside India (Australia head office, US hosting), and the right to complain to the Data Protection Board of India.
- **GST.** If an Indian entity sells, show its GSTIN on the company-information page and invoices. State whether prices include GST.
- **Imports.** If products ship from Australia, customs duty and IGST apply. State who pays them, and mention that the recipient may need to provide KYC/PAN details for clearance.
- **Cookies.** The NL site uses no analytics or tracking. If you add Google Analytics/Meta Pixel for India, ask for consent first and update the privacy policy.
- Warranty terms from AU (keep them): bats 12 months (handle/edge/toe/surface cracks repaired free; no cover for bowling-machine balls or moisture/toe swelling), protective gear 6 months (seams/stitching), helmets 6 months (size dial; not ball-impact damage), kit bags 12 months (seams, zips, wheels), balls no manufacturer warranty.

---

## 11. SEO requirements (lessons from NL, do these from day one)

1. **One canonical host:** `https://www.mantrasports.co.in`, hardcoded in `SITE_CONFIG.url` and used for `metadataBase`. Redirect the apex domain to `www`. (On NL, the base URL came from an env var that pointed at the non-www host, so every canonical/OG URL redirected.)
2. **Self-referencing canonical on every page:** in the root layout metadata, `alternates: { canonical: './' }`. This also drops query strings (`?sort=`, `?page=`, `?q=`). The 404 page sets `alternates: { canonical: null }` and `robots: { index: false }`.
3. **`app/sitemap.ts`** (`revalidate = 3600`): the homepage, `/shop`, every ACTIVE product (lastModified = `updatedAt`), only categories/collections that have at least one active product, all info/legal pages, and `/blog` + published posts (only when at least one exists). Wrap DB queries in try/catch and fall back to the static pages. Copy the NL file `app/sitemap.ts` and change nothing but the host.
4. **`app/robots.ts`:** allow `/`, disallow `/admin` and `/api/`, `Sitemap: https://www.mantrasports.co.in/sitemap.xml`.
5. **Titles:** use the template `%s | Mantra Sports India`. If a DB `metaTitle` already contains "Mantra Sports", return `{ absolute: metaTitle }` so the brand isn't doubled. The homepage title should be absolute.
6. **Structured data:** `Organization` (legal name, address, contact), `WebSite` with `SearchAction` → `/shop?q={search_term_string}`, `FAQPage`, `Article`. Consider adding `Product` JSON-LD with INR `Offer` on product pages.
7. **hreflang (optional, recommended):** cross-link regional sites (`en-IN` ↔ `nl-NL` ↔ `en-AU`) for pages that have equivalents.
8. After launch: verify the domain in Google Search Console, submit the sitemap, and purge Cloudflare's cached `robots.txt` (cached for 4h).

---

## 12. Known issues in the NL code: fix while cloning, don't copy

- **Fake homepage testimonials:** `REVIEWS` in `HomePageClient.tsx` (Rahul M./Priya S./Arjun K.) are hardcoded. Replace them with real reviews or remove the section.
- **Unverified marketing claims:** the announcement bar ("free shipping from €100", code `ERSTBESTELLUNG5`) and the trust bar ("30-day returns") must be confirmed with the owner for India.
- **Leftover German/Dutch text:** after cloning, search the whole project (including `lib/actions/*` error messages, aria-labels, placeholders and `lib/utils/format.ts`) and confirm no Dutch or German strings remain.
- **Hardcoded category tiles** on the homepage must only link to categories that exist. NL once linked to `/categories/sports-bags`, which was a 404.
- **DB category meta fields are English seed data.** Generate category titles/descriptions in code, or seed them properly.
- **Social links** are `#` placeholders. Fill them in or hide the icons.
- **Mobile layout:** many sections use fixed `gridTemplateColumns` and 60px padding (contact, wholesale, footer, B2B/dealer). Make these responsive (single column under ~768px, 16–20px side padding) while keeping the desktop look identical.
- **Firebase leftovers** (`apphosting.yaml`, `firebase.json`, `lib/firebase`) aren't used on Vercel. Remove them or leave them unused, but don't build on them.

---

## 13. Done checklist

- [ ] `npm run build` passes and `npx tsc --noEmit` is clean.
- [ ] Every URL in `/sitemap.xml` returns **200** (no redirects), with a canonical equal to its own URL and no `noindex`.
- [ ] Crawl all internal links on the homepage, shop, a product page, a category page and all info pages: **no 404s**.
- [ ] `/sitemap.xml` returns `application/xml` and valid XML; `/robots.txt` references it.
- [ ] Contact, wholesale, B2B and dealer forms submit successfully, the enquiry appears in `/admin/enquiries`, the email arrives, and the lead appears in MantraOS.
- [ ] Prices display as INR (₹, en-IN grouping); no EUR anywhere.
- [ ] No Dutch, German or placeholder text (`TO_BE_PROVIDED`) on public pages.
- [ ] Legal pages show the confirmed company details and Grievance Officer.
- [ ] Product images load from Cloudinary; every product has a primary image.
- [ ] The homepage looks identical in design to www.mantrasports.nl (compare side by side at desktop and mobile widths).

---

## 14. Prompt to start the new project

Paste this into the new Claude session together with the three files:

> I'm building **www.mantrasports.co.in**, the India website for Mantra Sports. It must look and work like our Netherlands site **www.mantrasports.nl** (repo `github.com/deepakchanana15/MantraSports.NL`): same design, colours, fonts, page structure, admin panel and products, adapted for India (English, INR, Indian e-commerce and privacy law). Read the attached **MANTRA-SPORTS-IN-BUILD-GUIDE.md** completely first. The product catalogue is in **mantra-products-catalog.json** and the logo is **logo.png**. Start by asking me the questions in section 2, then show me a phased plan for approval before writing code.
