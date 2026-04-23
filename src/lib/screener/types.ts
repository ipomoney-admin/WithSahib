export interface OHLCV {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface ScreenerResult {
  symbol: string
  exchange: string
  segment: 'swing' | 'intraday_1h' | 'intraday_15m'
  direction: 'bullish' | 'bearish'
  bucketCode: string
  bucketName: string
  priceAtSignal: number
  rsiAtSignal: number
  volumeAtSignal: number
  volumeAvg20d: number
  ema10: number
  ema20: number
  ema50: number
  patternStrength: number
  extraData: Record<string, unknown>
}

export interface PatternResult {
  matched: boolean
  strength: number
  extraData: Record<string, unknown>
}

export interface PatternContext {
  candles: OHLCV[]
  ema10: number[]
  ema20: number[]
  ema50: number[]
  rsi: number[]
  volumeAvg20d: number
}
