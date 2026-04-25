# withSahib — Complete Project Documentation
*Last updated: 2026-04-25 (Session 7 — Light theme v3, design system v2, repositioning, GitHub Actions fixed)*

---

## 1. IDENTITY & LEGAL

- **Platform name:** withSahib (withsahib.com)
- **Company:** Altitans Intelligence Private Limited
- **CIN:** U62011MP2026PTC083080
- **SEBI RA:** Sahib Singh Hora — INH000026266
- **Valid:** Apr 20, 2026 – Apr 19, 2031
- **Email:** sahib13singh13@gmail.com
- **WhatsApp / Phone:** +91 9981248888
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

**Tables (18 total):**
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
- **SPF:** `v=spf1 include:_spf.google.com ~all` ✅
- **MX:** SMTP.GOOGLE.COM priority 1 ✅
- **CNAME Google Workspace:** ywyhg3t7m → gv-b2kgfyfgr3rmjg.dv.googlehosted.com ✅

### Cron Jobs (external — cron-job.org)

- **Account:** sahib13singh13@gmail.com
- **Job:** withSahib Market Data Refresh
- **Schedule:** Daily 10:30 UTC = 4:00 PM IST (weekdays)
- **URL:** https://www.withsahib.com/api/revalidate-market?secret=withsahib2026market

### Vercel Crons (from vercel.json)

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

## 4. DESIGN SYSTEM (v2 — CSS Variables, Light Default)

### Theme

- **Default theme:** Light — forced on every page load via blocking script in `layout.tsx`
- **Dark mode:** Available via toggle button in Navbar — applies for session only, resets to light on next page load
- **ThemeProvider:** `src/components/layout/ThemeProvider.tsx` — initial state always `'light'`, `useEffect` no longer reads localStorage
- **Blocking script (in `<head>`):**
  ```js
  (function(){
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  })()
  ```

### CSS Variables — Light Mode

| Variable | Value | Usage |
|---|---|---|
| --bg | #F5F4F0 | Page background (warm off-white) |
| --surface | #FFFFFF | Card / panel background |
| --surface2 | #F0EEE8 | Secondary surface |
| --border | rgba(13,18,36,0.08) | Default border |
| --border2 | rgba(13,18,36,0.12) | Stronger border / toast |
| --emerald | #009966 | Primary CTA, active states, wins |
| --orange | #EA6C00 | Accent, secondary CTA |
| --navy | #0B1437 | Dark text, headings |
| --text | #0B1437 | Primary text |
| --text2 | #4A5568 | Secondary text |
| --text3 | #718096 | Muted text, labels |
| --gold | #D4A843 | SEBI reg numbers, warnings |
| Red / Loss | #EF4444 | SL hit, errors |
| Blue | #3B82F6 | Index options segment |
| Purple | #8B5CF6 | Swing segment |
| WhatsApp | #25D366 | WhatsApp button |

### CSS Variables — Dark Mode

| Variable | Value | Usage |
|---|---|---|
| --bg | #060A07 | Page background |
| --surface | #0D1410 | Card / panel background |
| --emerald | #00D97E | Primary CTA (brighter for dark contrast) |
| --orange | #F97316 | Accent |
| --text | #E8EDF5 | Primary text |
| --text2 | #8FA8C0 | Secondary text |
| --text3 | #6B8AAA | Muted text |

### Typography

| Font | Variable | Usage | Weights |
|---|---|---|---|
| Sora (Google Fonts) | --font-sora | Primary headings + all UI | 300–800 |
| Lora (Google Fonts) | --font-lora | Hero italic serif accents | 600, 700 |
| Outfit (Google Fonts) | --font-outfit | Body, labels, data | 200–800 |
| JetBrains Mono (Google Fonts) | --font-mono | SEBI reg numbers, monospace | 400, 500 |
| DM Serif Display (Google Fonts) | --font-dm-serif | Accent display headings | 400 |

### Logo

- **Shape:** 3 ascending candle bars (fading opacity left to right) + green pulse dot on top-right of tallest bar
- **Wordmark:** `with` (Outfit 300) + `Sahib` (#009966 light / #00D97E dark, Outfit 500) + `.com` (Outfit 300)
- **Animation:** Bars appear 1-by-1 with stagger, then dot pops in and pulses continuously
- **Files:** `src/components/ui/Logo.tsx` (static), `src/components/ui/AnimatedLogo.tsx` (animated)

### Segment Colors

| Segment | Color | Hex |
|---|---|---|
| Intraday | Emerald | #009966 (light) / #00D97E (dark) |
| Stock Options | Gold | #D4A843 |
| Index Options | Blue | #3B82F6 |
| Swing | Purple | #8B5CF6 |

---

## 5. ENVIRONMENT VARIABLES

All variables set in Vercel project settings. Keys only (no values committed):

| Variable | Notes |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key (public) |
| SUPABASE_SERVICE_ROLE_KEY | Server-only, never expose |
| NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION | Google Search Console code |
| NEXT_PUBLIC_BING_SITE_VERIFICATION | Bing Webmaster Tools code |
| NEXT_PUBLIC_RAZORPAY_KEY_ID | Razorpay publishable key ✅ live |
| RAZORPAY_KEY_SECRET | Razorpay secret key ✅ live |
| RAZORPAY_WEBHOOK_SECRET | Razorpay webhook secret ✅ live |
| CRON_SECRET | `withsahib2026market` |
| FYERS_APP_ID | `4CN81VDZUO-100` ✅ connected |
| FYERS_SECRET_KEY | Fyers API v3 secret ✅ |
| FYERS_MPIN | Fyers MPIN — needed for token refresh cron ✅ |
| FYERS_REDIRECT_URI | `https://withsahib.com/api/fyers/callback` ✅ |
| AISENSY_API_KEY | AiSensy WhatsApp key — ❌ not set up yet |
| AISENSY_CAMPAIGN_NAME | `withsahib_signal` |
| TELEGRAM_BOT_TOKEN | ❌ not set up yet |
| TELEGRAM_PAID_CHANNEL_ID | ❌ not set up yet |
| TELEGRAM_FREE_CHANNEL_ID | ❌ not set up yet |
| SAHIB_TELEGRAM_ID | ❌ not set up yet |
| RESEND_API_KEY | Domain verified ✅, full setup pending |
| NEXT_PUBLIC_APP_URL | `https://www.withsahib.com` |

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
| `/` | Public | Homepage — hero, services overview, methodology, social proof |
| `/about` | Public | Analyst profile — Sahib Singh Hora, bio, credentials, photos |
| `/pricing` | Public | Subscription plans comparison |
| `/performance` | Public | Public performance disclosure (aggregated, compliant language) |
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
| `/auth/login` | Public (redirect if logged in) | Login — two-column redesign, animated right panel |
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

**RLS:** None (public read).

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

**RLS:** users_own_contacts.

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
| recipient_id | TEXT | NOT NULL |
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
| segment | TEXT | NULL = overall |
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

**RLS:** public_read_performance — everyone can SELECT.

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
| atr_value | DECIMAL(12,2) | |
| atr_pct | DECIMAL(8,4) | ATR as % of price |
| time_bucket | TEXT | 09:15-10:00 / 10:00-11:30 / 11:30-13:00 / 13:00-15:30 |
| day_of_week | TEXT | Monday–Friday |
| days_to_expiry | INTEGER | Days until next Thursday |
| iv_percentile | DECIMAL(6,2) | |
| pcr | DECIMAL(6,4) | Put-Call Ratio |
| pattern_type | TEXT | |
| signal_rr_promised | DECIMAL(6,2) | |
| entry_vs_52wh | DECIMAL(8,4) | % from 52-week high |
| entry_vs_52wl | DECIMAL(8,4) | % from 52-week low |
| symbol_historical_winrate | DECIMAL(5,2) | |
| similar_setup_count | INTEGER | |
| last_5_signals_result | TEXT | e.g. "WWLWW" |
| outcome | TEXT | win / loss / neutral |
| failure_type | failure_type | Populated after loss |
| is_black_swan | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | |

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
| feature_importances | JSONB | |
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

- **calculate_rr(entry_low, entry_high, stop_loss, target_1)** → DECIMAL — R:R using mid-entry. IMMUTABLE.
- **recalculate_performance(month, year, segment)** → VOID — Recomputes performance_summary row. Called by trigger.
- **trigger_performance_recalc()** → TRIGGER — Fires AFTER UPDATE on signals when status changes.
- **auto_generate_postmortem()** → TRIGGER — Fires AFTER UPDATE on signals when status becomes 'sl_hit'.

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

### Segments

#### Intraday
- Valid publish window: 9:15 AM – 1:00 PM IST
- Auto-expire: 3:14 PM IST (via Vercel Cron)
- SL logic: Hard SL
- Minimum R:R: 2.0x
- Screener triggers on: VWAP crossover + volumeRatio > 1.5 + change_pct > 0.3%

#### Stock Options
- Minimum R:R: 2.5x
- SL logic: Hard or trailing
- Validity: Admin sets validity_date

#### Index Options (Nifty / BankNifty)
- Minimum R:R: 1.5x
- Strike field: e.g. "24000CE", "47500PE"

#### Swing
- Minimum R:R: 3.0x
- Validity: Multi-day, admin sets validity_date
- Available to: Basic, Pro, Elite plans

### Modification Rules (ENFORCED in validateModification() — signal-utils.ts)

- **Entry range:** LOCKED after publish — cannot be changed
- **Stop loss:** Can ONLY be tightened (moved closer to entry)
- **Targets:** Can ONLY be raised
- **Any change:** Triggers disclosure notification; sets is_modified=true; logs to signal_modifications table

---

## 11. ML SYSTEM

### Architecture

- **Implementation:** Pure TypeScript — no Python, no external ML library
- **Algorithm:** Random Forest (50 Decision Trees)
- **Tree parameters:** max_depth = 8, min_samples = 5
- **Split criterion:** Gini impurity
- **Bootstrap sampling:** With replacement
- **Training split:** 80% train / 20% test
- **Model storage:** Serialized as JSONB in `ml_models.model_params`
- **Training schedule:** Nightly Vercel Cron at 11:00 PM IST (Mon–Fri)
- **Status:** LEARNING — no live signals yet; model trains when 20+ closed signals exist

### Model Hierarchy (getModelForSymbol)

1. Try symbol-specific model (`symbol = 'RELIANCE', segment = 'intraday'`)
2. Fall back to global model (`symbol = NULL, segment = NULL`)
3. Return null if no model available

### 14 Numeric Features in ML Vector

| # | Feature | Source |
|---|---|---|
| 1 | vix | NSE:INDIA VIX-INDEX live_prices |
| 2 | nifty_trend | Derived from NIFTY50 change_pct |
| 3 | nifty_vs_20ema | NIFTY50 ltp vs vwap (proxy) |
| 4 | sector_performance | NIFTY50 change_pct |
| 5 | volume_ratio | signal stock volume / avg volume |
| 6 | vwap_distance | (ltp - vwap) / vwap * 100 |
| 7 | atr_pct | (high - low) / ltp * 100 |
| 8 | time_bucket | IST time at signal creation (0–3) |
| 9 | day_of_week | Mon(0) to Fri(4) |
| 10 | days_to_expiry | Days until next Thursday |
| 11 | iv_percentile | Implied volatility %ile |
| 12 | signal_rr_promised | R:R at publish |
| 13 | symbol_historical_winrate | Historical win % for scrip |
| 14 | similar_setup_count | # similar prior setups |

### Confidence Tiers

| Tier | Condition |
|---|---|
| LEARNING | samples < 5 |
| LOW | samples 5–19 |
| MEDIUM | samples 20–49 AND accuracy > 55% |
| HIGH | samples ≥ 50 AND accuracy > 65% |

---

## 12. DISTRIBUTION

### WhatsApp (AiSensy) — ❌ NOT YET SET UP

- Endpoint: https://backend.aisensy.com/campaign/t1/api
- Campaign name: `withsahib_signal`
- Eligible: Elite plan + whatsapp_opted_in = true
- Rate limit: 50 messages/min → 1.2s delay between sends
- Queue: All messages via signal_push_queue; processed every 2 min

### Telegram — ❌ NOT YET SET UP

- Free channel: Daily recap at 4:30 PM IST (outcome only)
- Paid channel: Live signals in real-time (Pro + Elite)
- Bot: @withsahibbot
- t.me/withsahib — CTA added across site; channel not yet created

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

**Telegram uses MarkdownV2** — special characters escaped with `\`.

---

## 13. ACCESS CONTROL MATRIX

| Feature | Public | Free | Basic | Pro | Elite | Viewer Admin | Super Admin |
|---|---|---|---|---|---|---|---|
| Homepage / Blog / FAQ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Performance page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
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

**Middleware enforcement:** `src/middleware.ts`
**API enforcement:** `src/lib/admin-check.ts` — isAdmin(), isSuperAdmin()
**DB enforcement:** Supabase RLS policies

---

## 14. FILE STRUCTURE

```
src/
├── app/
│   ├── layout.tsx                          — Root layout, fonts, metadata, blocking theme script
│   ├── page.tsx                            — Homepage (hero, methodology, services)
│   ├── loading.tsx / error.tsx / not-found.tsx
│   ├── icon.tsx / apple-icon.tsx / opengraph-image.tsx
│   ├── robots.ts / sitemap.ts
│   ├── about/page.tsx                      — About page (sahib-primary.jpg, sahib-secondary.jpg)
│   ├── admin/
│   │   ├── layout.tsx                      — Admin sidebar + auth guard
│   │   ├── signals/page.tsx                — Signal management dashboard
│   │   └── intelligence/page.tsx           — Performance matrix + ML + reports
│   ├── api/
│   │   ├── admin/alerts/route.ts
│   │   ├── ai/report/route.ts
│   │   ├── distribution/daily-recap/route.ts
│   │   ├── distribution/process-queue/route.ts
│   │   ├── fyers/refresh-token/route.ts
│   │   ├── fyers/status/route.ts
│   │   ├── intelligence/weekly-report/route.ts
│   │   ├── market-data/route.ts
│   │   ├── market-data/prices/route.ts
│   │   ├── ml/generate-postmortem/route.ts
│   │   ├── ml/generate-predictions/route.ts
│   │   ├── ml/score/[alertId]/route.ts
│   │   ├── ml/train/route.ts
│   │   ├── performance/route.ts
│   │   ├── revalidate-market/route.ts
│   │   ├── screener/run/route.ts           — force-dynamic, VWAP screener
│   │   ├── signals/route.ts
│   │   ├── signals/[id]/route.ts
│   │   ├── signals/[id]/push/route.ts
│   │   ├── signals/[id]/cancel/route.ts
│   │   ├── signals/check-status/route.ts
│   │   ├── signals/expire-intraday/route.ts
│   │   ├── subscriptions/create/route.ts
│   │   └── webhooks/razorpay/route.ts
│   ├── auth/callback/route.ts
│   ├── auth/login/page.tsx                 — Two-column redesign, animated right panel
│   ├── auth/register/page.tsx
│   ├── auth/forgot-password/page.tsx
│   ├── blog/page.tsx / blog/[slug]/page.tsx
│   ├── brand/page.tsx
│   ├── contact/page.tsx
│   ├── courses/page.tsx
│   ├── dashboard/layout.tsx / dashboard/page.tsx
│   ├── dashboard/signals/page.tsx
│   ├── faq/page.tsx
│   ├── performance/page.tsx
│   ├── pricing/page.tsx
│   ├── reports/page.tsx
│   ├── research/page.tsx
│   ├── services/page.tsx
│   ├── services/intraday/page.tsx
│   ├── services/stock-options/page.tsx
│   ├── services/index-options/page.tsx
│   ├── services/swing/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── layout/
│   │   ├── Footer.tsx                      — SEBI reg, WhatsApp 9981248888, Telegram t.me/withsahib
│   │   ├── Navbar.tsx                      — Dark toggle, SEBI shield badge
│   │   └── ThemeProvider.tsx               — Always starts 'light', no localStorage read
│   └── ui/
│       ├── AnimatedLogo.tsx
│       ├── Logo.tsx
│       ├── SebiDisclaimer.tsx              — 3 variants: short, signal, full
│       └── WhatsAppButton.tsx
├── lib/
│   ├── admin-check.ts
│   ├── capture-features.ts
│   ├── fyers-client.ts
│   ├── market-hours.ts
│   ├── signal-utils.ts
│   ├── ai/reports.ts
│   ├── data/posts.ts
│   ├── ml/decision-tree.ts
│   ├── ml/feature-encoder.ts
│   ├── ml/model-store.ts
│   ├── ml/random-forest.ts
│   ├── razorpay/client.ts
│   ├── supabase/client.ts
│   ├── supabase/server.ts
│   └── utils/marketData.ts
├── middleware.ts                           — Auth guard; /auth/* and /api/performance are public
└── types/index.ts
public/
├── images/
│   ├── sahib-primary.jpg                  — About page hero photo
│   └── sahib-secondary.jpg               — About page secondary photo
└── withsahib2026indexnow.txt              — IndexNow key file
```

---

## 15. SEBI COMPLIANCE CHECKLIST

| Requirement | Status | Implementation |
|---|---|---|
| RA registration number on every page | ✅ | INH000026266 in Footer, SebiDisclaimer |
| Risk disclaimer | ✅ | SebiDisclaimer component (3 variants) |
| Rationale mandatory for all signals | ✅ | Enforced in POST /api/signals |
| Modification disclosure | ✅ | signal_modifications table + subscriber notification |
| Audit log | ✅ | signal_audit_log table |
| Analyst holding disclosure | ✅ | analyst_holding boolean in signals table |
| Original values immutable | ✅ | original_* columns never updated after insert |
| Grievance page | ✅ | /grievance exists |
| SEBI disclosure page | ✅ | /sebi-disclosure exists |
| No guaranteed returns language | ✅ | All copy audited — no "guaranteed", "assured", "best" |
| Past performance disclaimer | ✅ | Performance page — compliant "Performance Disclosure" framing |
| Black swan exclusion | ✅ | is_black_swan excludes anomalous events from stats |

---

## 16. THIRD-PARTY INTEGRATIONS

| Service | Purpose | Status | Notes |
|---|---|---|---|
| Supabase | DB + Auth + Realtime | ✅ Active | sahib13singh13@gmail.com |
| Vercel | Hosting + Crons + Analytics | ✅ Active | sahibs-projects-f0c8b826 |
| Fyers API v3 | Market data (live prices) | ✅ Connected | Token refreshes at 8 AM IST; live_prices table still empty — Edge Function not deployed |
| Razorpay | Payment subscriptions | ✅ Connected | Live keys set; webhook handler active |
| Resend | Transactional email | ⚠️ Partial | Domain verified, DNS propagated; templates not built |
| Brevo | Email marketing / newsletters | ⚠️ Partial | Account created, domain authenticated; first template not built |
| AiSensy | WhatsApp delivery | ❌ Not set up | Account needed, API key needed |
| Telegram | Bot + channels | ❌ Not set up | @BotFather → bot + 2 channels + 4 env vars |
| cron-job.org | Market data ISR revalidation | ✅ Active | Daily 4 PM IST |
| Google Search Console | SEO + indexing | ✅ Active | Sitemap submitted |
| Bing Webmaster Tools | SEO indexing | ✅ Active | 21 URLs crawled, 0 errors |
| Microsoft Clarity | Analytics heatmaps | ✅ Active | Tag wg1eq65ef5, IP blocked |
| Spaceship | Domain registrar | ✅ Active | withsahib.com |
| Anthropic Claude API | AI research reports | ✅ Active | Via @anthropic-ai/sdk |
| Vercel Analytics | Page views | ✅ Active | |
| Vercel Speed Insights | Core Web Vitals | ✅ Active | |
| Google Workspace | Professional email | ⚠️ Activating | MX verified; DKIM not yet set up |
| Capacitor | iOS/Android app wrapper | Installed | For future mobile app |

---

## 17. SPOTMYCHART CONTEXT

**SpotMyChart.com** — separate platform, different codebase, same SEBI RA licence.

- **Purpose:** Pattern-based screener and backtest platform for NSE stocks
- **Entity:** Altitans Intelligence Private Limited (same CIN: U62011MP2026PTC083080)
- **SEBI RA:** Same — Sahib Singh Hora INH000026266
- **Tech stack:** Next.js 14, Supabase, TypeScript
- **Backtest pipeline:** 13,586 clean signals, 474 NSE stocks, 21 patterns analyzed
- **Pattern database:** 10 patterns live, 20,572 signals
- **Relationship:** Completely separate domain and codebase. withsahib.com = advisory/subscription platform; SpotMyChart = pattern screener/research tool.

---

## 18. CURRENT STATE (as of 25 Apr 2026 — Session 7)

**Platform is LIVE** at withsahib.com — DNS propagated, SSL active, all pages deployed.

### Admin accounts

| Email | Role | Password |
|---|---|---|
| sahib13singh13@gmail.com | super_admin | Sahib@2026 |
| akgupta7501@gmail.com | super_admin | Temp@2026 |

**Sahib's user ID:** `53c2ff99-f6d3-45d4-9fe9-2a4fe3d313cd`

### External dashboards

- Supabase: https://supabase.com/dashboard/project/trtoxawkeququfurddwr
- Vercel: https://vercel.com/sahibs-projects (search "withsahib")

### Key technical facts

| Key | Value |
|---|---|
| FYERS_APP_ID | `4CN81VDZUO-100` |
| FYERS_REDIRECT_URI | `https://withsahib.com/api/fyers/callback` |
| Fyers endpoint | `api-t1.fyers.in` (NOT api-t2) |
| appIdHash formula | `SHA256(appId + ':' + secretKey)` in hex |
| Microsoft Clarity tag | `wg1eq65ef5` |
| IndexNow key | `withsahib2026indexnow` |

### What's working

- Fyers API connected ✅ — auto-refresh cron at 8 AM IST
- Razorpay live ✅
- GitHub Actions build passing ✅ (build #23+)
- All admin pages live ✅ — /admin/signals, /admin/intelligence, /admin/settings
- Passkey (Touch ID) on Safari ✅
- Social links live ✅ — LinkedIn, X, Instagram, Facebook
- Dashboard greeting shows real user name ✅
- Admin/user toggle working ✅
- SEBI shield badge in Navbar ✅
- Photos live ✅ — sahib-primary.jpg, sahib-secondary.jpg
- Light theme default ✅ — forces light on every page load
- Sora + Lora fonts ✅
- Mobile responsive ✅ — hero, grids, pricing, login
- Methodology section ✅ — 3 pillars on homepage
- Performance Disclosure section ✅ — replaces "track record" framing
- Login page redesign ✅ — two-column, animated right panel
- WhatsApp 9981248888 ✅ — updated everywhere
- Telegram CTA t.me/withsahib ✅ — added across site

### Current architecture — signal flow

- `fyers-client.ts` reads from `live_prices` Supabase table (NOT directly from Fyers)
- `live_prices` table is **EMPTY** — Supabase Edge Function to feed it is NOT deployed
- Screener scans only 15 stocks (`INTRADAY_SYMBOLS`) — only intraday + basic swing logic
- Stock Options and Index Options screeners NOT built
- Swing screener needs full rewrite for 1500+ stock universe

### Lighthouse scores (Apr 23, 2026)

- **Mobile:** Performance 72, Accessibility 93, Best Practices 100, SEO 92
- **Desktop:** Performance 95–98, Accessibility 93, Best Practices 92, SEO 92

---

## 19. PENDING WORK

### HIGH PRIORITY

| Task | Status | Notes |
|---|---|---|
| Fyers → live_prices feed | Not deployed | Supabase Edge Function code written, not deployed. Blocks screener, signal tracking, ML |
| Swing screener (1500+ stocks) | Not built | Needs Fyers OHLCV feed first + Sahib's pattern rules |
| Options strategy design | Not started | Nifty/BankNifty screener architecture not coded |
| Signal tracking (check-status cron) | Blocked | Reads live_prices which is empty |

### MEDIUM PRIORITY

| Task | Status | Notes |
|---|---|---|
| Telegram setup | Not started | @BotFather → bot + 2 channels + 4 Vercel env vars |
| AiSensy setup | Not started | Account needed; AISENSY_API_KEY to Vercel |
| WhatsApp Quick Replies | Not started | /plans, /sebi, /track, /start keyword auto-replies |
| First Brevo newsletter template | Not started | Account live, template not built |
| DKIM for Google Workspace email | Not started | Google Workspace Admin → Gmail → Authenticate email → TXT record in Spaceship |
| DMARC record | Not started | Spaceship: Host `_dmarc`, TXT: `v=DMARC1; p=none; rua=mailto:sahib13singh13@gmail.com` |
| NSE Market Holidays 2026 | Not done | Insert into market_holidays table in Supabase |
| Product demo / GIF recording | Not started | Dashboard screen recording for landing page |

### LOW PRIORITY

| Task | Status | Notes |
|---|---|---|
| Wikipedia/Wikidata entry | Not started | Needs external citations first |
| ML model training | Blocked | Needs 20+ closed signals; currently zero |
| VPS vs Vercel Pro decision | Pending | Evaluate when 24/7 live data feed needed |
| Social posting strategy | Not started | X/Instagram/Facebook accounts exist, no calendar |

### Known bugs / approximations

- **live_prices is empty** — all real-time features (screener, check-status, ML) non-functional until Edge Function deployed
- **nifty_vs_20ema uses VWAP as proxy** — not a true 20-day EMA
- **volume ratio approximation** — uses `volume * 0.8` instead of real historical average
- **Admin intelligence VIX stats** — uses `Math.random()` placeholder instead of real signal_features aggregation
- **market_breadth and pcr** — always NULL in signal_features; no feed for these

---

## 20. COMMITTED WORK LOG

### Sessions 1–4 (Foundation — Apr 21–22, 2026)
- ✅ Complete signal system — 18 Supabase tables, RLS policies, triggers, DB functions
- ✅ Admin pages — /admin/signals, /admin/intelligence, /admin/settings deployed
- ✅ SQL migration idempotent — `supabase/migrations/001_signal_system.sql`
- ✅ Fyers API v3 connected — FYERS_MPIN added, auto-refresh cron working
- ✅ Razorpay live — keys, webhook handler active
- ✅ Supabase Auth — handle_new_user() trigger fixed (inserts to subscriptions not profiles)
- ✅ Admin roles — sahib + akshay both super_admin
- ✅ DNS propagated — withsahib.com live, SSL active
- ✅ Google Search Console, Bing Webmaster Tools, Microsoft Clarity all set up
- ✅ SPF + MX records added — Google Workspace activating
- ✅ Social links — LinkedIn, X, Instagram, Facebook updated in footer + about
- ✅ Dashboard greeting shows real user name
- ✅ Admin/user 'View as User' toggle working
- ✅ AEO — llms.txt, 7 structured data schemas, robots.ts with AI crawlers
- ✅ IndexNow — key file + /api/indexnow route

### Sessions 5–6 (Fyers + Screener + GitHub Actions — Apr 23–24, 2026)
- ✅ FYERS_MPIN env var added to Vercel — cron token refresh fixed
- ✅ Intraday screener engine built — VWAP crossover + volume ratio, 15 symbols
- ✅ force-dynamic on all screener API routes — GitHub Actions build no longer fails
- ✅ RESEND_API_KEY placeholder added to GitHub Actions workflow — build green

### Session 7 (Design System v2 + Repositioning — Apr 25, 2026)
- ✅ Light theme forced on every page load — blocking script overrides localStorage
- ✅ ThemeProvider always starts 'light' — no localStorage read on mount
- ✅ Dark toggle in Navbar — session-only, resets on reload
- ✅ Sora + Lora fonts added globally
- ✅ CSS variables v2 — complete light/dark token system
- ✅ Mobile responsive — hero, pricing, service grids, login
- ✅ Hero headline: "Where rigour meets the market."
- ✅ Methodology section — 3 pillars (Pattern Recognition, Risk Framework, Performance Accountability)
- ✅ Performance Disclosure section — replaces "track record", compliant language
- ✅ 15 audit fixes — middleware public routes, AI copy, schema author, blog attribution
- ✅ All hardcoded stock names removed — real DB signals or empty state
- ✅ Login page redesign — two-column layout, animated right panel
- ✅ Photos — sahib-primary.jpg, sahib-secondary.jpg added
- ✅ WhatsApp updated to 9981248888 everywhere
- ✅ Telegram CTA t.me/withsahib added across site
- ✅ SEBI shield badge in Navbar
- ✅ Sample banner on service call cards (non-subscriber view)
- ✅ Brevo account created, domain authenticated
- ✅ Resend domain verified, DNS propagated

---

## 21. PERMANENT RULES FOR AI SESSIONS

**Always read this file first.** It is the complete project context.

### Permanent facts
1. Platform: withsahib.com — SEBI Registered Research Analyst advisory platform
2. Stack: Next.js 14 (App Router) + Supabase + Vercel + Fyers API v3 + TypeScript ML
3. SEBI compliance is non-negotiable — every signal needs rationale + disclaimer
4. Sahib is non-technical — explain clearly, give complete commands to copy-paste
5. All monetary values in INR, en-IN locale formatting
6. Market hours: 9:00 AM – 3:30 PM IST, Mon–Fri, excluding NSE holidays
7. IST = UTC + 5:30 — all UTC times in vercel.json need +5:30 conversion to IST
8. WhatsApp: 9981248888 | Telegram: t.me/withsahib

### Architecture decisions (permanent)
- ML is 100% TypeScript (no Python) — runs on Vercel serverless
- Screener → signal_alerts (queue) → admin approves → published to signals table
- No direct screener-to-signal pipeline — everything requires human approval
- Performance metrics exclude black_swan signals
- Win rate denominator excludes expired signals

### Do NOT
- Remove SEBI disclaimer from any signal-related component
- Allow entry range to be modified after publish
- Skip rationale field when creating signals
- Push signals without admin approval
- Use guaranteed/assured/best language in any copy

---

## 22. SIGNAL SYSTEM BUILD REFERENCE

Built in Session 1 (21 Apr 2026).

**Critical files:**
- `src/app/admin/signals/page.tsx` — Alert queue, open signals, history, manual create
- `src/app/admin/intelligence/page.tsx` — Performance matrix, postmortems, weekly reports
- `src/app/admin/layout.tsx` — Admin sidebar + auth guard
- `src/middleware.ts` — Route protection; /auth/*, /api/webhooks/*, /api/performance are public
- `src/lib/signal-utils.ts` — validateModification() enforces SEBI immutability rules
- `src/lib/ml/decision-tree.ts` — CART decision tree (Gini impurity)
- `src/lib/ml/random-forest.ts` — 50-tree ensemble with bootstrap sampling
- `src/lib/ml/feature-extractor.ts` — 14-feature numeric vector
- `src/lib/ml/model-store.ts` — Load/save model from Supabase, confidence tiers
- `supabase/migrations/001_signal_system.sql` — Complete schema, idempotent

**Vercel cron schedule:**
- 8:00 AM IST: fyers/refresh-token
- 9:00 AM IST: screener (intraday)
- 9:15 AM IST: screener (stock_options, index_options)
- 10:00 AM IST: screener (swing)
- Every 1 min (8:30 AM–4 PM IST): signals/check-status
- Every 2 min (8:30 AM–4 PM IST): screener/run
- 3:14 PM IST: signals/expire-intraday
- Every 2 min 24/7: distribution/process-queue
- 4:30 PM IST: distribution/daily-recap
- 8:00 PM IST Sunday: intelligence/weekly-report
- 11:00 PM IST Mon–Fri: ml/train
- 11:05 PM IST Mon–Fri: ml/generate-predictions
