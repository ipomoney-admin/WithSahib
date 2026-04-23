/**
 * RSI Divergence patterns (B6A/B/C, S6A/B/C).
 * Bullish: price makes lower low while RSI makes higher low.
 * Bearish: price makes higher high while RSI makes lower high.
 */
import { PatternResult, PatternContext } from '../types'
import { last } from '../indicators'

function bullishRsiDivergence(ctx: PatternContext, days: number): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < days + 5) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow <= 60) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 1 - days, n - 1)
  const rsiSlice = rsi.slice(n - 1 - days, n - 1)

  // Find lowest close in window (point A)
  let aIdx = 0
  for (let i = 1; i < slice.length; i++) {
    if (slice[i]!.close < slice[aIdx]!.close) aIdx = i
  }
  const priceA = slice[aIdx]!.close
  const rsiA = rsiSlice[aIdx]!
  if (isNaN(rsiA)) return { matched: false, strength: 0, extraData: {} }

  // Find previous swing low before A (at least 3 candles before A)
  let bIdx = -1
  for (let i = aIdx - 3; i >= 0; i--) {
    if (slice[i]!.close < (slice[aIdx + 1]?.close ?? Infinity)) {
      bIdx = i
      break
    }
  }
  if (bIdx < 0) return { matched: false, strength: 0, extraData: {} }

  const priceB = slice[bIdx]!.close
  const rsiB = rsiSlice[bIdx]!
  if (isNaN(rsiB)) return { matched: false, strength: 0, extraData: {} }

  // Divergence: price lower low, RSI higher low
  const priceLowerLow = priceA < priceB
  const rsiHigherLow = rsiA > rsiB

  // Breakout above highest high between A and B
  const between = slice.slice(Math.min(aIdx, bIdx), Math.max(aIdx, bIdx) + 1)
  const highBetween = Math.max(...between.map((c) => c.high))
  const current = candles[n - 1]!!
  const breakoutConfirmed = current.close > highBetween

  const volOk = current.volume > volumeAvg20d
  const matched = priceLowerLow && rsiHigherLow && breakoutConfirmed && volOk

  const strength = matched
    ? Math.min(1, ((rsiNow - 60) / 40) * (current.volume / Math.max(1, volumeAvg20d)))
    : 0

  return {
    matched,
    strength,
    extraData: { priceA, priceB, rsiA, rsiB, neckline: highBetween, lookbackDays: days },
  }
}

function bearishRsiDivergence(ctx: PatternContext, days: number): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < days + 5) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow >= 40) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 1 - days, n - 1)
  const rsiSlice = rsi.slice(n - 1 - days, n - 1)

  // Find highest close in window (point A)
  let aIdx = 0
  for (let i = 1; i < slice.length; i++) {
    if (slice[i]!.close > slice[aIdx]!.close) aIdx = i
  }
  const priceA = slice[aIdx]!.close
  const rsiA = rsiSlice[aIdx]!
  if (isNaN(rsiA)) return { matched: false, strength: 0, extraData: {} }

  // Find previous swing high before A
  let bIdx = -1
  for (let i = aIdx - 3; i >= 0; i--) {
    bIdx = i
    break
  }
  if (bIdx < 0) return { matched: false, strength: 0, extraData: {} }

  const priceB = slice[bIdx]!.close
  const rsiB = rsiSlice[bIdx]!
  if (isNaN(rsiB)) return { matched: false, strength: 0, extraData: {} }

  // Divergence: price higher high, RSI lower high
  const priceHigherHigh = priceA > priceB
  const rsiLowerHigh = rsiA < rsiB

  // Breakdown below lowest low between A and B
  const between = slice.slice(Math.min(aIdx, bIdx), Math.max(aIdx, bIdx) + 1)
  const lowBetween = Math.min(...between.map((c) => c.low))
  const current = candles[n - 1]!!
  const breakdownConfirmed = current.close < lowBetween

  const volOk = current.volume > volumeAvg20d
  const matched = priceHigherHigh && rsiLowerHigh && breakdownConfirmed && volOk

  const strength = matched
    ? Math.min(1, ((40 - rsiNow) / 40) * (current.volume / Math.max(1, volumeAvg20d)))
    : 0

  return {
    matched,
    strength,
    extraData: { priceA, priceB, rsiA, rsiB, neckline: lowBetween, lookbackDays: days },
  }
}

export function b6aRsiDiv10(ctx: PatternContext): PatternResult { return bullishRsiDivergence(ctx, 10) }
export function b6bRsiDiv14(ctx: PatternContext): PatternResult { return bullishRsiDivergence(ctx, 14) }
export function b6cRsiDiv21(ctx: PatternContext): PatternResult { return bullishRsiDivergence(ctx, 21) }
export function s6aRsiDiv10(ctx: PatternContext): PatternResult { return bearishRsiDivergence(ctx, 10) }
export function s6bRsiDiv14(ctx: PatternContext): PatternResult { return bearishRsiDivergence(ctx, 14) }
export function s6cRsiDiv21(ctx: PatternContext): PatternResult { return bearishRsiDivergence(ctx, 21) }
