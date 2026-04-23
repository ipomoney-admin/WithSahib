import { createServiceRoleClient } from '@/lib/supabase/server'
import { ScreenerResult } from './types'
import { last } from './indicators'

export async function captureToML(results: ScreenerResult[], segment: string): Promise<void> {
  if (results.length === 0) return
  const supabase = createServiceRoleClient()
  const today = new Date().toISOString().split('T')[0]

  // Fetch existing entries for today to skip duplicates
  const symbols = Array.from(new Set(results.map((r) => r.symbol)))
  const { data: existing } = await supabase
    .from('screener_results')
    .select('symbol, bucket_code')
    .eq('segment', segment)
    .gte('scanned_at', `${today}T00:00:00Z`)
    .in('symbol', symbols)

  const existingSet = new Set(
    (existing ?? []).map((e: { symbol: string; bucket_code: string }) => `${e.symbol}::${e.bucket_code}`)
  )

  const toInsert = results.filter((r) => !existingSet.has(`${r.symbol}::${r.bucketCode}`))
  if (toInsert.length === 0) return

  // Batch insert screener_results
  const { data: inserted, error } = await supabase
    .from('screener_results')
    .insert(
      toInsert.map((r) => ({
        segment: r.segment,
        direction: r.direction,
        bucket_code: r.bucketCode,
        bucket_name: r.bucketName,
        symbol: r.symbol,
        exchange: r.exchange,
        price_at_signal: r.priceAtSignal,
        rsi_at_signal: r.rsiAtSignal,
        volume_at_signal: r.volumeAtSignal,
        volume_avg_20d: r.volumeAvg20d,
        ema10: r.ema10,
        ema20: r.ema20,
        ema50: r.ema50,
        extra_data: r.extraData,
        shared_with_users: false,
      }))
    )
    .select('id, symbol, bucket_code, price_at_signal')

  if (error) {
    console.error('screener_results insert error:', error)
    return
  }

  if (!inserted || inserted.length === 0) return

  // Build lookup map
  const idMap = new Map<string, string>()
  for (const row of inserted as Array<{ id: string; symbol: string; bucket_code: string }>) {
    idMap.set(`${row.symbol}::${row.bucket_code}`, row.id)
  }

  // Batch insert signal tracking
  const trackingRows = toInsert
    .map((r) => {
      const id = idMap.get(`${r.symbol}::${r.bucketCode}`)
      if (!id) return null
      return {
        screener_result_id: id,
        symbol: r.symbol,
        signal_date: today,
        signal_price: r.priceAtSignal,
        segment: r.segment,
        bucket_code: r.bucketCode,
        direction: r.direction,
        shared_with_users: false,
        outcome: 'open',
      }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)

  if (trackingRows.length > 0) {
    const { error: trackErr } = await supabase.from('screener_signal_tracking').insert(trackingRows)
    if (trackErr) console.error('screener_signal_tracking insert error:', trackErr)
  }

  // Batch insert ML features
  const mlRows = toInsert
    .map((r) => {
      const id = idMap.get(`${r.symbol}::${r.bucketCode}`)
      if (!id) return null

      const pVsEma10 = r.ema10 > 0 ? ((r.priceAtSignal - r.ema10) / r.ema10) * 100 : null
      const pVsEma20 = r.ema20 > 0 ? ((r.priceAtSignal - r.ema20) / r.ema20) * 100 : null
      const pVsEma50 = r.ema50 > 0 ? ((r.priceAtSignal - r.ema50) / r.ema50) * 100 : null
      const volRatio = r.volumeAvg20d > 0 ? r.volumeAtSignal / r.volumeAvg20d : null

      return {
        screener_result_id: id,
        symbol: r.symbol,
        signal_date: today,
        bucket_code: r.bucketCode,
        direction: r.direction,
        price_vs_ema10_pct: pVsEma10 !== null ? Number(pVsEma10.toFixed(4)) : null,
        price_vs_ema20_pct: pVsEma20 !== null ? Number(pVsEma20.toFixed(4)) : null,
        price_vs_ema50_pct: pVsEma50 !== null ? Number(pVsEma50.toFixed(4)) : null,
        volume_ratio: volRatio !== null ? Number(volRatio.toFixed(4)) : null,
        rsi_14: r.rsiAtSignal,
        pattern_strength: r.patternStrength,
      }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)

  if (mlRows.length > 0) {
    const { error: mlErr } = await supabase.from('screener_ml_features').insert(mlRows)
    if (mlErr) console.error('screener_ml_features insert error:', mlErr)
  }
}
