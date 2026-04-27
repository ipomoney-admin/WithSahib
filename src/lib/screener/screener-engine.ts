import { OHLCV, ScreenerResult, PatternContext } from './types'
import { calculateEMA, calculateRSI, getVolumeAvg, last } from './indicators'

// EMA patterns
import { b1EmaCrossover, b2EmaRetest, b3Ema2050Crossover, b4Ema2050Retest, s1DeathCross, s2EmaRetestDown, s3Ema2050DeathCross, s4Ema2050RetestDown } from './patterns/ema-patterns'
// Darvas
import { b5aDarvas10, b5bDarvas20, s5aDarvasBreak10, s5bDarvasBreak20 } from './patterns/darvas'
// RSI Divergence
import { b6aRsiDiv10, b6bRsiDiv14, b6cRsiDiv21, s6aRsiDiv10, s6bRsiDiv14, s6cRsiDiv21 } from './patterns/rsi-divergence'
// Double/Triple
import { b7aDoubleBottom, b7bTripleBottom, s7aDoubleTop, s7bTripleTop } from './patterns/double-triple'
// Base Breakout
import { b8aBase10, b8bBase15, b8cBase20, s8aBase10, s8bBase15, s8cBase20 } from './patterns/base-breakout'
// VCP
import { b9Vcp, s9VcpBearish } from './patterns/vcp'
// Visual
import { b10RoundingBottom, b11CupHandle, b12InverseHS, s10HeadAndShoulders } from './patterns/visual-patterns'
// SMC
import { b13BullishOB, b14BullishFVG, b15LiquiditySweep, s11BearishOB, s12BearishFVG, s13LiquiditySweepBearish } from './patterns/smc-patterns'

interface PatternDef {
  code: string
  name: string
  direction: 'bullish' | 'bearish'
  fn: (ctx: PatternContext) => { matched: boolean; strength: number; extraData: Record<string, unknown> }
}

const PATTERNS: PatternDef[] = [
  { code: 'B1',  name: 'EMA 10x20 Fresh Crossover',       direction: 'bullish', fn: b1EmaCrossover },
  { code: 'B2',  name: 'EMA 10/20 Retest Bounce',          direction: 'bullish', fn: b2EmaRetest },
  { code: 'B3',  name: 'EMA 20x50 Fresh Crossover',        direction: 'bullish', fn: b3Ema2050Crossover },
  { code: 'B4',  name: 'EMA 20/50 Retest Bounce',          direction: 'bullish', fn: b4Ema2050Retest },
  { code: 'S1',  name: 'EMA 10x20 Death Cross',            direction: 'bearish', fn: s1DeathCross },
  { code: 'S2',  name: 'EMA 10/20 Retest Down',            direction: 'bearish', fn: s2EmaRetestDown },
  { code: 'S3',  name: 'EMA 20x50 Death Cross',            direction: 'bearish', fn: s3Ema2050DeathCross },
  { code: 'S4',  name: 'EMA 20/50 Retest Down',            direction: 'bearish', fn: s4Ema2050RetestDown },
  { code: 'B5A', name: 'Darvas Box Breakout 10D',          direction: 'bullish', fn: b5aDarvas10 },
  { code: 'B5B', name: 'Darvas Box Breakout 20D',          direction: 'bullish', fn: b5bDarvas20 },
  { code: 'S5A', name: 'Darvas Box Breakdown 10D',         direction: 'bearish', fn: s5aDarvasBreak10 },
  { code: 'S5B', name: 'Darvas Box Breakdown 20D',         direction: 'bearish', fn: s5bDarvasBreak20 },
  { code: 'B6A', name: 'Bullish RSI Divergence 10D',       direction: 'bullish', fn: b6aRsiDiv10 },
  { code: 'B6B', name: 'Bullish RSI Divergence 14D',       direction: 'bullish', fn: b6bRsiDiv14 },
  { code: 'B6C', name: 'Bullish RSI Divergence 21D',       direction: 'bullish', fn: b6cRsiDiv21 },
  { code: 'S6A', name: 'Bearish RSI Divergence 10D',       direction: 'bearish', fn: s6aRsiDiv10 },
  { code: 'S6B', name: 'Bearish RSI Divergence 14D',       direction: 'bearish', fn: s6bRsiDiv14 },
  { code: 'S6C', name: 'Bearish RSI Divergence 21D',       direction: 'bearish', fn: s6cRsiDiv21 },
  { code: 'B7A', name: 'Double Bottom Breakout',           direction: 'bullish', fn: b7aDoubleBottom },
  { code: 'B7B', name: 'Triple Bottom Breakout',           direction: 'bullish', fn: b7bTripleBottom },
  { code: 'S7A', name: 'Double Top Breakdown',             direction: 'bearish', fn: s7aDoubleTop },
  { code: 'S7B', name: 'Triple Top Breakdown',             direction: 'bearish', fn: s7bTripleTop },
  { code: 'B8A', name: 'Base Breakout 10D',                direction: 'bullish', fn: b8aBase10 },
  { code: 'B8B', name: 'Base Breakout 15D',                direction: 'bullish', fn: b8bBase15 },
  { code: 'B8C', name: 'Base Breakout 20D',                direction: 'bullish', fn: b8cBase20 },
  { code: 'S8A', name: 'Base Breakdown 10D',               direction: 'bearish', fn: s8aBase10 },
  { code: 'S8B', name: 'Base Breakdown 15D',               direction: 'bearish', fn: s8bBase15 },
  { code: 'S8C', name: 'Base Breakdown 20D',               direction: 'bearish', fn: s8cBase20 },
  { code: 'B9',  name: 'VCP Bullish',                      direction: 'bullish', fn: b9Vcp },
  { code: 'S9',  name: 'VCP Bearish',                      direction: 'bearish', fn: s9VcpBearish },
  { code: 'B10', name: 'Rounding Bottom',                  direction: 'bullish', fn: b10RoundingBottom },
  { code: 'B11', name: 'Cup & Handle',                     direction: 'bullish', fn: b11CupHandle },
  { code: 'B12', name: 'Inverse Head & Shoulders',         direction: 'bullish', fn: b12InverseHS },
  { code: 'S10', name: 'Head & Shoulders',                 direction: 'bearish', fn: s10HeadAndShoulders },
  { code: 'B13', name: 'Bullish Order Block + MSB',        direction: 'bullish', fn: b13BullishOB },
  { code: 'B14', name: 'Bullish Fair Value Gap',           direction: 'bullish', fn: b14BullishFVG },
  { code: 'B15', name: 'Liquidity Sweep (SSL) Reversal',  direction: 'bullish', fn: b15LiquiditySweep },
  { code: 'S11', name: 'Bearish Order Block + MSB',        direction: 'bearish', fn: s11BearishOB },
  { code: 'S12', name: 'Bearish Fair Value Gap',           direction: 'bearish', fn: s12BearishFVG },
  { code: 'S13', name: 'Liquidity Sweep (BSL) Reversal',  direction: 'bearish', fn: s13LiquiditySweepBearish },
]

export async function runScreener(
  candles: Map<string, OHLCV[]>,
  segment: 'swing' | 'intraday_1h' | 'intraday_15m'
): Promise<ScreenerResult[]> {
  const results: ScreenerResult[] = []

  for (const [symbol, data] of Array.from(candles.entries())) {
    if (data.length < 100) continue

    try {
      const closes = data.map((c) => c.close)
      const volumes = data.map((c) => c.volume)

      const ema10 = calculateEMA(closes, 10)
      const ema20 = calculateEMA(closes, 20)
      const ema50 = calculateEMA(closes, 50)
      const rsi = calculateRSI(closes, 14)
      const volumeAvg20d = getVolumeAvg(volumes, 20)

      const ctx: PatternContext = { candles: data, ema10, ema20, ema50, rsi, volumeAvg20d }

      for (const pattern of PATTERNS) {
        try {
          const result = pattern.fn(ctx)
          if (!result.matched) continue

          const lastCandle = data[data.length - 1]!
          results.push({
            symbol,
            exchange: 'NSE',
            segment,
            direction: pattern.direction,
            bucketCode: pattern.code,
            bucketName: pattern.name,
            priceAtSignal: lastCandle.close,
            rsiAtSignal: last(rsi),
            volumeAtSignal: lastCandle.volume,
            volumeAvg20d,
            ema10: last(ema10),
            ema20: last(ema20),
            ema50: last(ema50),
            patternStrength: result.strength,
            extraData: result.extraData,
          })
        } catch {
          // skip failed pattern, continue with next
        }
      }
    } catch (err) {
      console.error(`Screener error for symbol ${symbol}:`, err)
    }
  }

  results.sort((a, b) => b.patternStrength - a.patternStrength)
  return results
}
