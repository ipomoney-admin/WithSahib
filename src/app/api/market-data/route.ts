import { NextResponse } from 'next/server'
import { FALLBACK_DATA, formatIndianPrice, formatChange, TickerItem } from '@/lib/utils/marketData'

export const revalidate = 14400 // 4 hours

const SYMBOLS = [
  { key: '%5ENSEI',    sym: 'NIFTY 50'   },
  { key: '%5ENSEBANK', sym: 'BANK NIFTY' },
  { key: '%5EBSESN',   sym: 'SENSEX'     },
  { key: 'RELIANCE.NS', sym: 'RELIANCE'  },
  { key: 'HDFCBANK.NS', sym: 'HDFC BANK' },
  { key: 'INFY.NS',    sym: 'INFOSYS'    },
  { key: 'TCS.NS',     sym: 'TCS'        },
  { key: 'WIPRO.NS',   sym: 'WIPRO'      },
  { key: 'ICICIBANK.NS', sym: 'ICICI BANK' },
  { key: 'LT.NS',      sym: 'L&T'        },
]

const YF_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart'

async function fetchSymbol(key: string, sym: string): Promise<TickerItem | null> {
  try {
    const url = `${YF_BASE}/${key}?interval=1d&range=1d`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; withsahib-market-data/1.0)',
      },
      next: { revalidate: 14400 },
    })
    if (!res.ok) return null

    const json = await res.json()
    const meta = json?.chart?.result?.[0]?.meta
    if (!meta) return null

    const price: number = meta.regularMarketPrice ?? meta.previousClose ?? 0
    const prevClose: number = meta.chartPreviousClose ?? meta.previousClose ?? price
    // Yahoo often omits regularMarketChange in non-market hours; derive it
    const change: number = meta.regularMarketChange ?? (price - prevClose)
    const changePct: number =
      meta.regularMarketChangePercent ??
      (prevClose !== 0 ? ((price - prevClose) / prevClose) * 100 : 0)

    return {
      sym,
      val: formatIndianPrice(price),
      raw: price,
      ...formatChange(change, changePct),
    }
  } catch {
    return null
  }
}

export async function GET() {
  const results = await Promise.allSettled(
    SYMBOLS.map(({ key, sym }) => fetchSymbol(key, sym))
  )

  const tickers: TickerItem[] = SYMBOLS.map(({ sym }, i) => {
    const result = results[i]
    if (result.status === 'fulfilled' && result.value) return result.value
    // Fall back to static value for this symbol
    return FALLBACK_DATA.find((f) => f.sym === sym) ?? FALLBACK_DATA[0]
  })

  const successCount = results.filter(
    (r) => r.status === 'fulfilled' && r.value !== null
  ).length

  return NextResponse.json(
    {
      tickers,
      fetchedAt: new Date().toISOString(),
      live: successCount > 0,
      successCount,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=14400, stale-while-revalidate=3600',
      },
    }
  )
}
