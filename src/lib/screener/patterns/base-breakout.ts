/**
 * Base Breakout/Breakdown patterns (B8A/B/C, S8A/B/C).
 * Tight base followed by explosive volume breakout above/below the range.
 */
import { PatternResult, PatternContext } from '../types'
import { last } from '../indicators'

function basePattern(
  ctx: PatternContext,
  days: number,
  maxRange: number,
  bullish: boolean
): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n <= days) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow)) return { matched: false, strength: 0, extraData: {} }

  const baseCandles = candles.slice(n - 1 - days, n - 1)
  const baseHigh = Math.max(...baseCandles.map((c) => c.high))
  const baseLow = Math.min(...baseCandles.map((c) => c.low))
  const baseRange = (baseHigh - baseLow) / baseLow

  const current = candles[n - 1]!!
  const volOk = current.volume > volumeAvg20d * 2.0

  const matched = bullish
    ? baseRange < maxRange && current.close > baseHigh && volOk && rsiNow > 60
    : baseRange < maxRange && current.close < baseLow && volOk && rsiNow < 40

  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched
    ? bullish
      ? Math.min(1, (rsiNow / 100) * Math.min(volRatio / 2, 1))
      : Math.min(1, ((100 - rsiNow) / 100) * Math.min(volRatio / 2, 1))
    : 0

  return {
    matched,
    strength,
    extraData: {
      baseHigh,
      baseLow,
      baseRange: Number((baseRange * 100).toFixed(2)),
      lookbackDays: days,
      volumeRatio: Number(volRatio.toFixed(2)),
    },
  }
}

export function b8aBase10(ctx: PatternContext): PatternResult  { return basePattern(ctx, 10, 0.10, true) }
export function b8bBase15(ctx: PatternContext): PatternResult  { return basePattern(ctx, 15, 0.12, true) }
export function b8cBase20(ctx: PatternContext): PatternResult  { return basePattern(ctx, 20, 0.15, true) }
export function s8aBase10(ctx: PatternContext): PatternResult  { return basePattern(ctx, 10, 0.10, false) }
export function s8bBase15(ctx: PatternContext): PatternResult  { return basePattern(ctx, 15, 0.12, false) }
export function s8cBase20(ctx: PatternContext): PatternResult  { return basePattern(ctx, 20, 0.15, false) }
