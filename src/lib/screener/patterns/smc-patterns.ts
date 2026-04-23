/**
 * Smart Money Concepts patterns (B13-B15, S11-S13).
 * Order Blocks, Fair Value Gaps, and Liquidity Sweeps.
 */
import { PatternResult, PatternContext } from '../types'
import { last } from '../indicators'

/** B13 — Bullish Order Block + Market Structure Break */
export function b13BullishOB(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 55) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow <= 50) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 50)

  // Find a significant bearish move: 3+ consecutive red candles with total move > 3%
  let msbStart = -1, msbEnd = -1, bearStart = -1
  for (let i = 2; i < slice.length - 5; i++) {
    const c0 = slice[i - 2]!, c1 = slice[i - 1]!, c2 = slice[i]!
    const allRed = c0.close < c0.open && c1.close < c1.open && c2.close < c2.open
    const totalMove = (c0.open - c2.close) / c0.open
    if (allRed && totalMove > 0.03) {
      // Check if price later broke above high before this move
      const preHigh = Math.max(...slice.slice(0, i - 2).map((c) => c.high))
      for (let j = i + 1; j < slice.length; j++) {
        if (slice[j]!.close > preHigh) {
          msbStart = i
          msbEnd = j
          bearStart = i - 2
          break
        }
      }
      if (msbStart >= 0) break
    }
  }

  if (msbStart < 0) return { matched: false, strength: 0, extraData: {} }

  // Order Block: last bearish candle before the bullish impulse that caused the MSB
  const obCandle = slice[bearStart]!
  const obHigh = obCandle.high
  const obLow = obCandle.low

  const current = candles[n - 1]!!
  const inOBZone = current.close >= obLow && current.close <= obHigh
  const bouncedFromOB = current.low <= obHigh && current.close > obHigh

  const volOk = current.volume > volumeAvg20d
  const matched = (inOBZone || bouncedFromOB) && volOk

  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, (rsiNow / 100) * Math.min(volRatio, 1)) : 0

  return {
    matched,
    strength,
    extraData: { obHigh, obLow, msbLevel: slice[msbEnd]?.close ?? 0, chochConfirmed: msbStart >= 0 },
  }
}

/** S11 — Bearish Order Block + Market Structure Break */
export function s11BearishOB(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 55) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow >= 50) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 50)

  let msbStart = -1, msbEnd = -1, bullStart = -1
  for (let i = 2; i < slice.length - 5; i++) {
    const c0 = slice[i - 2]!, c1 = slice[i - 1]!, c2 = slice[i]!
    const allGreen = c0.close > c0.open && c1.close > c1.open && c2.close > c2.open
    const totalMove = (c2.close - c0.open) / c0.open
    if (allGreen && totalMove > 0.03) {
      const preLow = Math.min(...slice.slice(0, i - 2).map((c) => c.low))
      for (let j = i + 1; j < slice.length; j++) {
        if (slice[j]!.close < preLow) {
          msbStart = i; msbEnd = j; bullStart = i - 2; break
        }
      }
      if (msbStart >= 0) break
    }
  }

  if (msbStart < 0) return { matched: false, strength: 0, extraData: {} }

  const obCandle = slice[bullStart]!
  const obHigh = obCandle.high
  const obLow = obCandle.low

  const current = candles[n - 1]!!
  const inOBZone = current.close >= obLow && current.close <= obHigh
  const bouncedFromOB = current.high >= obLow && current.close < obLow

  const volOk = current.volume > volumeAvg20d
  const matched = (inOBZone || bouncedFromOB) && volOk

  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, ((100 - rsiNow) / 100) * Math.min(volRatio, 1)) : 0

  return { matched, strength, extraData: { obHigh, obLow, msbLevel: slice[msbEnd]?.close ?? 0, chochConfirmed: msbStart >= 0 } }
}

/** B14 — Bullish Fair Value Gap (mean reversion to unfilled gap) */
export function b14BullishFVG(ctx: PatternContext): PatternResult {
  const { candles, rsi } = ctx
  const n = candles.length
  if (n < 35) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow <= 45) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 30)
  const current = candles[n - 1]!!

  // Find most recent unfilled bullish FVG
  let fvgHigh = 0, fvgLow = 0, fvgDate = ''
  for (let i = slice.length - 2; i >= 2; i--) {
    const prev2 = slice[i - 2]!
    const curr3 = slice[i]!
    // Bullish FVG: curr3.low > prev2.high
    if (curr3.low > prev2.high) {
      const gap = curr3.low - prev2.high
      const gapPct = gap / prev2.high
      if (gapPct > 0.003) {
        // Check if unfilled (price never traded in the gap after formation)
        const afterSlice = slice.slice(i + 1)
        const filled = afterSlice.some((c) => c.low <= curr3.low && c.high >= prev2.high)
        if (!filled) {
          fvgHigh = curr3.low
          fvgLow = prev2.high
          fvgDate = slice[i]!.date
          break
        }
      }
    }
  }

  if (!fvgHigh) return { matched: false, strength: 0, extraData: {} }

  // Price returning to fill FVG
  const inFVG = current.close >= fvgLow && current.close <= fvgHigh
  const touchedAndBounced = current.low <= fvgHigh && current.close > fvgHigh

  const matched = inFVG || touchedAndBounced
  const fvgSize = ((fvgHigh - fvgLow) / fvgLow) * 100
  const strength = matched ? Math.min(1, rsiNow / 100) : 0

  return { matched, strength, extraData: { fvgHigh, fvgLow, fvgDate, fvgSize: Number(fvgSize.toFixed(3)), isFilled: false } }
}

/** S12 — Bearish Fair Value Gap */
export function s12BearishFVG(ctx: PatternContext): PatternResult {
  const { candles, rsi } = ctx
  const n = candles.length
  if (n < 35) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow >= 55) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 30)
  const current = candles[n - 1]!!

  let fvgHigh = 0, fvgLow = 0, fvgDate = ''
  for (let i = slice.length - 2; i >= 2; i--) {
    const prev2 = slice[i - 2]!
    const curr3 = slice[i]!
    // Bearish FVG: curr3.high < prev2.low
    if (curr3.high < prev2.low) {
      const gap = prev2.low - curr3.high
      const gapPct = gap / curr3.high
      if (gapPct > 0.003) {
        const afterSlice = slice.slice(i + 1)
        const filled = afterSlice.some((c) => c.low <= curr3.high && c.high >= prev2.low)
        if (!filled) {
          fvgHigh = prev2.low
          fvgLow = curr3.high
          fvgDate = slice[i]!.date
          break
        }
      }
    }
  }

  if (!fvgHigh) return { matched: false, strength: 0, extraData: {} }

  const inFVG = current.close >= fvgLow && current.close <= fvgHigh
  const touchedAndBounced = current.high >= fvgLow && current.close < fvgLow

  const matched = inFVG || touchedAndBounced
  const fvgSize = ((fvgHigh - fvgLow) / fvgLow) * 100
  const strength = matched ? Math.min(1, (100 - rsiNow) / 100) : 0

  return { matched, strength, extraData: { fvgHigh, fvgLow, fvgDate, fvgSize: Number(fvgSize.toFixed(3)), isFilled: false } }
}

/** B15 — Liquidity Sweep (SSL) + Bullish Reversal */
export function b15LiquiditySweep(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 35) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow <= 40) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 1 - 25, n - 1)
  const lows = slice.map((c) => c.low)

  // Find equal lows (SSL) within 0.5%
  let liquidityLevel = 0
  let equalLowsCount = 0
  for (let i = 0; i < lows.length; i++) {
    let count = 1
    for (let j = i + 1; j < lows.length; j++) {
      if (Math.abs(lows[i]! - lows[j]!) / lows[i]! <= 0.005) count++
    }
    if (count >= 2 && count > equalLowsCount) {
      equalLowsCount = count
      liquidityLevel = lows[i]!
    }
  }

  if (liquidityLevel === 0) return { matched: false, strength: 0, extraData: {} }

  const current = candles[n - 1]!
  // Sweep: low[last] < liquidityLevel but close[last] > liquidityLevel
  const swept = current.low < liquidityLevel && current.close > liquidityLevel
  const bullishClose = current.close > current.open
  const lowerWick = current.open - current.low
  const candleRange = current.high - current.low
  const wickPct = candleRange > 0 ? lowerWick / candleRange : 0
  const volOk = current.volume > volumeAvg20d * 1.5

  const matched = swept && bullishClose && wickPct > 0.5 && volOk

  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, (rsiNow / 100) * Math.min(volRatio / 1.5, 1)) : 0

  return { matched, strength, extraData: { liquidityLevel, sweepLow: current.low, wickSize: Number(wickPct.toFixed(3)), equalLowsCount } }
}

/** S13 — Liquidity Sweep (BSL) + Bearish Reversal */
export function s13LiquiditySweepBearish(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 35) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow >= 60) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 1 - 25, n - 1)
  const highs = slice.map((c) => c.high)

  // Find equal highs (BSL) within 0.5%
  let liquidityLevel = 0
  let equalHighsCount = 0
  for (let i = 0; i < highs.length; i++) {
    let count = 1
    for (let j = i + 1; j < highs.length; j++) {
      if (Math.abs(highs[i]! - highs[j]!) / highs[i]! <= 0.005) count++
    }
    if (count >= 2 && count > equalHighsCount) {
      equalHighsCount = count
      liquidityLevel = highs[i]!
    }
  }

  if (liquidityLevel === 0) return { matched: false, strength: 0, extraData: {} }

  const current = candles[n - 1]!
  const swept = current.high > liquidityLevel && current.close < liquidityLevel
  const bearishClose = current.close < current.open
  const upperWick = current.high - current.open
  const candleRange = current.high - current.low
  const wickPct = candleRange > 0 ? upperWick / candleRange : 0
  const volOk = current.volume > volumeAvg20d * 1.5

  const matched = swept && bearishClose && wickPct > 0.5 && volOk

  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, ((100 - rsiNow) / 100) * Math.min(volRatio / 1.5, 1)) : 0

  return { matched, strength, extraData: { liquidityLevel, sweepHigh: current.high, wickSize: Number(wickPct.toFixed(3)), equalHighsCount } }
}
