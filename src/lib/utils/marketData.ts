export interface TickerItem {
  sym: string
  val: string
  chg: string
  chgAbs: string
  up: boolean
  raw: number
}

// ─── FULL NIFTY 50 + INDICES FALLBACK DATA ─────────────────────────────────
export const FALLBACK_DATA: TickerItem[] = [
  { sym: 'NIFTY 50',     val: '24,162',  chg: '+0.87%', chgAbs: '+208', up: true,  raw: 24162 },
  { sym: 'BANK NIFTY',   val: '52,341',  chg: '-0.18%', chgAbs: '-94',  up: false, raw: 52341 },
  { sym: 'RELIANCE',     val: '2,847',   chg: '+1.24%', chgAbs: '+35',  up: true,  raw: 2847  },
  { sym: 'TCS',          val: '3,892',   chg: '+0.56%', chgAbs: '+22',  up: true,  raw: 3892  },
  { sym: 'HDFC BANK',    val: '1,638',   chg: '-0.32%', chgAbs: '-5',   up: false, raw: 1638  },
  { sym: 'INFOSYS',      val: '1,421',   chg: '+2.14%', chgAbs: '+30',  up: true,  raw: 1421  },
  { sym: 'BHARTIARTL',   val: '1,785',   chg: '+0.91%', chgAbs: '+16',  up: true,  raw: 1785  },
  { sym: 'ICICI BANK',   val: '1,248',   chg: '+0.43%', chgAbs: '+5',   up: true,  raw: 1248  },
  { sym: 'KOTAK BANK',   val: '2,012',   chg: '-0.21%', chgAbs: '-4',   up: false, raw: 2012  },
  { sym: 'L&T',          val: '3,621',   chg: '-0.67%', chgAbs: '-24',  up: false, raw: 3621  },
  { sym: 'HINDUNILVR',   val: '2,342',   chg: '+0.34%', chgAbs: '+8',   up: true,  raw: 2342  },
  { sym: 'SBIN',         val: '812',     chg: '+1.02%', chgAbs: '+8',   up: true,  raw: 812   },
  { sym: 'BAJFINANCE',   val: '7,124',   chg: '+1.55%', chgAbs: '+108', up: true,  raw: 7124  },
  { sym: 'WIPRO',        val: '462',     chg: '+1.90%', chgAbs: '+8',   up: true,  raw: 462   },
  { sym: 'MARUTI',       val: '12,450',  chg: '+0.72%', chgAbs: '+89',  up: true,  raw: 12450 },
  { sym: 'TITAN',        val: '3,298',   chg: '-0.48%', chgAbs: '-16',  up: false, raw: 3298  },
  { sym: 'ASIANPAINT',   val: '2,612',   chg: '-1.02%', chgAbs: '-27',  up: false, raw: 2612  },
  { sym: 'AXISBANK',     val: '1,102',   chg: '+0.38%', chgAbs: '+4',   up: true,  raw: 1102  },
  { sym: 'NTPC',         val: '356',     chg: '+0.56%', chgAbs: '+2',   up: true,  raw: 356   },
  { sym: 'ONGC',         val: '267',     chg: '-0.37%', chgAbs: '-1',   up: false, raw: 267   },
  { sym: 'POWERGRID',    val: '312',     chg: '+0.64%', chgAbs: '+2',   up: true,  raw: 312   },
  { sym: 'ULTRACEMCO',   val: '10,876',  chg: '+0.29%', chgAbs: '+31',  up: true,  raw: 10876 },
  { sym: 'SUNPHARMA',    val: '1,648',   chg: '+1.18%', chgAbs: '+19',  up: true,  raw: 1648  },
  { sym: 'TECHM',        val: '1,412',   chg: '+2.34%', chgAbs: '+32',  up: true,  raw: 1412  },
  { sym: 'ADANIPORTS',   val: '1,324',   chg: '-0.82%', chgAbs: '-11',  up: false, raw: 1324  },
  { sym: 'BAJAJFINSV',   val: '1,812',   chg: '+0.67%', chgAbs: '+12',  up: true,  raw: 1812  },
  { sym: 'NESTLEIND',    val: '2,248',   chg: '-0.14%', chgAbs: '-3',   up: false, raw: 2248  },
  { sym: 'TATASTEEL',    val: '156',     chg: '+1.29%', chgAbs: '+2',   up: true,  raw: 156   },
  { sym: 'JSWSTEEL',     val: '892',     chg: '+0.90%', chgAbs: '+8',   up: true,  raw: 892   },
  { sym: 'HCLTECH',      val: '1,576',   chg: '+1.43%', chgAbs: '+22',  up: true,  raw: 1576  },
  { sym: 'DRREDDY',      val: '6,342',   chg: '+0.51%', chgAbs: '+32',  up: true,  raw: 6342  },
  { sym: 'HINDALCO',     val: '624',     chg: '+0.96%', chgAbs: '+6',   up: true,  raw: 624   },
  { sym: 'CIPLA',        val: '1,478',   chg: '+0.27%', chgAbs: '+4',   up: true,  raw: 1478  },
  { sym: 'DIVISLAB',     val: '4,876',   chg: '-0.33%', chgAbs: '-16',  up: false, raw: 4876  },
  { sym: 'APOLLOHOSP',   val: '6,812',   chg: '+0.88%', chgAbs: '+59',  up: true,  raw: 6812  },
  { sym: 'COALINDIA',    val: '412',     chg: '-0.48%', chgAbs: '-2',   up: false, raw: 412   },
  { sym: 'EICHERMOT',    val: '4,612',   chg: '+0.62%', chgAbs: '+28',  up: true,  raw: 4612  },
  { sym: 'GRASIM',       val: '2,748',   chg: '+0.34%', chgAbs: '+9',   up: true,  raw: 2748  },
  { sym: 'HEROMOTOCO',   val: '4,812',   chg: '-0.27%', chgAbs: '-13',  up: false, raw: 4812  },
  { sym: 'INDUSINDBK',   val: '812',     chg: '-1.24%', chgAbs: '-10',  up: false, raw: 812   },
  { sym: 'ITC',          val: '432',     chg: '+0.46%', chgAbs: '+2',   up: true,  raw: 432   },
  { sym: 'M&M',          val: '3,012',   chg: '+1.07%', chgAbs: '+32',  up: true,  raw: 3012  },
  { sym: 'TATAMOTORS',   val: '712',     chg: '+1.68%', chgAbs: '+12',  up: true,  raw: 712   },
  { sym: 'TATACONSUM',   val: '1,012',   chg: '-0.39%', chgAbs: '-4',   up: false, raw: 1012  },
  { sym: 'BPCL',         val: '312',     chg: '+0.64%', chgAbs: '+2',   up: true,  raw: 312   },
  { sym: 'BRITANNIA',    val: '5,412',   chg: '+0.22%', chgAbs: '+12',  up: true,  raw: 5412  },
  { sym: 'SHRIRAMFIN',   val: '612',     chg: '+0.98%', chgAbs: '+6',   up: true,  raw: 612   },
  { sym: 'SBILIFE',      val: '1,612',   chg: '+0.31%', chgAbs: '+5',   up: true,  raw: 1612  },
  { sym: 'HDFCLIFE',     val: '724',     chg: '-0.55%', chgAbs: '-4',   up: false, raw: 724   },
  { sym: 'BAJAJ-AUTO',   val: '9,248',   chg: '+0.73%', chgAbs: '+67',  up: true,  raw: 9248  },
]

// ─── FORMAT IN INDIAN NUMBER SYSTEM ────────────────────────────────────────
export function formatIndianPrice(price: number): string {
  if (price >= 1000) {
    const parts = price.toFixed(2).split('.')
    const intPart = parts[0] ?? ''
    const decPart = parts[1] ?? '00'
    const lastThree = intPart.slice(-3)
    const rest = intPart.slice(0, -3)
    const formatted = rest
      ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
      : lastThree
    return formatted + '.' + decPart
  }
  return price.toFixed(2)
}

export function formatChange(change: number, changePct: number): Pick<TickerItem, 'chg' | 'chgAbs' | 'up'> {
  const up = change >= 0
  const sign = up ? '+' : ''
  return {
    up,
    chg: `${sign}${changePct.toFixed(2)}%`,
    chgAbs: `${sign}${formatIndianPrice(Math.abs(change))}`,
  }
}
