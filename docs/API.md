# API Routes

All API routes live in `src/app/api/`. Every file exports named HTTP method handlers (`GET`, `POST`, `PUT`, `DELETE`).

---

## Authentication

Supabase Auth handles login/register/logout — no custom auth endpoints needed.

Admin routes are protected by two things:
1. Supabase session + `isAdmin()` check (in `src/lib/admin-check.ts`)
2. Passkey session cookie (checked via `isPasskeySessionValid()` in `src/lib/webauthn.ts`)

Cron jobs are protected by `CRON_SECRET`:
```typescript
// Bearer token auth for Vercel cron
Authorization: Bearer ${CRON_SECRET}
```

---

## Route Reference

### Webhooks

#### `POST /api/webhooks/razorpay`
Receives Razorpay subscription events.
- Verifies HMAC signature using `RAZORPAY_WEBHOOK_SECRET`
- On `subscription.activated`: updates `users.tier`, creates `subscriptions` row, sends welcome email
- On `subscription.cancelled`: updates `users.tier = 'free'`, updates `subscriptions.status`
- On `subscription.charged`: records payment

---

### Signals (Research Calls)

#### `GET /api/signals`
Returns trade_calls for the authenticated user's tier.
Protected: requires valid Supabase session.

#### `POST /api/signals`
Creates a new trade call.
Admin only (service role check).
Body: `{ symbol, exchange, direction, entry_price, target_1, stop_loss, service_type, rationale, tier_required }`

#### `POST /api/signals/[id]/push`
Pushes a signal to WhatsApp (AiSensy) and Telegram.
Admin only.

#### `PUT /api/signals/[id]`
Updates signal status (`target_hit`, `sl_hit`, `closed`) and adds exit price/PnL.
Admin only.

#### `POST /api/signals/[id]/cancel`
Cancels/voids a signal before it reaches subscribers.
Admin only.

#### `GET /api/signals/check-status`
Cron job — checks if targets or SL has been hit based on live Fyers prices.
Protected by `CRON_SECRET`.

#### `POST /api/signals/expire-intraday`
Cron job — marks all active intraday signals as `expired` at market close (3:30 PM IST).
Protected by `CRON_SECRET`.

---

### Distribution

#### `POST /api/distribution/process-queue`
Processes the outbound message queue — sends WhatsApp messages via AiSensy.
Uses `AISENSY_API_KEY` and `AISENSY_CAMPAIGN_NAME`.
Protected by `CRON_SECRET`.

#### `POST /api/distribution/daily-recap`
Sends daily performance recap to subscribers via Telegram/WhatsApp.
Protected by `CRON_SECRET`.
Uses `TELEGRAM_BOT_TOKEN`, `TELEGRAM_PAID_CHANNEL_ID`, `TELEGRAM_FREE_CHANNEL_ID`.

---

### Fyers (Market Data)

#### `GET /api/fyers/auth`
Initiates Fyers OAuth flow — redirects to Fyers login page.
Admin only.
Uses: `FYERS_APP_ID`, `FYERS_REDIRECT_URI`.

#### `GET /api/fyers/callback`
Receives Fyers auth code, exchanges for access token, stores in `fyers_tokens` table.
Uses: `FYERS_APP_ID`, `FYERS_SECRET_KEY`.

#### `GET /api/fyers/refresh-token`
Renews the Fyers token using refresh token + MPIN.
Run daily by Vercel cron.
Protected by `CRON_SECRET`.
Uses: `FYERS_APP_ID`, `FYERS_SECRET_KEY`, `FYERS_MPIN`.
On failure: sends alert via `TELEGRAM_BOT_TOKEN` to `SAHIB_TELEGRAM_ID`.

---

### Intelligence

#### `POST /api/intelligence/weekly-report`
Generates a weekly market intelligence report using Claude AI.
Admin only.
Uses: `ANTHROPIC_API_KEY`.
Reads recent `trade_calls` from Supabase, sends to Claude, saves result to `research_reports`.

---

### Screener

#### `POST /api/screener/run`
Runs the market screener via `src/lib/screener/screener-engine.ts`.
Admin only.
Fetches live data from Fyers API, scores symbols against pattern criteria.
Returns ranked list of signals.

---

### Market Data

#### `GET /api/market-data/[symbol]`
Returns live quote for a symbol via Fyers API.
Protected: requires valid session.

#### `POST /api/revalidate-market`
Triggers ISR cache revalidation for market-data-dependent pages.
Protected by `CRON_SECRET`.

---

### ML

#### `POST /api/ml/generate-predictions`
Generates ML-based trade predictions.
Admin only.

#### `POST /api/ml/train`
Triggers model retraining with recent outcome data.
Admin only.

---

### Subscriptions

#### `POST /api/subscriptions/create`
Creates a Razorpay subscription for a user.
Protected: requires valid session.
Body: `{ planId, billingCycle }`

#### `DELETE /api/subscriptions/cancel`
Cancels active Razorpay subscription.
Protected: requires valid session.

---

### Appointments

#### `POST /api/appointments/book`
Creates a new appointment booking.
Body: `{ duration, date, time_slot, name, email, topic }`

---

### Email

#### `POST /api/email/send`
Internal — sends transactional emails via Resend.
Not exposed publicly (called internally).

---

### Admin

#### `GET /api/admin/view-mode`
Toggles admin "view as user" mode (sets a cookie to bypass admin checks).
Admin only.

---

### IndexNow

#### `POST /api/indexnow`
Submits new/updated URLs to Bing IndexNow for fast indexing.
Protected by `CRON_SECRET`.

---

## Adding a New API Route

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // For user-protected routes — check session
    const supabase = createServiceRoleClient()
    // ... your logic

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('[example] error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
```

**Conventions:**
- Always set `export const dynamic = 'force-dynamic'` on routes that read request state
- Always prefix `console.error` tags with the route name: `'[fyers/callback]'`
- Never use `console.log` in production routes — use `console.error` in catch blocks only
- Return `{ success: true, data: ... }` on success, `{ error: '...' }` on failure
- Use `createServiceRoleClient()` for DB operations in API routes (bypasses RLS safely from server)
