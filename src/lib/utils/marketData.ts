export interface TickerItem {
  sym: string
  val: string
  chg: string
  chgAbs: string
  up: boolean
  raw: number
}

// ─── FALLBACK DATA (used when API is unavailable) ──────────────────────────
export const FALLBACK_DATA: TickerItem[] = [
  { sym: 'NIFTY 50',   val: '24,162.45', chg: '+0.87%', chgAbs: '+208.15', up: true,  raw: 24162.45 },
  { sym: 'BANK NIFTY', val: '52,341.80', chg: '-0.18%', chgAbs: '-94.30',  up: false, raw: 52341.80 },
  { sym: 'SENSEX',     val: '79,823.15', chg: '+0.72%', chgAbs: '+571.20', up: true,  raw: 79823.15 },
  { sym: 'RELIANCE',   val: '2,847.30',  chg: '+1.24%', chgAbs: '+34.85',  up: true,  raw: 2847.30  },
  { sym: 'HDFC BANK',  val: '1,638.90',  chg: '-0.32%', chgAbs: '-5.30',   up: false, raw: 1638.90  },
  { sym: 'INFOSYS',    val: '1,421.55',  chg: '+2.14%', chgAbs: '+29.80',  up: true,  raw: 1421.55  },
  { sym: 'TCS',        val: '3,892.20',  chg: '+0.56%', chgAbs: '+21.70',  up: true,  raw: 3892.20  },
  { sym: 'WIPRO',      val: '462.75',    chg: '+1.90%', chgAbs: '+8.60',   up: true,  raw: 462.75   },
  { sym: 'ICICI BANK', val: '1,248.60',  chg: '+0.43%', chgAbs: '+5.30',   up: true,  raw: 1248.60  },
  { sym: 'L&T',        val: '3,621.40',  chg: '-0.67%', chgAbs: '-24.35',  up: false, raw: 3621.40  },
]

// ─── FORMAT IN INDIAN NUMBER SYSTEM ────────────────────────────────────────
export function formatIndianPrice(price: number): string {
  if (price >= 1000) {
    const [intPart, decPart] = price.toFixed(2).split('.')
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
