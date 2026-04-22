import { createServiceRoleClient } from '@/lib/supabase/server'

export interface LivePrice {
  symbol: string
  ltp: number
  prev_close: number
  change_pct: number
  open_price: number
  high_price: number
  low_price: number
  volume: number
  oi: number
  iv: number
  vwap: number
  timestamp: string
}

export async function getFyersToken(): Promise<string | null> {
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('fyers_tokens')
    .select('access_token, expires_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) return null
  if (new Date(data.expires_at) <= new Date()) return null
  return data.access_token
}

export async function fetchLivePrice(symbol: string): Promise<LivePrice | null> {
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('live_prices')
    .select('*')
    .eq('symbol', symbol)
    .single()

  return data as LivePrice | null
}

export async function fetchLivePrices(symbols: string[]): Promise<LivePrice[]> {
  if (symbols.length === 0) return []
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('live_prices')
    .select('*')
    .in('symbol', symbols)

  return (data ?? []) as LivePrice[]
}

export function calculateVwapDistance(ltp: number, vwap: number): number {
  if (!vwap || vwap === 0) return 0
  return Number((((ltp - vwap) / vwap) * 100).toFixed(4))
}

export function calculateVolumeRatio(currentVolume: number, avgVolume: number): number {
  if (!avgVolume || avgVolume === 0) return 1
  return Number((currentVolume / avgVolume).toFixed(4))
}

export async function isFyersConnected(): Promise<boolean> {
  const token = await getFyersToken()
  return token !== null
}
