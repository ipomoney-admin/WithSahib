import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const FUNCTION_SECRET = Deno.env.get('FUNCTION_SECRET')!

interface FyersQuoteValue {
  open: number
  high: number
  low: number
  ltp: number
  volume: number
  change_percentage: number
  prev_close_price: number
  vwap?: number
  tt?: number  // unix timestamp
}

interface FyersQuote {
  n: string        // symbol name e.g. 'NSE:RELIANCE-EQ'
  s: string        // 'ok' | 'error'
  v: FyersQuoteValue
}

interface FyersResponse {
  s: string        // 'ok' | 'error'
  d: FyersQuote[]
}

Deno.serve(async (req: Request) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Auth — Bearer FUNCTION_SECRET
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${FUNCTION_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Parse body: { symbols: string[] }
  let symbols: string[]
  try {
    const body = await req.json()
    symbols = body.symbols
    if (!Array.isArray(symbols) || symbols.length === 0) {
      throw new Error('symbols must be a non-empty array')
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid request body', detail: String(err) }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Get latest Fyers access token, check expiry
  const { data: tokenRow } = await supabase
    .from('fyers_tokens')
    .select('access_token, expires_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!tokenRow?.access_token) {
    return new Response(JSON.stringify({ error: 'fyers_token_expired', detail: 'No token found' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (new Date(tokenRow.expires_at) < new Date()) {
    return new Response(JSON.stringify({ error: 'fyers_token_expired', detail: 'Token expired' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Call Fyers API v3 market quotes
  const fyersUrl = `https://api-t1.fyers.in/data/quotes?symbols=${symbols.join(',')}`
  let fyersData: FyersResponse

  try {
    const fyersRes = await fetch(fyersUrl, {
      headers: { Authorization: `Bearer ${tokenRow.access_token}` },
    })
    if (!fyersRes.ok) {
      const text = await fyersRes.text()
      throw new Error(`Fyers API ${fyersRes.status}: ${text}`)
    }
    fyersData = await fyersRes.json()
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Fyers API failed', detail: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (fyersData.s !== 'ok' || !Array.isArray(fyersData.d)) {
    return new Response(JSON.stringify({ error: 'Fyers API returned error', data: fyersData }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Map Fyers response → live_prices rows
  const now = new Date().toISOString()
  const rows = fyersData.d
    .filter((q) => q.s === 'ok' && q.v)
    .map((q) => ({
      symbol: q.n,
      ltp: q.v.ltp,
      open: q.v.open,
      high: q.v.high,
      low: q.v.low,
      volume: q.v.volume,
      change_pct: q.v.change_percentage,
      prev_close: q.v.prev_close_price,
      vwap: q.v.vwap ?? q.v.ltp,  // ltp as proxy when vwap unavailable
      last_updated: q.v.tt ? new Date(q.v.tt * 1000).toISOString() : now,
    }))

  if (rows.length === 0) {
    return new Response(JSON.stringify({ success: true, updated: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Upsert into live_prices
  const { error: upsertError } = await supabase
    .from('live_prices')
    .upsert(rows, { onConflict: 'symbol' })

  if (upsertError) {
    return new Response(JSON.stringify({ error: 'DB upsert failed', detail: upsertError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true, updated: rows.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
