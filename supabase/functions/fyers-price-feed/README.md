# fyers-price-feed

Supabase Edge Function (Deno) that fetches live market quotes from the Fyers API v3 and upserts them into the `live_prices` table.

## Project

- Project ref: `trtoxawkeququfurddwr`
- Supabase dashboard: https://supabase.com/dashboard/project/trtoxawkeququfurddwr

## Deploy

```bash
supabase functions deploy fyers-price-feed
```

## Set secrets

```bash
supabase secrets set \
  FUNCTION_SECRET=your_secret_here \
  SUPABASE_URL=https://trtoxawkeququfurddwr.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Also add `FYERS_FEED_SECRET` to Vercel env vars (same value as `FUNCTION_SECRET`) so the Next.js screener route can call this function securely.

## Usage

```bash
POST https://trtoxawkeququfurddwr.supabase.co/functions/v1/fyers-price-feed
Authorization: Bearer {FUNCTION_SECRET}
Content-Type: application/json

{
  "symbols": [
    "NSE:RELIANCE-EQ",
    "NSE:NIFTY50-INDEX",
    "NSE:INDIA VIX-INDEX"
  ]
}
```

## Response

```json
{ "success": true, "updated": 3 }
```

On Fyers token expiry:
```json
{ "error": "fyers_token_expired", "detail": "Token expired" }
```
→ Trigger `/api/fyers/refresh-token` to renew the token, then retry.

## How it works

1. Verifies `Authorization: Bearer {FUNCTION_SECRET}` — returns 401 if wrong.
2. Reads the latest Fyers access token from `fyers_tokens` table; returns 503 if expired.
3. Calls `GET https://api-t1.fyers.in/data/quotes?symbols=...` with the Fyers bearer token.
4. Maps the response fields: `ltp`, `open`, `high`, `low`, `volume`, `change_percentage` → `change_pct`, `prev_close_price` → `prev_close`, `vwap` (falls back to `ltp`), `tt` → `last_updated`.
5. Upserts all rows into `live_prices` with `onConflict: 'symbol'`.
