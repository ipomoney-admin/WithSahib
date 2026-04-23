/**
 * EMA-based pattern detectors (B1-B4, S1-S4).
 * All use pre-computed EMA and RSI arrays (oldest→newest).
 */
import { PatternResult, PatternContext } from '../types'
import { last, prev } from '../indicators'

function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v))
}

/** B1 — EMA 10x20 Fresh Bullish Crossover */
export function b1EmaCrossover(ctx: PatternContext): PatternResult {
  const { ema10, ema20, rsi, candles, volumeAvg20d } = ctx
  const e10Now = last(ema10), e10Prev = prev(ema10)
  const e20Now = last(ema20), e20Prev = prev(ema20)
  const rsiNow = last(rsi)
  const vol = candles[candles.length - 1]!.volume

  if (isNaN(e10Now) || isNaN(e10Prev) || isNaN(e20Now) || isNaN(e20Prev) || isNaN(rsiNow))
    return { matched: false, strength: 0, extraData: {} }

  const matched =
    e10Now > e20Now &&
    e10Prev <= e20Prev &&
    vol > volumeAvg20d &&
    rsiNow > 60

  const volRatio = volumeAvg20d > 0 ? vol / volumeAvg20d : 1
  const strength = matched ? clamp((rsiNow / 100) * Math.min(volRatio, 2) * 0.5) : 0

  return { matched, strength, extraData: { ema10: e10Now, ema20: e20Now, volumeRatio: volRatio } }
}

/** B2 — EMA 10/20 Retest Bounce (Bullish) */
export function b2EmaRetest(ctx: PatternContext): PatternResult {
  const { ema10, ema20, rsi, candles, volumeAvg20d } = ctx
  const c = candles[candles.length - 1]!
  const e10 = last(ema10), e20 = last(ema20), rsiNow = last(rsi)

  if (isNaN(e10) || isNaN(e20) || isNaN(rsiNow))
    return { matched: false, strength: 0, extraData: {} }

  const near10 = Math.abs(c.close - e10) / e10 < 0.02
  const near20 = Math.abs(c.close - e20) / e20 < 0.02
  const bullishCandle = c.close > c.open
  const volOk = c.volume > volumeAvg20d
  const rsiOk = rsiNow > 60

  const matched = (near10 || near20) && bullishCandle && volOk && rsiOk
  const volRatio = volumeAvg20d > 0 ? c.volume / volumeAvg20d : 1
  const strength = matched ? clamp((rsiNow / 100) * Math.min(volRatio, 2) * 0.5) : 0

  return {
    matched,
    strength,
    extraData: { retestEma: near10 ? 10 : 20, ema10: e10, ema20: e20, volumeRatio: volRatio },
  }
}

/** B3 — EMA 20x50 Fresh Bullish Crossover */
export function b3Ema2050Crossover(ctx: PatternContext): PatternResult {
  const { ema20, ema50, rsi, candles, volumeAvg20d } = ctx
  const e20Now = last(ema20), e20Prev = prev(ema20)
  const e50Now = last(ema50), e50Prev = prev(ema50)
  const rsiNow = last(rsi)
  const vol = candles[candles.length - 1]!.volume

  if (isNaN(e20Now) || isNaN(e20Prev) || isNaN(e50Now) || isNaN(e50Prev) || isNaN(rsiNow))
    return { matched: false, strength: 0, extraData: {} }

  const matched =
    e20Now > e50Now &&
    e20Prev <= e50Prev &&
    vol > volumeAvg20d &&
    rsiNow > 60

  const volRatio = volumeAvg20d > 0 ? vol / volumeAvg20d : 1
  const strength = matched ? clamp((rsiNow / 100) * Math.min(volRatio, 2) * 0.5) : 0

  return { matched, strength, extraData: { ema20: e20Now, ema50: e50Now, volumeRatio: volRatio } }
}

/** B4 — EMA 20/50 Retest Bounce (Bullish) */
export function b4Ema2050Retest(ctx: PatternContext): PatternResult {
  const { ema20, ema50, rsi, candles, volumeAvg20d } = ctx
  const c = candles[candles.length - 1]!
  const e20 = last(ema20), e50 = last(ema50), rsiNow = last(rsi)

  if (isNaN(e20) || isNaN(e50) || isNaN(rsiNow))
    return { matched: false, strength: 0, extraData: {} }

  const near20 = Math.abs(c.close - e20) / e20 < 0.02
  const near50 = Math.abs(c.close - e50) / e50 < 0.02
  const bullishCandle = c.close > c.open
  const volOk = c.volume > volumeAvg20d
  const rsiOk = rsiNow > 60

  const matched = (near20 || near50) && bullishCandle && volOk && rsiOk
  const volRatio = volumeAvg20d > 0 ? c.volume / volumeAvg20d : 1
  const strength = matched ? clamp((rsiNow / 100) * Math.min(volRatio, 2) * 0.5) : 0

  return {
    matched,
    strength,
    extraData: { retestEma: near20 ? 20 : 50, ema20: e20, ema50: e50, volumeRatio: volRatio },
  }
}

/** S1 — EMA 10x20 Death Cross (Bearish) */
export function s1DeathCross(ctx: PatternContext): PatternResult {
  const { ema10, ema20, rsi, candles, volumeAvg20d } = ctx
  const e10Now = last(ema10), e10Prev = prev(ema10)
  const e20Now = last(ema20), e20Prev = prev(ema20)
  const rsiNow = last(rsi)
  const vol = candles[candles.length - 1]!.volume

  if (isNaN(e10Now) || isNaN(e10Prev) || isNaN(e20Now) || isNaN(e20Prev) || isNaN(rsiNow))
    return { matched: false, strength: 0, extraData: {} }

  const matched =
    e10Now < e20Now &&
    e10Prev >= e20Prev &&
    vol > volumeAvg20d &&
    rsiNow < 40

  const volRatio = volumeAvg20d > 0 ? vol / volumeAvg20d : 1
  const strength = matched ? clamp(((100 - rsiNow) / 100) * Math.min(volRatio, 2) * 0.5) : 0

  return { matched, strength, extraData: { ema10: e10Now, ema20: e20Now, volumeRatio: volRatio } }
}

/** S2 — EMA 10/20 Retest Bounce Down (Bearish) */
export function s2EmaRetestDown(ctx: PatternContext): PatternResult {
  const { ema10, ema20, rsi, candles, volumeAvg20d } = ctx
  const c = candles[candles.length - 1]!
  const e10 = last(ema10), e20 = last(ema20), rsiNow = last(rsi)

  if (isNaN(e10) || isNaN(e20) || isNaN(rsiNow))
    return { matched: false, strength: 0, extraData: {} }

  const near10 = Math.abs(c.close - e10) / e10 < 0.02
  const near20 = Math.abs(c.close - e20) / e20 < 0.02
  const bearishCandle = c.close < c.open
  const volOk = c.volume > volumeAvg20d
  const rsiOk = rsiNow < 40

  const matched = (near10 || near20) && bearishCandle && volOk && rsiOk
  const volRatio = volumeAvg20d > 0 ? c.volume / volumeAvg20d : 1
  const strength = matched ? clamp(((100 - rsiNow) / 100) * Math.min(volRatio, 2) * 0.5) : 0

  return {
    matched,
    strength,
    extraData: { retestEma: near10 ? 10 : 20, ema10: e10, ema20: e20, volumeRatio: volRatio },
  }
}

/** S3 — EMA 20x50 Death Cross (Bearish) */
export function s3Ema2050DeathCross(ctx: PatternContext): PatternResult {
  const { ema20, ema50, rsi, candles, volumeAvg20d } = ctx
  const e20Now = last(ema20), e20Prev = prev(ema20)
  const e50Now = last(ema50), e50Prev = prev(ema50)
  const rsiNow = last(rsi)
  const vol = candles[candles.length - 1]!.volume

  if (isNaN(e20Now) || isNaN(e20Prev) || isNaN(e50Now) || isNaN(e50Prev) || isNaN(rsiNow))
    return { matched: false, strength: 0, extraData: {} }

  const matched =
    e20Now < e50Now &&
    e20Prev >= e50Prev &&
    vol > volumeAvg20d &&
    rsiNow < 40

  const volRatio = volumeAvg20d > 0 ? vol / volumeAvg20d : 1
  const strength = matched ? clamp(((100 - rsiNow) / 100) * Math.min(volRatio, 2) * 0.5) : 0

  return { matched, strength, extraData: { ema20: e20Now, ema50: e50Now, volumeRatio: volRatio } }
}

/** S4 — EMA 20/50 Retest Bounce Down (Bearish) */
export function s4Ema2050RetestDown(ctx: PatternContext): PatternResult {
  const { ema20, ema50, rsi, candles, volumeAvg20d } = ctx
  const c = candles[candles.length - 1]!
  const e20 = last(ema20), e50 = last(ema50), rsiNow = last(rsi)

  if (isNaN(e20) || isNaN(e50) || isNaN(rsiNow))
    return { matched: false, strength: 0, extraData: {} }

  const near20 = Math.abs(c.close - e20) / e20 < 0.02
  const near50 = Math.abs(c.close - e50) / e50 < 0.02
  const bearishCandle = c.close < c.open
  const volOk = c.volume > volumeAvg20d
  const rsiOk = rsiNow < 40

  const matched = (near20 || near50) && bearishCandle && volOk && rsiOk
  const volRatio = volumeAvg20d > 0 ? c.volume / volumeAvg20d : 1
  const strength = matched ? clamp(((100 - rsiNow) / 100) * Math.min(volRatio, 2) * 0.5) : 0

  return {
    matched,
    strength,
    extraData: { retestEma: near20 ? 20 : 50, ema20: e20, ema50: e50, volumeRatio: volRatio },
  }
}
