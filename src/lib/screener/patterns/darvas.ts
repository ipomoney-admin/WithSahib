/**
 * Darvas Box patterns (B5A, B5B, S5A, S5B).
 * Detects tight consolidation boxes followed by volume-confirmed breakouts/breakdowns.
 */
import { PatternResult, PatternContext } from '../types'
import { last } from '../indicators'

function darvasBox(
  ctx: PatternContext,
  days: number,
  maxRange: number,
  bullish: boolean,
  volMultiplier: number
): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n <= days) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow)) return { matched: false, strength: 0, extraData: {} }

  const boxCandles = candles.slice(n - 1 - days, n - 1)
  const boxTop = Math.max(...boxCandles.map((c) => c.high))
  const boxBottom = Math.min(...boxCandles.map((c) => c.low))
  const boxRange = (boxTop - boxBottom) / boxBottom

  const current = candles[n - 1]!!
  const volOk = current.volume > volumeAvg20d * volMultiplier

  const matched = bullish
    ? boxRange < maxRange && current.close > boxTop && volOk && rsiNow > 60
    : boxRange < maxRange && current.close < boxBottom && volOk && rsiNow < 40

  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched
    ? bullish
      ? Math.min(1, (rsiNow / 100) * Math.min(volRatio / 1.5, 1))
      : Math.min(1, ((100 - rsiNow) / 100) * Math.min(volRatio / 1.5, 1))
    : 0

  return {
    matched,
    strength,
    extraData: {
      boxTop,
      boxBottom,
      boxRange: Number((boxRange * 100).toFixed(2)),
      lookbackDays: days,
      volumeRatio: Number(volRatio.toFixed(2)),
    },
  }
}

/** B5A — Darvas Box Breakout (10-day, max 15% range) */
export function b5aDarvas10(ctx: PatternContext): PatternResult {
  return darvasBox(ctx, 10, 0.15, true, 1.5)
}

/** B5B — Darvas Box Breakout (20-day, max 20% range) */
export function b5bDarvas20(ctx: PatternContext): PatternResult {
  return darvasBox(ctx, 20, 0.2, true, 1.5)
}

/** S5A — Darvas Box Breakdown (10-day, max 15% range) */
export function s5aDarvasBreak10(ctx: PatternContext): PatternResult {
  return darvasBox(ctx, 10, 0.15, false, 1.5)
}

/** S5B — Darvas Box Breakdown (20-day, max 20% range) */
export function s5bDarvasBreak20(ctx: PatternContext): PatternResult {
  return darvasBox(ctx, 20, 0.2, false, 1.5)
}
