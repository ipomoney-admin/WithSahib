/**
 * Double/Triple Bottom and Top patterns (B7A, B7B, S7A, S7B).
 * Identifies W-shape bottoms and M-shape tops with neckline breakouts.
 */
import { PatternResult, PatternContext } from '../types'
import { findSwingLows, findSwingHighs, last } from '../indicators'

/** B7A — Double Bottom + Neckline Breakout */
export function b7aDoubleBottom(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 60) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow <= 60) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 60)
  const rsiSlice = rsi.slice(n - 60)
  const lows = slice.map((c) => c.low)
  const swingLows = findSwingLows(lows, 3)

  if (swingLows.length < 2) return { matched: false, strength: 0, extraData: {} }

  // Take the last two swing lows
  const low2 = swingLows[swingLows.length - 1]!
  const low1 = swingLows[swingLows.length - 2]!

  // Both lows within 3% of each other
  const lowDiff = Math.abs(low1.value - low2.value) / low1.value
  if (lowDiff >= 0.03) return { matched: false, strength: 0, extraData: {} }

  // RSI confirmation: RSI at low2 > RSI at low1
  const rsiAtLow1 = rsiSlice[low1.index]!
  const rsiAtLow2 = rsiSlice[low2.index]!
  if (isNaN(rsiAtLow1) || isNaN(rsiAtLow2)) return { matched: false, strength: 0, extraData: {} }
  if (rsiAtLow2 <= rsiAtLow1) return { matched: false, strength: 0, extraData: {} }

  // Neckline = highest high between the two lows
  const between = slice.slice(low1.index, low2.index + 1)
  const neckline = Math.max(...between.map((c) => c.high))

  const current = candles[n - 1]!!
  const breakout = current.close > neckline
  const volOk = current.volume > volumeAvg20d * 1.5

  const matched = breakout && volOk
  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, (rsiNow / 100) * Math.min(volRatio / 1.5, 1)) : 0

  return {
    matched,
    strength,
    extraData: { low1: low1.value, low2: low2.value, neckline, rsiAtLow1, rsiAtLow2, lowDiffPct: Number((lowDiff * 100).toFixed(2)) },
  }
}

/** B7B — Triple Bottom + Neckline Breakout */
export function b7bTripleBottom(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 90) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow <= 60) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 90)
  const rsiSlice = rsi.slice(n - 90)
  const lows = slice.map((c) => c.low)
  const swingLows = findSwingLows(lows, 3)

  if (swingLows.length < 3) return { matched: false, strength: 0, extraData: {} }

  const last3L = swingLows.slice(-3)
  const low1 = last3L[0]!, low2 = last3L[1]!, low3 = last3L[2]!
  const maxLow = Math.max(low1.value, low2.value, low3.value)
  const minLow = Math.min(low1.value, low2.value, low3.value)
  if ((maxLow - minLow) / minLow >= 0.03) return { matched: false, strength: 0, extraData: {} }

  // RSI progressively higher
  const r1 = rsiSlice[low1.index]!, r2 = rsiSlice[low2.index]!, r3 = rsiSlice[low3.index]!
  if (isNaN(r1) || isNaN(r2) || isNaN(r3)) return { matched: false, strength: 0, extraData: {} }
  if (!(r3 > r2 && r2 > r1)) return { matched: false, strength: 0, extraData: {} }

  const neckline = Math.max(...slice.slice(low1.index, low3.index + 1).map((c) => c.high))
  const current = candles[n - 1]!!
  const matched = current.close > neckline && current.volume > volumeAvg20d * 1.5

  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, (rsiNow / 100) * Math.min(volRatio / 1.5, 1)) : 0

  return {
    matched,
    strength,
    extraData: { low1: low1.value, low2: low2.value, low3: low3.value, neckline, rsiAtLows: [r1, r2, r3] },
  }
}

/** S7A — Double Top + Neckline Breakdown */
export function s7aDoubleTop(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 60) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow >= 40) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 60)
  const rsiSlice = rsi.slice(n - 60)
  const highs = slice.map((c) => c.high)
  const swingHighs = findSwingHighs(highs, 3)

  if (swingHighs.length < 2) return { matched: false, strength: 0, extraData: {} }

  const high2 = swingHighs[swingHighs.length - 1]!
  const high1 = swingHighs[swingHighs.length - 2]!
  const highDiff = Math.abs(high1.value - high2.value) / high1.value
  if (highDiff >= 0.03) return { matched: false, strength: 0, extraData: {} }

  const rsiAtHigh1 = rsiSlice[high1.index]!
  const rsiAtHigh2 = rsiSlice[high2.index]!
  if (isNaN(rsiAtHigh1) || isNaN(rsiAtHigh2)) return { matched: false, strength: 0, extraData: {} }
  if (rsiAtHigh2 >= rsiAtHigh1) return { matched: false, strength: 0, extraData: {} }

  const neckline = Math.min(...slice.slice(high1.index, high2.index + 1).map((c) => c.low))
  const current = candles[n - 1]!!
  const matched = current.close < neckline && current.volume > volumeAvg20d * 1.5

  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, ((100 - rsiNow) / 100) * Math.min(volRatio / 1.5, 1)) : 0

  return {
    matched,
    strength,
    extraData: { high1: high1.value, high2: high2.value, neckline, rsiAtHigh1, rsiAtHigh2 },
  }
}

/** S7B — Triple Top + Neckline Breakdown */
export function s7bTripleTop(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 90) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow >= 40) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 90)
  const rsiSlice = rsi.slice(n - 90)
  const highs = slice.map((c) => c.high)
  const swingHighs = findSwingHighs(highs, 3)

  if (swingHighs.length < 3) return { matched: false, strength: 0, extraData: {} }

  const last3H = swingHighs.slice(-3)
  const h1 = last3H[0]!, h2 = last3H[1]!, h3 = last3H[2]!
  const maxH = Math.max(h1.value, h2.value, h3.value)
  const minH = Math.min(h1.value, h2.value, h3.value)
  if ((maxH - minH) / minH >= 0.03) return { matched: false, strength: 0, extraData: {} }

  const r1 = rsiSlice[h1.index]!, r2 = rsiSlice[h2.index]!, r3 = rsiSlice[h3.index]!
  if (isNaN(r1) || isNaN(r2) || isNaN(r3)) return { matched: false, strength: 0, extraData: {} }
  if (!(r3 < r2 && r2 < r1)) return { matched: false, strength: 0, extraData: {} }

  const neckline = Math.min(...slice.slice(h1.index, h3.index + 1).map((c) => c.low))
  const current = candles[n - 1]!!
  const matched = current.close < neckline && current.volume > volumeAvg20d * 1.5

  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, ((100 - rsiNow) / 100) * Math.min(volRatio / 1.5, 1)) : 0

  return {
    matched,
    strength,
    extraData: { high1: h1.value, high2: h2.value, high3: h3.value, neckline, rsiAtHighs: [r1, r2, r3] },
  }
}
