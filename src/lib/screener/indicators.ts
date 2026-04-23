/**
 * Technical indicator calculations for the screener engine.
 * All functions operate on price arrays (oldest first, newest last).
 */

/** Standard Exponential Moving Average. Returns NaN for first (period-1) values. */
export function calculateEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1)
  const result: number[] = new Array(prices.length).fill(NaN) as number[]
  if (prices.length < period) return result

  // seed with SMA of first `period` prices
  let sum = 0
  for (let i = 0; i < period; i++) sum += prices[i]!
  result[period - 1] = sum / period

  for (let i = period; i < prices.length; i++) {
    result[i] = prices[i]! * k + result[i - 1]! * (1 - k)
  }
  return result
}

/** Wilder's RSI. Returns NaN for first `period` values. */
export function calculateRSI(prices: number[], period: number = 14): number[] {
  const result: number[] = new Array(prices.length).fill(NaN) as number[]
  if (prices.length <= period) return result

  let avgGain = 0
  let avgLoss = 0

  for (let i = 1; i <= period; i++) {
    const diff = prices[i]! - prices[i - 1]!
    if (diff > 0) avgGain += diff
    else avgLoss += Math.abs(diff)
  }
  avgGain /= period
  avgLoss /= period

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
  result[period] = 100 - 100 / (1 + rs)

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i]! - prices[i - 1]!
    const gain = diff > 0 ? diff : 0
    const loss = diff < 0 ? Math.abs(diff) : 0
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    const rs2 = avgLoss === 0 ? 100 : avgGain / avgLoss
    result[i] = 100 - 100 / (1 + rs2)
  }
  return result
}

/** Simple average of the last N volumes. */
export function getVolumeAvg(volumes: number[], period: number = 20): number {
  if (volumes.length === 0) return 0
  const slice = volumes.slice(-period)
  return slice.reduce((a, b) => a + b, 0) / slice.length
}

/** Find local lows: candle[i].low is lower than `lookback` candles on each side. */
export function findSwingLows(
  lows: number[],
  lookback: number
): Array<{ index: number; value: number }> {
  const result: Array<{ index: number; value: number }> = []
  for (let i = lookback; i < lows.length - lookback; i++) {
    const val = lows[i]!
    let isLow = true
    for (let j = 1; j <= lookback; j++) {
      if (val >= lows[i - j]! || val >= lows[i + j]!) {
        isLow = false
        break
      }
    }
    if (isLow) result.push({ index: i, value: val })
  }
  return result
}

/** Find local highs: candle[i].high is higher than `lookback` candles on each side. */
export function findSwingHighs(
  highs: number[],
  lookback: number
): Array<{ index: number; value: number }> {
  const result: Array<{ index: number; value: number }> = []
  for (let i = lookback; i < highs.length - lookback; i++) {
    const val = highs[i]!
    let isHigh = true
    for (let j = 1; j <= lookback; j++) {
      if (val <= highs[i - j]! || val <= highs[i + j]!) {
        isHigh = false
        break
      }
    }
    if (isHigh) result.push({ index: i, value: val })
  }
  return result
}

/** Safe last non-NaN value from array */
export function last(arr: number[]): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    const v = arr[i]!
    if (!isNaN(v)) return v
  }
  return NaN
}

/** Safe second-to-last non-NaN value */
export function prev(arr: number[]): number {
  let count = 0
  for (let i = arr.length - 1; i >= 0; i--) {
    const v = arr[i]!
    if (!isNaN(v)) {
      count++
      if (count === 2) return v
    }
  }
  return NaN
}
