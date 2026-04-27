# Database

## Provider: Supabase (PostgreSQL)

The full schema is in `src/lib/supabase/schema.sql`. Run it in the Supabase SQL editor to set up a new project from scratch.

---

## Core Tables

### `users`
Extends Supabase's `auth.users`. One row per registered user.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK — references `auth.users(id)` |
| `email` | text | Unique |
| `name` | text | Full name |
| `phone` | text | Optional |
| `avatar_url` | text | Optional profile photo |
| `tier` | text | `'free'` \| `'basic'` \| `'pro'` \| `'elite'` |
| `subscription_id` | text | Active Razorpay subscription ID |
| `subscription_status` | text | `'active'` \| `'inactive'` \| `'cancelled'` \| `'past_due'` |
| `subscription_ends_at` | timestamptz | Null = ongoing |
| `razorpay_customer_id` | text | Razorpay customer reference |
| `onboarding_completed` | boolean | Whether user finished onboarding |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Auto |

### `subscriptions`
Full subscription history per user.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `user_id` | uuid | FK → `users.id` |
| `tier` | text | `'free'` \| `'basic'` \| `'pro'` \| `'elite'` |
| `status` | text | `'active'` \| `'inactive'` \| `'cancelled'` \| `'past_due'` |
| `razorpay_subscription_id` | text | Unique |
| `razorpay_customer_id` | text | |
| `plan_id` | text | Razorpay plan ID (from env vars) |
| `price_paid` | integer | Amount in paise (₹6999 → 699900) |
| `billing_cycle` | text | `'monthly'` \| `'yearly'` |
| `current_period_start` | timestamptz | |
| `current_period_end` | timestamptz | |
| `cancelled_at` | timestamptz | Null if not cancelled |
| `created_at` | timestamptz | Auto |

### `trade_calls`
Research signals published by admin.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `service_type` | text | `'intraday'` \| `'stock_options'` \| `'index_options'` \| `'swing'` \| `'portfolio'` \| `'report'` |
| `symbol` | text | e.g. `'HDFCBANK'` |
| `exchange` | text | `'NSE'` \| `'BSE'` |
| `direction` | text | `'BUY'` \| `'SELL'` |
| `entry_price` | decimal | Single entry or midpoint |
| `entry_range_low` | decimal | Entry zone low (optional) |
| `entry_range_high` | decimal | Entry zone high (optional) |
| `target_1` | decimal | First target |
| `target_2` | decimal | Second target (optional) |
| `target_3` | decimal | Third target (optional) |
| `stop_loss` | decimal | Stop-loss level |
| `status` | text | `'active'` \| `'target_hit'` \| `'sl_hit'` \| `'expired'` \| `'closed'` |
| `exit_price` | decimal | Actual exit (filled on close) |
| `exit_date` | date | |
| `pnl_pct` | decimal | Profit/loss % |
| `rationale` | text | Written research rationale |
| `chart_url` | text | Optional chart image URL |
| `tier_required` | text | Minimum tier to see this call |
| `published_by` | text | `'Sahib Singh Hora'` |
| `created_at` | timestamptz | Auto |

### `appointments`
1-on-1 session bookings.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `user_id` | uuid | FK → `users.id` |
| `duration` | integer | `15` or `30` (minutes) |
| `date` | date | |
| `time_slot` | text | e.g. `'10:00 AM'` |
| `status` | text | `'pending'` \| `'confirmed'` \| `'cancelled'` |

### `courses`
Course catalogue.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `title` | text | |
| `slug` | text | URL slug |
| `description` | text | |
| `price` | integer | In paise |
| `is_published` | boolean | |

### `research_reports`
Long-form research documents (PDF/HTML).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `title` | text | |
| `summary` | text | |
| `report_url` | text | Supabase Storage URL |
| `tier_required` | text | Minimum tier |
| `published_at` | timestamptz | Null = draft |

### `blog_posts`
Blog content (currently also static in `src/lib/data/posts.ts`).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `slug` | text | Unique URL slug |
| `title` | text | |
| `excerpt` | text | 150–160 chars |
| `content` | text | Markdown or HTML |
| `category` | text | |
| `published_at` | timestamptz | Null = draft |
| `updated_at` | timestamptz | Auto |

### `fyers_tokens`
Stores the Fyers API OAuth token (one active row).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `access_token` | text | Valid ~24h |
| `refresh_token` | text | Used to renew |
| `expires_at` | timestamptz | IST display in admin settings |

### `admin_passkeys`
WebAuthn credentials for admin passkey login.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `user_id` | uuid | FK → `users.id` |
| `credential_id` | text | WebAuthn credential ID |
| `public_key` | text | Public key bytes |
| `counter` | integer | Sign count (replay attack prevention) |

### `notifications`
In-app notification feed for subscribers.

### `portfolio_holdings`
Portfolio positions tracked in the admin intelligence view.

---

## Row Level Security (RLS)

RLS is enabled on all tables. Key rules:

| Table | Read | Write |
|-------|------|-------|
| `users` | Own row only | Own row only |
| `trade_calls` | Users whose `tier >= tier_required` | Admin service role only |
| `subscriptions` | Own rows only | Service role only (via webhooks) |
| `blog_posts` | All (if `published_at` not null) | Service role only |
| `fyers_tokens` | Service role only | Service role only |
| `admin_passkeys` | Own row (by user_id) | Service role only |

---

## Supabase Client Usage

```tsx
// In CLIENT components (browser — uses anon key, respects RLS)
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
const { data, error } = await supabase
  .from('trade_calls')
  .select('*')
  .eq('tier_required', 'free')

// In SERVER components or API routes (server — uses service role, bypasses RLS)
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'

// For reading user-specific data (respects RLS):
const supabase = createServerComponentClient()

// For admin operations (bypasses RLS — use carefully):
const supabase = createServiceRoleClient()
```

---

## Adding a New Table

1. Add `CREATE TABLE` to `src/lib/supabase/schema.sql`
2. Run it in the Supabase SQL editor
3. Add TypeScript interface to `src/types/index.ts`
4. Enable RLS and write policies in Supabase dashboard
5. Update this file (`docs/DATABASE.md`)
