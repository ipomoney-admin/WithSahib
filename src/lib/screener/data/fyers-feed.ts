import { getFyersToken } from '@/lib/fyers-client'
import type { OHLCV } from '@/lib/screener/types'

const FYERS_DATA_URL = 'https://api-t1.fyers.in/data/history'

interface FyersHistoryResponse {
  s: string
  candles: number[][]
}

export async function fetchOHLCV(
  symbol: string,
  resolution: string,
  days: number
): Promise<OHLCV[]> {
  const appId = process.env.FYERS_APP_ID
  if (!appId) throw new Error('FYERS_APP_ID not configured')

  const token = await getFyersToken()
  if (!token) throw new Error('Fyers token not available — please reconnect Fyers')

  const toTs = Math.floor(Date.now() / 1000)
  const fromTs = toTs - days * 24 * 60 * 60

  const url = new URL(FYERS_DATA_URL)
  url.searchParams.set('symbol', symbol)
  url.searchParams.set('resolution', resolution)
  url.searchParams.set('date_format', '1')
  url.searchParams.set('range_from', String(fromTs))
  url.searchParams.set('range_to', String(toTs))
  url.searchParams.set('cont_flag', '1')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `${appId}:${token}` },
    // 10s per symbol timeout
    signal: AbortSignal.timeout(10_000),
  })

  if (!res.ok) throw new Error(`Fyers HTTP ${res.status} for ${symbol}`)

  const json = (await res.json()) as FyersHistoryResponse
  if (json.s !== 'ok' || !json.candles || json.candles.length === 0) return []

  return json.candles.map((c) => ({
    date: new Date(c[0]! * 1000).toISOString().split('T')[0]!,
    open: c[1]!,
    high: c[2]!,
    low: c[3]!,
    close: c[4]!,
    volume: c[5]!,
  }))
}

/** Fetch OHLCV for a batch of symbols concurrently, silently skipping failures. */
export async function fetchOHLCVBatch(
  symbols: string[],
  resolution: string,
  days: number
): Promise<Map<string, OHLCV[]>> {
  const results = new Map<string, OHLCV[]>()
  const settled = await Promise.allSettled(
    symbols.map((s) => fetchOHLCV(s, resolution, days).then((data) => ({ s, data })))
  )
  for (const r of settled) {
    if (r.status === 'fulfilled' && r.value.data.length > 0) {
      results.set(r.value.s, r.value.data)
    }
  }
  return results
}

/** Utility: sleep for ms milliseconds */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
