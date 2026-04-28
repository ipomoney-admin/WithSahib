# withSahib — Project Context & Memory

> Last updated: 2026-04-28
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
Admin Panel  ← super admin only, Shield icon, gold color
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
10. `/appointments` page — update to show ₹1,999 (15 min) and ₹2,999 (30 min)
11. Redirects: `/dashboard/intraday`, `/dashboard/stock-options`, `/dashboard/index-options`, `/dashboard/swing` → redirect to `/dashboard` (these routes have no dedicated pages yet)

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
