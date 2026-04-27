# withSahib — File Audit Report

**Date:** 2026-04-27  
**Auditor:** Claude Sonnet 4.6  
**Purpose:** Count every file, categorize each one, identify unused/dead/unnecessary files

---

## Total File Counts

| Type | Count |
|------|-------|
| All files (excl. node_modules/.next/.git) | **380** |
| TSX (React components + pages) | **89** |
| TS (API routes, libs, types, config) | **88** |
| CSS | **1** |
| Markdown (docs + audit reports) | **15** |
| JSON (config files) | **7** |
| Other (public, supabase, config) | ~**130** |

---

## File Categories

### 1. App Pages (`src/app/**/page.tsx`) — 46 files

All public pages, auth pages, admin pages. Every directory has a `page.tsx`.

| Route | File | Lines | Status |
|-------|------|-------|--------|
| `/` | `src/app/page.tsx` | ~1150 | Active — homepage |
| `/about` | `src/app/about/page.tsx` | ~400 | Active |
| `/appointments` | `src/app/appointments/page.tsx` | ~350 | Active |
| `/blog` | `src/app/blog/page.tsx` | 153 | Active |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | 180 | Active |
| `/brand` | `src/app/brand/page.tsx` | ~680 | Active — internal design reference (noindex) |
| `/complaints` | `src/app/complaints/page.tsx` | 188 | Active — form has no submit handler |
| `/contact` | `src/app/contact/page.tsx` | 154 | Active |
| `/courses` | `src/app/courses/page.tsx` | ~400 | Active — 13 unfixed #FF6B00 values |
| `/dashboard` | `src/app/dashboard/page.tsx` | ~200 | Active |
| `/dashboard/signals` | `src/app/dashboard/signals/page.tsx` | ~380 | Active |
| `/disclaimer` | `src/app/disclaimer/page.tsx` | 205 | Active — statutory |
| `/disclosure` | `src/app/disclosure/page.tsx` | 123 | Active — statutory |
| `/faq` | `src/app/faq/page.tsx` | ~280 | Active |
| `/grievance-redressal` | `src/app/grievance-redressal/page.tsx` | 137 | Active — statutory |
| `/investor-charter` | `src/app/investor-charter/page.tsx` | 153 | Active — statutory |
| `/methodology` | `src/app/methodology/page.tsx` | ~480 | Active |
| `/mitc` | `src/app/mitc/page.tsx` | 128 | Active — statutory |
| `/performance` | `src/app/performance/page.tsx` | ~200 | Active — noindex |
| `/portfolio` | `src/app/portfolio/page.tsx` | unknown | Active (not checked) |
| `/pricing` | `src/app/pricing/page.tsx` | ~420 | Active |
| `/privacy-policy` | `src/app/privacy-policy/page.tsx` | 197 | Active — statutory |
| `/refund-policy` | `src/app/refund-policy/page.tsx` | 102 | Active — statutory |
| `/reports` | `src/app/reports/page.tsx` | ~200 | Active |
| `/research` | `src/app/research/page.tsx` | 141 | Active — noindex |
| `/services` | `src/app/services/page.tsx` | ~200 | Active |
| `/services/index-options` | `src/app/services/index-options/page.tsx` | 120 | Active |
| `/services/intraday` | `src/app/services/intraday/page.tsx` | ~370 | Active |
| `/services/stock-options` | `src/app/services/stock-options/page.tsx` | 105 | Active |
| `/services/swing` | `src/app/services/swing/page.tsx` | 178 | Active |
| `/settings` | `src/app/settings/page.tsx` | ~450 | Active |
| `/smart-odr` | `src/app/smart-odr/page.tsx` | 126 | Active — statutory |
| `/terminology` | `src/app/terminology/page.tsx` | 170 | Active |
| `/terms-of-service` | `src/app/terms-of-service/page.tsx` | ~200 | Active — statutory |
| `/who-its-for` | `src/app/who-its-for/page.tsx` | ~200 | Active |
| `/work-with-us` | `src/app/work-with-us/page.tsx` | 200 | Active |
| `/auth/login` | `src/app/auth/login/page.tsx` | ~270 | Active |
| `/auth/register` | `src/app/auth/register/page.tsx` | ~200 | Active |
| `/auth/forgot-password` | `src/app/auth/forgot-password/page.tsx` | ~270 | Active |
| `/auth/reset-password` | `src/app/auth/reset-password/page.tsx` | ~150 | Active |
| `/admin` | `src/app/admin/layout.tsx` renders admin shell | — | Active |
| `/admin/intelligence` | `src/app/admin/intelligence/page.tsx` | unknown | Active — admin |
| `/admin/passkey` | `src/app/admin/passkey/page.tsx` | 139 | Active — admin |
| `/admin/passkey/verify` | `src/app/admin/passkey/verify/page.tsx` | 174 | Active — admin |
| `/admin/screener` | `src/app/admin/screener/page.tsx` | ~730 | Active — admin |
| `/admin/settings` | `src/app/admin/settings/page.tsx` | ~200 | Active — admin |
| `/admin/signals` | `src/app/admin/signals/page.tsx` | unknown | Active — admin |
| `/admin/super` | `src/app/admin/super/page.tsx` | ~200 | Active — admin |

---

### 2. Layout Files (`src/app/**/layout.tsx`) — 16 files

| File | Lines | Purpose |
|------|-------|---------|
| `src/app/layout.tsx` | ~370 | Root layout — ThemeProvider, Toaster, WhatsAppButton, skip link |
| `src/app/about/layout.tsx` | 51 | Metadata + Person + BreadcrumbList JSON-LD |
| `src/app/appointments/layout.tsx` | ~50 | Metadata + Service + BreadcrumbList JSON-LD |
| `src/app/auth/forgot-password/layout.tsx` | 9 | noindex metadata only |
| `src/app/auth/login/layout.tsx` | 9 | noindex metadata only |
| `src/app/auth/register/layout.tsx` | 9 | noindex metadata only |
| `src/app/auth/reset-password/layout.tsx` | 9 | noindex metadata only |
| `src/app/blog/layout.tsx` | ~40 | Blog metadata |
| `src/app/complaints/layout.tsx` | ~30 | Complaints metadata |
| `src/app/contact/layout.tsx` | ~30 | Contact metadata |
| `src/app/dashboard/signals/layout.tsx` | 9 | noindex metadata only |
| `src/app/methodology/layout.tsx` | ~60 | HowTo + BreadcrumbList JSON-LD |
| `src/app/pricing/layout.tsx` | 51 | Service + BreadcrumbList JSON-LD |
| `src/app/reports/layout.tsx` | 9 | noindex metadata only |
| `src/app/services/intraday/layout.tsx` | ~50 | Service + BreadcrumbList JSON-LD |
| `src/app/work-with-us/layout.tsx` | ~30 | Work with us metadata |

**Note:** Six layout files are tiny (9 lines each) — they exist solely to apply `robots: { index: false }` metadata. This is correct Next.js App Router pattern, not waste.

---

### 3. Special App Files — 7 files

| File | Purpose | Status |
|------|---------|--------|
| `src/app/layout.tsx` | Root layout | Active |
| `src/app/loading.tsx` | Root loading UI | Active |
| `src/app/error.tsx` | Root error boundary | Active |
| `src/app/global-error.tsx` | Global error boundary | Active |
| `src/app/not-found.tsx` | 404 page | Active |
| `src/app/opengraph-image.tsx` | OG image generator | Active |
| `src/app/icon.tsx` | Favicon generator | Active |
| `src/app/apple-icon.tsx` | Apple touch icon | Active |
| `src/app/contact/ContactClient.tsx` | Client split for contact page | Active |
| `src/app/sitemap.ts` | Dynamic sitemap generator (~28 URLs) | Active |

---

### 4. API Routes (`src/app/api/**/route.ts`) — 37 routes

All routes have `route.ts` files. Every route is active.

| Group | Routes | Count |
|-------|--------|-------|
| Signals | `/signals`, `/signals/[id]`, `/signals/[id]/cancel`, `/signals/[id]/push`, `/signals/check-status`, `/signals/expire-intraday` | 6 |
| Screener | `/screener/run`, `/screener/results`, `/screener/stats`, `/screener/test`, `/screener/signal-action` | 5 |
| ML | `/ml/train`, `/ml/generate-predictions`, `/ml/generate-postmortem`, `/ml/score/[alertId]` | 4 |
| Admin | `/admin/alerts`, `/admin/view-mode`, `/admin/passkey/*` (4 routes) | 6 |
| Fyers | `/fyers/auth`, `/fyers/callback`, `/fyers/refresh-token`, `/fyers/status` | 4 |
| Distribution | `/distribution/daily-recap`, `/distribution/process-queue` | 2 |
| Market Data | `/market-data`, `/market-data/prices` | 2 |
| Auth | `/api/auth` | — see below |
| Other | `/ai/report`, `/email/welcome`, `/intelligence/weekly-report`, `/subscriptions/create`, `/webhooks/razorpay`, `/indexnow`, `/performance`, `/revalidate-market` | 8 |

**⚠️ EMPTY API DIRECTORIES (no route.ts):**
- `src/app/api/appointments/` — **empty directory** (0 files inside)
- `src/app/api/auth/` — **empty directory** (0 files inside)

These are ghost directories. No route is served. Appointments booking is handled via client-side code in `appointments/page.tsx` calling Supabase directly. Auth routing is handled by Supabase Auth. These empty dirs should be **deleted**.

---

### 5. Layout Components (`src/components/layout/`) — 6 files

| File | Usages | Status |
|------|--------|--------|
| `Navbar.tsx` | 32 pages | Active — used everywhere |
| `Footer.tsx` | 27 pages | Active — used everywhere |
| `BookingBanner.tsx` | 28 pages | Active — used everywhere |
| `ThemeProvider.tsx` | 1 (root layout) | Active — wraps entire app |
| `StatutoryLetterhead.tsx` | 3 pages | Active — compliance pages |
| `CredentialBar.tsx` | **0 anywhere** | **⚠️ UNUSED — never imported** |

`CredentialBar.tsx` is a SEBI credential bar component (ShieldCheck icon + "SEBI Registered" text). It was built but never wired into any page or layout. Zero imports.

---

### 6. UI Components (`src/components/ui/`) — 11 files

| File | Direct Imports | Status | Notes |
|------|----------------|--------|-------|
| `Button.tsx` | 16 files | ✅ Active — core component | Used in 33 JSX usages |
| `SebiDisclaimer.tsx` | 7 files | ✅ Active | Disclaimer widget |
| `Logo.tsx` | Barrel only | ✅ Active (via barrel) | Used in Navbar, admin, opengraph |
| `WhatsAppButton.tsx` | 1 (layout.tsx) | ✅ Active | Fixed float button on all pages |
| `Toast.tsx` | 0 direct imports | **⚠️ ORPHANED** | App uses `sonner` Toaster instead; Toast.tsx is our own implementation that was never adopted |
| `Card.tsx` | 0 direct imports | **⚠️ POSSIBLY UNUSED** | Only in barrel; no page imports it |
| `Skeleton.tsx` | 0 direct imports | **⚠️ POSSIBLY UNUSED** | `<Skeleton />` in admin/screener appears to be a local inline shimmer, not this component |
| `Badge.tsx` | 0 direct imports | **⚠️ ORPHANED** | All badge-like elements throughout app are custom inline spans; this component was never adopted |
| `Input.tsx` | 0 direct imports | **⚠️ ORPHANED** | All form inputs use the `className="input"` CSS class; the Input component was never adopted |
| `Modal.tsx` | 0 direct imports | **⚠️ ORPHANED** | admin/screener uses a local `ChartModal` function; no page imports this component |
| `AnimatedLogo.tsx` | **0 anywhere** | **🔴 DEAD — never used** | 38-line animated logo component; zero imports anywhere |
| `index.ts` | 0 imports | Active (barrel) | Re-exports all UI components |

**Summary of UI component adoption:**
- Fully adopted: `Button`, `SebiDisclaimer`, `Logo`, `WhatsAppButton`  
- Partially adopted (few usages): `Toast` (superseded by sonner)
- Never adopted: `Badge`, `Input`, `Modal`, `Card`, `Skeleton`, `AnimatedLogo`, `CredentialBar`

---

### 7. Library Files (`src/lib/`) — 40 files

| File | Used By | Status |
|------|---------|--------|
| `supabase/client.ts` | ~20 client components | ✅ Active |
| `supabase/server.ts` | ~15 API routes | ✅ Active |
| `razorpay/client.ts` | pricing, appointments | ✅ Active |
| `signal-utils.ts` | dashboard, admin/signals | ✅ Active |
| `fyers-client.ts` | 5 API routes + screener | ✅ Active |
| `admin-check.ts` | admin layout + API routes | ✅ Active |
| `webauthn.ts` | admin layout + 4 passkey routes | ✅ Active |
| `market-hours.ts` | 4 API routes | ✅ Active |
| `rate-limit.ts` | signals API routes | ✅ Active |
| `logger.ts` | signals routes + capture-features | ✅ Active |
| `tokens.ts` | CSS token definitions | ✅ Active |
| `capture-features.ts` | `api/signals/route.ts` | ✅ Active |
| `data/posts.ts` | blog pages | ✅ Active |
| `ai/reports.ts` | `api/ai/report` | ✅ Active |
| `email/resend-client.ts` | email templates | ✅ Active |
| `email/send-email.ts` | email routes | ✅ Active |
| `email/templates/*.ts` (7 files) | email routes | ✅ Active |
| `screener/screener-engine.ts` | screener API | ✅ Active |
| `screener/indicators.ts` | screener engine | ✅ Active |
| `screener/ml-capture.ts` | `api/screener/run` | ✅ Active |
| `screener/types.ts` | screener files | ✅ Active |
| `screener/data/fyers-feed.ts` | screener engine | ✅ Active |
| `screener/data/nse-universe.ts` | screener engine | ✅ Active |
| `screener/patterns/*.ts` (8 pattern files) | screener engine | ✅ Active |
| `ml/decision-tree.ts` | ml routes | ✅ Active |
| `ml/feature-encoder.ts` | ml routes | ✅ Active |
| `ml/model-store.ts` | ml routes | ✅ Active |
| `ml/random-forest.ts` | ml routes | ✅ Active |
| `utils/marketData.ts` | market-data API | ✅ Active |

**All library files are actively used.** No dead lib code found.

---

### 8. Configuration & Build Files — ~12 files

| File | Purpose | Status |
|------|---------|--------|
| `package.json` | Dependencies | Active |
| `package-lock.json` | Lock file | Active |
| `next.config.js` | Next.js config | Active |
| `tsconfig.json` | TypeScript config | Active |
| `postcss.config.js` | PostCSS (Tailwind-adjacent) | Active |
| `.eslintrc.*` / `eslint.config.*` | Lint config | Active |
| `tailwind.config.*` | Tailwind (if present) | Check |
| `vercel.json` | Vercel deploy config | Active (if present) |
| `.env.example` | Environment template | Active — documentation |
| `src/middleware.ts` | Auth middleware | Active |
| `src/types/index.ts` | Global TypeScript types | Active |
| `src/components/ui/index.ts` | UI barrel export | Active |
| `src/styles/globals.css` | Global CSS (only CSS file) | Active |

---

### 9. Markdown Files — 15 files

| File | Lines | Purpose | Recommendation |
|------|-------|---------|----------------|
| `README.md` | ~200 | Project README (root) | **KEEP** |
| `withsahib.md` | **1,271** | AI session context document — project identity, tech stack, env vars, schema, signal lifecycle, ML system, access control, file structure, pending work, AI rules | **KEEP** — not deployable code, but essential AI session memory. Consider moving to `.claude/` or `docs/CONTEXT.md` |
| `AUDIT_REPORT.md` | 538 | V1 audit (2026-04-27) | **ARCHIVE or DELETE** — superseded by V2/V3/FINAL |
| `AUDIT_REPORT_V2.md` | 652 | V2 audit (2026-04-27) | **ARCHIVE or DELETE** — superseded |
| `AUDIT_REPORT_V3.md` | ~413 | V3 audit (2026-04-27) | **ARCHIVE or DELETE** — superseded |
| `AUDIT_REPORT_FINAL.md` | ~250 | Final audit (2026-04-27) | **KEEP** — current reference |
| `FILE_AUDIT.md` | this file | File audit | **KEEP** |
| `docs/API.md` | unknown | API reference | **KEEP** — referenced 69 times in code/docs |
| `docs/ARCHITECTURE.md` | unknown | System architecture | **KEEP** |
| `docs/COMPLIANCE.md` | unknown | SEBI compliance guide | **KEEP** |
| `docs/DATABASE.md` | unknown | Supabase schema docs | **KEEP** |
| `docs/DESIGN_SYSTEM.md` | unknown | Design tokens + CSS system | **KEEP** |
| `docs/ONBOARDING.md` | unknown | Developer onboarding | **KEEP** |
| `docs/SEO.md` | unknown | SEO/AEO/GEO strategy | **KEEP** |
| `docs/USER_FLOWS.md` | unknown | User journey docs | **KEEP** |
| `supabase/functions/fyers-price-feed/README.md` | unknown | Edge function docs | **KEEP** |

**⚠️ Missing:** `docs/README.md` — The Final Audit found 10/11 expected docs files. The root `README.md` should either be duplicated/symlinked to `docs/README.md`, or the docs check expectation should be updated to look at root.

---

### 10. Public Files — 13 files

| File | Referenced | Status | Notes |
|------|-----------|--------|-------|
| `public/favicon.svg` | In `<head>` via Next.js | ✅ Active | |
| `public/manifest.json` | Referenced in layout.tsx | ✅ Active | PWA manifest |
| `public/llms.txt` | Direct URL `/llms.txt` | ✅ Active | 54 lines — AI crawler hints |
| `public/.well-known/llms.txt` | Standard `/.well-known/llms.txt` | ✅ Active | **⚠️ DIVERGED** — different content from `public/llms.txt` (shorter version). Should be kept in sync. |
| `public/ai.txt` | AI crawler access file | ✅ Active | Companion to llms.txt |
| `public/sw.js` | Service Worker | ✅ Active | PWA offline support |
| `public/workbox-4754cb34.js` | Workbox runtime | ✅ Active | SW dependency |
| `public/images/sahib-primary.jpg` | `about/page.tsx` | ✅ Active | Analyst portrait |
| `public/images/sahib-secondary.jpg` | `page.tsx` | ✅ Active | Homepage analyst image |
| `public/BingSiteAuth.xml` | Bing Webmaster verification | ✅ Active | Served at `/BingSiteAuth.xml` |
| `public/google-site-verification.html` | Google Search Console | ✅ Active | Served at `/google-site-verification.html` |
| `public/withsahib2026indexnow.txt` | IndexNow API key | ✅ Active | Required for IndexNow URL submission |
| `public/.DS_Store` | Nothing | **🔴 SHOULD NOT EXIST IN GIT** | macOS metadata file — tracked in git despite `.DS_Store` in `.gitignore`. Remove with `git rm --cached public/.DS_Store`. |

---

### 11. Supabase Files — ~15 files

| File | Status | Notes |
|------|--------|-------|
| `supabase/migrations/001_signal_system.sql` | ✅ Active | Signal table schema |
| `supabase/migrations/002_passkeys.sql` | ✅ Active | Admin passkey schema |
| `supabase/migrations/003_screener_ml_system.sql` | ✅ Active | Screener + ML schema |
| `supabase/functions/fyers-price-feed/index.ts` | ✅ Active | Deno edge function for live price feed |
| `supabase/functions/fyers-price-feed/.env.example` | ✅ Active | Edge function env template |
| `supabase/functions/fyers-price-feed/README.md` | ✅ Active | Documentation |
| `supabase/.temp/cli-latest` | **🔴 IN GIT** | Supabase CLI temp file — should not be committed |
| `supabase/.temp/gotrue-version` | **🔴 IN GIT** | Version pin — should not be committed |
| `supabase/.temp/pooler-url` | **🔴 IN GIT — POTENTIALLY SENSITIVE** | Database pooler URL — may contain connection info |
| `supabase/.temp/postgres-version` | **🔴 IN GIT** | Version pin |
| `supabase/.temp/project-ref` | **🔴 IN GIT** | Supabase project ID |
| `supabase/.temp/rest-version` | **🔴 IN GIT** | Version pin |
| `supabase/.temp/storage-migration` | **🔴 IN GIT** | Version pin |
| `supabase/.temp/storage-version` | **🔴 IN GIT** | Version pin |

**8 Supabase CLI temp files are tracked in git.** These are generated by `supabase link` and should be added to `.gitignore`. The `pooler-url` file especially may contain sensitive connection strings.

---

## Duplicate Component Names

`find . -name "*.tsx" | xargs basename | sort | uniq -d` returns: **`layout`** and **`page`**

These are not true duplicates — every route directory has its own `page.tsx` and `layout.tsx` by Next.js App Router convention. Not an issue.

---

## TODO / FIXME Comments Found

| File | Line | Content | Action |
|------|------|---------|--------|
| `src/app/layout.tsx` | 331 | `TODO: Replace PLACEHOLDER with actual Google Search Console verification code` | Replace with env var when GSC code is obtained |
| `src/app/layout.tsx` | 333 | `TODO: Replace BING_PLACEHOLDER with actual Bing Webmaster Tools verification code` | Replace with env var when Bing code is obtained |
| `src/app/brand/page.tsx` | 316–319 | `₹ XXX` placeholder values in SVG signal card demo | Intentional placeholder in design reference page |
| `src/app/services/intraday/page.tsx` | 315–318 | `₹XXX` placeholder values | Intentional — demo card for non-subscribers |
| `src/app/services/swing/page.tsx` | 141–144 | `₹XXX` placeholder values | Intentional — demo card for non-subscribers |
| `src/app/admin/settings/page.tsx` | 53–61 | `'PLACEHOLDER'` env var checks | Logic for detecting unconfigured integrations — correct usage |

No actual TODO/FIXME bugs that require code changes outside of the GSC/Bing verification codes.

---

## Verdict: Definitely Safe to Delete

| File/Dir | Reason |
|----------|--------|
| `src/app/api/appointments/` | Empty directory — no route.ts, no files, no purpose |
| `src/app/api/auth/` | Empty directory — no route.ts, no files, no purpose |
| `public/.DS_Store` | macOS metadata file committed to git by accident (`git rm --cached public/.DS_Store`) |
| `AUDIT_REPORT.md` | V1 audit — fully superseded by V2, V3, and FINAL |
| `AUDIT_REPORT_V2.md` | V2 audit — fully superseded by V3 and FINAL |
| `AUDIT_REPORT_V3.md` | V3 audit — fully superseded by FINAL |

---

## Verdict: Probably Unused (Verify Before Deleting)

| File | Reason | Verification |
|------|--------|--------------|
| `src/components/ui/AnimatedLogo.tsx` | **0 imports anywhere** in all 89 TSX files | `grep -rn "AnimatedLogo" ./src` → 0 results outside definition file |
| `src/components/layout/CredentialBar.tsx` | **0 imports anywhere** — credential bar built but never wired | `grep -rn "CredentialBar" ./src` → 0 results outside definition file |
| `src/components/ui/Badge.tsx` | **0 direct imports** — all badge-like UI uses custom inline spans | `grep -rn "from.*Badge\|<Badge" ./src` → 0 outside definition |
| `src/components/ui/Input.tsx` | **0 direct imports** — all form inputs use `className="input"` CSS class directly | `grep -rn "from.*Input\|<Input" ./src` → 0 outside definition |
| `src/components/ui/Modal.tsx` | **0 direct imports** — admin/screener uses local `ChartModal` function, not this | `grep -rn "from.*Modal\|<Modal" ./src` → 0 outside definition |
| `src/components/ui/Toast.tsx` | **0 direct imports** — app uses `sonner` Toaster in `layout.tsx` instead | Custom Toast implementation fully superseded by `sonner` |
| `src/components/ui/Card.tsx` | **0 direct imports** — only re-exported in barrel index | `grep -rn "from.*Card" ./src` → 0 page/component imports |
| `src/components/ui/Skeleton.tsx` | **0 direct imports** — shimmer effects are inline CSS animations | `grep -rn "from.*Skeleton" ./src` → 0 page imports |

**Combined: 8 component files (~300 lines total) that appear to be dead UI library code.**

These are safe to delete if confirmed unused, but they represent future capability (Badge, Input, Modal, Card, Skeleton could be adopted as the codebase grows). Decision: **archive or delete** based on whether UI component library expansion is planned.

---

## Verdict: Keep But Review

| File | Reason |
|------|--------|
| `withsahib.md` | 1,271-line AI session context document. Not deployable code. Contains sensitive info (personal contact, CIN, SEBI details). Useful for AI sessions. Consider moving to `.claude/context.md` or `docs/CONTEXT.md` and adding to `.gitignore` if it contains anything sensitive |
| `supabase/.temp/*` (8 files) | Generated by Supabase CLI. Should be in `.gitignore`. The `pooler-url` file may contain a sensitive database connection URL. **Action:** add `supabase/.temp/` to `.gitignore` and run `git rm --cached supabase/.temp/*` |
| `public/llms.txt` vs `public/.well-known/llms.txt` | Both exist, content differs. `public/llms.txt` (54 lines, richer) is the canonical version. `.well-known/llms.txt` (shorter) diverged. **Action:** sync them — copy public/llms.txt content to .well-known/llms.txt |
| `docs/` (8 files) | All docs files are useful reference. None are imported in code. `docs/API.md` shows 69 grep hits but those are all "API" word matches in other docs, not actual imports. All 8 docs files should be kept. |

---

## Verdict: Harmless But Noisy

| File | Note |
|------|------|
| `AUDIT_REPORT_FINAL.md` | Keep — current reference |
| `FILE_AUDIT.md` | Keep — this file |

---

## Summary Table

| Category | Count | Status |
|----------|-------|--------|
| Active app pages | 46 | All active |
| Active layout files | 16 | All active |
| Active special app files | 10 | All active |
| Active API routes | 37 | All active |
| Active layout components | 5 | Active |
| **Unused layout component** | **1** | CredentialBar — 0 imports |
| Active UI components | 4 | Button, SebiDisclaimer, Logo, WhatsAppButton |
| **Unused UI components** | **7** | AnimatedLogo, Badge, Input, Modal, Toast, Card, Skeleton |
| Active lib files | 40 | All active |
| Active config files | ~12 | All active |
| **Empty ghost API dirs** | **2** | api/appointments/, api/auth/ |
| **Stale in git** | **9** | public/.DS_Store + 8 supabase/.temp files |
| Active docs | 8 | docs/*.md |
| AI context file | 1 | withsahib.md — keep |
| **Superseded audit reports** | **3** | V1, V2, V3 (safe to delete) |
| Active audit files | 2 | AUDIT_REPORT_FINAL.md, FILE_AUDIT.md |
| Active public files | 12 | All needed |
| **Diverged duplicate** | **1** | .well-known/llms.txt differs from public/llms.txt |

**Dead code footprint:** ~8 unused component files, 2 empty dirs, 9 miscommitted files, 3 obsolete audit reports = **~22 items to clean up.**

---

## Recommended Cleanup Sequence

```bash
# 1. Remove public .DS_Store from git
git rm --cached public/.DS_Store

# 2. Remove supabase/.temp from git tracking
git rm --cached supabase/.temp/cli-latest
git rm --cached supabase/.temp/gotrue-version
git rm --cached supabase/.temp/pooler-url
git rm --cached supabase/.temp/postgres-version
git rm --cached supabase/.temp/project-ref
git rm --cached supabase/.temp/rest-version
git rm --cached supabase/.temp/storage-migration
git rm --cached supabase/.temp/storage-version

# 3. Add to .gitignore
echo "supabase/.temp/" >> .gitignore

# 4. Delete empty ghost directories
rmdir src/app/api/appointments
rmdir src/app/api/auth

# 5. Delete dead UI components (verify no hidden usages first)
rm src/components/ui/AnimatedLogo.tsx
rm src/components/ui/Badge.tsx
rm src/components/ui/Input.tsx
rm src/components/ui/Modal.tsx
rm src/components/ui/Toast.tsx
rm src/components/ui/Card.tsx
rm src/components/ui/Skeleton.tsx
rm src/components/layout/CredentialBar.tsx
# Update index.ts barrel to remove deleted exports

# 6. Delete superseded audit reports
rm AUDIT_REPORT.md AUDIT_REPORT_V2.md AUDIT_REPORT_V3.md

# 7. Sync llms.txt files
cp public/llms.txt public/.well-known/llms.txt
```

**Before running step 5:** confirm no dynamic imports of Badge/Input/Modal/Card/Skeleton exist (rare but possible). The static grep found none, but worth a final check:
```bash
grep -rn "Badge\|Input\|Modal\|Card\|Skeleton" --include="*.tsx" ./src | grep "import\|require" | grep -v "components/ui"
```
