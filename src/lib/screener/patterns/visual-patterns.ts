/**
 * Visual chart patterns: Rounding Bottom (B10), Cup & Handle (B11), IH&S (B12), H&S (S10).
 */
import { PatternResult, PatternContext } from '../types'
import { findSwingLows, findSwingHighs, last } from '../indicators'

/** B10 — Rounding Bottom (3-segment approximation over 60 candles) */
export function b10RoundingBottom(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 60) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow <= 60) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 60)
  const seg = Math.floor(slice.length / 3)
  const left = slice.slice(0, seg)
  const middle = slice.slice(seg, seg * 2)
  const right = slice.slice(seg * 2)

  const avg = (cs: typeof slice) => cs.reduce((s, c) => s + c.close, 0) / cs.length
  const leftAvg = avg(left), middleAvg = avg(middle), rightAvg = avg(right)
  const leftVol = left.reduce((s, c) => s + c.volume, 0) / left.length
  const rightVol = right.reduce((s, c) => s + c.volume, 0) / right.length

  const bowlShape = middleAvg < leftAvg && middleAvg < rightAvg
  const recovery = rightAvg >= leftAvg * 0.95
  const risingVol = rightVol > leftVol
  const matched = bowlShape && recovery && risingVol

  const strength = matched
    ? Math.min(1, (rightAvg - middleAvg) / Math.max(0.001, leftAvg - middleAvg))
    : 0

  return { matched, strength, extraData: { leftAvg, middleAvg, rightAvg, leftVol, rightVol } }
}

/** B11 — Cup & Handle */
export function b11CupHandle(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 75) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow <= 60) return { matched: false, strength: 0, extraData: {} }

  const cupCandles = candles.slice(n - 60, n - 15)
  const handleCandles = candles.slice(n - 15)
  const current = candles[n - 1]!!

  // Cup check via rounding bottom logic
  const seg = Math.floor(cupCandles.length / 3)
  const cLeft = cupCandles.slice(0, seg)
  const cMid = cupCandles.slice(seg, seg * 2)
  const cRight = cupCandles.slice(seg * 2)
  const avg = (cs: typeof cupCandles) => cs.reduce((s, c) => s + c.close, 0) / cs.length
  const leftAvg = avg(cLeft), midAvg = avg(cMid), rightAvg = avg(cRight)
  const cupValid = midAvg < leftAvg && midAvg < rightAvg && rightAvg >= leftAvg * 0.95

  if (!cupValid) return { matched: false, strength: 0, extraData: {} }

  const cupRim = Math.max(...cupCandles.map((c) => c.high))
  const handleHigh = Math.max(...handleCandles.map((c) => c.high))
  const handleLow = Math.min(...handleCandles.map((c) => c.low))
  const handleRange = (handleHigh - handleLow) / handleLow

  const cupVolAvg = cupCandles.reduce((s, c) => s + c.volume, 0) / cupCandles.length
  const handleVolAvg = handleCandles.reduce((s, c) => s + c.volume, 0) / handleCandles.length

  const matched =
    handleHigh < cupRim &&
    handleRange < 0.15 &&
    handleVolAvg < cupVolAvg &&
    current.close > cupRim &&
    current.volume > volumeAvg20d * 2 &&
    rsiNow > 60

  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, (rsiNow / 100) * Math.min(volRatio / 2, 1)) : 0

  return { matched, strength, extraData: { cupRim, handleHigh, handleLow, handleRange: Number((handleRange * 100).toFixed(2)), volumeRatio: Number(volRatio.toFixed(2)) } }
}

/** B12 — Inverse Head & Shoulders */
export function b12InverseHS(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 80) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow <= 60) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 80)
  const swingLows = findSwingLows(slice.map((c) => c.low), 3)
  if (swingLows.length < 3) return { matched: false, strength: 0, extraData: {} }

  const last3L = swingLows.slice(-3)
  const ls = last3L[0]!, head = last3L[1]!, rs = last3L[2]!
  if (head.value >= ls.value || head.value >= rs.value)
    return { matched: false, strength: 0, extraData: {} }

  const shoulderDiff = Math.abs(ls.value - rs.value) / ls.value
  if (shoulderDiff >= 0.05) return { matched: false, strength: 0, extraData: {} }
  if (rs.value <= head.value) return { matched: false, strength: 0, extraData: {} }

  // Neckline: avg of highest high between ls&head, and between head&rs
  const leftHighs = slice.slice(ls.index, head.index + 1).map((c) => c.high)
  const rightHighs = slice.slice(head.index, rs.index + 1).map((c) => c.high)
  const neckline = (Math.max(...leftHighs) + Math.max(...rightHighs)) / 2

  // Volume at rsShoulder < lsShoulder
  const lsVol = slice[ls.index]!.volume
  const rsVol = slice[rs.index]!.volume

  const current = candles[n - 1]!!
  const matched =
    current.close > neckline &&
    rsVol < lsVol &&
    current.volume > volumeAvg20d * 1.5

  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, (rsiNow / 100) * Math.min(volRatio / 1.5, 1)) : 0

  return { matched, strength, extraData: { leftShoulder: ls.value, head: head.value, rightShoulder: rs.value, neckline } }
}

/** S10 — Head & Shoulders */
export function s10HeadAndShoulders(ctx: PatternContext): PatternResult {
  const { candles, rsi, volumeAvg20d } = ctx
  const n = candles.length
  if (n < 80) return { matched: false, strength: 0, extraData: {} }

  const rsiNow = last(rsi)
  if (isNaN(rsiNow) || rsiNow >= 40) return { matched: false, strength: 0, extraData: {} }

  const slice = candles.slice(n - 80)
  const swingHighs = findSwingHighs(slice.map((c) => c.high), 3)
  if (swingHighs.length < 3) return { matched: false, strength: 0, extraData: {} }

  const last3H = swingHighs.slice(-3)
  const ls = last3H[0]!, head = last3H[1]!, rs = last3H[2]!
  if (head.value <= ls.value || head.value <= rs.value)
    return { matched: false, strength: 0, extraData: {} }

  const shoulderDiff = Math.abs(ls.value - rs.value) / ls.value
  if (shoulderDiff >= 0.05) return { matched: false, strength: 0, extraData: {} }
  if (rs.value >= head.value) return { matched: false, strength: 0, extraData: {} }

  const leftLows = slice.slice(ls.index, head.index + 1).map((c) => c.low)
  const rightLows = slice.slice(head.index, rs.index + 1).map((c) => c.low)
  const neckline = (Math.min(...leftLows) + Math.min(...rightLows)) / 2

  const lsVol = slice[ls.index]!.volume
  const rsVol = slice[rs.index]!.volume

  const current = candles[n - 1]!!
  const matched =
    current.close < neckline &&
    rsVol < lsVol &&
    current.volume > volumeAvg20d * 1.5

  const volRatio = volumeAvg20d > 0 ? current.volume / volumeAvg20d : 1
  const strength = matched ? Math.min(1, ((100 - rsiNow) / 100) * Math.min(volRatio / 1.5, 1)) : 0

  return { matched, strength, extraData: { leftShoulder: ls.value, head: head.value, rightShoulder: rs.value, neckline } }
}
