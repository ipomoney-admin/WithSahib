/**
 * Volatility Contraction Pattern (B9 bullish, S9 bearish).
 * Mark Minervini's VCP: successive contracting corrections with falling volume.
 */
import { PatternResult, PatternContext } from '../types'
import { findSwingHighs, findSwingLows, last } from '../indicators'

/** B9 — VCP Bullish */
export function b9Vcp(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 100) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow <= 60) return { matched: false, strength: 0, extraData: {} }

  // Prior uptrend
  const avg100 = candles.slice(-100).reduce((s, c) => s + c.close, 0) / 100
  if (candles[n - 1]!.close <= avg100) return { matched: false, strength: 0, extraData: {} }

  // Find corrections in last 60 days
  const slice60 = candles.slice(n - 1 - 60, n - 1)
  const highs = slice60.map((c) => c.high)
  const lows = slice60.map((c) => c.low)
  const swingHighs = findSwingHighs(highs, 2)
  const swingLows = findSwingLows(lows, 2)

  if (swingHighs.length < 2 || swingLows.length < 1)
    return { matched: false, strength: 0, extraData: {} }

  // Build corrections: swing high → next swing low
  const corrections: Array<{ high: number; low: number; pct: number; avgVol: number }> = []
  for (let i = 0; i < swingHighs.length - 1 && i < swingLows.length; i++) {
    const sh = swingHighs[i]!
    const sl = swingLows.find((l) => l.index > sh.index)
    if (!sl) continue
    const pct = (sh.value - sl.value) / sh.value
    const segVols = slice60.slice(sh.index, sl.index + 1).map((c) => c.volume)
    const avgVol = segVols.reduce((a, b) => a + b, 0) / segVols.length
    corrections.push({ high: sh.value, low: sl.value, pct, avgVol })
  }

  if (corrections.length < 2) return { matched: false, strength: 0, extraData: {} }

  // Each correction smaller by 25% and volume lower
  let contracting = true
  for (let i = 1; i < corrections.length; i++) {
    if (corrections[i]!.pct >= corrections[i - 1]!.pct * 0.75) { contracting = false; break }
    if (corrections[i]!.avgVol >= corrections[i - 1]!.avgVol) { contracting = false; break }
  }
  if (!contracting) return { matched: false, strength: 0, extraData: {} }

  // Pivot = last correction swing high
  const lastCorr = corrections[corrections.length - 1]!
  const pivot = lastCorr.high
  const current = candles[n - 1]!!
  const volOk = current.volume > volumeAvg20d * 2

  const matched = current.close > pivot && volOk
  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, (rsiNow / 100) * Math.min(volRatio / 2, 1)) : 0

  return {
    matched,
    strength,
    extraData: { pivotPoint: pivot, contractionCount: corrections.length, corrections, volumeRatio: Number(volRatio.toFixed(2)) },
  }
}

/** S9 — VCP Bearish */
export function s9VcpBearish(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 100) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow >= 40) return { matched: false, strength: 0, extraData: {} }

  // Prior downtrend
  const avg100 = candles.slice(-100).reduce((s, c) => s + c.close, 0) / 100
  if (candles[n - 1]!.close >= avg100) return { matched: false, strength: 0, extraData: {} }

  const slice60 = candles.slice(n - 1 - 60, n - 1)
  const highs = slice60.map((c) => c.high)
  const lows = slice60.map((c) => c.low)
  const swingHighs = findSwingHighs(highs, 2)
  const swingLows = findSwingLows(lows, 2)

  if (swingLows.length < 2 || swingHighs.length < 1)
    return { matched: false, strength: 0, extraData: {} }

  // Rallies: swing low → next swing high
  const rallies: Array<{ low: number; high: number; pct: number; avgVol: number }> = []
  for (let i = 0; i < swingLows.length - 1 && i < swingHighs.length; i++) {
    const sl = swingLows[i]!
    const sh = swingHighs.find((h) => h.index > sl.index)
    if (!sh) continue
    const pct = (sh.value - sl.value) / sl.value
    const segVols = slice60.slice(sl.index, sh.index + 1).map((c) => c.volume)
    const avgVol = segVols.reduce((a, b) => a + b, 0) / segVols.length
    rallies.push({ low: sl.value, high: sh.value, pct, avgVol })
  }

  if (rallies.length < 2) return { matched: false, strength: 0, extraData: {} }

  let contracting = true
  for (let i = 1; i < rallies.length; i++) {
    if (rallies[i]!.pct >= rallies[i - 1]!.pct * 0.75) { contracting = false; break }
    if (rallies[i]!.avgVol >= rallies[i - 1]!.avgVol) { contracting = false; break }
  }
  if (!contracting) return { matched: false, strength: 0, extraData: {} }

  const pivot = rallies[rallies.length - 1]!.low
  const current = candles[n - 1]!!
  const volOk = current.volume > volumeAvg20d * 2

  const matched = current.close < pivot && volOk
  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, ((100 - rsiNow) / 100) * Math.min(volRatio / 2, 1)) : 0

  return {
    matched,
    strength,
    extraData: { pivotPoint: pivot, contractionCount: rallies.length, rallies, volumeRatio: Number(volRatio.toFixed(2)) },
  }
}
