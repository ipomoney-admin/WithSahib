import { createServiceRoleClient } from '@/lib/supabase/server'
import { fetchLivePrice, calculateVwapDistance, calculateVolumeRatio } from '@/lib/fyers-client'
import { getDaysToExpiry, getTimeBucket } from '@/lib/market-hours'
import { logError } from '@/lib/logger'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function getNiftyTrend(changePct: number): string {
  if (changePct > 1.5) return 'strong_bull'
  if (changePct > 0.3) return 'bull'
  if (changePct < -1.5) return 'strong_bear'
  if (changePct < -0.3) return 'bear'
  return 'neutral'
}

async function getSymbolHistoricalWinrate(
  supabase: ReturnType<typeof createServiceRoleClient>,
  scrip: string
): Promise<number> {
  const { data } = await supabase
    .from('signals')
    .select('status')
    .eq('scrip', scrip)
    .in('status', ['t1_hit', 't2_hit', 't3_hit', 'sl_hit'])
    .eq('is_black_swan', false)

  if (!data || data.length === 0) return 0
  const wins = data.filter((s) => ['t1_hit', 't2_hit', 't3_hit'].includes(s.status)).length
  return Number(((wins / data.length) * 100).toFixed(2))
}

async function getLastFiveSignalsResult(
  supabase: ReturnType<typeof createServiceRoleClient>,
  scrip: string
): Promise<string> {
  const { data } = await supabase
    .from('signals')
    .select('status')
    .eq('scrip', scrip)
    .in('status', ['t1_hit', 't2_hit', 't3_hit', 'sl_hit'])
    .order('published_at', { ascending: false })
    .limit(5)

  if (!data || data.length === 0) return 'no_history'
  return data
    .map((s) => (['t1_hit', 't2_hit', 't3_hit'].includes(s.status) ? 'W' : 'L'))
    .join('')
}

async function getSimilarSetupCount(
  supabase: ReturnType<typeof createServiceRoleClient>,
  scrip: string,
  segment: string
): Promise<number> {
  const { count } = await supabase
    .from('signal_features')
    .select('id', { count: 'exact', head: true })
    .eq('scrip' as never, scrip)
    .eq('segment' as never, segment)

  return count ?? 0
}

export async function captureSignalFeatures(
  signalId: string,
  scrip: string,
  segment: string
): Promise<void> {
  try {
    const supabase = createServiceRoleClient()

    const [niftyPrice, vixPrice, signalPrice] = await Promise.all([
      fetchLivePrice('NSE:NIFTY50-INDEX'),
      fetchLivePrice('NSE:INDIA VIX-INDEX'),
      fetchLivePrice(`NSE:${scrip}-EQ`),
    ])

    const now = new Date()
    const dayOfWeek = DAYS[now.getDay()]
    const timeBucket = getTimeBucket()
    const daysToExpiry = getDaysToExpiry()

    const niftyTrend = niftyPrice ? getNiftyTrend(niftyPrice.change_pct ?? 0) : 'neutral'
    const niftyVs20ema: 'above' | 'below' =
      niftyPrice && niftyPrice.ltp && niftyPrice.vwap
        ? niftyPrice.ltp > niftyPrice.vwap ? 'above' : 'below'
        : 'above'

    const volumeRatio = signalPrice
      ? calculateVolumeRatio(signalPrice.volume ?? 0, (signalPrice.volume ?? 0) * 0.8)
      : null

    const vwapDistance = signalPrice && signalPrice.vwap
      ? calculateVwapDistance(signalPrice.ltp ?? 0, signalPrice.vwap)
      : null

    const [symbolHistoricalWinrate, lastFiveSignalsResult, similarSetupCount] = await Promise.all([
      getSymbolHistoricalWinrate(supabase, scrip),
      getLastFiveSignalsResult(supabase, scrip),
      getSimilarSetupCount(supabase, scrip, segment),
    ])

    // Fetch signal for RR
    const { data: signal } = await supabase
      .from('signals')
      .select('rr_ratio, entry_low, entry_high')
      .eq('id', signalId)
      .single()

    await supabase.from('signal_features').upsert({
      signal_id: signalId,
      vix: vixPrice?.ltp ?? null,
      nifty_trend: niftyTrend,
      nifty_vs_20ema: niftyVs20ema,
      sector_performance: niftyPrice?.change_pct ?? null,
      market_breadth: null, // populated separately if available
      volume_ratio: volumeRatio,
      vwap_distance: vwapDistance,
      atr_value: signalPrice ? Math.abs((signalPrice.high_price ?? 0) - (signalPrice.low_price ?? 0)) : null,
      atr_pct: signalPrice && signalPrice.ltp
        ? Number(
            (
              (Math.abs((signalPrice.high_price ?? 0) - (signalPrice.low_price ?? 0)) /
                signalPrice.ltp) *
              100
            ).toFixed(4)
          )
        : null,
      time_bucket: timeBucket,
      day_of_week: dayOfWeek,
      days_to_expiry: daysToExpiry,
      iv_percentile: signalPrice?.iv ?? null,
      pcr: null, // populated from options chain if available
      signal_rr_promised: signal?.rr_ratio ?? null,
      entry_vs_52wh: signalPrice
        ? Number(
            (((signalPrice.ltp ?? 0) - (signalPrice.high_price ?? 0)) /
              (signalPrice.high_price ?? 1) *
              100
            ).toFixed(4)
          )
        : null,
      entry_vs_52wl: signalPrice
        ? Number(
            (((signalPrice.ltp ?? 0) - (signalPrice.low_price ?? 0)) /
              (signalPrice.low_price ?? 1) *
              100
            ).toFixed(4)
          )
        : null,
      symbol_historical_winrate: symbolHistoricalWinrate,
      similar_setup_count: similarSetupCount,
      last_5_signals_result: lastFiveSignalsResult,
      outcome: null,
      is_black_swan: false,
    }, { onConflict: 'signal_id' })
  } catch (err) {
    logError('captureSignalFeatures', err)
  }
}
