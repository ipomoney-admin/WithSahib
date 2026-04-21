# withSahib.com — Complete Setup Guide

## Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Payments**: Razorpay Subscriptions
- **AI Engine**: Claude API (Haiku for bulk, Sonnet for reports)
- **Email**: Resend
- **Hosting**: Vercel (free tier)
- **Mobile**: Capacitor (Android + iOS — one command)

---

## Step 1 — Install dependencies

```bash
cd withsahib
npm install
```

---

## Step 2 — Supabase setup

1. Go to [supabase.com](https://supabase.com) → New project
   - **Name**: withsahib
   - **Password**: save it
   - **Region**: Mumbai (ap-south-1)
   - ⚠️ This is a **completely separate** project from SpotMyChart

2. In SQL Editor, run the entire contents of:
   `src/lib/supabase/schema.sql`

3. Copy your project URL and keys into `.env.local`

---

## Step 3 — Razorpay setup

1. Go to [razorpay.com](https://razorpay.com) → Dashboard
2. Create 6 subscription plans:

| Plan | Amount (INR) | Interval |
|------|-------------|----------|
| Basic Monthly | 999 | monthly |
| Basic Yearly | 799 | monthly (12 months) |
| Pro Monthly | 2499 | monthly |
| Pro Yearly | 1999 | monthly (12 months) |
| Elite Monthly | 5999 | monthly |
| Elite Yearly | 4799 | monthly (12 months) |

3. Copy all plan IDs into `.env.local`
4. Set webhook URL: `https://withsahib.com/api/webhooks/razorpay`
   - Events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `payment.failed`

---

## Step 4 — Configure environment

```bash
cp .env.example .env.local
# Fill in all values
```

---

## Step 5 — Run locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## Step 6 — Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables → paste all from .env.local
```

Or connect GitHub repo → auto-deploy on every push.

---

## Step 7 — One-click mobile app

### Android
```bash
npm run cap:android
# This will:
# 1. Build Next.js (next build)
# 2. Sync to Capacitor (cap sync android)
# 3. Open Android Studio
# In Android Studio: click ▶ Run
```

### iOS (Mac only)
```bash
npm run cap:ios
# Opens Xcode → click ▶ Run
```

### Publish to stores
- **Android**: Build → Generate Signed Bundle → upload to Play Console
- **iOS**: Product → Archive → upload to App Store Connect

---

## Folder Structure

```
withsahib/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Landing page
│   │   ├── layout.tsx            ← Root layout
│   │   ├── auth/                 ← Login, Register, Forgot
│   │   ├── dashboard/            ← Protected dashboard
│   │   ├── appointments/         ← Booking system
│   │   ├── services/             ← Intraday, Options, Swing
│   │   ├── reports/              ← AI research reports
│   │   ├── portfolio/            ← Model portfolio
│   │   ├── courses/              ← Education
│   │   ├── pricing/              ← Pricing page
│   │   └── api/                  ← All API routes
│   ├── components/
│   │   ├── layout/               ← Navbar, Footer, ThemeProvider
│   │   └── sections/             ← Landing page sections
│   ├── lib/
│   │   ├── supabase/             ← DB client + schema
│   │   ├── razorpay/             ← Payment integration
│   │   └── ai/                   ← Report generation
│   ├── types/                    ← TypeScript types
│   └── styles/                   ← Global CSS + tokens
├── public/
│   ├── manifest.json             ← PWA manifest
│   └── icons/                    ← App icons (generate at realfavicongenerator.net)
├── capacitor.config.ts           ← Mobile app config
└── .env.example                  ← Environment template
```

---

## Generate app icons

Go to [realfavicongenerator.net](https://realfavicongenerator.net) → upload your logo → download → place in `public/icons/`

Required sizes: 72, 96, 128, 144, 152, 192, 384, 512 (PNG) + apple-touch-icon (180x180)

---

## SEBI Compliance checklist

- [x] Registration number on every page (INH000026266)
- [x] Risk disclaimer in footer
- [x] Disclaimer on all trade call pages
- [x] "Not investment advice" on AI reports
- [x] Validity dates displayed
- [x] Analyst name on all recommendations
- [ ] Add your SEBI disclosure document PDF at `/public/sebi-disclosure.pdf`
- [ ] Update `withsahib.com` in footer once live
- [ ] Verify on SEBI portal before going live

---

## Key notes

- **SpotMyChart is completely separate** — different Supabase project, different Vercel project, different everything
- All AI reports use `claude-haiku-4-5-20251001` for cost efficiency (~₹0.04/report)
- Razorpay webhook is the source of truth for subscription status — never trust client-side
- RLS policies ensure users can only see their own data
