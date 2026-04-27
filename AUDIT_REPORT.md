# withSahib Complete Audit Report
Date: 2026-04-27
Audited by: Claude Sonnet 4.6

---

## EXECUTIVE SUMMARY

| Section | Score |
|---|---|
| Page-by-Page Visual Audit | 5/10 |
| SEBI / DSA Compliance | 8/10 |
| Codebase Quality | 5/10 |
| Fintech Benchmarking | 5/10 |
| SEO (Traditional Search) | 8/10 |
| AEO (Answer Engine) | 8/10 |
| GEO (Generative AI) | 7/10 |
| **Overall** | **6/10** |

The platform is legally compliant and architecturally sound at a basic level. The SEBI compliance posture is genuinely strong. However, there are at least **5 pages showing a literal "$1" text artifact** that renders visibly on production, a critical unloaded font (`DM Serif Display`) referenced 46 times, and 4 high-traffic pages missing Footer and BookingBanner entirely. The gap between stated design intent (orange/black/white brand) and execution (pervasive green CTAs) is wide. Against a Zerodha/Groww standard this is a 4/10 on design systems — it's a solo-developer codebase, not an engineered product.

---

## SECTION 1: Page-by-Page Visual Issues

### Homepage (`/`) — 6/10
**MAJOR:** Entire `page.tsx` is `'use client'` — only the popup component requires client-side state. This blocks all SEO benefits of React Server Components on the most important page.
**MAJOR:** Pricing section has separate PLANS array from `pricing/page.tsx`. If pricing changes, there are now two sources of truth to update manually.
**MINOR:** Multiple inline `onMouseEnter`/`onMouseLeave` style toggling with hardcoded `#FF6B00` instead of CSS hover pseudo-classes. Hover state logic is scattered and inconsistent.
**MINOR:** No skeleton/loading state for the hero section. Fast 3G will show blank white space.

---

### About (`/about`) — 7/10
**MAJOR:** `var(--green)` used for the timeline gradient and credential bar underline. Green is the secondary brand color, not the hero accent. On the about page of a personal brand, this should be orange.
**MINOR:** `about/page.tsx` is `'use client'` — the page appears entirely static from the content perspective; no interactive elements visible in the code that would require client state.
**MINOR:** Hardcoded `'#FF6B00'` in some inline hover handlers instead of `var(--orange)`.

---

### Methodology (`/methodology`) — 7/10
**MINOR:** `methodology/page.tsx` is `'use client'` — again, the page appears to be static content.
**MINOR:** No visible issues with footer/banner (both present). Clean page.

---

### Pricing (`/pricing`) — 6/10
**MAJOR:** `pricing/page.tsx` is `'use client'` — the billing toggle (monthly/yearly) is the reason, but this means the server renders nothing useful for crawlers.
**MAJOR:** FAQ answers inside the pricing page still contained old prices at time of audit (some ₹999/₹2,499/₹5,999 references partially updated).
**MINOR:** The Elite plan gold colour (`#B8975A`) is hardcoded inline, not a CSS variable. This creates a third gold tone alongside `var(--gold)` (#92680A) and `--gold-light` (#B8860B).

---

### Courses (`/courses`) — 7/10
**MAJOR:** "BEST VALUE" badge on Course 02 uses `#FF6B00` (orange) but its background is orange and text is white — very easy to confuse with the Pro plan CTA. The badge is also the same visual style as the pricing plan's "MOST POPULAR" badge. This is a copy-paste design with no visual hierarchy differentiation.
**MINOR:** `courses/page.tsx` uses `courseSchemas.map((schema, i) => ...)` to render script tags inline in JSX — valid but unconventional. Better placed in layout.tsx.

---

### Services / Intraday (`/services/intraday`) — 3/10
**CRITICAL:** **NO Footer component**. The page ends with a SEBI disclaimer div and closes. A user reading intraday content has no navigation back to other parts of the site.
**CRITICAL:** **NO BookingBanner component**. This is the highest-intent service page — users reading intraday picks are the prime candidates for the booking CTA, and it's missing.
**MAJOR:** Entire page is `'use client'` — the page fetches signals from `/api/signals` but 80%+ of the page content (hero, HowTo section, sample call preview) is static and could be server-rendered.
**MAJOR:** Sample call values are literally `₹XXX – ₹XXX` and `₹XXX (+X%)` — placeholders instead of illustrative realistic numbers. This looks unfinished on the live site.
**MINOR:** `#EF4444` hardcoded for stop-loss red color — not in the design token system.

---

### Services / Stock Options (`/services/stock-options`) — 7/10
**MINOR:** Footer and BookingBanner both present. Metadata and layout are clean.
**MINOR:** No breadcrumb schema in layout (added in the previous round for intraday only).

---

### Services / Index Options (`/services/index-options`) — 4/10
**CRITICAL:** `<BookingBanner />$1` — there is a literal `$1` text artifact on this page after the BookingBanner. This renders as visible text "$1" on the live site. This is a broken search-and-replace from a previous editing session.
**MINOR:** Footer missing — grep shows only BookingBanner at line 90 with the $1 artifact, no Footer import or render found.

---

### Services / Swing (`/services/swing`) — 7/10
**MAJOR:** Sample call values are `₹XXX` placeholders (same as intraday). Looks incomplete.
**MINOR:** Both Footer and BookingBanner present. Otherwise clean.

---

### Services Hub (`/services`) — 7/10
**MINOR:** Page has Footer and BookingBanner. Generally clean.
**MINOR:** `ItemList` schema is present in the page but doesn't match the JSON-LD schemas added to sub-pages. Potential duplicate schema signals.

---

### Blog listing (`/blog`) — 7/10
**MAJOR:** Category filter tabs use `var(--emerald)` (green) as the active state. The active/selected state should use orange per brand guidelines.
**MINOR:** Both Footer and BookingBanner present.

---

### Blog post (`/blog/[slug]`) — 5/10
**CRITICAL:** `<BookingBanner />$1` artifact — same broken search-and-replace as index-options. Visible "$1" text on every single blog post page.
**MAJOR:** No `<Footer />` component found in the blog post page. Users reading an article have nowhere to go after the related posts section.
**MINOR:** `dateModified` not present in the Article schema (uses `post.date` for both `datePublished` and the image fallback but never sets `dateModified`). This hurts freshness signals.

---

### FAQ (`/faq`) — 5/10
**CRITICAL:** `<BookingBanner />$1` artifact — "$1" renders on the page after the booking banner.
**MAJOR:** ALL interactive elements (accordion open icon, section tags, CTAs, quick nav links) use `var(--emerald)` (green). The FAQ is entirely green-accented when the brand is orange. The "Start Free" CTA at the bottom is green. This is a significant brand inconsistency.
**MAJOR:** The page still had old pricing (₹999/₹2,499/₹5,999) in the "How much does withSahib subscription cost?" answer — partially fixed in the last commit but the existing FAQ answer text inside the accordion had not been updated at audit time.

---

### Contact (`/contact`) — 6/10
**CRITICAL:** `ContactClient.tsx` has `<BookingBanner />$1` artifact — visible "$1" text on the contact page.
**MAJOR:** Uses `DM Serif Display` for h1 heading (contactClient.tsx line 70) — this font is NOT loaded by Next.js and will fall back to the browser's default serif (typically Times New Roman). This is a visual defect.
**MINOR:** Both Footer and BookingBanner are present in the parent `contact/page.tsx`, but `ContactClient.tsx` also tries to render BookingBanner — resulting in a potential double render.

---

### Appointments (`/appointments`) — 3/10
**CRITICAL:** **NO Footer component**. Page ends abruptly with booking list.
**CRITICAL:** **NO BookingBanner component**. An appointment page with no BookingBanner is inconsistent.
**MAJOR:** Uses `var(--emerald)` for confirmation status indicators and icon colors — green on an appointments page is fine contextually but inconsistent with overall brand.
**MAJOR:** The page is not in the sitemap (removed — correct) but has no explicit `robots: { index: false }` metadata either. It's currently accessible by Google.

---

### Reports (`/reports`) — 4/10
**CRITICAL:** **NO Footer component**.
**CRITICAL:** **NO BookingBanner component**.
**MAJOR:** Removed from sitemap but no `robots: { index: false }` metadata. Google can still crawl it.
**MAJOR:** CTA button inside the page uses `var(--emerald)` green background — should be orange.
**MINOR:** `'use client'` page with no loading skeleton. Blank screen while data loads.

---

### Performance (`/performance`) — 4/10
**CRITICAL:** **NO Footer component**.
**CRITICAL:** **NO BookingBanner component**.
**MAJOR:** Removed from sitemap but no explicit noindex. Google crawls it.
**MINOR:** Page has proper metadata with SEBI RA number in description — good.

---

### Research (`/research`) — 5/10
**CRITICAL:** `<BookingBanner />$1` artifact — "$1" visible on the research page.
**MAJOR:** All CTA buttons use `var(--emerald)` green background with `color: '#031A13'` (dark text on green). This is the opposite of the orange-CTA brand standard.
**MINOR:** Footer present. Metadata present.

---

### Settings (`/settings`) — 6/10
**NOTE:** This is a protected post-auth page — Footer and BookingBanner are intentionally absent (correct for dashboard pages).
**MAJOR:** Uses `DM Serif Display` for headings — NOT loaded, will fall back to Times New Roman.
**MAJOR:** Uses `var(--sapphire)` (#2563EB) for "completed" appointment status — this blue color appears nowhere in the brand guidelines.
**MINOR:** Uses `var(--emerald)` for active tab indicators and toggle switches — consistent with dashboard but inconsistent with public brand.

---

### Disclaimer / Privacy Policy / Terms of Service — 6/10
**MAJOR:** No BookingBanner on any of these pages — may be intentional for legal pages but creates inconsistent UX for users who land on these from Google.
**MINOR:** Footer present on all three. SEBI number and disclaimer language present.

---

### Investor Charter / Grievance Redressal / MITC / Smart ODR — 7/10
**MINOR:** Both Footer and BookingBanner present. Compliance pages are well-structured.

---

## SECTION 2: SEBI / DSA Compliance

**Score: 8/10**

### What's Working
- **SEBI Registration INH000026266** visible on every public page — in Navbar, Footer, service pages, blog author cards, SEBI disclaimer blocks. This is comprehensive.
- **Zero "guaranteed returns" language** — every instance of "guaranteed" in the codebase explicitly states that returns are NOT guaranteed. Clean.
- **Risk disclaimer** present on: pricing page FAQ, all service pages, all blog posts, the admin brand reference card, MITC page, layout.tsx FAQ schema. The `SebiDisclaimer` component is reusable and deployed.
- **Grievance redressal** pages exist at `/complaints`, `/grievance-redressal`, `/smart-odr`. The complaints page has a proper escalation tree.
- **Investor charter** page exists at `/investor-charter`.
- **SCORES portal reference** in complaints page.

### Gaps

**MAJOR:** The admin layout (`admin/layout.tsx`) has a TODO comment: `// TODO: re-enable passkey check once WebAuthn is debugged on production` — meaning the admin section passkey authentication is currently **disabled**. If the admin pages become accessible (even via direct URL), they bypass security.

**MAJOR:** The `/performance` and `/reports` pages are removed from the sitemap but have NO noindex metadata. Google can still crawl and index them. These are partially gated pages that could show incomplete data to unauthenticated visitors.

**MAJOR:** Google Search Console verification tag in `layout.tsx` has `PLACEHOLDER` as fallback value — `content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? 'PLACEHOLDER'}`. If the env var is unset, `PLACEHOLDER` is served to Google. This means GSC cannot verify the site ownership if the env var is missing.

**MINOR:** The Compliance Officer details mentioned in SEBI requirements — a named compliance officer is listed in the contact page, but the name should be verifiable against SEBI records.

**MINOR:** Bing verification meta tag also has `BING_PLACEHOLDER` fallback.

---

## SECTION 3: Codebase Quality

**Score: 5/10**

### 3.1 Font Loading Bug (CRITICAL)
`DM Serif Display` is referenced **46 times** across page files (research, settings, contact, faq, about, methodology, and others). This font is **NOT imported** via `next/font/google` in `layout.tsx`. Only `Inter` and `Playfair_Display` are loaded.

Result: Every heading on research.tsx, settings.tsx, contactClient.tsx that specifies `fontFamily: 'DM Serif Display, serif'` falls back to the browser's default `serif` font — typically Times New Roman on Windows, Georgia on Mac. The visual output is significantly degraded from the intended design.

Fix required: Either add DM Serif Display to `layout.tsx` font imports, or replace all 46 instances with `var(--font-heading)` (Playfair Display).

### 3.2 "$1" Text Artifacts (CRITICAL)
Five pages have `<BookingBanner />$1` — the `$1` is rendered as literal text on the page:
- `/services/index-options`
- `/blog/[slug]` (every blog post)
- `/faq`
- `/contact` (ContactClient.tsx)
- `/research`

This is a broken search-and-replace artifact. Every visitor to those pages sees the text "$1" near the booking banner. Needs immediate fix.

### 3.3 Missing Footer/BookingBanner on High-Traffic Pages (CRITICAL)
Pages confirmed missing Footer and/or BookingBanner:
| Page | Footer | BookingBanner |
|---|---|---|
| `/services/intraday` | ❌ | ❌ |
| `/appointments` | ❌ | ❌ |
| `/performance` | ❌ | ❌ |
| `/reports` | ❌ | ❌ |
| `/disclaimer` | ✅ | ❌ |
| `/privacy-policy` | ✅ | ❌ |
| `/terms-of-service` | ✅ | ❌ |

### 3.4 Console.log in Production Code
9 `console.log` statements found in production code:
- `src/app/api/fyers/callback/route.ts` — 8 instances (logs auth tokens and API keys to console)
- `src/app/api/fyers/refresh-token/route.ts` — 1 instance
- `src/lib/screener/screener-engine.ts` — 1 instance

The Fyers callback logging is the most serious — it may expose sensitive auth data in server logs. The `next.config.js` has `removeConsole: { exclude: ['error', 'warn'] }` in production which strips `console.log` — but this only applies when `NODE_ENV === 'production'` is set, which may not be the case in preview deployments.

### 3.5 Dead Dependencies
The `package.json` includes **7 Capacitor packages** (`@capacitor/android`, `@capacitor/ios`, `@capacitor/app`, `@capacitor/cli`, `@capacitor/core`, `@capacitor/haptics`, `@capacitor/keyboard`, `@capacitor/status-bar`). A `capacitor.config.ts` exists but the `webDir: 'out'` setting is incompatible with Next.js App Router (which requires a server, not a static export). The Capacitor integration is **non-functional** and the packages add dead weight.

`framer-motion` is installed (`^11.2.6`) but **zero usage found** in `src/`. This is a ~40KB gzipped library adding to the bundle for nothing.

`react-hook-form` and `@hookform/resolvers` are installed but no `useForm` usage detected in public page code (might be used in admin pages).

`tailwindcss` generates utility classes but the app uses inline CSS-in-JS almost exclusively. Tailwind is only providing its CSS reset. `tailwind-merge` and `clsx` may also be orphaned.

### 3.6 TypeScript Quality
**No `any` type usage found** in page files (grep returned no results) — this is genuinely good.
Central `src/types/index.ts` exists with proper type definitions.
API routes use proper TypeScript typing based on the import patterns visible.
Score: 8/10 for TypeScript specifically.

### 3.7 Accessibility
**3 aria-label attributes** found across the entire public-facing codebase. For a financial platform serving retail investors including potentially elderly users, this is critically inadequate.

Specific missing ARIA:
- No `aria-label` on the WhatsApp float button
- No `role` attributes on custom accordion (FAQ uses `<details>` which is semantically correct, but the custom chevron/marker implementation overrides browser accessibility)
- No `aria-live` regions for error messages in forms
- No `role="alert"` on form validation messages
- No keyboard navigation for mobile menu (requires `onKeyDown` handler)
- Only 5 Next.js `<Image>` components found — suspect many images use `<img>` tags or CSS backgrounds without alt text

### 3.8 Loading States
Dashboard pages (`/dashboard`, `/reports`, `/appointments`) use `'use client'` and fetch data via `useEffect` but show blank screens during load rather than skeleton components. This creates a jarring experience on first load.

### 3.9 Component Reuse
64+ unique inline button style definitions across the codebase. No reusable `Button` component. No `Card` component. No `Badge` component. Every page reinvents the same patterns with slightly different padding/border-radius values.

Example: The orange CTA button appears in at least 15 different places with padding values ranging from `10px 20px` to `16px 40px` with no consistency.

### 3.10 TODO / Unresolved Items
```
src/app/layout.tsx:402  — Google Search Console verification code is 'PLACEHOLDER'
src/app/layout.tsx:404  — Bing verification code is 'BING_PLACEHOLDER'  
src/app/admin/layout.tsx:30 — Admin passkey auth is DISABLED with a TODO comment
```

---

## SECTION 4: Fintech Benchmarking

**Current Level: 4/10 vs Zerodha/Groww standard**

### 4.1 Design System

**Zerodha/Groww level:** Strict design token system, component library (often Radix/Shadcn or custom), consistent spacing scale, documented design decisions.

**withSahib current state:**
- CSS variables exist and are well-defined in `globals.css` — this is the foundation of a design system.
- But 90%+ of styling is done via inline `style={{ }}` objects with hardcoded pixel values that don't reference the design tokens.
- Spacing is inconsistent: padding values seen include 12px, 16px, 20px, 24px, 28px, 32px, 36px, 40px, 48px, 56px, 64px, 72px, 80px — no scale.
- Three distinct "gold" colors in use: `#92680A` (var(--gold)), `#B8860B` (var(--gold-light)), `#B8975A` (Elite plan, hardcoded).
- Two distinct "green" naming systems: `var(--emerald)`, `var(--green)`, `var(--electric)`, `var(--electric2)` — all aliasing the same color. The alias system in globals.css creates confusion.
- No Storybook, no component documentation.

**Gap:** Need a `components/ui/Button.tsx`, `components/ui/Card.tsx`, `components/ui/Badge.tsx` minimum. Replace inline styles with CSS classes referencing design tokens.

### 4.2 Architecture

**Zerodha/Groww level:** Clean API layer, typed responses, centralized error handling, proper auth middleware.

**withSahib current state:**
- Supabase client exists at `src/lib/supabase/` — proper separation.
- API routes exist at `src/app/api/` — conventional Next.js structure.
- Auth check via `isAdmin()` helper exists.
- Signal utilities in `src/lib/signal-utils.ts` — good.
- Market hours in `src/lib/market-hours.ts` — good.
- Rate limiting exists.
- **BUT:** Admin passkey auth is currently disabled (TODO comment). Admin section has no active authentication gate at the route level right now.
- `src/app/api/fyers/callback/` logs raw auth tokens and API keys to console.
- No centralized API error handling pattern — each route handles errors independently.

**Gap:** Re-enable admin auth. Remove console.log from auth routes. Create a centralized `src/lib/api/` layer with typed responses.

### 4.3 User Flow

**Onboarding:**
Register → Dashboard in 1 step. Clean. However:
- The register page password strength indicator (3 bars) is implementation-level feedback, not user-level guidance
- No onboarding tour or welcome flow after registration
- No email verification step (auto sign-in after register)

**Subscription flow:**
- Currently: Register → Dashboard → Pricing page → (Razorpay). 
- Razorpay integration exists in appointments page but the actual subscription purchase flow is unclear from the code. This is a potential revenue leak.
- No clear "upgrade" CTA on the free-tier dashboard.

**Research delivery:**
- Signals are shown on the dashboard behind a plan gate.
- WhatsApp delivery mentioned prominently but the actual WhatsApp Business integration is not visible in the codebase (AiSensy API key is referenced in admin settings but the integration is marked as `PLACEHOLDER`).
- If WhatsApp delivery is the primary channel (mentioned in llms.txt and several pages), the delivery mechanism is either not built or not connected.

**Mobile experience:**
- Responsive CSS breakpoints are defined and used — pages are technically responsive.
- But the actual mobile layout hasn't been tested: 40px padding on a 375px screen leaves only 295px of content width.
- `padding: '80px 40px'` (FAQ page) on mobile = 295px content width. Tight.
- Navigation mobile menu exists in Navbar — hard to verify without rendering.
- Capacitor was attempted but is non-functional.

### 4.4 vs Zerodha Specifically

| Feature | Zerodha | withSahib |
|---|---|---|
| Design system | Full Varsity/Pi design language | Partial CSS vars, mostly inline |
| Component library | Documented, reusable | None — inline styles everywhere |
| Loading states | Skeleton screens everywhere | Blank screens on most data pages |
| Error handling | Graceful degradation | Mixed — some catch blocks, some not |
| Accessibility | WCAG 2.1 AA | Minimal (3 aria-labels total) |
| Mobile app | Full native app | Capacitor attempted, non-functional |
| Auth security | WebAuthn + SMS OTP | Admin auth currently disabled |
| Type safety | Full TypeScript | Good TypeScript but admin bypassed |

---

## SECTION 5: SEO Audit

**Score: 8/10**

### What's Working
- Canonical tags on all public pages ✓
- `metadataBase` set correctly in root layout ✓
- www redirect in `next.config.js` ✓
- `robots.ts` disallows `/auth/`, `/dashboard/`, `/api/`, `/admin/` ✓
- `sitemap.ts` covers 27+ pages with correct priorities ✓
- Static `public/robots.txt` and `public/sitemap.xml` removed (dynamic routes take precedence) ✓
- OG tags on all pages ✓
- Unique title + description on all pages ✓

### Gaps

**MAJOR:** `/performance` and `/reports` are removed from sitemap but have NO `robots: { index: false }` in their metadata. Google will find and index these pages via internal links.

**MAJOR:** `/appointments` is in the sitemap (priority 0.80) but it's a semi-authenticated page that requires login to use. Google landing on `/appointments` gets a partially useful page at best.

**MAJOR:** `og-home.jpg` referenced in root layout metadata but the file does not exist in `/public/`. Every page falls back to a missing image. Social sharing shows broken OG image for all pages.

**MINOR:** `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env var likely not set — Google sees `PLACEHOLDER` as the verification value.

**MINOR:** Image alt text coverage: only 5 `<Image>` components found in public pages. Most visual content appears to use CSS backgrounds (no alt text possible). The single `<Image>` usage in blog posts has proper alt text.

**MINOR:** Internal linking is largely ad-hoc — no systematic cross-linking from high-authority pages (home, about) to service pages with related content.

---

## SECTION 6: AEO Audit

**Score: 8/10**

### Schema Coverage
| Schema Type | Pages | Status |
|---|---|---|
| Organization | Root layout | ✓ |
| Person | Root layout + About layout | ✓ |
| WebSite + SearchAction | Root layout | ✓ |
| FinancialService | Root layout | ✓ |
| FAQPage | Root layout + FAQ page | ✓ (duplicate!) |
| HowTo | Methodology layout | ✓ |
| Course (×4) | Courses page | ✓ |
| Service (pricing) | Pricing layout | ✓ |
| BlogPosting | Blog post pages | ✓ |
| BreadcrumbList | Most inner page layouts | ✓ |

### Gaps

**MAJOR:** FAQPage schema is defined **twice** — once in root `layout.tsx` (the long 8-question version) and once in `faq/page.tsx` (the full 84-question version). Google will see two FAQPage schemas on `/faq` — the root layout's schema applies to every page, and the FAQ page's schema applies additionally. The root layout FAQPage schema will be sent on every page, which could confuse Google's schema parser.

**MAJOR:** The FAQ answers in `layout.tsx` FAQPage schema still reference old pricing (`₹999/₹2,499/₹5,999`) in the `acceptedAnswer` for "How to subscribe". This was partially fixed but the inline schema data in the layout's structured data object wasn't updated in all places.

**MINOR:** Article schema uses `'https://www.withsahib.com/og-image.png'` as the default image — this file may not exist (og-home.jpg was specified as the new default but og-image.png is the blog fallback).

**MINOR:** Service pages (`/services/stock-options`, `/services/index-options`, `/services/swing`) have no FinancialProduct or Service schema despite being the primary product pages.

---

## SECTION 7: GEO Audit

**Score: 7/10**

### What's Working
- `/llms.txt` exists with updated pricing ✓
- Clear entity relationships (withSahib = platform, Sahib Singh Hora = analyst) ✓
- SEBI registration number stated clearly ✓
- Preferred citation format provided ✓
- AI crawler rules not blocked in robots.ts (currently the simplified robots.ts removed the specific AI agent rules — this is a regression) ✗

### Gaps

**MAJOR:** The previous `robots.ts` had explicit per-agent rules for `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Googlebot`, etc. The latest simplified version has only a `*` wildcard rule. This is technically correct (the `*` allows all), but some AI crawlers check for explicit allow rules before indexing. The explicit per-agent rules provided stronger GEO signal.

**MAJOR:** `llms.txt` subscription plan pricing was updated, but the current `llms.txt` references `connect@withsahib.com` as the contact email. The rest of the codebase uses `sahib13singh13@gmail.com` and no `connect@withsahib.com` address appears to be active. AI systems citing this could give users incorrect contact information.

**MINOR:** The SEBI verification URL in `llms.txt` is a dynamic search URL (`doRecognisedFpi=yes&intmId=14`) — this may not deep-link correctly. The stable verification URL for Research Analysts is a different endpoint.

**MINOR:** `llms.txt` mentions 14+ years of market experience. The `about/page.tsx` should explicitly state when the analyst career began (2010 or similar) so AI systems can independently verify the experience claim. Unverifiable claims get discounted by AI citation systems.

**MINOR:** No `ai.txt` or explicit AI citation policy beyond `llms.txt`. Perplexity and other citation-heavy AI systems look for structured entity pages. The About page should function as a canonical entity page for Sahib Singh Hora.

---

## PRIORITY ACTION LIST

Ranked by impact and severity:

### IMMEDIATE (Ship-blockers)

**1. Fix "$1" text artifacts on 5 pages**
Affected: `/services/index-options`, every `/blog/[slug]`, `/faq`, `/contact`, `/research`
Each shows literal text "$1" on the live site.
Action: Remove `$1` from after `<BookingBanner />` in each file.

**2. Fix DM Serif Display font not loading**
46 inline font references to `DM Serif Display` will render Times New Roman.
Action: Add `DM_Serif_Display` to `next/font/google` imports in `layout.tsx` OR replace all 46 references with `fontFamily: 'var(--font-heading)'`.

**3. Add Footer + BookingBanner to missing pages**
Critical pages missing both: `/services/intraday`, `/appointments`, `/performance`, `/reports`
These are high-traffic pages with no navigation and no CTA.

**4. Add `og-home.jpg` to `/public/`**
Every page's social share shows a broken image. Create and place a 1200×630 OG image.

**5. Re-enable admin authentication**
`admin/layout.tsx` has passkey auth disabled via TODO comment. If the admin URL is guessed, it's open.

### HIGH PRIORITY (Within 1 week)

**6. Add `robots: { index: false }` to `/performance`, `/reports`**
These were removed from sitemap but are still crawlable. Add noindex metadata.

**7. Fix FAQPage schema duplication**
Remove FAQPage schema from root `layout.tsx` — it doesn't belong on every page. Keep only in `faq/page.tsx`.

**8. Update old pricing in layout.tsx FAQ schema answers**
The structured data in `layout.tsx` still mentions old prices in the schema JSON.

**9. Remove console.log from Fyers callback route**
`callback/route.ts` logs sensitive auth data (8 console.log statements). Remove or replace with `logger.ts` (which already exists).

**10. Remove dead Capacitor dependencies**
7 Capacitor packages, 1 framer-motion, potentially react-hook-form and tailwind-merge — audit and remove unused dependencies.

### MEDIUM PRIORITY (Within 1 month)

**11. Create reusable Button component**
64+ inline button definitions. Extract `components/ui/Button.tsx` with size/variant props.

**12. Fix color brand consistency**
The FAQ, research, and contact pages use green (emerald) for primary CTAs. The brand is orange. Audit and switch all primary CTAs on public pages to `var(--orange)`.

**13. Add loading skeletons to data-fetching pages**
`/reports`, `/appointments`, `/dashboard` show blank on load. Add skeleton components.

**14. Contact email consistency**
`llms.txt` uses `connect@withsahib.com` — verify this email exists or correct to the actual contact email.

**15. Restore explicit AI agent rules in robots.ts**
The simplified robots.ts removed GPTBot, ClaudeBot, PerplexityBot specific rules. Restore them for stronger GEO signal.

### LOW PRIORITY (Backlog)

**16. Accessibility pass**
Add aria-labels to all interactive elements. Add role="alert" to form errors. Add keyboard navigation to mobile menu. Target WCAG 2.1 AA.

**17. Unify gold color**
Three different gold tones in use. Standardize to one.

**18. Move inline styles to CSS classes**
Replace `style={{ padding: '40px 20px', ... }}` patterns with CSS utility classes using the existing `container-wide`, `container-narrow` patterns.

**19. Add Service schema to stock-options, index-options, swing service pages**
These are product pages without FinancialProduct schema.

**20. Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION env var**
GSC verification currently serves `PLACEHOLDER` if env var is missing.

---

## SCORECARD SUMMARY

| Area | Score | Key Issue |
|---|---|---|
| Visual consistency | 4/10 | $1 artifacts, wrong font, green vs orange CTAs |
| Mobile responsiveness | 7/10 | Technically responsive but not mobile-first |
| Footer/BookingBanner coverage | 6/10 | 4 key pages missing entirely |
| SEBI compliance | 8/10 | Solid — admin auth bypass is the main gap |
| TypeScript quality | 8/10 | Genuinely good — no any abuse found |
| Component reusability | 3/10 | No reusable Button/Card/Badge — everything inline |
| Bundle hygiene | 4/10 | Capacitor (dead), framer-motion (unused) |
| Accessibility | 2/10 | 3 aria-labels across entire codebase |
| Loading states | 4/10 | Blank screens on data-fetch pages |
| SEO coverage | 8/10 | Good structure, missing og-home.jpg |
| AEO schemas | 7/10 | Good coverage, FAQPage duplicated |
| GEO readiness | 7/10 | llms.txt present, AI robots rules removed |

---

*Audit conducted by static code analysis. No live rendering performed. Some visual issues may differ in actual browser render.*
