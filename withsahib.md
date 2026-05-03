# withSahib — Project Context & Memory

> Last updated: 2026-05-04
> This file is the authoritative context document for all AI-assisted work on this project.
> Read this before making any changes to the codebase.

---

## BUSINESS CONTEXT

**withSahib** is a SEBI Registered Research Analyst platform operated by **Sahib Singh Hora** (SEBI RA **INH000026266**, NISM certified, 14+ years Indian market experience).

**What it does:**
- Publishes daily equity research for NSE-listed stocks
- Covers intraday picks, swing trades, stock options, index options
- Every recommendation includes entry zone, two targets, stop-loss, and written rationale
- Research published before 9 AM on every trading day

**Business model:** Subscriptions + Courses + Mentorship + HNI research + Appointments (1-on-1)

**Target audience:**
- Retail traders and investors seeking accountable, regulated research
- HNIs and family offices requiring institutional-quality independent research
- Active traders in Nifty, BankNifty, Sensex, FinNifty options

---

## PRICING (FINAL — DO NOT CHANGE WITHOUT EXPLICIT INSTRUCTION)

### Subscriptions

| Plan | Price | Includes |
|------|-------|---------|
| Free | ₹0 | Research previews |
| Positional | ₹3,999/month | 8–12 high-conviction positional setups/month, written rationale, weekly digest, research archive |
| Pro | ₹6,999/month | Everything in Positional + choice of 1 service (Intraday / Stock Options / Index Options) + WhatsApp delivery + 3 research reports/month + direct WhatsApp access + 1 monthly strategy call |
| Elite | ₹12,499/month | Everything in Pro + all 3 services + 4 weekly strategy calls + monthly portfolio review + bespoke research note + direct call access |

**Plan 1 — Positional (₹3,999/mo):** "For investors who want conviction, not noise."
- 8–12 high-conviction positional setups per month — low risk, asymmetric reward
- Precisely defined entry zone, two price targets, and stop-loss on every pick
- Written research rationale explaining the structural basis for each recommendation
- Sector context and broader market conditions included
- Weekly research digest with closed-trade performance summary
- Access to full research archive

**Plan 2 — Pro (₹6,999/mo):** "For active traders who demand depth and speed."
- Everything in Positional
- Real-time WhatsApp research delivery before market opens (9 AM)
- Subscriber's choice of ONE: Intraday Research Picks / Stock Options Research / Index Options Research
- 3 institutional-quality research reports per month
- Direct WhatsApp access to Sahib Singh Hora
- 1 × 15-minute strategy session with Sahib every month

**Plan 3 — Elite (₹12,499/mo):** "Maximum coverage. Personal access. No compromise."
- Everything in Pro — with all three services included
- 4 × 15-minute weekly strategy calls with Sahib (worth ₹7,996 independently)
- Monthly personalised trade feedback and portfolio review session
- One bespoke research note per month — commissioned exclusively for you, shared only with you
- Direct call access to Sahib, in addition to WhatsApp
- 🎁 Annual Elite: Market Foundations course at no charge (₹24,999 value), accessible within first 3 months

### Courses / Mentorship

| Product | Price |
|---------|-------|
| Market Foundations (Equity Focus) | ₹24,999 |
| Options Positioning System | ₹34,999 |
| Research Framework (Pro) | ₹44,999 |
| Flagship Mentorship (1:1, 3 months) | ₹74,999 one-time OR 3 × ₹26,999 instalments |

**Flagship Mentorship — CORE MOAT:**
- Only 1 mentee per batch — this is intentional and non-negotiable
- 3 months personalised mentorship with direct access to Sahib
- Never position it as a group program or scalable product

### Appointments (1-on-1 sessions)

| Session | Price |
|---------|-------|
| 15 minutes | ₹1,999 |
| 30 minutes | ₹2,999 |

### HNI / Institutional

- Starting ₹9,999/month
- CTA: "Let's Discuss" → /contact form

---

## TECH STACK

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS Variables |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel (auto-deploy from main branch) |
| Email | Resend (`RESEND_API_KEY`, from: `WithSahib <connect@withsahib.com>`) |
| Fonts | Inter (body) + Playfair Display (headings) — NO other fonts |
| Auth | Supabase Auth |

**Supabase project:** `trtoxawkeququfurddwr` (region: ap-northeast-1)
**Vercel project:** `withsahib` (auto-deploys from main branch on GitHub)

---

## DESIGN SYSTEM

### Color Variables

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-orange` | `#FF6B00` | Primary CTA, accents — dominant accent |
| `--color-black` | `#0A0A0A` | Dark backgrounds |
| `--color-white` | `#FAFAF7` | Page backgrounds |
| `--color-cream` | `#F5F3EE` | Surface cards |
| `--color-green` | `#1A7A4A` | Logo "Sahib" text, success states |
| `--color-gold` | `#B8975A` | Elite plan, premium badges |
| `--color-muted` | `#6E6E73` | Secondary text |

### Design Rules

- **NEVER hardcode color hex in components** — always use `var(--color-*)` or `var(--orange)` etc.
- **ALL buttons** use `<Button variant="primary|ghost|secondary|gold">` component
- **ALL headings** (h1–h4): Playfair Display, serif
- **ALL body text, UI, buttons**: Inter, system-ui
- **Dark mode**: `html.dark` class toggle; CSS variables handle the switch
- **Always-dark sections**: use class `.always-dark` (methodology section, analyst section intentionally stay dark on both modes)
- **Orange is the dominant accent** — not green (green is logo/success only)

### Logo Rules

- "with" → Inter 400, color: `var(--text)` (black in light / white in dark)
- "Sahib" → Playfair Display 700 italic, `#FF6B00` always (never changes with theme)

---

## NAVIGATION STRUCTURE

### Public Navbar

`Methodology | Services | The Analyst | Who It's For | Pricing | Blog | Learn`

Logged-in users: show "Sahib's Dashboard →" instead of Login/Start Free buttons.

### Dashboard Sidebar

```
Dashboard
Intraday Calls
Stock Options
Index Options
Swing Trades
Model Portfolio
Research Reports
Appointments
Mentorship
─────────────
Settings
Admin Panel  ← admin only, Shield icon, gold color
◈ Ops        ← super_admin only, orange, links to /ops
Sign out
```

---

## PAGES (ALL EXISTING)

### Public
`/` `/pricing` `/about` `/methodology` `/who-its-for` `/courses` `/blog` `/blog/[slug]` `/contact` `/faq` `/services` `/services/intraday` `/services/stock-options` `/services/index-options` `/services/swing` `/work-with-us` `/appointments` `/investor-charter` `/complaints` `/disclosure` `/refund-policy` `/grievance-redressal` `/smart-odr` `/mitc` `/terminology` `/privacy-policy` `/terms-of-service` `/disclaimer`

### Auth (all `noindex`)
`/auth/login` `/auth/register` `/auth/forgot-password`

### Dashboard (all `noindex`)
`/dashboard` `/dashboard/model-portfolio` `/dashboard/research-reports`

### Admin (`noindex`, super admin only)
`/admin`

### Ops (`noindex`, super_admin only — NOT in sitemap or robots.txt)
`/ops` — Agent Command Center. Full-screen internal dashboard. Never link from any public page.

---

## COMPLIANCE RULES — CRITICAL, NEVER VIOLATE

1. **NEVER use:** "guaranteed returns", "assured profit", "sure shot", "100% profit"
2. **Risk disclaimer MUST appear on:** homepage, pricing page, every blog post, all services pages
3. **SEBI registration INH000026266** must appear in: navbar, footer, all research samples
4. **DO NOT mention** SEBI registration expiry dates anywhere — registration number only
5. **Compliance Officer:** Sahib Singh Hora · sahib13singh13@gmail.com
6. **Standard disclaimer:**
   > "Research by Sahib Singh Hora, SEBI RA INH000026266. Investments subject to market risk. Past performance not indicative of future results. Not investment advice."
7. **No "100% auditable track record"** — Sahib does not want to benchmark against other RAs
8. **No fake testimonials** — only genuine ones when they arrive
9. **Never say "View Sample Call"** — always say "View Sample Research Report"

---

## AUDIT SCORES (PROGRESS TRACKER)

| Session | Score |
|---------|-------|
| V1 | 6.0 / 10 |
| V2 | 7.0 / 10 |
| V3 | 8.2 / 10 |
| Final | 8.6 / 10 |
| After 2026-04-28 session | ~9.2 / 10 |

### Remaining gaps to 10/10

- Real user testimonials (manual — when genuine ones arrive)
- Blog featured images 1200px+ (for Google Discover)
- Backlinks from MoneyControl / ET Markets (off-page SEO, manual)
- Bing Webmaster Tools sitemap submission (manual)

---

## PENDING TASKS (NOT YET DONE)

1. Dashboard sidebar — all 8 service items should open a **popup** (not navigate to a new page)
2. Intraday / Stock Options / Index Options / Swing clicking → show service pricing popup
3. Model Portfolio → "SOON" glazing badge + coming-soon popup with animated portfolio visual
4. Research Reports → "SOON" glazing badge + coming-soon popup with animated docs visual
5. Appointments popup → show 15 min ₹1,999 and 30 min ₹2,999 options
6. Mentorship popup (rename "Courses" → "Mentorship" in sidebar)
7. Logged-in user personalised navbar: show "Sahib's Dashboard →" instead of Login/Start Free
8. Sidebar darker theme (#1A1A1A background — not too dark, not too light)
9. `/services/swing` page — fix pricing to show ₹999/month Basic plan (currently shows wrong price)
10. Redirects: `/dashboard/intraday`, `/dashboard/stock-options`, `/dashboard/index-options`, `/dashboard/swing` → redirect to `/dashboard` (these routes have no dedicated pages yet)

### 2026-04-29

**Session 3 — remaining gaps closed:**
- `terms-of-service/page.tsx`: "Basic, Pro, and Elite" → "Positional, Pro, and Elite"
- `src/lib/data/posts.ts`: old pricing (₹999/₹2,499/₹5,999) in blog post body → current (₹3,999/₹6,999/₹12,499)
- `src/app/blog/page.tsx`: blog card image placeholder upgraded — dark gradient `#0A0A0A→#1A1A1A` with "withSahib" Playfair watermark and category badge
- `src/app/appointments/page.tsx`: simplified to clean booking form (Name, Email, Phone, Duration radio, Preferred Date, Message) that POSTs to `/api/appointments/book` — Razorpay calendar replaced with functional email-based flow

### Multi-Language Support

**Status:** LIVE
**Languages available:** English, Hindi, Marathi, Gujarati
**Languages coming soon:** Tamil, Telugu, Kannada, Bengali, Punjabi, Malayalam

**Implementation:**
- Context: `src/contexts/LanguageContext.tsx`
- Translations: `/messages/*.json` (en, hi, mr, gu)
- Language detection: `src/lib/detectLanguage.ts` (ipapi.co — 3s timeout, graceful fallback)
- State-to-language mapping: `src/lib/languageMapping.ts` (all 36 Indian states/UTs)
- Picker component: `src/components/ui/LanguagePicker.tsx` (globe icon in navbar)
- Welcome modal: `src/components/ui/LanguageWelcomeModal.tsx` (bottom-of-screen, non-intrusive)
- Dashboard greeting: `src/components/ui/DashboardGreeting.tsx` (client component wrapping server page)

**Flow:**
1. User visits site → IP detected via ipapi.co → state identified → language suggested
2. Welcome modal appears (bottom of screen, only first visit, only if non-English locale detected)
3. User picks language → saved to `localStorage` as `withsahib-locale`
4. On return visits → saved preference applied immediately (no re-detection)
5. Language picker always visible in navbar (globe icon, before dark mode toggle)
6. Full control in Settings → Language tab

**Adding a new language:**
1. Create `messages/[code].json` with all keys matching `en.json`
2. Add code to `AVAILABLE_LANGUAGES` array in `languageMapping.ts`
3. Done — picker automatically shows it as available, "Soon" badge removed

**CSP updated:** `https://ipapi.co` added to `connect-src` in `next.config.js`

---

## Next phase — Revenue activation

- **Razorpay**: Set `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` env vars. Uncomment implementation in `/api/payments/create-order/route.ts`. Create Razorpay account + activate subscription plans.
- **AiSensy / WhatsApp**: Set `AISENSY_API_KEY` + `AISENSY_CAMPAIGN_NAME` env vars. Uncomment implementation in `/api/whatsapp/send/route.ts`.
- **Anthropic blog cron**: Set `ANTHROPIC_API_KEY` env var. Cron job `/api/cron/blog-draft` runs Mon–Fri 2 AM. Blog drafts save to `blog_posts` table as `published_at: null` — admin must review + publish manually.
- **Google Search Console**: Replace placeholder in `public/google-site-verification.html` with real verification content.
- **Bing Webmaster Tools**: Replace placeholder in `public/BingSiteAuth.xml` with real auth key.
- **Testimonials**: Replace placeholder cards in homepage `TestimonialsSection` with real testimonials when they arrive.

---

## SEO / AEO / GEO STATUS

### Done
- Canonical tags on all public pages
- Sitemap (`/sitemap.xml`)
- `robots.txt`
- JSON-LD schemas on 16 pages (Organization, Person, WebSite, FinancialService, BlogPosting, BreadcrumbList, FAQPage, HowTo, Service, ProfessionalService)
- `llms.txt` at `/llms.txt` and `/.well-known/llms.txt` (both in sync)
- OG images — per-post at 1200×630 via `opengraph-image.tsx` (edge runtime)
- `noindex` on auth / dashboard / admin pages
- Twitter card `summary_large_image` on all pages
- Article schema on blog posts (with `datePublished`, author, publisher)

### Pending (manual)
- Bing Webmaster Tools verification + sitemap submission
- Google Business Profile (if applicable)
- Guest posts on MoneyControl / ET Markets for backlinks

---

## KEY CONTACTS & LINKS

| Purpose | Value |
|---------|-------|
| General email | connect@withsahib.com |
| Compliance Officer | Sahib Singh Hora · sahib13singh13@gmail.com |
| SEBI verification | https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14 |
| Telegram | https://t.me/withsahib |
| Twitter/X | @WithSahib_ |
| Instagram | @withsahib_ |
| LinkedIn | linkedin.com/in/sahibsinghhora |
| Facebook | facebook.com/sahib1313 |
| Legal entity | Altitans Intelligence Private Limited · CIN: U62011MP2026PTC083080 |
| Address | 86/2 Prem Nagar, Madan Mahal, Jabalpur, MP 482001 |
| Phone | +91-9981248888 |

---

## IMPORTANT DECISIONS MADE (DO NOT REVERSE)

| Decision | Rationale |
|----------|-----------|
| "with" in logo: Inter 400, theme-aware | Clean, readable, doesn't clash with brand word |
| "Sahib" in logo: Playfair italic, #FF6B00 always | Brand color is non-negotiable, always orange |
| Methodology + analyst sections always dark | Intentional design — `.always-dark` class, both light and dark modes |
| No "100% auditable track record" copy | Sahib doesn't want to position against/benchmark other RAs |
| No SEBI expiry dates | Registration number only, no dates anywhere |
| No fake testimonials | Only genuine testimonials when they organically arrive |
| No "View Sample Call" | Always "View Sample Research Report" — more professional |
| Pro plan: choose 1 of 3 services (Intraday / Stock Options / Index Options) | Subscriber picks one at sign-up; Elite gets all three |
| Flagship mentorship: 1 mentee per batch | This scarcity is the core MOAT — never change to a group format |
| No dark/light mode toggle for always-dark sections | `.always-dark` class keeps them dark regardless of user preference |
| Complaints form wired to Resend → sahib13singh13@gmail.com | Compliance requirement, SEBI 30-day response rule |
| supabase/.temp/ gitignored + removed from tracking | Security — credentials must not be in git. Rotate pooler URL in Supabase dashboard |
| /ops never added to sitemap.xml or robots.txt | Internal super-admin tool — zero public discoverability intentional |
| All /ops data fetched via API routes (service-role), not browser Supabase client | Browser client + RLS + admin_roles subquery = silent empty results. Service-role API routes are the only reliable pattern for super-admin-only data |

---

## RECENT WORK LOG

### 2026-04-28

**Fixes applied:**
- `courses/page.tsx`: 13 hardcoded `#FF6B00` → `var(--orange)`
- `complaints/page.tsx` + `src/app/api/complaints/route.ts`: wired form to Resend, returns reference ID, loading/success/error states
- `auth/forgot-password/page.tsx`: added `role="heading" aria-level={1}` to branches 1+2 heading `<p>` elements (screen reader a11y)
- Deleted 8 unused UI components: AnimatedLogo, Badge, Card, Input, Modal, Skeleton, Toast, CredentialBar
- `supabase/.temp/` untracked from git + deleted + added to `.gitignore`
- `public/.well-known/llms.txt` synced from canonical `public/llms.txt`
- `src/app/layout.tsx`: added `<link>` for `/.well-known/llms.txt`
- `docs/README.md` created (documentation index)
- `src/app/blog/[slug]/opengraph-image.tsx`: per-post OG image at 1200×630 (edge runtime, dynamic title scaling)
- Dashboard sidebar nav routes fixed: all items now point to correct `/dashboard/*` paths
- Removed pricing redirect from locked sidebar items — pages handle their own locked state
- Admin Panel link added to sidebar (Shield icon, gold, `isAdminUser && !viewingAsUser`)
- `dashboard/model-portfolio/page.tsx`: animated coming-soon (donut chart, sparklines, progress bar)
- `dashboard/research-reports/page.tsx`: animated coming-soon (doc stack, data flow SVGs, progress bars)
- IST time-based greeting with emoji: ☀️ morning / 🌤️ afternoon / 🌆 evening / 🌙 night
- Avatar: orange gradient circle with dynamic initials + 👑 crown for admin/founder

**Security action still required:**
- `supabase/.temp/pooler-url` value is still in git history
- Rotate the Supabase pooler connection string: Supabase dashboard → Settings → Database → Connection pooling → Reset
- Consider BFG Repo Cleaner to scrub history if credential was sensitive

### 2026-04-28 (session 2)

**25 pending items completed:**

- **Brand page** (`/brand`): protected with inline `admin_roles` query via `createServiceRoleClient`, redirects non-super-admins to `/dashboard`. Middleware updated with `/brand` session check. `ADMIN_SETUP.sql` created for granting roles.
- **BASIC → POSITIONAL rename**: `TIER_ORDER`, `hasServiceAccess`, dashboard layout, pricing page — all renamed. DB value `'basic'` preserved for backwards-compat; display only.
- **Sidebar logo white fix**: logo "with" text uses `var(--text)` (theme-aware), "Sahib" uses `#FF6B00` always.
- **Brand page color/font overhaul**: uses CSS variables throughout, Playfair headings.
- **Letterhead editor**: `/dashboard/letterhead` — live preview with SEBI fields, print/PDF export.
- **Plan-based dashboard access control**: `hasServiceAccess(tier, service)` — elite: all; pro: all 4; positional: swing only. Admins get elite regardless.
- **Methodology/about dark mode**: confirmed uses `.always-dark` class + CSS variables — no hardcoded hex.
- **Blog improvements**: author byline in hero, CTA box at end, related posts section. Fixed `var(--emerald)` → `var(--orange)` in related posts category badge.
- **Testimonials placeholder structure**: three cards in homepage `TestimonialsSection` with dashed borders, gold stars, per-plan labels.
- **Social links updated**: Footer now has Twitter/X (`@WithSahib_`), Instagram (`@withsahib_`), LinkedIn (`sahibsinghhora`) + existing WhatsApp/Telegram.
- **Telegram CTA**: already existed on homepage — verified correct `https://t.me/withsahib` link.
- **Appointments manual booking flow**: booking process section added to `/appointments` page (Option 1: form, Option 2: email/WhatsApp, Payment: UPI before confirmation).
- **Google Search Console**: placeholder `public/google-site-verification.html` with TODO instructions.
- **Bing Webmaster Tools**: placeholder `public/BingSiteAuth.xml` with TODO instructions.
- **Google Business JSON**: `public/structured-data-local.json` with ProfessionalService schema.
- **Blog draft cron**: `src/app/api/cron/blog-draft/route.ts` — Anthropic API (`claude-sonnet-4-6`), saves to `blog_posts` table as draft. Vercel cron: Mon–Fri 2 AM.
- **Appointments booking API**: `src/app/api/appointments/book/route.ts` — Resend emails (admin + user confirmation), validates 15/30 min, prices ₹1,999/₹2,999.
- **Razorpay placeholder API**: `src/app/api/payments/create-order/route.ts` — placeholder with commented-out implementation, plan prices in paise.
- **AiSensy WhatsApp placeholder API**: `src/app/api/whatsapp/send/route.ts` — admin-only, placeholder with commented-out AiSensy implementation.
- **Admin publish flow**: `src/app/admin/publish/page.tsx` — form with stock/exchange/action/entry/targets/stop-loss/service/rationale + R:R calculator. `src/app/api/admin/publish-research/route.ts` inserts into `signals` table.
- **Admin layout publish nav**: "Publish Research" added as first nav item with `Send` icon.
- **llms.txt updated**: Basic → Positional rename, appointments section with prices.
- **`withsahib.md` updated**: all 25 items marked complete, Next phase section added.

---

## SESSION UPDATE — April 30, 2026

### Completed this session
- Letterhead editor: Altitans Intelligence + CIN removed from footer, header text darkened, phone corrected to +91-90988 87210
- Multi-language: 10 languages live (en, hi, mr, gu, ta, te, kn, bn, pa, ml)
- Auto location detection: removed completely — language is manual choice only, default always English
- Language picker: globe icon in navbar, dropdown on desktop, bottom sheet on mobile
- Translation files: /messages/*.json — all 10 languages complete with all keys
- Pages converted to client components using t() for translations
- POSITIONAL rename from BASIC: complete across all pages
- Dashboard ELITE PLAN badge: reads correctly from user_metadata.plan
- /brand page: protected via admin_roles table (super_admin only)
- Subscriptions table: uses 'tier' column not 'plan', has plan_id FK NOT NULL constraint
- user plan stored in auth.users raw_user_meta_data->>'plan'
- Both admins have plan: 'elite' set in user metadata
- 25-item mega fix: brand overhaul, letterhead editor, plan access control, blog improvements, APIs

### Still pending
- PWA — not built yet
- React Native — not built yet
- ANTHROPIC_API_KEY, RAZORPAY keys, TWILIO keys — not added to Vercel yet
- Google Search Console + Bing verification codes needed
- Some pages may still have hardcoded English strings not using t()

---

## SESSION UPDATE — May 4, 2026

### Agent Command Center — /ops (built + fixed)

#### What was built

**Route + auth guard**
- `src/app/ops/layout.tsx` — server component, queries `admin_roles` with `createServiceRoleClient`, redirects non-super-admins to `/dashboard`. Zero public access.
- `src/app/ops/page.tsx` — thin server wrapper (exports metadata, `noindex`)
- `src/app/ops/OpsClient.tsx` — full-screen dark dashboard UI (`'use client'`)

**Database** (`supabase/migrations/006_agent_system.sql`)
- 6 new tables: `agent_departments`, `agents`, `agent_tasks`, `approval_queue`, `agent_commands`, `token_usage`
- RLS enabled on all tables
- Seed data: 7 departments + 19 named agents

**7 departments and 19 agents:**
| Department | Agents |
|---|---|
| 🔬 Research (4) | MarketScout, SectorSage, ChartMind, NewsRadar |
| 📡 Distribution (3) | TeleBot, WhatsAppBeam, MailCraft |
| 📈 Chart Reading (3) | PatternHunter, LevelMapper, TrendOracle |
| 💼 Sales (3) | LeadSense, ConvertMax, UpgradeNudge |
| 🎧 Support (2) | QueryBot, EscalateAI |
| 💰 Finance (2) | RevenueTrack, TaxBot |
| 👥 HR (2) | OnboardBot, FeedbackLens |

**Dashboard UI features**
- Top bar: withSahib logo + `AGENT COMMAND CENTER` badge + live IST clock + `SUPER ADMIN` pill
- Left sidebar (220px): department list with agent count badges + token budget mini-gauge
- Center: 4-card metrics row (Running / Done Today / Pending Approvals / Tokens Today) → agent card grid → pinned command bar
- Agent cards: name, role, skills tags, progress bar (running only), status dot with pulse animation, model + calls footer
- Command bar: free-text input, target selector (All / Department / Agent), `POST /api/ops/command`, ⌘+Enter to send, echoes sent commands to live feed log
- Right panel (300px): Live Feed tab (realtime agent_tasks events) + Approvals tab (approve/edit/reject) + Schedule tab (placeholder)
- Approvals panel: inline edit mode, approve/edit/reject buttons, `POST /api/ops/approve`
- Setup banner: shown if tables are empty, "Seed Departments + Agents →" button calls `POST /api/ops/seed`

**API routes (all service-role, super_admin auth checked on every call)**
- `GET  /api/ops/departments` — returns all departments
- `GET  /api/ops/agents` — returns all agents
- `GET  /api/ops/approvals` — returns pending approval_queue items (with agent name join)
- `GET  /api/ops/feed` — returns last 50 agent_tasks (with agent name join)
- `GET  /api/ops/status` — returns live metrics: running, doneToday, pendingApprovals, tokensToday, tokenLimit, tokenPct
- `POST /api/ops/command` — inserts into agent_commands
- `POST /api/ops/approve` — updates approval_queue, marks linked task completed on approve
- `POST /api/ops/seed` — idempotent seed: inserts 7 departments + 19 agents (skips if already seeded)

**Token budget module** (`src/lib/agents/tokenBudget.ts`)
- Tracks Gemini Flash free quota: 1,000,000 tokens/day from `token_usage` table
- `getTokenBudgetStatus()` — returns usage, limit, pct, status (healthy/warning/critical)
- `checkBudgetAllowsRun(agentId, priority)` — at 80% idles low-priority agents; at 95% halts all non-critical + fires Telegram alert via `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`

**Dashboard sidebar link**
- `src/app/dashboard/layout.tsx` updated: fetches `role` column alongside `id` from `admin_roles`
- Added `isSuperAdminUser` state (true when `role === 'super_admin'`)
- `◈ Ops` link shown only when `isSuperAdminUser && !viewingAsUser`

#### Bug fixed — "Loading agents…" with 0 departments

**Root cause:** OpsClient used `createClient()` (browser Supabase, anon key + user JWT). The RLS policies did:
```sql
USING (auth.uid() IN (SELECT user_id FROM admin_roles WHERE role = 'super_admin'))
```
`admin_roles` is itself RLS-protected and unreadable by the anon client → subquery returns `∅` → `auth.uid() IN ∅` = false → every query silently returned []. Also `agent_departments` had no RLS policy at all.

**Fix applied:**
- All data fetching in OpsClient moved to `fetch('/api/ops/…')` — server-side service-role client, bypasses RLS entirely
- Supabase browser client kept only for realtime channel subscriptions (used as re-fetch triggers, not direct reads)
- `supabase/migrations/007_agent_rls_fix.sql`: creates `is_super_admin()` as a `SECURITY DEFINER` function (runs as DB owner, can always read `admin_roles`); enables RLS on `agent_departments` (was missing); drops all old broken policies; creates new policies using the function

#### Supabase setup checklist (run once if starting fresh)
1. Run `supabase/migrations/006_agent_system.sql` in SQL Editor → creates tables + initial RLS + seed
2. Run `supabase/migrations/007_agent_rls_fix.sql` in SQL Editor → fixes RLS with SECURITY DEFINER
3. If seed didn't run from the DO block: open `/ops` → click **"Seed Departments + Agents →"**

#### Architecture rule learned
> **Never query Supabase directly from a browser client (`createClient()`) for data that is protected by RLS policies that reference `admin_roles`.** The anon client cannot read `admin_roles` (it's RLS-protected), so all subqueries against it return empty → access silently denied. Always use API routes with `createServiceRoleClient()` for super-admin-only data.
