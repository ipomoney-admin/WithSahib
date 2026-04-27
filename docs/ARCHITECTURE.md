# System Architecture

## Folder Structure

```
withsahib/
├── src/
│   ├── app/                         # Next.js App Router — every page lives here
│   │   │
│   │   ├── page.tsx                 # Homepage /
│   │   ├── layout.tsx               # Root layout — fonts, metadata, skip link, <main> wrapper
│   │   ├── globals.css              # ALL CSS variables and global styles
│   │   ├── layout-public.tsx        # Shared layout for public pages (Navbar + Footer)
│   │   ├── sitemap.ts               # Auto-generates /sitemap.xml
│   │   ├── robots.ts                # Auto-generates /robots.txt
│   │   ├── opengraph-image.tsx      # Default OG image for social sharing
│   │   │
│   │   ├── about/                   # /about — The Analyst page
│   │   ├── appointments/            # /appointments — Book a 1-on-1 session
│   │   ├── blog/                    # /blog (list) + /blog/[slug] (post)
│   │   ├── brand/                   # /brand — design system reference page
│   │   ├── complaints/              # /complaints — SEBI-mandated complaint form
│   │   ├── contact/                 # /contact
│   │   ├── courses/                 # /courses — Learn page
│   │   ├── disclaimer/              # /disclaimer
│   │   ├── disclosure/              # /disclosure — SEBI disclosure
│   │   ├── faq/                     # /faq
│   │   ├── grievance-redressal/     # /grievance-redressal
│   │   ├── investor-charter/        # /investor-charter
│   │   ├── methodology/             # /methodology
│   │   ├── mitc/                    # /mitc — Most Important Terms & Conditions
│   │   ├── performance/             # /performance — historical track record
│   │   ├── portfolio/               # /portfolio
│   │   ├── pricing/                 # /pricing
│   │   ├── privacy-policy/          # /privacy-policy
│   │   ├── refund-policy/           # /refund-policy
│   │   ├── reports/                 # /reports — research reports listing
│   │   ├── research/                # /research
│   │   ├── services/                # /services and sub-pages:
│   │   │   ├── intraday/            #   /services/intraday
│   │   │   ├── swing/               #   /services/swing
│   │   │   ├── stock-options/       #   /services/stock-options
│   │   │   └── index-options/       #   /services/index-options
│   │   ├── settings/                # /settings — user account settings
│   │   ├── smart-odr/               # /smart-odr — SEBI ODR link
│   │   ├── terminology/             # /terminology — glossary
│   │   ├── terms-of-service/        # /terms-of-service
│   │   ├── who-its-for/             # /who-its-for
│   │   ├── work-with-us/            # /work-with-us — jobs page
│   │   │
│   │   ├── auth/                    # Authentication pages (noindex)
│   │   │   ├── login/               # /auth/login
│   │   │   ├── register/            # /auth/register
│   │   │   ├── forgot-password/     # /auth/forgot-password
│   │   │   ├── reset-password/      # /auth/reset-password
│   │   │   └── callback/            # /auth/callback — Supabase OAuth redirect
│   │   │
│   │   ├── dashboard/               # Protected — requires login (noindex)
│   │   │   ├── layout.tsx           # Dashboard shell with sidebar
│   │   │   ├── page.tsx             # Dashboard home
│   │   │   └── signals/             # Research call feed
│   │   │
│   │   ├── admin/                   # Admin only — passkey-protected (noindex)
│   │   │   ├── layout.tsx           # Admin sidebar layout + passkey guard
│   │   │   ├── signals/             # Publish/manage research calls
│   │   │   ├── screener/            # Market screener
│   │   │   ├── intelligence/        # AI-generated market intelligence
│   │   │   ├── settings/            # Fyers token, Telegram config
│   │   │   ├── passkey/             # Passkey setup + verify
│   │   │   └── super/               # Super-admin features
│   │   │
│   │   └── api/                     # API routes (server-side only)
│   │       ├── auth/                # Auth helpers
│   │       ├── admin/               # Admin view-mode toggle
│   │       ├── appointments/        # Booking endpoints
│   │       ├── distribution/        # WhatsApp/Telegram delivery pipeline
│   │       ├── email/               # Email sending endpoints
│   │       ├── fyers/               # Fyers market data auth + token refresh
│   │       │   ├── auth/            # Initiate OAuth
│   │       │   ├── callback/        # Receive auth code, store token
│   │       │   └── refresh-token/   # Cron-triggered token renewal
│   │       ├── indexnow/            # Submit URLs to Bing/IndexNow
│   │       ├── intelligence/        # AI weekly report generation
│   │       ├── market-data/         # Live price feeds via Fyers
│   │       ├── ml/                  # ML prediction generation + training
│   │       ├── performance/         # Trade performance calculation
│   │       ├── revalidate-market/   # ISR cache invalidation
│   │       ├── screener/            # Run market screener
│   │       ├── signals/             # Signal CRUD, status checks, push
│   │       ├── subscriptions/       # Subscription management
│   │       └── webhooks/            # Razorpay payment webhooks
│   │
│   ├── components/
│   │   ├── ui/                      # Reusable UI primitives
│   │   │   ├── Button.tsx           # THE button component — use for ALL buttons
│   │   │   ├── Badge.tsx            # Plan badges, status tags
│   │   │   ├── Card.tsx             # Card container
│   │   │   ├── Input.tsx            # Form inputs
│   │   │   ├── Modal.tsx            # Reusable modal/dialog
│   │   │   ├── Toast.tsx            # Success/error notifications
│   │   │   ├── Skeleton.tsx         # Loading skeleton states
│   │   │   ├── Logo.tsx             # LogoMark SVG component
│   │   │   ├── AnimatedLogo.tsx     # Animated bars logo
│   │   │   ├── SebiDisclaimer.tsx   # Reusable SEBI risk disclaimer block
│   │   │   ├── WhatsAppButton.tsx   # Floating WhatsApp CTA
│   │   │   └── index.ts             # Barrel export — import from here
│   │   │
│   │   └── layout/                  # Page-level layout components
│   │       ├── Navbar.tsx           # Top navigation — on ALL public pages
│   │       ├── Footer.tsx           # Footer — on ALL public pages
│   │       ├── BookingBanner.tsx    # "Book a session" strip above footer
│   │       ├── CredentialBar.tsx    # SEBI credentials display bar
│   │       ├── StatutoryLetterhead.tsx  # Used on statutory/legal pages
│   │       └── ThemeProvider.tsx    # Dark/light mode context + toggle
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Supabase browser client (use in 'use client' components)
│   │   │   ├── server.ts            # Supabase server client (use in server components + API routes)
│   │   │   └── schema.sql           # Full PostgreSQL schema — run this to set up a new project
│   │   ├── data/
│   │   │   └── posts.ts             # Static blog post data (POSTS array + Post type)
│   │   ├── ai/                      # Anthropic AI helpers
│   │   ├── email/                   # Resend email templates + sender
│   │   ├── ml/                      # ML model utilities
│   │   ├── razorpay/                # Razorpay SDK helpers
│   │   ├── screener/                # Market screener engine
│   │   ├── utils/                   # General utility functions
│   │   ├── admin-check.ts           # isAdmin() + isSuperAdmin() helpers
│   │   ├── capture-features.ts      # User feature flag helper
│   │   ├── fyers-client.ts          # Fyers API client
│   │   ├── logger.ts                # Structured logging utility
│   │   ├── market-hours.ts          # NSE market hours helpers
│   │   ├── rate-limit.ts            # API rate limiting
│   │   ├── signal-utils.ts          # Research signal helper functions
│   │   ├── tokens.ts                # Design tokens (JS-accessible)
│   │   └── webauthn.ts              # Passkey auth helpers
│   │
│   └── types/
│       └── index.ts                 # ALL TypeScript interfaces — start here when
│                                    # you need to understand a data shape
│
├── public/
│   ├── images/                      # Static images (sahib-primary.jpg, etc)
│   ├── llms.txt                     # GEO — tells AI crawlers about withSahib
│   ├── sw.js                        # Service worker (PWA offline support)
│   └── favicon.svg                  # Site favicon (LogoMark)
│
├── docs/                            # Developer documentation (you are here)
│   ├── ARCHITECTURE.md              # This file
│   ├── DESIGN_SYSTEM.md
│   ├── USER_FLOWS.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── SEO.md
│   ├── COMPLIANCE.md
│   └── ONBOARDING.md
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## How a Page Request Works

```
User visits /pricing
    ↓
Vercel edge receives request
    ↓
Next.js App Router — finds src/app/pricing/page.tsx
    ↓
Server component: data fetched from Supabase server-side (no API round-trip)
Static page: pre-built HTML served instantly
    ↓
layout.tsx wraps page with fonts, metadata, skip link
layout-public.tsx adds Navbar + Footer
    ↓
HTML delivered to browser
    ↓
React hydrates for interactivity (client components only)
```

## Authentication Flow

```
New visitor clicks "Start Free"
    ↓
/auth/register — email + password form
    ↓
Supabase Auth creates user in auth.users
    ↓
Trigger creates matching row in public.users (tier = 'free')
    ↓
Confirmation email sent via Resend
    ↓
User confirms → Supabase session created
    ↓
Redirect to /dashboard
    ↓
Navbar shows "Dashboard →" instead of "Log in"
```

## Admin Authentication (Passkey)

Admin access uses two layers:

1. **Supabase Auth** — must be an admin-flagged user
2. **WebAuthn Passkey** — biometric/hardware key stored in `admin_passkeys` table

```
Admin visits /admin/*
    ↓
AdminLayout checks Supabase session → not logged in → /auth/login
    ↓
AdminLayout calls isAdmin(user.id) → not admin → /auth/login
    ↓
AdminLayout checks admin_passkeys table
  → no passkey registered → /admin/passkey (setup)
    ↓
AdminLayout checks isPasskeySessionValid(cookies)
  → session expired → /admin/passkey/verify
    ↓
Passkey verified → admin page rendered
```

## Subscription + Payment Flow

```
Dashboard user clicks Upgrade
    ↓
Razorpay subscription dialog opens (client-side)
    ↓
User pays (UPI / card / netbanking)
    ↓
Razorpay calls /api/webhooks/razorpay with event
    ↓
Webhook verifies HMAC signature
    ↓
Updates users.tier + creates subscriptions row in Supabase
    ↓
Sends confirmation email via Resend
    ↓
User refreshes dashboard → new tier features unlocked
```

## Research Delivery Flow

```
Admin creates signal in /admin/signals
    ↓
Signal saved to trade_calls table (status: 'active')
    ↓
Admin clicks "Push" → POST /api/signals/[id]/push
    ↓
Distribution service sends WhatsApp via AiSensy
    ↓
Optional: Telegram notification via bot
    ↓
Signal appears in /dashboard/signals feed for subscribers
    ↓
Cron job runs /api/signals/expire-intraday at market close
  → marks intraday signals expired if not manually closed
```

## Fyers Market Data Flow

```
Fyers token stored in fyers_tokens table
    ↓
/api/fyers/refresh-token runs daily via Vercel cron
  → renews token (valid 24h)
  → alerts Sahib on Telegram if renewal fails
    ↓
/api/market-data/* uses fyers-client.ts to fetch live prices
    ↓
/api/screener/run uses screener-engine.ts to scan symbols
    ↓
Results shown in /admin/screener
```

## Server vs Client Components — The Rule

```tsx
// SERVER COMPONENT (default in App Router)
// ✅ Can fetch from Supabase directly
// ✅ Can read environment variables
// ✅ Faster — no JS sent to browser
// ❌ Cannot use useState, useEffect, onClick
// File: no 'use client' directive needed
export default async function MyPage() { ... }

// CLIENT COMPONENT
// ✅ Can use React hooks (useState, useEffect)
// ✅ Can handle user interactions
// ❌ Cannot fetch securely from Supabase server client
// ❌ Cannot read server-only env vars
// File must start with:
'use client'
export default function MyComponent() { ... }
```

**Key rule:** Server components CAN import client components. Client components CANNOT import server-only code.
