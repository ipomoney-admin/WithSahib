# withSahib — Complete Project Documentation
*Last updated: 2026-04-22 (Session 2 — auth, DB, admin 404 fixes)*

---

## 1. IDENTITY & LEGAL

- **Platform name:** withSahib (withsahib.com)
- **Company:** Altitans Intelligence Private Limited
- **CIN:** U62011MP2026PTC083080
- **SEBI RA:** Sahib Singh Hora — INH000026266
- **Valid:** Apr 20, 2026 – Apr 19, 2031
- **Email:** sahib13singh13@gmail.com
- **Phone:** +91 9198887210
- **Address:** 86/2 Opposite Ice Factory, Prem Nagar, Madan Mahal, Jabalpur, MP 482001
- **Entity type:** Individual Research Analyst registered with SEBI under SEBI (Research Analysts) Regulations, 2014

---

## 2. TECH STACK

### Dependencies (from package.json)

| Package | Version |
|---|---|
| next | 14.2.3 |
| react | ^18 |
| react-dom | ^18 |
| @anthropic-ai/sdk | ^0.24.3 |
| @hookform/resolvers | ^3.4.2 |
| @supabase/ssr | ^0.3.0 |
| @supabase/supabase-js | ^2.43.1 |
| @vercel/analytics | ^2.0.1 |
| @vercel/speed-insights | ^2.0.0 |
| clsx | ^2.1.1 |
| date-fns | ^3.6.0 |
| framer-motion | ^11.2.6 |
| jose | ^5.2.4 |
| lucide-react | ^0.383.0 |
| next-pwa | ^5.6.0 |
| razorpay | ^2.9.2 |
| react-hook-form | ^7.51.5 |
| resend | ^3.2.0 |
| sharp | ^0.33.4 |
| sonner | ^1.4.41 |
| tailwind-merge | ^2.3.0 |
| zod | ^3.23.8 |

### DevDependencies

| Package | Version |
|---|---|
| @capacitor/android | ^6.1.0 |
| @capacitor/app | ^6.0.0 |
| @capacitor/cli | ^6.1.0 |
| @capacitor/core | ^6.1.0 |
| @capacitor/haptics | ^6.0.0 |
| @capacitor/ios | ^6.1.0 |
| @capacitor/keyboard | ^6.0.0 |
| @capacitor/status-bar | ^6.0.0 |
| @types/node | ^20 |
| @types/react | ^18 |
| @types/react-dom | ^18 |
| autoprefixer | ^10.0.1 |
| critters | ^0.0.23 |
| eslint | ^8 |
| eslint-config-next | 14.2.3 |
| postcss | ^8 |
| tailwindcss | ^3.4.1 |
| typescript | ^5 |

### Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
- `npm run cap:sync` — build + Capacitor sync (Android/iOS)
- `npm run cap:android` — build + open in Android Studio
- `npm run cap:ios` — build + open in Xcode

### Node version
Not explicitly pinned in package.json. Vercel defaults to Node.js 24 LTS.

---

## 3. INFRASTRUCTURE

### Vercel

- **Project name:** with-sahib
- **Team:** sahibs-projects-f0c8b826
- **Production URL:** https://www.withsahib.com
- **Framework:** Next.js 14 (App Router)
- **Build command:** `next build`

### Supabase

- **Project ID:** trtoxawkeququfurddwr
- **Region:** ap-northeast-1 (Tokyo)
- **URL pattern:** `https://trtoxawkeququfurddwr.supabase.co`
- **Auth:** Supabase Auth (email/password + magic link)
- **Realtime:** Used on admin signals page and member dashboard for live prices and signal updates

**Tables (17 total):**
1. subscriptions
2. admin_roles
3. market_holidays
4. fyers_tokens
5. live_prices
6. subscriber_contacts
7. admin_alerts
8. signal_alerts
9. signals
10. signal_modifications
11. signal_audit_log
12. signal_push_queue
13. performance_summary
14. signal_features
15. signal_ml_scores
16. ml_models
17. signal_postmortems
18. intelligence_reports

### DNS (Spaceship)

- **Domain registrar:** Spaceship (spaceship.com)
- **A record:** @ → 76.76.21.21
- **CNAME:** www → 01a8d991bd3b8c7e.vercel-dns-017.com

### Cron Jobs (external — cron-job.org)

- **Account:** sahib13singh13@gmail.com
- **Job:** withSahib Market Data Refresh
- **Schedule:** Daily 10:30 UTC = 4:00 PM IST (weekdays)
- **URL:** https://www.withsahib.com/api/revalidate-market?secret=withsahib2026market

### Vercel Crons (from vercel.json — 9 jobs)

| Path | Schedule | IST Time | Days | Purpose |
|---|---|---|---|---|
| /api/screener/run | `*/2 3-10 * * 1-5` | Every 2 min, 8:30 AM–4 PM | Mon–Fri | Auto-scan stocks for signals |
| /api/signals/check-status | `*/1 3-10 * * 1-5` | Every 1 min, 8:30 AM–4 PM | Mon–Fri | Check open signals vs live prices |
| /api/signals/expire-intraday | `44 9 * * 1-5` | 3:14 PM IST | Mon–Fri | Expire all open intraday signals at market close |
| /api/fyers/refresh-token | `30 2 * * 1-5` | 8:00 AM IST | Mon–Fri | Refresh Fyers API access token |
| /api/ml/train | `30 17 * * 1-5` | 11:00 PM IST | Mon–Fri | Nightly ML model training |
| /api/ml/generate-predictions | `35 17 * * 1-5` | 11:05 PM IST | Mon–Fri | Generate predictions for today's signals |
| /api/intelligence/weekly-report | `30 14 * * 0` | 8:00 PM IST Sunday | Sunday | Generate weekly intelligence report |
| /api/distribution/daily-recap | `0 11 * * 1-5` | 4:30 PM IST | Mon–Fri | Send daily recap to free Telegram channel |
| /api/distribution/process-queue | `*/2 * * * *` | Every 2 min, 24/7 | All days | Process signal push queue (WhatsApp + Telegram) |

---

## 4. DESIGN SYSTEM (LOCKED — DO NOT CHANGE)

### Colors

| Variable | Value | Usage |
|---|---|---|
| --bg | #06090F | Page background |
| --surface | #141F2E | Card / panel background |
| --border | #1A2333 | Default border color |
| --border2 | (slightly lighter variant) | Toast border |
| --emerald | #00C896 | Primary CTA, active states, wins |
| --gold | #D4A843 | Accents, SEBI reg numbers, warnings |
| --text | #E8EDF5 | Primary text |
| --text2 | #8FA8C0 | Secondary text |
| --text3 | #6B8AAA | Muted text, labels |
| Ticker bg (dark) | #0C1219 | Ticker background |
| WhatsApp | #25D366 | WhatsApp button |
| Red / Loss | #EF4444 | SL hit, errors |
| Blue | #3B82F6 | Index options segment |
| Purple | #8B5CF6 | Swing segment |

### Typography

| Font | Usage | Weights |
|---|---|---|
| DM Serif Display (Google Fonts) | Headings, hero text | 300, 400 |
| Outfit (Google Fonts, variable --font-outfit) | Body, UI, labels | 200–800 |
| JetBrains Mono (Google Fonts, variable --font-mono) | SEBI reg numbers, monospace | 400, 500 |

### Logo

- **Shape:** 3 ascending candle bars (fading opacity left to right) + green pulse dot on top-right of tallest bar
- **Wordmark:** `with` (Outfit 300) + `Sahib` (#00C896, Outfit 500) + `.com` (Outfit 300)
- **Animation:** Bars appear 1-by-1 with stagger, then dot pops in and pulses continuously
- **Files:** `src/components/ui/Logo.tsx` (static), `src/components/ui/AnimatedLogo.tsx` (animated)

### Segment Colors

| Segment | Color | Hex |
|---|---|---|
| Intraday | Emerald | #00C896 |
| Stock Options | Gold | #D4A843 |
| Index Options | Blue | #3B82F6 |
| Swing | Purple | #8B5CF6 |

---

## 5. ENVIRONMENT VARIABLES

All variables must be set in Vercel project settings. Keys only (no values committed):

| Variable | Value / Notes |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key (public) |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key (server-only, never expose) |
| NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION | Google Search Console verification code |
| NEXT_PUBLIC_BING_SITE_VERIFICATION | Bing Webmaster Tools verification code |
| NEXT_PUBLIC_RAZORPAY_KEY_ID | Razorpay publishable key |
| RAZORPAY_KEY_SECRET | Razorpay secret key (server-only) |
| RAZORPAY_WEBHOOK_SECRET | Razorpay webhook signature secret |
| CRON_SECRET | `withsahib2026market` — used in x-cron-secret header |
| FYERS_APP_ID | Fyers API v3 app ID (from myapi.fyers.in) |
| FYERS_SECRET_KEY | Fyers API v3 secret key |
| FYERS_REDIRECT_URI | `https://withsahib.com/api/fyers/callback` |
| AISENSY_API_KEY | AiSensy WhatsApp API key |
| AISENSY_CAMPAIGN_NAME | `withsahib_signal` |
| TELEGRAM_BOT_TOKEN | Telegram bot token from @BotFather |
| TELEGRAM_PAID_CHANNEL_ID | ID of paid Telegram channel |
| TELEGRAM_FREE_CHANNEL_ID | ID of free Telegram channel |
| SAHIB_TELEGRAM_ID | Sahib's personal Telegram user ID |
| NEXT_PUBLIC_APP_URL | `https://www.withsahib.com` (used in performance page SSR fetch) |

---

## 6. SUBSCRIPTION TIERS

| Plan | Monthly | Yearly | Discount | Access |
|---|---|---|---|---|
| Free | ₹0 | ₹0 | — | Performance tracker only (public page) |
| Basic | ₹999/mo | ₹919/mo | Save 8% | Swing signals only |
| Pro | ₹2,499/mo | ₹2,199/mo | Save 12% | All signals + Telegram paid channel |
| Elite | ₹5,999/mo | ₹5,099/mo | Save 15% | All signals + WhatsApp delivery + priority |

**Plan logic enforced in:**
- Database RLS policies (subscriptions table)
- API `/api/signals` (GET handler checks plan vs segment)
- Member dashboard `src/app/dashboard/signals/page.tsx`

**Minimum R:R enforced at publish:**
- Intraday: 2.0x
- Stock Options: 2.5x
- Index Options: 1.5x
- Swing: 3.0x

---

## 7. PAGE ROUTES (Complete)

| Route | Auth | Description |
|---|---|---|
| `/` | Public | Homepage — hero, services overview, stats, social proof |
| `/about` | Public | Analyst profile — Sahib Singh Hora, bio, credentials |
| `/pricing` | Public | Subscription plans comparison |
| `/performance` | Public | Public performance track record (aggregated, no entry/SL/target) |
| `/services` | Public | Services overview page |
| `/services/intraday` | Member | Intraday signals service detail (protected) |
| `/services/stock-options` | Member | Stock options service detail (protected) |
| `/services/index-options` | Member | Index options service detail (protected) |
| `/services/swing` | Public | Swing trades service detail |
| `/blog` | Public | Blog index page |
| `/blog/[slug]` | Public | Individual blog post |
| `/faq` | Public | Frequently asked questions |
| `/contact` | Public | Contact form |
| `/brand` | Public | Brand guidelines page |
| `/research` | Public | Research page |
| `/auth/login` | Public (redirect if logged in) | Login page |
| `/auth/register` | Public (redirect if logged in) | Registration page |
| `/auth/forgot-password` | Public | Password reset page |
| `/auth/callback` | Public | Supabase OAuth callback handler |
| `/dashboard` | Member | Member dashboard home |
| `/dashboard/signals` | Member | Live signal feed with real-time price tracking |
| `/appointments` | Member | Book 1-on-1 sessions with Sahib |
| `/reports` | Member | AI research reports |
| `/courses` | Member | Trading courses |
| `/settings` | Member | Account settings |
| `/admin/signals` | Admin | Signal queue, open signals, history, manual create |
| `/admin/intelligence` | Admin | Performance matrix, ML postmortems, weekly reports |

---

## 8. API ROUTES (Complete)

| Path | Method(s) | Auth | Purpose |
|---|---|---|---|
| `/api/signals` | GET | Public/Member/Admin | List signals (filtered by plan/segment) |
| `/api/signals` | POST | Admin | Publish new signal (validates R:R, captures ML features, logs audit) |
| `/api/signals/[id]` | GET | Member/Admin | Get single signal |
| `/api/signals/[id]` | PATCH | Admin | Modify signal (enforces entry locked, SL tighten-only, targets raise-only) |
| `/api/signals/[id]` | DELETE | Admin | Delete/cancel signal |
| `/api/signals/[id]/push` | POST | Admin | Push signal to WhatsApp or Telegram paid channel |
| `/api/signals/[id]/cancel` | POST | Admin | Cancel open signal (notifies subscribers) |
| `/api/signals/check-status` | GET | CRON_SECRET | Check open signals vs live prices; auto-update T1/T2/T3/SL; queue notifications |
| `/api/signals/expire-intraday` | GET | CRON_SECRET | Expire all open intraday signals at 3:14 PM IST |
| `/api/screener/run` | GET | CRON_SECRET | Scan INTRADAY_SYMBOLS for VWAP crossover + volume signals; insert to signal_alerts |
| `/api/fyers/refresh-token` | GET | CRON_SECRET | Refresh Fyers API access token; store in fyers_tokens table |
| `/api/fyers/status` | GET | Admin | Check Fyers connection status + token expiry time |
| `/api/ml/train` | GET | CRON_SECRET | Train Random Forest model on closed signals; save to ml_models table |
| `/api/ml/generate-predictions` | GET | CRON_SECRET | Generate ML win probability scores for recent open signals |
| `/api/ml/generate-postmortem` | POST | Admin | Generate ML postmortem for a SL-hit signal |
| `/api/ml/score/[alertId]` | GET | Admin | Get ML win probability score for a pending alert |
| `/api/distribution/process-queue` | GET | CRON_SECRET | Process signal_push_queue — send WhatsApp (AiSensy) + Telegram messages |
| `/api/distribution/daily-recap` | GET | CRON_SECRET | Send daily outcome recap to free Telegram channel at 4:30 PM IST |
| `/api/intelligence/weekly-report` | GET | CRON_SECRET | Generate weekly performance report; deliver to Telegram |
| `/api/performance` | GET | Public | Return aggregated performance_summary data + recent calls log |
| `/api/admin/alerts` | GET | Admin | List unread admin_alerts (fyers_disconnected, sl_hit, etc.) |
| `/api/ai/report` | POST | Member | Generate AI research report using Anthropic Claude |
| `/api/market-data` | GET | Public | Return current live_prices from Supabase |
| `/api/market-data/prices` | GET | Public | Return prices for specific symbols |
| `/api/revalidate-market` | GET | CRON_SECRET (query param) | Revalidate Next.js ISR cache for market data pages |
| `/api/subscriptions/create` | POST | Authenticated | Create Razorpay subscription |
| `/api/webhooks/razorpay` | POST | Razorpay webhook secret | Handle subscription lifecycle (activate, expire, cancel) |
| `/auth/callback` | GET | Public | Supabase auth callback (code exchange) |

---

## 9. SUPABASE SCHEMA (Complete)

### ENUMs

```sql
signal_segment: intraday | stock_options | index_options | swing
signal_status: open | partial_exit | t1_hit | t2_hit | t3_hit | sl_hit | expired | cancelled | modified
subscription_plan: free | basic | pro | elite
subscription_status: active | expired | cancelled | grace_period
push_channel: whatsapp | telegram_paid | telegram_free
push_status: queued | sent | delivered | failed | opted_out
admin_role_type: super_admin | viewer_admin
alert_review_status: pending | approved | rejected
audit_action: alert_generated | alert_approved | alert_rejected | signal_published | signal_modified | signal_cancelled | status_changed | pushed_whatsapp | pushed_telegram | ml_score_generated | postmortem_generated
failure_type: clean_loss | stop_hunt | premature_entry | sector_against | black_swan
ml_confidence: HIGH | MEDIUM | LOW | LEARNING
model_status: training | active | deprecated
admin_alert_type: fyers_disconnected | token_expired | new_signal | sl_hit | target_hit | system_error
intelligence_report_type: weekly | monthly
modification_type: sl_tightened | target_raised | cancelled | other
```

### Table: subscriptions
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| user_id | UUID FK → auth.users | UNIQUE, ON DELETE CASCADE |
| plan | subscription_plan | DEFAULT 'free' |
| status | subscription_status | DEFAULT 'active' |
| razorpay_subscription_id | TEXT | |
| current_period_end | TIMESTAMPTZ | |
| grace_period_end | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

**RLS:** users_own_subscription — users see only their own row.

### Table: admin_roles
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK → auth.users | UNIQUE, ON DELETE CASCADE |
| role | admin_role_type | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

**RLS:** admin_roles_read — only admins can read.

### Table: market_holidays
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| date | DATE | UNIQUE |
| description | TEXT | |
| exchange | TEXT | DEFAULT 'NSE' |

**RLS:** None (no RLS enabled on this table — public read).

### Table: fyers_tokens
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| access_token | TEXT | NOT NULL |
| refresh_token | TEXT | |
| expires_at | TIMESTAMPTZ | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

**RLS:** None (service role only).

### Table: live_prices
| Column | Type | Notes |
|---|---|---|
| symbol | TEXT | PRIMARY KEY |
| ltp | DECIMAL(12,2) | Last traded price |
| prev_close | DECIMAL(12,2) | |
| change_pct | DECIMAL(8,4) | |
| open_price | DECIMAL(12,2) | |
| high_price | DECIMAL(12,2) | |
| low_price | DECIMAL(12,2) | |
| volume | BIGINT | |
| oi | BIGINT | Open interest |
| iv | DECIMAL(8,4) | Implied volatility |
| vwap | DECIMAL(12,2) | |
| timestamp | TIMESTAMPTZ | DEFAULT NOW() |

**Indexes:** idx_live_prices_symbol, idx_live_prices_timestamp DESC

### Table: subscriber_contacts
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK → auth.users | UNIQUE, ON DELETE CASCADE |
| phone | TEXT | |
| whatsapp_opted_in | BOOLEAN | DEFAULT false |
| telegram_user_id | TEXT | |
| telegram_opted_in | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**RLS:** users_own_contacts — users see only their own row.

### Table: admin_alerts
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| type | admin_alert_type | NOT NULL |
| message | TEXT | NOT NULL |
| data | JSONB | |
| is_read | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | |

**RLS:** admin_alerts_read — admins only. **Index:** idx_admin_alerts_unread (WHERE is_read = false).

### Table: signal_alerts (Screener queue — pre-publish)
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| segment | signal_segment | NOT NULL |
| scrip | TEXT | NOT NULL |
| strike | TEXT | For options |
| entry_low | DECIMAL(12,2) | NOT NULL |
| entry_high | DECIMAL(12,2) | NOT NULL |
| stop_loss | DECIMAL(12,2) | NOT NULL |
| stop_loss_type | TEXT | 'hard' or 'trailing' |
| target_1 | DECIMAL(12,2) | NOT NULL |
| target_2 | DECIMAL(12,2) | |
| target_3 | DECIMAL(12,2) | |
| rr_ratio | DECIMAL(6,2) | |
| rationale | TEXT | NOT NULL |
| validity_date | DATE | |
| pattern_type | TEXT | |
| trigger_conditions | JSONB | |
| review_status | alert_review_status | DEFAULT 'pending' |
| reviewed_by | UUID FK → auth.users | |
| reviewed_at | TIMESTAMPTZ | |
| rejection_reason | TEXT | |
| edit_history | JSONB | DEFAULT '[]' |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**RLS:** admin_alerts_all — admins full access. **Index:** idx_signal_alerts_review.

### Table: signals (Live published signals)
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| alert_id | UUID FK → signal_alerts | |
| segment | signal_segment | NOT NULL |
| scrip | TEXT | NOT NULL |
| strike | TEXT | |
| original_entry_low | DECIMAL(12,2) | NOT NULL — IMMUTABLE after publish |
| original_entry_high | DECIMAL(12,2) | NOT NULL — IMMUTABLE after publish |
| original_stop_loss | DECIMAL(12,2) | NOT NULL — IMMUTABLE after publish |
| original_target_1 | DECIMAL(12,2) | NOT NULL — IMMUTABLE after publish |
| original_target_2 | DECIMAL(12,2) | IMMUTABLE after publish |
| original_target_3 | DECIMAL(12,2) | IMMUTABLE after publish |
| entry_low | DECIMAL(12,2) | NOT NULL — current (LOCKED after publish) |
| entry_high | DECIMAL(12,2) | NOT NULL — current (LOCKED after publish) |
| stop_loss | DECIMAL(12,2) | NOT NULL — can only tighten |
| stop_loss_type | TEXT | 'hard' or 'trailing' |
| target_1 | DECIMAL(12,2) | NOT NULL — can only raise |
| target_2 | DECIMAL(12,2) | Can only raise |
| target_3 | DECIMAL(12,2) | Can only raise |
| rr_ratio | DECIMAL(6,2) | |
| rationale | TEXT | NOT NULL |
| validity_date | DATE | |
| pattern_type | TEXT | |
| analyst_holding | BOOLEAN | DEFAULT false |
| status | signal_status | DEFAULT 'open' |
| exit_price | DECIMAL(12,2) | |
| exit_time | TIMESTAMPTZ | |
| t1_hit_at | TIMESTAMPTZ | |
| t2_hit_at | TIMESTAMPTZ | |
| t3_hit_at | TIMESTAMPTZ | |
| sl_hit_at | TIMESTAMPTZ | |
| actual_rr_achieved | DECIMAL(6,2) | |
| is_black_swan | BOOLEAN | DEFAULT false |
| published_at | TIMESTAMPTZ | DEFAULT NOW() |
| published_by | UUID FK → auth.users | NOT NULL |
| is_modified | BOOLEAN | DEFAULT false |
| modification_disclosed | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**RLS Policies:**
- basic_swing_signals — Basic/Pro/Elite plan users can SELECT swing signals
- pro_all_signals — Pro/Elite plan users can SELECT all segments
- admin_signals_all — Admins have full access

**Indexes:** idx_signals_status, idx_signals_segment, idx_signals_scrip, idx_signals_published_at DESC

**Triggers:**
- on_signal_status_change → trigger_performance_recalc() — auto-recalculates performance_summary on status change
- on_sl_hit → auto_generate_postmortem() — inserts admin_alert when SL hit

### Table: signal_modifications
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| signal_id | UUID FK → signals ON DELETE CASCADE | |
| modification_type | modification_type | NOT NULL |
| field_changed | TEXT | NOT NULL |
| old_value | TEXT | NOT NULL |
| new_value | TEXT | NOT NULL |
| reason | TEXT | NOT NULL |
| disclosed_via | TEXT[] | Channels used for disclosure |
| modified_by | UUID FK → auth.users | |
| created_at | TIMESTAMPTZ | |

### Table: signal_audit_log
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| signal_id | UUID | |
| alert_id | UUID | |
| action | audit_action | NOT NULL |
| performed_by | UUID FK → auth.users | |
| old_values | JSONB | |
| new_values | JSONB | |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | |

### Table: signal_push_queue
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| signal_id | UUID FK → signals ON DELETE CASCADE | |
| channel | push_channel | NOT NULL |
| recipient_id | TEXT | NOT NULL (phone/telegram_id/channel_id) |
| user_id | UUID FK → auth.users | |
| message_content | TEXT | NOT NULL |
| status | push_status | DEFAULT 'queued' |
| failure_reason | TEXT | |
| retry_count | INTEGER | DEFAULT 0 |
| attempted_at | TIMESTAMPTZ | |
| delivered_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

**RLS:** admin_push_queue_all — admins only. **Index:** idx_push_queue_status.

### Table: performance_summary
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| month | INTEGER | NOT NULL |
| year | INTEGER | NOT NULL |
| segment | TEXT | NULL = overall across all segments |
| total_calls | INTEGER | DEFAULT 0 |
| t1_hit | INTEGER | DEFAULT 0 |
| t2_hit | INTEGER | DEFAULT 0 |
| t3_hit | INTEGER | DEFAULT 0 |
| sl_hit | INTEGER | DEFAULT 0 |
| expired | INTEGER | DEFAULT 0 |
| cancelled | INTEGER | DEFAULT 0 |
| win_rate | DECIMAL(5,2) | |
| avg_rr_promised | DECIMAL(6,2) | |
| avg_rr_achieved | DECIMAL(6,2) | |
| avg_gain_pct | DECIMAL(8,4) | |
| avg_loss_pct | DECIMAL(8,4) | |
| expectancy | DECIMAL(6,4) | |
| updated_at | TIMESTAMPTZ | |

**RLS:** public_read_performance — everyone can SELECT (no sensitive data).
**Unique indexes:** idx_perf_summary_overall (month, year WHERE segment IS NULL), idx_perf_summary_segment (month, year, segment WHERE segment IS NOT NULL).

### Table: signal_features (ML training data)
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| signal_id | UUID FK → signals ON DELETE CASCADE | UNIQUE |
| vix | DECIMAL(6,2) | India VIX at signal time |
| nifty_trend | TEXT | strong_bull/bull/neutral/bear/strong_bear |
| nifty_vs_20ema | TEXT | above/below |
| sector_performance | DECIMAL(8,4) | |
| market_breadth | DECIMAL(6,4) | |
| volume_ratio | DECIMAL(8,4) | Current vol / avg vol |
| vwap_distance | DECIMAL(8,4) | % distance from VWAP |
| atr_value | DECIMAL(12,2) | Absolute ATR |
| atr_pct | DECIMAL(8,4) | ATR as % of price |
| time_bucket | TEXT | 09:15-10:00 / 10:00-11:30 / 11:30-13:00 / 13:00-15:30 |
| day_of_week | TEXT | Monday–Friday |
| days_to_expiry | INTEGER | Days until next Thursday (weekly expiry) |
| iv_percentile | DECIMAL(6,2) | |
| pcr | DECIMAL(6,4) | Put-Call Ratio |
| pattern_type | TEXT | |
| signal_rr_promised | DECIMAL(6,2) | |
| entry_vs_52wh | DECIMAL(8,4) | % from 52-week high |
| entry_vs_52wl | DECIMAL(8,4) | % from 52-week low |
| symbol_historical_winrate | DECIMAL(5,2) | Historical win % for this scrip |
| similar_setup_count | INTEGER | # of similar setups in history |
| last_5_signals_result | TEXT | e.g. "WWLWW" |
| outcome | TEXT | win / loss / neutral |
| failure_type | failure_type | Populated after loss |
| is_black_swan | BOOLEAN | DEFAULT false — excluded from training |
| created_at | TIMESTAMPTZ | |

**Index:** idx_signal_features_signal.

### Table: signal_ml_scores
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| signal_id | UUID FK → signals ON DELETE CASCADE | |
| alert_id | UUID FK → signal_alerts ON DELETE CASCADE | |
| win_probability | DECIMAL(5,4) | 0.0–1.0 |
| confidence_level | ml_confidence | DEFAULT 'LEARNING' |
| top_risk_factors | JSONB | Array of {factor, impact, direction} |
| suggested_sl_adjustment | DECIMAL(10,2) | |
| similar_winning_count | INTEGER | DEFAULT 0 |
| similar_losing_count | INTEGER | DEFAULT 0 |
| model_used | TEXT | 'global' or '{symbol}_{segment}' |
| model_version | INTEGER | |
| trained_on | DATE | |
| training_samples | INTEGER | DEFAULT 0 |
| feature_importances | JSONB | |
| created_at | TIMESTAMPTZ | |

### Table: ml_models
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| symbol | TEXT | NULL = global model |
| segment | TEXT | NULL = global model |
| model_version | INTEGER | NOT NULL DEFAULT 1 |
| training_samples | INTEGER | NOT NULL DEFAULT 0 |
| accuracy | DECIMAL(5,4) | |
| precision_score | DECIMAL(5,4) | |
| recall_score | DECIMAL(5,4) | |
| f1_score | DECIMAL(5,4) | |
| feature_importances | JSONB | {feature_name: importance_value} |
| model_params | JSONB | {forest: serialized_json, medians: {}} |
| model_file_url | TEXT | |
| status | model_status | DEFAULT 'active' |
| trained_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

### Table: signal_postmortems
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| signal_id | UUID FK → signals ON DELETE CASCADE | UNIQUE |
| failure_type | failure_type | NOT NULL |
| primary_miss | TEXT | NOT NULL |
| secondary_miss | TEXT | |
| timing_analysis | TEXT | |
| market_context_analysis | TEXT | |
| pattern_detected | TEXT | |
| similar_winning_signals | JSONB | DEFAULT '[]' |
| learning_applied | TEXT | |
| ml_recommendation | TEXT | |
| reviewed_by_sahib | BOOLEAN | DEFAULT false |
| sahib_notes | TEXT | |
| created_at | TIMESTAMPTZ | |

### Table: intelligence_reports
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| week_number | INTEGER | |
| month | INTEGER | |
| year | INTEGER | |
| report_type | intelligence_report_type | NOT NULL |
| report_data | JSONB | NOT NULL DEFAULT '{}' |
| key_insights | TEXT[] | |
| recommendations | TEXT[] | |
| generated_at | TIMESTAMPTZ | DEFAULT NOW() |
| delivered_to_telegram | BOOLEAN | DEFAULT false |

### Database Functions

- **calculate_rr(entry_low, entry_high, stop_loss, target_1)** → DECIMAL — Calculates R:R ratio using mid-entry. IMMUTABLE.
- **recalculate_performance(month, year, segment)** → VOID — Recomputes performance_summary row by counting signal outcomes. Called automatically by trigger.
- **trigger_performance_recalc()** → TRIGGER — Fires AFTER UPDATE on signals when status changes; calls recalculate_performance for both overall and segment rows.
- **auto_generate_postmortem()** → TRIGGER — Fires AFTER UPDATE on signals when status becomes 'sl_hit'; inserts admin_alert.

---

## 10. SIGNAL LIFECYCLE

### Status Flow

```
open → partial_exit → t1_hit → t2_hit → t3_hit   (progressive targets hit)
open → sl_hit                                       (stop loss triggered)
open → expired                                      (validity_date passed)
open → cancelled                                    (admin cancels)
open → modified (stays open, is_modified=true)      (SL tightened or target raised)
```

### Win / Loss / Neutral Definition

- **Win** = any target hit (t1_hit OR t2_hit OR t3_hit)
- **Loss** = sl_hit
- **Neutral** = expired (excluded from win rate denominator)
- **Win Rate** = (T1 + T2 + T3) / (T1 + T2 + T3 + sl_hit) × 100
- **Black swan signals** = excluded from performance calculations AND ML training

### Segments — Valid Entry Windows, SL Logic, Target Logic

#### Intraday
- **Valid publish window:** 9:15 AM – 1:00 PM IST (checked by screener)
- **Auto-expire:** 3:14 PM IST (via Vercel Cron `expire-intraday`)
- **SL logic:** Hard SL — price touches SL → sl_hit
- **Target logic:** Minimum R:R 2.0x before publish is allowed
- **Screener triggers on:** VWAP crossover + volumeRatio > 1.5 + change_pct > 0.3%

#### Stock Options
- **Minimum R:R:** 2.5x
- **SL logic:** Hard or trailing (admin selects)
- **Validity:** Admin sets validity_date

#### Index Options (Nifty / BankNifty)
- **Minimum R:R:** 1.5x (lower because options decay fast)
- **SL logic:** Hard or trailing
- **Strike field:** e.g. "24000CE", "47500PE"

#### Swing
- **Minimum R:R:** 3.0x
- **Validity:** Multi-day (admin sets validity_date)
- **Available to:** Basic, Pro, Elite plans

### Modification Rules (ENFORCED in validateModification() — signal-utils.ts)

- **Entry range:** LOCKED after publish — cannot be changed at all
- **Stop loss:** Can ONLY be tightened (moved closer to entry)
  - Long position: newSL > oldSL (higher)
  - Short position: newSL < oldSL (lower)
- **Targets:** Can ONLY be raised
  - Long position: newTarget > oldTarget (higher)
  - Short position: newTarget < oldTarget (lower)
- **Any change:** Triggers disclosure notification to subscribers; sets is_modified=true; logs to signal_modifications table

---

## 11. ML SYSTEM

### Architecture

- **Implementation:** Pure TypeScript — no Python, no external ML library
- **Algorithm:** Random Forest (ensemble of 50 Decision Trees)
- **Tree parameters:** max_depth = 8, min_samples = 5
- **Forest parameters:** nTrees = 50
- **Split criterion:** Gini impurity
- **Bootstrap sampling:** With replacement (standard Random Forest bagging)
- **Training split:** 80% train / 20% test
- **Model storage:** Serialized as JSONB in `ml_models.model_params` column (field: `forest`)
- **Medians storage:** Stored alongside model in `model_params.medians` for imputation
- **Training schedule:** Nightly Vercel Cron at 11:00 PM IST (Mon–Fri)

### Model Hierarchy (getModelForSymbol)

1. Try symbol-specific model first (`symbol = 'RELIANCE', segment = 'intraday'`)
2. Fall back to global model (`symbol = NULL, segment = NULL`)
3. Return null if no model available

### Features Captured (14 numeric features in ML vector)

Order matters — this is the exact vector passed to the model:

| # | Feature | Source | Description |
|---|---|---|---|
| 1 | vix | NSE:INDIA VIX-INDEX live_prices | India VIX value |
| 2 | nifty_trend | Derived from NIFTY50 change_pct | strong_bull(2)/bull(1)/neutral(0)/bear(-1)/strong_bear(-2) |
| 3 | nifty_vs_20ema | Derived from NIFTY50 ltp vs vwap | above(1) / below(0) |
| 4 | sector_performance | NIFTY50 change_pct | % change (proxy) |
| 5 | volume_ratio | signal stock volume / avg volume | > 1.5 = high volume |
| 6 | vwap_distance | (ltp - vwap) / vwap * 100 | % distance from VWAP |
| 7 | atr_pct | (high - low) / ltp * 100 | ATR as % of price |
| 8 | time_bucket | IST time at signal creation | 0/1/2/3 bucket |
| 9 | day_of_week | Day of week | Mon(0) to Fri(4) |
| 10 | days_to_expiry | Days until next Thursday | Weekly options expiry |
| 11 | iv_percentile | From options data | Implied volatility %ile |
| 12 | signal_rr_promised | R:R ratio at publish | R:R value |
| 13 | symbol_historical_winrate | Calculated from signals table | % historical wins for this scrip |
| 14 | similar_setup_count | Count in signal_features | # similar prior setups |

Additional fields stored in signal_features but NOT in ML vector: market_breadth, pcr, entry_vs_52wh, entry_vs_52wl, last_5_signals_result (categorical, not yet encoded)

### Confidence Tiers (getConfidenceTier)

| Tier | Condition |
|---|---|
| LEARNING | samples < 5 |
| LOW | samples 5–19 (uses global model) |
| MEDIUM | samples 20–49 AND accuracy > 55% |
| HIGH | samples ≥ 50 AND accuracy > 65% |

### Failure Types

| Type | Meaning |
|---|---|
| clean_loss | Setup was valid but market moved against |
| stop_hunt | Unusual wick took out SL before reversal |
| premature_entry | Entered before setup confirmed |
| sector_against | Sector or broader market moved against |
| black_swan | Unforeseeable macro/event-driven move |

### ML Metrics Tracked

- Accuracy, Precision, Recall, F1 score (all stored in ml_models table)
- Feature importances (normalized, summing to 1.0)
- training_samples, model_version, trained_at

---

## 12. DISTRIBUTION

### WhatsApp (AiSensy)

- **Endpoint:** https://backend.aisensy.com/campaign/t1/api
- **Campaign name:** `withsahib_signal`
- **API key env var:** AISENSY_API_KEY
- **Eligible subscribers:** Elite plan + whatsapp_opted_in = true in subscriber_contacts
- **Rate limit:** 50 messages/min → 1.2 second delay between sends
- **Triggers:** New signal publish, outcome update (T1/T2/T3/SL), signal modification
- **Queue:** All messages go through signal_push_queue first; processed by /api/distribution/process-queue every 2 minutes

### Telegram

- **Free channel:** Receives daily recap at 4:30 PM IST (outcome only — no entry/SL/targets)
- **Paid channel:** Receives live signals in real-time (Pro + Elite subscribers)
- **Personal bot:** @withsahibbot (TELEGRAM_BOT_TOKEN)
- **Free channel ID:** TELEGRAM_FREE_CHANNEL_ID env var
- **Paid channel ID:** TELEGRAM_PAID_CHANNEL_ID env var

### Message Format (WhatsApp — formatSignalMessage)

**New signal:**
```
🎯 *withSahib Signal Alert*

*INTRADAY CALL*
Scrip: *RELIANCE*

Entry: ₹2,850 – ₹2,880
SL: ₹2,810
T1: ₹2,950 | T2: ₹3,050 | T3: ₹3,150
R:R ≈ 2.5

Rationale: VWAP crossover with 2x volume...
✅ Analyst holding position

SEBI RA: INH000026266 | Not investment advice
```

**Outcome update:**
```
✅ *withSahib Signal Update*

*RELIANCE*
Status: T2 Hit ✅✅
Exit Price: ₹3,050
R:R Achieved: 2.5x

SEBI RA: INH000026266 | Not investment advice
```

**Modification:**
```
⚠️ *withSahib Signal Modified*

*RELIANCE*
Entry: ₹2,850 – ₹2,880
SL (updated): ₹2,840
T1: ₹2,950

*Disclosure:* This signal has been modified since original publication.

SEBI RA: INH000026266 | Not investment advice
```

**Telegram uses MarkdownV2** — special characters escaped with `\`.

---

## 13. ACCESS CONTROL MATRIX

| Feature | Public | Free | Basic | Pro | Elite | Viewer Admin | Super Admin |
|---|---|---|---|---|---|---|---|
| Homepage / Blog / FAQ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Performance page (public stats) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Swing signals | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Intraday signals | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Stock Options signals | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Index Options signals | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Telegram paid channel | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| WhatsApp delivery | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| AI Research Reports | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Appointments booking | ❌ | ❌ | 1/mo | 1/mo | Unlimited | ❌ | ❌ |
| Dashboard signals page | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Admin signals page | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (view) | ✅ |
| Admin intelligence page | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Publish signals | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Approve/reject alerts | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Push to WhatsApp/Telegram | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Modify signals | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| ML postmortem management | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Black swan marking | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

**Middleware enforcement:** `src/middleware.ts` — protects /dashboard, /admin, /api routes.
**API enforcement:** Each handler calls `isAdmin()` or `isSuperAdmin()` from `src/lib/admin-check.ts`.
**DB enforcement:** RLS policies in Supabase.

---

## 14. PENDING MANUAL SETUP

Items that require manual action before the platform is fully operational:

1. ✅ **SQL Migration** — `supabase/migrations/001_signal_system.sql` made fully idempotent (wrapped all CREATE TYPEs, added ALTER TABLE guards, fixed NULL comparison, added DROP TRIGGER/POLICY IF EXISTS). Safe to re-run. Session 2: ran successfully.

2. ❌ **Fyers API setup** — Create app at myapi.fyers.in → get FYERS_APP_ID + FYERS_SECRET_KEY → add to Vercel env vars. Set redirect URI to `https://withsahib.com/api/fyers/callback`. Must complete OAuth handshake to populate fyers_tokens table.

3. ❌ **Telegram Bot** — Create via @BotFather → get TELEGRAM_BOT_TOKEN → add to Vercel env vars.

4. ❌ **Telegram Channels** — Create 2 channels (1 free, 1 paid) → get channel IDs → add TELEGRAM_FREE_CHANNEL_ID + TELEGRAM_PAID_CHANNEL_ID to Vercel env vars. Add bot as admin in both channels.

5. ❌ **AiSensy setup** — Create account at aisensy.com → get AISENSY_API_KEY → create campaign `withsahib_signal` → add keys to Vercel env vars.

6. ✅ **Admin role setup** — Sahib signed up. User ID: `53c2ff99-f6d3-45d4-9fe9-2a4fe3d313cd`. Email confirmed. `super_admin` row inserted into admin_roles.

7. **Supabase Edge Function** — Deploy Fyers price feed function:
   ```bash
   supabase functions deploy fyers-price-feed
   ```
   (Note: Edge function code not yet written — this feeds live prices into the live_prices table)

8. ✅ **Replace PLACEHOLDER env vars** — 18 Vercel env vars set (Session 2). Remaining PLACEHOLDERs: Fyers, Telegram, AiSensy, Razorpay.

9. ❌ **Razorpay** — Account pending approval. Once approved, replace PLACEHOLDER keys with real RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel env vars.

10. ❌ **Professional photo** — Upload real photo to About page at `/about`.

11. ❌ **LinkedIn profile** — Create at linkedin.com/in/sahibsinghhora → update href in footer.

12. ❌ **Twitter/X profile** — Create at x.com/sahibsinghhora → update href in footer.

13. **Market Holidays** — Insert NSE holidays for the year into market_holidays table.

14. **Bing Search Console** — Add NEXT_PUBLIC_BING_SITE_VERIFICATION env var with real code.

15. ✅ **handle_new_user() trigger** — Fixed to insert into `public.subscriptions` instead of non-existent `public.profiles`. Auth signup now works without "Database error saving new user".

---

## 15. CURRENT BUGS / KNOWN ISSUES

1. ✅ **SQL migration conflict** — `ERROR 42703: column "plan" does not exist` — FIXED in Session 2. Migration now fully idempotent with ALTER TABLE IF NOT EXISTS guards for all new columns.

2. **DNS propagation** — CNAME updated to `01a8d991bd3b8c7e.vercel-dns-017.com`. May take up to 48 hours to propagate fully. SSL certificate will auto-provision after DNS is confirmed.

3. **Social links placeholder** — LinkedIn (`linkedin.com/in/sahibsinghhora`) and Twitter (`x.com/sahibsinghhora`) links are `href="#"` in footer/about page — placeholder until profiles are created.

4. **Blog post 404s** — Blog posts at `/blog/[slug]` may return 404 if slug is not found in `src/lib/data/posts.ts`. Verify all slugs exist and match.

5. **VIX condition view** — In admin intelligence page, Condition View VIX stats use `Math.random()` as placeholder. Needs real data aggregation from signal_features table.

6. **market_breadth and pcr** — These feature fields in signal_features are populated as NULL (comment: "populated separately if available"). No feed for these yet.

7. **Fyers VWAP proxy** — In capture-features.ts, nifty_vs_20ema uses VWAP as proxy for 20 EMA. This is an approximation — not a true 20-day EMA calculation.

8. **Volume ratio approximation** — In capture-features.ts, average volume is approximated as `volume * 0.8` instead of using a real historical average.

9. ✅ **FIXED Session 3 — `/admin/signals` 404 in production** — Admin folder was missing from git, never committed. Deployed via `npx vercel --prod` with crons stripped temporarily. All three admin pages now live: /admin/signals, /admin/intelligence, /admin/settings.

10. **Dashboard greeting shows "Investor" not user name** — `/dashboard` shows hardcoded "Welcome back, Investor" instead of the user's actual name. Fix: fetch `subscriptions` or `auth.users` metadata and display real name.

11. **Email confirmation required on signup** — New users must confirm email before they can log in. For early testing, disable in Supabase Auth settings: Authentication → Settings → "Enable email confirmations" → toggle OFF.

---

## 16. FILE STRUCTURE

```
src/
├── app/
│   ├── layout.tsx                          — Root layout, fonts, metadata, structured data
│   ├── layout-public.tsx                   — Public layout wrapper
│   ├── page.tsx                            — Homepage
│   ├── loading.tsx                         — Global loading UI
│   ├── error.tsx                           — Global error boundary
│   ├── global-error.tsx                    — Global error fallback
│   ├── not-found.tsx                       — 404 page
│   ├── icon.tsx                            — /icon route (favicon generator)
│   ├── apple-icon.tsx                      — /apple-icon route
│   ├── opengraph-image.tsx                 — /opengraph-image route
│   ├── robots.ts                           — robots.txt generator
│   ├── sitemap.ts                          — sitemap.xml generator
│   ├── about/page.tsx                      — About page
│   ├── admin/
│   │   ├── layout.tsx                      — Admin layout (auth guard + sidebar)
│   │   ├── signals/page.tsx                — Signal management dashboard
│   │   └── intelligence/page.tsx           — Performance matrix + ML postmortems + reports
│   ├── api/
│   │   ├── admin/alerts/route.ts           — GET admin alerts
│   │   ├── ai/report/route.ts              — POST AI research report generation
│   │   ├── distribution/
│   │   │   ├── daily-recap/route.ts        — GET daily recap (CRON)
│   │   │   └── process-queue/route.ts      — GET process push queue (CRON)
│   │   ├── fyers/
│   │   │   ├── refresh-token/route.ts      — GET refresh Fyers token (CRON)
│   │   │   └── status/route.ts             — GET Fyers connection status
│   │   ├── intelligence/weekly-report/route.ts  — GET generate weekly report (CRON)
│   │   ├── market-data/
│   │   │   ├── route.ts                    — GET all live prices
│   │   │   └── prices/route.ts             — GET prices for specific symbols
│   │   ├── ml/
│   │   │   ├── generate-postmortem/route.ts — POST generate postmortem
│   │   │   ├── generate-predictions/route.ts — GET generate ML predictions (CRON)
│   │   │   ├── score/[alertId]/route.ts    — GET ML score for an alert
│   │   │   └── train/route.ts             — GET train ML model (CRON)
│   │   ├── performance/route.ts            — GET public performance data
│   │   ├── revalidate-market/route.ts      — GET ISR revalidation
│   │   ├── screener/run/route.ts           — GET run intraday screener (CRON)
│   │   ├── signals/
│   │   │   ├── route.ts                    — GET list / POST publish signal
│   │   │   ├── [id]/route.ts               — GET/PATCH/DELETE single signal
│   │   │   ├── [id]/push/route.ts          — POST push signal to channel
│   │   │   ├── [id]/cancel/route.ts        — POST cancel signal
│   │   │   ├── check-status/route.ts       — GET auto-check T1/T2/T3/SL (CRON)
│   │   │   └── expire-intraday/route.ts    — GET expire intraday (CRON)
│   │   ├── subscriptions/create/route.ts   — POST create Razorpay subscription
│   │   └── webhooks/razorpay/route.ts      — POST Razorpay webhook handler
│   ├── appointments/page.tsx               — Appointments booking (member)
│   ├── auth/
│   │   ├── callback/route.ts               — Supabase OAuth callback
│   │   ├── forgot-password/page.tsx        — Password reset
│   │   ├── login/page.tsx                  — Login
│   │   └── register/page.tsx               — Registration
│   ├── blog/
│   │   ├── page.tsx                        — Blog index
│   │   └── [slug]/page.tsx                 — Individual blog post
│   ├── brand/page.tsx                      — Brand guidelines
│   ├── contact/
│   │   ├── ContactClient.tsx               — Contact form client component
│   │   └── page.tsx                        — Contact page
│   ├── courses/page.tsx                    — Courses (member)
│   ├── dashboard/
│   │   ├── layout.tsx                      — Dashboard layout (sidebar + header)
│   │   ├── page.tsx                        — Dashboard home
│   │   └── signals/page.tsx                — Member signal feed
│   ├── faq/page.tsx                        — FAQ page
│   ├── performance/page.tsx                — Public performance tracker
│   ├── pricing/page.tsx                    — Pricing page
│   ├── reports/page.tsx                    — AI research reports (member)
│   ├── research/page.tsx                   — Research page
│   ├── services/
│   │   ├── page.tsx                        — Services overview
│   │   ├── index-options/page.tsx          — Index options service
│   │   ├── intraday/page.tsx               — Intraday service
│   │   ├── stock-options/page.tsx          — Stock options service
│   │   └── swing/page.tsx                  — Swing service
│   └── settings/page.tsx                   — Account settings
├── components/
│   ├── layout/
│   │   ├── Footer.tsx                      — Site footer (SEBI reg, links)
│   │   ├── Navbar.tsx                      — Navigation bar
│   │   └── ThemeProvider.tsx               — Theme context
│   └── ui/
│       ├── AnimatedLogo.tsx                — Animated 3-bar candle logo
│       ├── Logo.tsx                        — Static logo
│       ├── SebiDisclaimer.tsx              — SEBI disclosure component (3 variants)
│       └── WhatsAppButton.tsx              — Fixed WhatsApp CTA button
├── lib/
│   ├── admin-check.ts                      — isAdmin(), isSuperAdmin(), getAdminRole()
│   ├── capture-features.ts                 — captureSignalFeatures() — auto ML feature capture
│   ├── fyers-client.ts                     — Fyers API client + live price fetching
│   ├── market-hours.ts                     — isMarketOpen(), isPreMarketWindow(), getTimeBucket()
│   ├── signal-utils.ts                     — calculateRR(), formatSignalMessage(), validateModification()
│   ├── ai/reports.ts                       — Anthropic Claude AI report generation
│   ├── data/posts.ts                       — Blog post data store
│   ├── ml/
│   │   ├── decision-tree.ts                — Decision tree training + prediction
│   │   ├── feature-encoder.ts              — Raw features → numeric vector
│   │   ├── model-store.ts                  — save/load/train models in Supabase
│   │   └── random-forest.ts                — Random forest ensemble
│   ├── razorpay/client.ts                  — Razorpay client setup
│   ├── supabase/
│   │   ├── client.ts                       — Browser Supabase client
│   │   └── server.ts                       — Server + service role Supabase clients
│   └── utils/marketData.ts                 — Market data utility functions
├── middleware.ts                           — Auth middleware (route protection)
└── types/index.ts                          — Shared TypeScript types
```

---

## 17. SEBI COMPLIANCE CHECKLIST

| Requirement | Status | Implementation |
|---|---|---|
| RA registration number on every page | ✅ | INH000026266 in Footer, SebiDisclaimer component |
| Risk disclaimer | ✅ | SebiDisclaimer component (3 variants: short, signal, full) |
| Rationale mandatory for all signals | ✅ | Enforced in POST /api/signals — required field validation |
| Modification disclosure | ✅ | signal_modifications table + is_modified flag + subscriber notification |
| Audit log | ✅ | signal_audit_log table — every action logged |
| Analyst holding disclosure | ✅ | analyst_holding boolean field in signals table |
| Original values immutable | ✅ | original_* columns never updated after insert |
| Grievance page | ✅ | /grievance page exists |
| SEBI disclosure page | ✅ | /sebi-disclosure page exists |
| SEBI verification link | ✅ | https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14 |
| No guaranteed returns language | ✅ | FAQ and disclaimer text explicitly states no guarantees |
| Past performance disclaimer | ✅ | Performance page includes standard disclaimer |
| Black swan exclusion | ✅ | is_black_swan field excludes anomalous events from stats |

---

## 18. THIRD-PARTY INTEGRATIONS

| Service | Purpose | Status | Account |
|---|---|---|---|
| Supabase | DB + Auth + Realtime | Active | sahib13singh13@gmail.com |
| Vercel | Hosting + Crons + Analytics | Active | sahibs-projects-f0c8b826 |
| Fyers API v3 | Market data (live prices) | Pending setup | myapi.fyers.in |
| AiSensy | WhatsApp message delivery | Pending setup | TBD |
| Telegram | Bot + paid channel + free channel | Pending setup | @withsahibbot |
| Razorpay | Payment subscriptions | Pending approval | sahib13singh13@gmail.com |
| cron-job.org | Market data ISR revalidation | Active | sahib13singh13@gmail.com |
| Google Search Console | SEO + indexing | Active | sitemap submitted |
| Spaceship | Domain registrar | Active | withsahib.com |
| Anthropic Claude API | AI research reports | Active (SDK installed) | Via @anthropic-ai/sdk |
| Vercel Analytics | Page view analytics | Active | Included with Vercel |
| Vercel Speed Insights | Core Web Vitals tracking | Active | Included with Vercel |
| Resend | Transactional email | Installed (^3.2.0) | Pending setup |
| Capacitor | iOS/Android app wrapper | Installed (devDep) | For future mobile app |

---

## 19. SPOTMYCHART CONTEXT

**SpotMyChart.com** — separate platform, different codebase, same SEBI RA licence.

- **Purpose:** SEBI RA signals for NSE stocks — pattern-based screener and backtest platform
- **Entity:** Altitans Intelligence Private Limited (same CIN: U62011MP2026PTC083080)
- **SEBI RA:** Same — Sahib Singh Hora INH000026266
- **Tech stack:** Next.js 14, Supabase, TypeScript
- **Backtest pipeline:** 13,586 clean signals, 474 NSE stocks, 21 patterns analyzed
- **Pattern database:** 10 patterns live, 20,572 signals
- **Relationship to withsahib.com:** Completely separate domain and codebase. Same SEBI RA licence covers both platforms. withsahib.com is the advisory/subscription platform; SpotMyChart is the pattern screener/research tool.

---

## 20. NOTES FOR NEXT AI SESSION

When starting a new session on this project, read this file first. It is the complete project context.

### CURRENT STATE AS OF 22 APR 2026 (Session 3)

**Platform is LIVE** at withsahib.com — DNS propagated, SSL active, Vercel deployed.

**Sahib's account:**
- Email: sahib13singh13@gmail.com
- User ID: `53c2ff99-f6d3-45d4-9fe9-2a4fe3d313cd`
- Role: `super_admin` (in admin_roles table)
- Email confirmed: YES

**External dashboards:**
- Supabase: https://supabase.com/dashboard/project/[project-ref] (check .env.local for project ref from NEXT_PUBLIC_SUPABASE_URL)
- Vercel: https://vercel.com/sahibs-projects (or search "withsahib" in Vercel dashboard)

**What works:**
- Auth signup/login (handle_new_user trigger fixed → inserts into subscriptions)
- SQL migration fully idempotent — safe to re-run
- Admin pages exist in code and build: /admin/signals, /admin/intelligence
- 18 Vercel env vars set (CRON_SECRET, Supabase, Anthropic, Resend, etc.)
- npm run build passes cleanly — no TypeScript errors
- Admin pages restored and live: /admin/signals, /admin/intelligence, /admin/settings
- Admin folder was missing from git (never committed) — fixed by deploying via npx vercel --prod
- Vercel GitHub webhook missed commit 109a85aa — workaround: strip crons from vercel.json for CLI deploy

**FIRST TASK for next session:** Fix dashboard greeting — shows 'Welcome back, Investor' instead of real user name (Bug #10 in Section 15). Fetch user name from auth.users metadata or subscriptions table and display it.

**Second task:** Set up Fyers API — create app at myapi.fyers.in, get FYERS_APP_ID + FYERS_SECRET_KEY, add to Vercel env vars, complete OAuth handshake. See Section 14 item 2.

**Key facts:**
1. Platform: withsahib.com — SEBI Registered Research Analyst advisory platform
2. Stack: Next.js 14 (App Router) + Supabase + Vercel + Fyers API v3 + TypeScript ML
3. Design tokens: DO NOT CHANGE — locked in Section 4 (colors, fonts, logo)
4. Current status: Auth working, signal system built, admin pages built. Fyers/Telegram/AiSensy/Razorpay still need setup.
5. SEBI compliance is non-negotiable — every signal needs rationale + disclaimer
6. Sahib is non-technical — explain clearly, give complete commands to copy-paste
7. All monetary values in Indian Rupees (INR). Use en-IN locale formatting.
8. Market hours: 9:00 AM – 3:30 PM IST, Mon–Fri, excluding NSE holidays
9. IST = UTC + 5:30 — all UTC times in vercel.json need +5:30 to convert to IST

**Architecture decisions made:**
- ML is 100% TypeScript (no Python) — by design, to run on Vercel serverless without Python runtime
- Signal screener generates signal_alerts (queue) — admin reviews and approves before publishing to signals table
- No direct screener-to-signal pipeline — everything requires human approval
- Performance metrics exclude black swan signals (is_black_swan = true)
- Win rate denominator excludes expired signals (only counts actionable outcomes)

**Do NOT:**
- Change the color palette, fonts, or logo
- Remove SEBI disclaimer from any signal-related component
- Allow entry range to be modified after publish
- Skip rationale field when creating signals
- Push signals without admin approval (screener → alert_queue → admin approve → publish)

---

## 21. SIGNAL SYSTEM BUILD REFERENCE

The complete signal management system was built in Session 1 (21 Apr 2026). It includes:

**Critical files that MUST exist (all confirmed present):**
- `src/app/admin/signals/page.tsx` — Alert queue, open signals, history, manual create tabs
- `src/app/admin/intelligence/page.tsx` — Performance matrix, postmortems, weekly reports
- `src/app/admin/layout.tsx` — Admin sidebar + auth guard (redirects non-admins)
- `src/middleware.ts` — Route protection for /admin, /dashboard, /api/admin/, /api/signals, /api/ml/, /api/fyers/
- `src/lib/signal-utils.ts` — validateModification() enforces SEBI immutability rules
- `src/lib/ml/decision-tree.ts` — Full CART decision tree (Gini impurity, trainTree, predictProba)
- `src/lib/ml/random-forest.ts` — 50-tree ensemble with bootstrap sampling
- `src/lib/ml/feature-extractor.ts` — 14-feature numeric vector from signal data
- `src/lib/ml/model-store.ts` — Load/save model from Supabase ml_models table, confidence tiers
- `supabase/migrations/001_signal_system.sql` — Complete schema (17 tables, RLS, triggers, functions)

**API routes (all under src/app/api/):**
- `/api/screener/[segment]/route.ts` — Cron: scans Fyers data, generates signal_alerts
- `/api/signals/route.ts` — GET list (member), POST create (admin)
- `/api/signals/[id]/route.ts` — GET detail, PATCH modify (SEBI-compliant), DELETE cancel
- `/api/signals/check-status/route.ts` — Cron: check open signals against live prices
- `/api/signals/expire-intraday/route.ts` — Cron: expire stale intraday signals at 3:20 PM IST
- `/api/admin/alerts/route.ts` — GET alert queue for admin dashboard
- `/api/admin/alerts/[id]/approve/route.ts` — POST approve alert → publish signal
- `/api/admin/alerts/[id]/reject/route.ts` — POST reject alert
- `/api/ml/train/route.ts` — GET train model on historical data (cron weekly)
- `/api/ml/generate-predictions/route.ts` — GET generate predictions for all open signals (cron)
- `/api/ml/score/[alertId]/route.ts` — GET ML score for a specific alert
- `/api/intelligence/weekly-report/route.ts` — GET generate weekly AI report (cron)
- `/api/distribution/process-queue/route.ts` — GET process signal_push_queue (cron every 2 min)
- `/api/distribution/daily-recap/route.ts` — GET send daily recap to channels (cron)
- `/api/fyers/refresh-token/route.ts` — GET refresh Fyers OAuth token (cron 8 AM IST)
- `/api/fyers/status/route.ts` — GET Fyers connection status for admin
- `/api/performance/route.ts` — GET public performance data (used by /performance page)

**Vercel cron schedule (vercel.json):**
- 8:55 AM IST: fyers/refresh-token
- 9:00 AM IST: screener (intraday)
- 9:15 AM IST: screener (stock_options, index_options)
- 10:00 AM IST: screener (swing)
- Every 2 min (9–4 IST): signals/check-status
- 3:20 PM IST: signals/expire-intraday
- Every 2 min: distribution/process-queue
- 4:00 PM IST: distribution/daily-recap
- 4:30 PM IST: intelligence/weekly-report
- Sunday midnight IST: ml/train
- Monday 7 AM IST: ml/generate-predictions
