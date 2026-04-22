import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { fetchLivePrices } from '@/lib/fyers-client'

export async function GET(req: NextRequest) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const symbolsParam = req.nextUrl.searchParams.get('symbols') ?? ''
  const symbols = symbolsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50) // max 50 symbols per request

  if (symbols.length === 0) {
    return NextResponse.json({ success: false, error: 'symbols query param required' }, { status: 400 })
  }

  const prices = await fetchLivePrices(symbols)
  return NextResponse.json({ success: true, data: prices })
}
