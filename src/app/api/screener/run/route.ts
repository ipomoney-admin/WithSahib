import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { isMarketOpen } from '@/lib/market-hours'
import { fetchLivePrice, fetchLivePrices } from '@/lib/fyers-client'
import { calculateRR } from '@/lib/signal-utils'

export const dynamic = 'force-dynamic'
import { runScreener } from '@/lib/screener/screener-engine'
import { captureToML } from '@/lib/screener/ml-capture'
import { fetchOHLCVBatch, sleep } from '@/lib/screener/data/fyers-feed'
import { NSE_MAIN_BOARD, FNO_STOCKS } from '@/lib/screener/data/nse-universe'
import type { OHLCV } from '@/lib/screener/types'

function cronGuard(req: NextRequest): boolean {
  return req.headers.get('x-cron-secret') === process.env.CRON_SECRET
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
function nowIST() {
  return new Date(Date.now() + IST_OFFSET_MS)
}
function istMins() {
  const now = nowIST()
  return now.getUTCHours() * 60 + now.getUTCMinutes()
}

const INTRADAY_SYMBOLS = [
  'NSE:RELIANCE-EQ', 'NSE:TCS-EQ', 'NSE:HDFCBANK-EQ', 'NSE:INFY-EQ',
  'NSE:ICICIBANK-EQ', 'NSE:KOTAKBANK-EQ', 'NSE:LT-EQ', 'NSE:SBIN-EQ',
  'NSE:BAJFINANCE-EQ', 'NSE:WIPRO-EQ', 'NSE:AXISBANK-EQ', 'NSE:TATAMOTORS-EQ',
  'NSE:ITC-EQ', 'NSE:M&M-EQ', 'NSE:BHARTIARTL-EQ',
]

async function runIntradayScreener(supabase: ReturnType<typeof createServiceRoleClient>) {
  const mins = istMins()
  // Intraday: 9:15 AM to 1:00 PM IST
  if (mins < 9 * 60 + 15 || mins > 13 * 60) return []

  const [prices, niftyPrice] = await Promise.all([
    fetchLivePrices(INTRADAY_SYMBOLS),
    fetchLivePrice('NSE:NIFTY50-INDEX'),
  ])

  const generated: string[] = []

  for (const price of prices) {
    if (!price.ltp || !price.vwap || !price.volume) continue

    const volumeRatio = price.volume / Math.max(1, price.volume * 0.7)
    const crossingVwapUp = price.ltp > price.vwap && price.open_price < price.vwap
    const momentumPositive = price.change_pct > 0.3

    if (!crossingVwapUp || volumeRatio < 1.5 || !momentumPositive) continue

    const scrip = price.symbol.replace('NSE:', '').replace('-EQ', '')
    const entryLow = price.vwap
    const entryHigh = price.ltp * 1.002
    const stopLoss = price.low_price * 0.998
    const range = entryHigh - entryLow
    const target1 = entryHigh + range * 2

    const rr = calculateRR(entryLow, entryHigh, stopLoss, target1)
    if (rr < 2) continue // minimum 1:2 RR

    const { data: existing } = await supabase
      .from('signal_alerts')
      .select('id')
      .eq('scrip', scrip)
      .eq('segment', 'intraday')
      .eq('review_status', 'pending')
      .gte('created_at', new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString())
      .limit(1)

    if (existing && existing.length > 0) continue

    const rationale = `VWAP crossover on ${scrip} with volume ratio ${volumeRatio.toFixed(2)}x. Price crossed VWAP upward with positive momentum +${price.change_pct.toFixed(2)}%. Nifty ${niftyPrice?.change_pct && niftyPrice.change_pct > 0 ? 'supporting' : 'mixed'}.`

    const { data: alert } = await supabase.from('signal_alerts').insert({
      segment: 'intraday',
      scrip,
      entry_low: Number(entryLow.toFixed(2)),
      entry_high: Number(entryHigh.toFixed(2)),
      stop_loss: Number(stopLoss.toFixed(2)),
      stop_loss_type: 'trailing',
      target_1: Number(target1.toFixed(2)),
      rr_ratio: rr,
      rationale,
      validity_date: new Date().toISOString().split('T')[0],
      pattern_type: 'vwap_crossover',
      trigger_conditions: {
        volume_ratio: volumeRatio,
        vwap: price.vwap,
        ltp_at_trigger: price.ltp,
        change_pct: price.change_pct,
        nifty_change: niftyPrice?.change_pct,
      },
    }).select().single()

    if (alert) {
      await supabase.from('signal_audit_log').insert({
        alert_id: alert.id,
        action: 'alert_generated',
        notes: `Screener: VWAP crossover ${scrip}`,
      })
      await supabase.from('admin_alerts').insert({
        type: 'new_signal',
        message: `New intraday alert: ${scrip} — VWAP crossover`,
        data: { alert_id: alert.id, scrip, segment: 'intraday' },
      })
      generated.push(scrip)
    }
  }

  return generated
}

async function runSwingScreener(supabase: ReturnType<typeof createServiceRoleClient>) {
  const mins = istMins()
  // Swing: pre-market 8-9 AM preferred, also runs during market hours
  if (mins < 8 * 60) return []

  const [prices, niftyPrice] = await Promise.all([
    fetchLivePrices(INTRADAY_SYMBOLS),
    fetchLivePrice('NSE:NIFTY50-INDEX'),
  ])

  const generated: string[] = []

  for (const price of prices) {
    if (!price.ltp || !price.vwap) continue

    // Swing breakout: price near 52-week high with volume confirmation
    const nearHighThreshold = price.high_price * 0.98
    const breakingOut = price.ltp >= nearHighThreshold
    const volumeConfirmed = price.volume && price.volume > 0

    if (!breakingOut || !volumeConfirmed) continue

    const sectorPositive = niftyPrice?.change_pct && niftyPrice.change_pct > 0

    const scrip = price.symbol.replace('NSE:', '').replace('-EQ', '')
    const entryLow = price.ltp * 0.998
    const entryHigh = price.high_price * 1.002
    const stopLoss = price.vwap * 0.97
    const range = entryHigh - entryLow
    const target1 = entryHigh + range * 2
    const target2 = entryHigh + range * 3.5
    const target3 = entryHigh + range * 5

    const rr = calculateRR(entryLow, entryHigh, stopLoss, target1)
    if (rr < 3) continue // minimum 1:3 RR for swing

    const { data: existing } = await supabase
      .from('signal_alerts')
      .select('id')
      .eq('scrip', scrip)
      .eq('segment', 'swing')
      .eq('review_status', 'pending')
      .gte('created_at', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString())
      .limit(1)

    if (existing && existing.length > 0) continue

    const rationale = `${scrip} approaching 52-week high breakout at ₹${price.high_price.toLocaleString('en-IN')}. ${sectorPositive ? 'Sector tailwind with Nifty positive.' : 'Broader market mixed — tight SL recommended.'} Volume confirmation present. Pattern: Breakout near resistance.`

    const { data: alert } = await supabase.from('signal_alerts').insert({
      segment: 'swing',
      scrip,
      entry_low: Number(entryLow.toFixed(2)),
      entry_high: Number(entryHigh.toFixed(2)),
      stop_loss: Number(stopLoss.toFixed(2)),
      stop_loss_type: 'hard',
      target_1: Number(target1.toFixed(2)),
      target_2: Number(target2.toFixed(2)),
      target_3: Number(target3.toFixed(2)),
      rr_ratio: rr,
      rationale,
      pattern_type: 'breakout_52wh',
      trigger_conditions: {
        price_vs_high_pct: ((price.ltp / price.high_price - 1) * 100).toFixed(2),
        volume: price.volume,
        nifty_trend: niftyPrice?.change_pct,
      },
    }).select().single()

    if (alert) {
      await supabase.from('signal_audit_log').insert({
        alert_id: alert.id,
        action: 'alert_generated',
        notes: `Screener: Swing breakout ${scrip}`,
      })
      await supabase.from('admin_alerts').insert({
        type: 'new_signal',
        message: `New swing alert: ${scrip} — 52W high breakout`,
        data: { alert_id: alert.id, scrip, segment: 'swing' },
      })
      generated.push(scrip)
    }
  }

  return generated
}

const SEGMENT_CONFIG = {
  swing:         { resolution: 'D',  days: 400, universe: NSE_MAIN_BOARD, minTurnover: 5_000_000 },
  intraday_1h:   { resolution: '60', days: 30,  universe: FNO_STOCKS,     minTurnover: 0 },
  intraday_15m:  { resolution: '15', days: 15,  universe: FNO_STOCKS,     minTurnover: 0 },
} as const

type Segment = keyof typeof SEGMENT_CONFIG

async function runFyersScreener(segment: Segment) {
  const { resolution, days, universe, minTurnover } = SEGMENT_CONFIG[segment]
  const BATCH = 50
  const candlesMap = new Map<string, OHLCV[]>()

  for (let i = 0; i < universe.length; i += BATCH) {
    const batch = universe.slice(i, i + BATCH)
    const batchData = await fetchOHLCVBatch(batch, resolution, days)

    for (const [sym, data] of Array.from(batchData.entries())) {
      if (data.length < 100) continue
      if (minTurnover > 0) {
        const last20 = data.slice(-20)
        const avgTurnover = last20.reduce((s, c) => s + c.close * c.volume, 0) / last20.length
        if (avgTurnover < minTurnover) continue
      }
      candlesMap.set(sym, data)
    }

    // Polite pause between batches to respect Fyers rate limits
    if (i + BATCH < universe.length) await sleep(1500)
  }

  const results = await runScreener(candlesMap, segment)
  await captureToML(results, segment)
  return results
}

export async function GET(req: NextRequest) {
  if (!cronGuard(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const segmentParam = searchParams.get('segment')

  // --- New: Fyers-backed pattern screener ---
  if (segmentParam) {
    const allowedSegments = ['swing', 'intraday_1h', 'intraday_15m'] as const
    if (!allowedSegments.includes(segmentParam as Segment)) {
      return NextResponse.json({ success: false, error: 'Invalid segment' }, { status: 400 })
    }
    const segment = segmentParam as Segment

    try {
      const results = await runFyersScreener(segment)
      const grouped: Record<string, typeof results> = {}
      for (const r of results) {
        if (!grouped[r.bucketCode]) grouped[r.bucketCode] = []
        ;(grouped[r.bucketCode] as typeof results).push(r)
      }
      return NextResponse.json({ success: true, data: { segment, total: results.length, grouped } })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      return NextResponse.json({ success: false, error: msg }, { status: 500 })
    }
  }

  // --- Legacy: VWAP cron screener ---
  const open = await isMarketOpen()
  const mins = istMins()
  // Allow pre-market for swing screener
  if (!open && mins < 8 * 60) {
    return NextResponse.json({ success: true, data: { skipped: true, reason: 'market_closed' } })
  }

  const supabase = createServiceRoleClient()

  const [intradayAlerts, swingAlerts] = await Promise.all([
    runIntradayScreener(supabase),
    runSwingScreener(supabase),
  ])

  return NextResponse.json({
    success: true,
    data: {
      intraday_generated: intradayAlerts,
      swing_generated: swingAlerts,
      total: intradayAlerts.length + swingAlerts.length,
    },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || !body.segment || !body.candles) {
    return NextResponse.json({ success: false, error: 'Missing segment or candles' }, { status: 400 })
  }

  const allowedSegments = ['swing', 'intraday_1h', 'intraday_15m'] as const
  type Segment = typeof allowedSegments[number]
  if (!allowedSegments.includes(body.segment as Segment)) {
    return NextResponse.json({ success: false, error: 'Invalid segment' }, { status: 400 })
  }

  const segment = body.segment as Segment
  const candlesMap = new Map<string, OHLCV[]>()
  for (const [symbol, data] of Object.entries(body.candles as Record<string, OHLCV[]>)) {
    if (Array.isArray(data) && data.length > 0) {
      candlesMap.set(symbol, data)
    }
  }

  const results = await runScreener(candlesMap, segment)
  await captureToML(results, segment)

  const grouped: Record<string, typeof results> = {}
  for (const r of results) {
    if (!grouped[r.bucketCode]) grouped[r.bucketCode] = []
    ;(grouped[r.bucketCode] as typeof results).push(r)
  }

  return NextResponse.json({ success: true, data: { total: results.length, grouped } })
}
