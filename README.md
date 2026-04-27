# withSahib — Developer Documentation

## What is withSahib?

withSahib is a SEBI Registered Research Analyst platform (INH000026266) that publishes daily equity research for Indian stock markets. It has three distinct areas:

| Area | URL | Access |
|------|-----|--------|
| Public marketing site | withsahib.com | Anyone |
| Subscriber dashboard | withsahib.com/dashboard | Logged-in users |
| Admin panel | withsahib.com/admin | Sahib only (passkey-protected) |

---

## Quick Start (get running in 5 minutes)

```bash
git clone https://github.com/ipomoney-admin/WithSahib.git
cd WithSahib
npm install
cp .env.example .env.local   # fill in values — ask Sahib for dev credentials
npm run dev                   # http://localhost:3000
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) | SSR + SSG + API routes in one repo |
| Language | TypeScript (strict) | Type safety across the whole codebase |
| Styling | CSS Variables + Tailwind | Token-based theming + utility classes |
| Database | Supabase (PostgreSQL) | Auth + DB + Row Level Security |
| Payments | Razorpay Subscriptions | INR billing, UPI support |
| Email | Resend | Transactional emails (confirmation, alerts) |
| WhatsApp | AiSensy | Subscriber research delivery |
| AI | Anthropic Claude API | Weekly intelligence reports |
| Market Data | Fyers API | Live price feeds for screener + signals |
| Deployment | Vercel | Auto-deploy on push to main |

---

## Fonts

- **Headings:** Playfair Display (Google Fonts, loaded in `src/app/layout.tsx`)
- **Body/UI:** Inter (Google Fonts, loaded in `src/app/layout.tsx`)
- **Monospace:** Courier New (system font, for SEBI reg numbers + prices)
- **NO other fonts** are used or should be added

---

## Color System

All colors are CSS variables in `src/app/globals.css`. **Never hardcode a hex value in a component.**

| Token | Value | Usage |
|-------|-------|-------|
| `--orange` | `#FF6B00` | Primary CTAs, accents |
| `--black` | `#0A0A0A` | Dark backgrounds, primary text |
| `--bg` | `#FAFAF8` | Page backgrounds (light mode) |
| `--bg2` | `#F5F3EE` | Section backgrounds, hero areas |
| `--surface` | `#FFFFFF` | Cards, modals |
| `--green` | `#1A7A4A` | Logo "Sahib", success, emerald accents |
| `--gold` | `#D4A843` | Elite plan, premium accents, SEBI badge |
| `--text` | `#0A0A0A` | Primary body text |
| `--text2` | `#374151` | Secondary text |
| `--text3` | `#64748B` | Muted/label text |
| `--border` | `rgba(0,0,0,0.08)` | Default borders |

---

## Environment Variables

See `.env.example` for all required variables. Critical ones:

```bash
# Supabase — always needed
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # safe to expose (read-only, browser)
SUPABASE_SERVICE_ROLE_KEY=           # NEVER expose to browser — server only

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Razorpay — needed for payment flows
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=        # safe to expose (public key)
# Plus 12 plan IDs (basic/pro/elite × monthly/yearly × public/private)

# Resend — needed for emails
RESEND_API_KEY=

# Anthropic — needed for AI intelligence reports
ANTHROPIC_API_KEY=

# Fyers — needed for market data + screener
FYERS_APP_ID=
FYERS_SECRET_KEY=
FYERS_REDIRECT_URI=
FYERS_MPIN=

# AiSensy — needed for WhatsApp delivery
AISENSY_API_KEY=
AISENSY_CAMPAIGN_NAME=

# Telegram — for admin alerts
TELEGRAM_BOT_TOKEN=
SAHIB_TELEGRAM_ID=
TELEGRAM_PAID_CHANNEL_ID=
TELEGRAM_FREE_CHANNEL_ID=

# Cron protection
CRON_SECRET=
```

---

## First-Time Supabase Setup

1. Create a new Supabase project (Mumbai region — `ap-south-1`)
2. In the SQL Editor, run the full contents of `src/lib/supabase/schema.sql`
3. Copy project URL + keys to `.env.local`

---

## Deployment

- **Production:** Push to `main` → Vercel auto-deploys to withsahib.com
- **Preview:** Every PR gets a preview URL automatically from Vercel
- **Never** push directly to `main` without testing locally first
- **Build check:** `npx next build` must pass with zero errors before merging

---

## Razorpay Plan Setup

Create 6 subscription plans in Razorpay dashboard → Subscriptions → Plans:

| Plan | Amount (INR/month) | Billing |
|------|--------------------|---------|
| Basic Monthly | ₹999 | monthly |
| Basic Yearly | ₹799 | monthly (12 months) |
| Pro Monthly | ₹2,499 | monthly |
| Pro Yearly | ₹1,999 | monthly (12 months) |
| Elite Monthly | ₹5,999 | monthly |
| Elite Yearly | ₹4,799 | monthly (12 months) |

Set webhook URL: `https://www.withsahib.com/api/webhooks/razorpay`
Events to enable: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `payment.failed`

---

## Where to go for more

| Topic | Document |
|-------|----------|
| Folder structure, data flows | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Colors, fonts, Button component | [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) |
| How users move through the app | [docs/USER_FLOWS.md](docs/USER_FLOWS.md) |
| Database schema, all tables | [docs/DATABASE.md](docs/DATABASE.md) |
| API routes reference | [docs/API.md](docs/API.md) |
| SEO/metadata/JSON-LD requirements | [docs/SEO.md](docs/SEO.md) |
| SEBI compliance rules | [docs/COMPLIANCE.md](docs/COMPLIANCE.md) |
| Day 1 & 2 onboarding plan | [docs/ONBOARDING.md](docs/ONBOARDING.md) |

---

## Key Notes

- Razorpay webhook is the **source of truth** for subscription status — never trust client-side plan state
- RLS policies in Supabase ensure users can only access their own data
- Fyers API token must be renewed daily — this is automated via `/api/fyers/refresh-token` cron
- Claude AI models: `claude-haiku-4-5-20251001` for bulk operations, `claude-sonnet-4-6` for reports
- **SEBI registration number** `INH000026266` must appear on all public-facing pages
