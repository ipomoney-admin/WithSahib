import { NextResponse } from 'next/server'
import { fetchOHLCVBatch } from '@/lib/screener/data/fyers-feed'
import { runScreener } from '@/lib/screener/screener-engine'

export const dynamic = 'force-dynamic'

const TEST_SYMBOLS = [
  'NSE:RELIANCE-EQ',
  'NSE:TCS-EQ',
  'NSE:INFY-EQ',
  'NSE:HDFCBANK-EQ',
  'NSE:ICICIBANK-EQ',
]

export async function GET() {
  try {
    const candlesMap = await fetchOHLCVBatch(TEST_SYMBOLS, 'D', 400)

    const symbolCount = candlesMap.size
    const candleCounts: Record<string, number> = {}
    for (const [sym, data] of Array.from(candlesMap.entries())) {
      candleCounts[sym] = data.length
    }

    if (symbolCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'No OHLCV data returned — check Fyers token',
        symbolCount,
        candleCounts,
      }, { status: 502 })
    }

    const results = await runScreener(candlesMap, 'swing')

    return NextResponse.json({
      success: true,
      data: {
        symbolsRequested: TEST_SYMBOLS.length,
        symbolsFetched: symbolCount,
        candleCounts,
        patternsMatched: results.length,
        results,
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
