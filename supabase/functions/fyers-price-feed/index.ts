import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const FYERS_APP_ID = Deno.env.get('FYERS_APP_ID')!

const SYMBOLS = [
  'NSE:RELIANCE-EQ', 'NSE:TCS-EQ', 'NSE:HDFCBANK-EQ', 'NSE:INFY-EQ',
  'NSE:BHARTIARTL-EQ', 'NSE:ICICIBANK-EQ', 'NSE:KOTAKBANK-EQ',
  'NSE:LT-EQ', 'NSE:HINDUNILVR-EQ', 'NSE:SBIN-EQ', 'NSE:BAJFINANCE-EQ',
  'NSE:WIPRO-EQ', 'NSE:MARUTI-EQ', 'NSE:TITAN-EQ', 'NSE:ASIANPAINT-EQ',
  'NSE:AXISBANK-EQ', 'NSE:NTPC-EQ', 'NSE:ONGC-EQ', 'NSE:POWERGRID-EQ',
  'NSE:ULTRACEMCO-EQ', 'NSE:SUNPHARMA-EQ', 'NSE:TECHM-EQ',
  'NSE:ADANIPORTS-EQ', 'NSE:BAJAJFINSV-EQ', 'NSE:NESTLEIND-EQ',
  'NSE:TATASTEEL-EQ', 'NSE:JSWSTEEL-EQ', 'NSE:HCLTECH-EQ',
  'NSE:DRREDDY-EQ', 'NSE:HINDALCO-EQ', 'NSE:CIPLA-EQ',
  'NSE:DIVISLAB-EQ', 'NSE:APOLLOHOSP-EQ', 'NSE:COALINDIA-EQ',
  'NSE:EICHERMOT-EQ', 'NSE:GRASIM-EQ', 'NSE:HEROMOTOCO-EQ',
  'NSE:INDUSINDBK-EQ', 'NSE:ITC-EQ', 'NSE:M&M-EQ',
  'NSE:TATAMOTORS-EQ', 'NSE:TATACONSUM-EQ', 'NSE:BPCL-EQ',
  'NSE:BRITANNIA-EQ', 'NSE:SHRIRAMFIN-EQ', 'NSE:SBILIFE-EQ',
  'NSE:HDFCLIFE-EQ', 'NSE:BAJAJ-AUTO-EQ',
  'NSE:NIFTY50-INDEX', 'NSE:BANKNIFTY-INDEX', 'NSE:INDIA VIX-INDEX',
]

const BATCH_SIZE = 10

interface FyersQuote {
  n: string // symbol
  s: string // status
  v: {
    ltp: number
    prev_close_price: number
    ch_p: number // change pct
    open_price: number
    high_price: number
    low_price: number
    volume: number
    oi: number
    vwap?: number
  }
}

async function getFyersToken(supabase: ReturnType<typeof createClient>): Promise<string | null> {
  const { data } = await supabase
    .from('fyers_tokens')
    .select('access_token, expires_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) return null
  if (new Date(data.expires_at) <= new Date()) return null
  return data.access_token
}

async function fetchAndUpsertPrices(
  supabase: ReturnType<typeof createClient>,
  accessToken: string,
  symbols: string[]
): Promise<void> {
  const symbolStr = symbols.join(',')
  const url = `https://api-t2.fyers.in/data-rest/v2/quotes?symbols=${encodeURIComponent(symbolStr)}`

  const res = await fetch(url, {
    headers: {
      Authorization: `${FYERS_APP_ID}:${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) return

  const json = await res.json()
  const quotes: FyersQuote[] = json.d ?? []

  if (quotes.length === 0) return

  const upsertData = quotes
    .filter((q) => q.s === 'ok' && q.v)
    .map((q) => ({
      symbol: q.n,
      ltp: q.v.ltp,
      prev_close: q.v.prev_close_price,
      change_pct: q.v.ch_p,
      open_price: q.v.open_price,
      high_price: q.v.high_price,
      low_price: q.v.low_price,
      volume: q.v.volume,
      oi: q.v.oi,
      vwap: q.v.vwap ?? null,
      timestamp: new Date().toISOString(),
    }))

  if (upsertData.length > 0) {
    await supabase
      .from('live_prices')
      .upsert(upsertData, { onConflict: 'symbol' })
  }
}

async function runPriceFeed(supabase: ReturnType<typeof createClient>): Promise<void> {
  const accessToken = await getFyersToken(supabase)
  if (!accessToken) {
    await supabase.from('admin_alerts').insert({
      type: 'fyers_disconnected',
      message: 'Price feed: No valid Fyers token found',
    })
    return
  }

  // Batch symbols to avoid URL length limits
  for (let i = 0; i < SYMBOLS.length; i += BATCH_SIZE) {
    const batch = SYMBOLS.slice(i, i + BATCH_SIZE)
    await fetchAndUpsertPrices(supabase, accessToken, batch)
    // Small delay between batches
    await new Promise((r) => setTimeout(r, 200))
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    await runPriceFeed(supabase)
    return new Response(JSON.stringify({ success: true, symbols: SYMBOLS.length, timestamp: new Date().toISOString() }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await supabase.from('admin_alerts').insert({
      type: 'system_error',
      message: `Price feed error: ${message}`,
    }).catch(() => {})
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
