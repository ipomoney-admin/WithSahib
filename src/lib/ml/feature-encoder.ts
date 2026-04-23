// Encode raw signal_features rows into numeric feature vectors

const NIFTY_TREND_MAP: Record<string, number> = {
  strong_bull: 2,
  bull: 1,
  neutral: 0,
  bear: -1,
  strong_bear: -2,
}

const NIFTY_EMA_MAP: Record<string, number> = {
  above: 1,
  below: 0,
}

const TIME_BUCKET_MAP: Record<string, number> = {
  '09:15-10:00': 0,
  '10:00-11:30': 1,
  '11:30-13:00': 2,
  '13:00-15:30': 3,
}

const DAY_MAP: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
}

const FEATURE_NAMES = [
  'vix',
  'nifty_trend',
  'nifty_vs_20ema',
  'sector_performance',
  'volume_ratio',
  'vwap_distance',
  'atr_pct',
  'time_bucket',
  'day_of_week',
  'days_to_expiry',
  'iv_percentile',
  'signal_rr_promised',
  'symbol_historical_winrate',
  'similar_setup_count',
]

export { FEATURE_NAMES }

export interface RawFeature {
  vix?: number | null
  nifty_trend?: string | null
  nifty_vs_20ema?: string | null
  sector_performance?: number | null
  volume_ratio?: number | null
  vwap_distance?: number | null
  atr_pct?: number | null
  time_bucket?: string | null
  day_of_week?: string | null
  days_to_expiry?: number | null
  iv_percentile?: number | null
  signal_rr_promised?: number | null
  symbol_historical_winrate?: number | null
  similar_setup_count?: number | null
}

// Clamp a value within [min, max] and replace NaN with fallback
function safe(value: number, min: number, max: number, fallback: number): number {
  if (!isFinite(value) || isNaN(value)) return fallback
  return Math.min(max, Math.max(min, value))
}

export function encodeFeature(raw: RawFeature, medians: Record<string, number>): number[] {
  const get = (key: keyof RawFeature, fallback: number): number => {
    const val = raw[key]
    if (val === null || val === undefined) return medians[key] ?? fallback
    const n = Number(val)
    return isNaN(n) ? (medians[key] ?? fallback) : n
  }

  return [
    safe(get('vix', 15), 0, 100, 15),
    safe(NIFTY_TREND_MAP[raw.nifty_trend ?? ''] ?? 0, -2, 2, 0),
    safe(NIFTY_EMA_MAP[raw.nifty_vs_20ema ?? ''] ?? 0, 0, 1, 0),
    safe(get('sector_performance', 0), -20, 20, 0),
    safe(get('volume_ratio', 1), 0, 50, 1),
    safe(get('vwap_distance', 0), -20, 20, 0),
    safe(get('atr_pct', 1), 0, 20, 1),
    safe(TIME_BUCKET_MAP[raw.time_bucket ?? ''] ?? 0, 0, 3, 0),
    safe(DAY_MAP[raw.day_of_week ?? ''] ?? 0, 0, 4, 0),
    safe(get('days_to_expiry', 3), 0, 7, 3),
    safe(get('iv_percentile', 50), 0, 100, 50),
    safe(get('signal_rr_promised', 2), 0, 20, 2),
    safe(get('symbol_historical_winrate', 50), 0, 100, 50),
    safe(get('similar_setup_count', 0), 0, 10000, 0),
  ]
}

export function computeMedians(rows: RawFeature[]): Record<string, number> {
  const keys: (keyof RawFeature)[] = [
    'vix', 'sector_performance', 'volume_ratio', 'vwap_distance',
    'atr_pct', 'days_to_expiry', 'iv_percentile', 'signal_rr_promised',
    'symbol_historical_winrate', 'similar_setup_count',
  ]

  const medians: Record<string, number> = {}
  for (const key of keys) {
    const vals = rows
      .map((r) => r[key])
      .filter((v): v is number => v !== null && v !== undefined && isFinite(Number(v)) && !isNaN(Number(v)))
      .sort((a, b) => a - b)
    if (vals.length === 0) {
      medians[key] = 0
    } else {
      const mid = Math.floor(vals.length / 2)
      medians[key] = vals.length % 2 === 0 ? ((vals[mid - 1] ?? 0) + (vals[mid] ?? 0)) / 2 : (vals[mid] ?? 0)
    }
  }
  return medians
}

export function encodeOutcome(outcome: string | null | undefined): number {
  if (outcome === 'win') return 1
  if (outcome === 'loss') return 0
  return 0 // neutral defaults to loss for conservative model
}
