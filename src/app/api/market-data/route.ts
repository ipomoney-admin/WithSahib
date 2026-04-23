import { NextResponse } from 'next/server'
import { FALLBACK_DATA, formatIndianPrice, formatChange, TickerItem } from '@/lib/utils/marketData'

export const revalidate = 14400 // 4 hours

// Full Nifty 50 + Indices
const SYMBOLS = [
  { key: '%5ENSEI',       sym: 'NIFTY 50'   },
  { key: '%5ENSEBANK',    sym: 'BANK NIFTY' },
  { key: 'RELIANCE.NS',  sym: 'RELIANCE'   },
  { key: 'TCS.NS',       sym: 'TCS'        },
  { key: 'HDFCBANK.NS',  sym: 'HDFC BANK'  },
  { key: 'INFY.NS',      sym: 'INFOSYS'    },
  { key: 'BHARTIARTL.NS',sym: 'BHARTIARTL' },
  { key: 'ICICIBANK.NS', sym: 'ICICI BANK' },
  { key: 'KOTAKBANK.NS', sym: 'KOTAK BANK' },
  { key: 'LT.NS',        sym: 'L&T'        },
  { key: 'HINDUNILVR.NS',sym: 'HINDUNILVR' },
  { key: 'SBIN.NS',      sym: 'SBIN'       },
  { key: 'BAJFINANCE.NS',sym: 'BAJFINANCE' },
  { key: 'WIPRO.NS',     sym: 'WIPRO'      },
  { key: 'MARUTI.NS',    sym: 'MARUTI'     },
  { key: 'TITAN.NS',     sym: 'TITAN'      },
  { key: 'ASIANPAINT.NS',sym: 'ASIANPAINT' },
  { key: 'AXISBANK.NS',  sym: 'AXISBANK'   },
  { key: 'NTPC.NS',      sym: 'NTPC'       },
  { key: 'ONGC.NS',      sym: 'ONGC'       },
  { key: 'POWERGRID.NS', sym: 'POWERGRID'  },
  { key: 'ULTRACEMCO.NS',sym: 'ULTRACEMCO' },
  { key: 'SUNPHARMA.NS', sym: 'SUNPHARMA'  },
  { key: 'TECHM.NS',     sym: 'TECHM'      },
  { key: 'ADANIPORTS.NS',sym: 'ADANIPORTS' },
  { key: 'BAJAJFINSV.NS',sym: 'BAJAJFINSV' },
  { key: 'NESTLEIND.NS', sym: 'NESTLEIND'  },
  { key: 'TATASTEEL.NS', sym: 'TATASTEEL'  },
  { key: 'JSWSTEEL.NS',  sym: 'JSWSTEEL'   },
  { key: 'HCLTECH.NS',   sym: 'HCLTECH'    },
  { key: 'DRREDDY.NS',   sym: 'DRREDDY'    },
  { key: 'HINDALCO.NS',  sym: 'HINDALCO'   },
  { key: 'CIPLA.NS',     sym: 'CIPLA'      },
  { key: 'DIVISLAB.NS',  sym: 'DIVISLAB'   },
  { key: 'APOLLOHOSP.NS',sym: 'APOLLOHOSP' },
  { key: 'COALINDIA.NS', sym: 'COALINDIA'  },
  { key: 'EICHERMOT.NS', sym: 'EICHERMOT'  },
  { key: 'GRASIM.NS',    sym: 'GRASIM'     },
  { key: 'HEROMOTOCO.NS',sym: 'HEROMOTOCO' },
  { key: 'INDUSINDBK.NS',sym: 'INDUSINDBK' },
  { key: 'ITC.NS',       sym: 'ITC'        },
  { key: 'M%26M.NS',     sym: 'M&M'        },
  { key: 'TATAMOTORS.NS',sym: 'TATAMOTORS' },
  { key: 'TATACONSUM.NS',sym: 'TATACONSUM' },
  { key: 'BPCL.NS',      sym: 'BPCL'       },
  { key: 'BRITANNIA.NS', sym: 'BRITANNIA'  },
  { key: 'SHRIRAMFIN.NS',sym: 'SHRIRAMFIN' },
  { key: 'SBILIFE.NS',   sym: 'SBILIFE'    },
  { key: 'HDFCLIFE.NS',  sym: 'HDFCLIFE'   },
  { key: 'BAJAJ-AUTO.NS',sym: 'BAJAJ-AUTO' },
]

const YF_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart'

async function fetchSymbol(key: string, sym: string): Promise<TickerItem | null> {
  try {
    const url = `${YF_BASE}/${key}?interval=1d&range=1d`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; withsahib-market-data/1.0)' },
      next: { revalidate: 14400 },
    })
    if (!res.ok) return null

    const json = await res.json()
    const meta = json?.chart?.result?.[0]?.meta
    if (!meta) return null

    const price: number = meta.regularMarketPrice ?? meta.previousClose ?? 0
    const prevClose: number = meta.chartPreviousClose ?? meta.previousClose ?? price
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

// Fetch in batches of 10 to avoid rate limits
async function fetchBatch(batch: typeof SYMBOLS): Promise<(TickerItem | null)[]> {
  return Promise.allSettled(batch.map(({ key, sym }) => fetchSymbol(key, sym))).then(
    (results) => results.map((r) => (r.status === 'fulfilled' ? r.value : null))
  )
}

export async function GET() {
  const BATCH_SIZE = 10
  const batches: typeof SYMBOLS[] = []
  for (let i = 0; i < SYMBOLS.length; i += BATCH_SIZE) {
    batches.push(SYMBOLS.slice(i, i + BATCH_SIZE))
  }

  const batchResults = await Promise.allSettled(batches.map(fetchBatch))
  const allResults: (TickerItem | null)[] = []
  for (const batch of batchResults) {
    if (batch.status === 'fulfilled') {
      allResults.push(...batch.value)
    } else {
      allResults.push(...new Array(BATCH_SIZE).fill(null))
    }
  }

  const tickers: TickerItem[] = SYMBOLS.map(({ sym }, i) => {
    const result = allResults[i]
    if (result) return result
    const fallback = FALLBACK_DATA.find((f) => f.sym === sym) ?? FALLBACK_DATA[0]
    return fallback!
  })

  const successCount = allResults.filter(Boolean).length

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
