'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { TrendingUp, TrendingDown, ChevronDown, ChevronRight, Share2, X, BarChart2, RefreshCw, AlertCircle } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScreenerResult {
  id: string
  symbol: string
  exchange: string
  segment: string
  direction: 'bullish' | 'bearish'
  bucket_code: string
  bucket_name: string
  price_at_signal: number
  rsi_at_signal: number
  volume_at_signal: number
  volume_avg_20d: number
  ema10: number
  ema20: number
  ema50: number
  extra_data: Record<string, unknown>
  shared_with_users: boolean
  shared_at: string | null
  scanned_at: string
  screener_signal_tracking?: Array<{
    outcome: string
    outcome_pct: number | null
    price_5d: number | null
    price_10d: number | null
  }>
}

interface Stats {
  bullishToday: number
  bearishToday: number
  sharedToday: number
  bestBucket: { code: string; name: string; winRate: number }
  winRate30d: number
  missedOpportunities: number
}

interface BucketDef {
  code: string
  name: string
  direction: 'bullish' | 'bearish'
}

// ─── Bucket Definitions ───────────────────────────────────────────────────────

const BUCKETS: BucketDef[] = [
  { code: 'B1',  name: 'EMA 10x20 Fresh Crossover',      direction: 'bullish' },
  { code: 'B2',  name: 'EMA 10/20 Retest Bounce',         direction: 'bullish' },
  { code: 'B3',  name: 'EMA 20x50 Fresh Crossover',       direction: 'bullish' },
  { code: 'B4',  name: 'EMA 20/50 Retest Bounce',         direction: 'bullish' },
  { code: 'B5A', name: 'Darvas Box Breakout 10D',         direction: 'bullish' },
  { code: 'B5B', name: 'Darvas Box Breakout 20D',         direction: 'bullish' },
  { code: 'B6A', name: 'RSI Divergence 10D',              direction: 'bullish' },
  { code: 'B6B', name: 'RSI Divergence 14D',              direction: 'bullish' },
  { code: 'B6C', name: 'RSI Divergence 21D',              direction: 'bullish' },
  { code: 'B7A', name: 'Double Bottom Breakout',          direction: 'bullish' },
  { code: 'B7B', name: 'Triple Bottom Breakout',          direction: 'bullish' },
  { code: 'B8A', name: 'Base Breakout 10D',               direction: 'bullish' },
  { code: 'B8B', name: 'Base Breakout 15D',               direction: 'bullish' },
  { code: 'B8C', name: 'Base Breakout 20D',               direction: 'bullish' },
  { code: 'B9',  name: 'VCP Bullish',                     direction: 'bullish' },
  { code: 'B10', name: 'Rounding Bottom',                 direction: 'bullish' },
  { code: 'B11', name: 'Cup & Handle',                    direction: 'bullish' },
  { code: 'B12', name: 'Inverse Head & Shoulders',        direction: 'bullish' },
  { code: 'B13', name: 'Bullish Order Block + MSB',       direction: 'bullish' },
  { code: 'B14', name: 'Bullish Fair Value Gap',          direction: 'bullish' },
  { code: 'B15', name: 'Liquidity Sweep (SSL)',           direction: 'bullish' },
  { code: 'S1',  name: 'EMA 10x20 Death Cross',           direction: 'bearish' },
  { code: 'S2',  name: 'EMA 10/20 Retest Down',           direction: 'bearish' },
  { code: 'S3',  name: 'EMA 20x50 Death Cross',           direction: 'bearish' },
  { code: 'S4',  name: 'EMA 20/50 Retest Down',           direction: 'bearish' },
  { code: 'S5A', name: 'Darvas Breakdown 10D',            direction: 'bearish' },
  { code: 'S5B', name: 'Darvas Breakdown 20D',            direction: 'bearish' },
  { code: 'S6A', name: 'Bearish RSI Divergence 10D',      direction: 'bearish' },
  { code: 'S6B', name: 'Bearish RSI Divergence 14D',      direction: 'bearish' },
  { code: 'S6C', name: 'Bearish RSI Divergence 21D',      direction: 'bearish' },
  { code: 'S7A', name: 'Double Top Breakdown',            direction: 'bearish' },
  { code: 'S7B', name: 'Triple Top Breakdown',            direction: 'bearish' },
  { code: 'S8A', name: 'Base Breakdown 10D',              direction: 'bearish' },
  { code: 'S8B', name: 'Base Breakdown 15D',              direction: 'bearish' },
  { code: 'S8C', name: 'Base Breakdown 20D',              direction: 'bearish' },
  { code: 'S9',  name: 'VCP Bearish',                     direction: 'bearish' },
  { code: 'S10', name: 'Head & Shoulders',                direction: 'bearish' },
  { code: 'S11', name: 'Bearish Order Block + MSB',       direction: 'bearish' },
  { code: 'S12', name: 'Bearish Fair Value Gap',          direction: 'bearish' },
  { code: 'S13', name: 'Liquidity Sweep (BSL)',           direction: 'bearish' },
]

const BULLISH_BUCKETS = BUCKETS.filter((b) => b.direction === 'bullish')
const BEARISH_BUCKETS = BUCKETS.filter((b) => b.direction === 'bearish')

// ─── Helpers ─────────────────────────────────────────────────────────────────

function volRatio(r: ScreenerResult) {
  if (!r.volume_avg_20d || r.volume_avg_20d === 0) return 1
  return r.volume_at_signal / r.volume_avg_20d
}

function rsiColor(rsi: number) {
  if (rsi > 60) return '#00C896'
  if (rsi < 40) return '#EF4444'
  return '#D4A843'
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

function formatINR(n: number) {
  return n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PatternStrengthDots({ strength }: { strength: number }) {
  const filled = Math.round((strength ?? 0) * 5)
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: i <= filled ? '#00C896' : 'var(--border)',
          }}
        />
      ))}
    </div>
  )
}

function VolumeBar({ ratio }: { ratio: number }) {
  const pct = Math.min(100, (ratio / 3) * 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ fontSize: 11, color: ratio >= 2 ? '#00C896' : 'var(--text2)', minWidth: 36 }}>
        {ratio.toFixed(1)}x
      </div>
      <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: ratio >= 2 ? '#00C896' : '#D4A843', borderRadius: 2 }} />
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, height: 180, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: 'var(--text3)', gap: 12 }}>
      <BarChart2 size={40} strokeWidth={1} />
      <p style={{ margin: 0, fontSize: 14 }}>{message}</p>
    </div>
  )
}

// ─── Chart Modal ──────────────────────────────────────────────────────────────

function ChartModal({ result, onClose }: { result: ScreenerResult; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let cleanup = () => {}

    import('lightweight-charts').then(({ createChart, CandlestickSeries, LineSeries }) => {
      if (!containerRef.current) return
      const chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height: 400,
        layout: { background: { color: '#06090F' }, textColor: '#8FA8C0' },
        grid: { vertLines: { color: '#1A2333' }, horzLines: { color: '#1A2333' } },
        timeScale: { borderColor: '#1A2333' },
        rightPriceScale: { borderColor: '#1A2333' },
      })

      // Placeholder mock candles since live feed not connected
      const now = Date.now()
      const mockCandles = Array.from({ length: 90 }, (_, i) => {
        const base = result.price_at_signal * (1 + (Math.random() - 0.52) * 0.02)
        const t = Math.floor((now - (89 - i) * 86400000) / 1000) as unknown as import('lightweight-charts').Time
        return { time: t, open: base, high: base * 1.01, low: base * 0.99, close: base * (1 + (Math.random() - 0.5) * 0.005) }
      })

      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#00C896', downColor: '#EF4444',
        borderUpColor: '#00C896', borderDownColor: '#EF4444',
        wickUpColor: '#00C896', wickDownColor: '#EF4444',
      })
      candleSeries.setData(mockCandles)

      // EMA overlays
      const ema10Line = chart.addSeries(LineSeries, { color: '#3B82F6', lineWidth: 1, title: 'EMA10' })
      const ema20Line = chart.addSeries(LineSeries, { color: '#D4A843', lineWidth: 1, title: 'EMA20' })
      const ema50Line = chart.addSeries(LineSeries, { color: '#8B5CF6', lineWidth: 1, title: 'EMA50' })

      ema10Line.setData(mockCandles.map((c) => ({ time: c.time, value: result.ema10 })))
      ema20Line.setData(mockCandles.map((c) => ({ time: c.time, value: result.ema20 })))
      ema50Line.setData(mockCandles.map((c) => ({ time: c.time, value: result.ema50 })))

      chart.timeScale().fitContent()

      cleanup = () => chart.remove()
    }).catch(() => {})

    return () => cleanup()
  }, [result])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(6,9,15,0.92)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
        width: '100%', maxWidth: 900, padding: 24, position: 'relative',
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{result.symbol}</span>
            <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 8 }}>{result.bucket_code} — {result.bucket_name}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>
          Chart shows mock data — live feed not yet connected. EMA lines reflect signal-time values.
        </div>
        <div ref={containerRef} style={{ width: '100%', borderRadius: 8, overflow: 'hidden' }} />
        <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 11, color: 'var(--text3)' }}>
          <span style={{ color: '#3B82F6' }}>─ EMA10</span>
          <span style={{ color: '#D4A843' }}>─ EMA20</span>
          <span style={{ color: '#8B5CF6' }}>─ EMA50</span>
        </div>
      </div>
    </div>
  )
}

// ─── Signal Card ──────────────────────────────────────────────────────────────

function SignalCard({
  result,
  tab,
  onAction,
  onChart,
}: {
  result: ScreenerResult
  tab: 'queue' | 'shared' | 'missed'
  onAction: (id: string, action: 'share' | 'ignore') => void
  onChart: (r: ScreenerResult) => void
}) {
  const vr = volRatio(result)
  const track = result.screener_signal_tracking?.[0]
  const outcomePct = track?.outcome_pct
  const price10d = track?.price_10d
  const missedMove = price10d && result.price_at_signal
    ? ((price10d - result.price_at_signal) / result.price_at_signal * 100)
    : null

  const isGreen = result.direction === 'bullish'
  const accentColor = isGreen ? '#00C896' : '#EF4444'

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid var(--border)`,
      borderLeft: `3px solid ${accentColor}`,
      borderRadius: 10,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{result.symbol}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 6px',
              background: isGreen ? 'rgba(0,200,150,0.12)' : 'rgba(239,68,68,0.12)',
              color: accentColor, borderRadius: 4,
            }}>{result.bucket_code}</span>
            <span style={{ fontSize: 10, color: 'var(--text3)', background: 'var(--bg)', padding: '2px 5px', borderRadius: 3 }}>
              {result.exchange}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{timeAgo(result.scanned_at)}</div>
        </div>
        {tab === 'missed' && missedMove !== null && (
          <span style={{
            fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
            background: missedMove > 0 ? 'rgba(0,200,150,0.12)' : 'rgba(239,68,68,0.12)',
            color: missedMove > 0 ? '#00C896' : '#EF4444',
          }}>
            {missedMove > 0 ? '+' : ''}{missedMove.toFixed(1)}%
          </span>
        )}
        {tab === 'shared' && track?.outcome && track.outcome !== 'open' && (
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 6, fontWeight: 600,
            background: track.outcome === 'win' ? 'rgba(0,200,150,0.15)' : 'rgba(239,68,68,0.15)',
            color: track.outcome === 'win' ? '#00C896' : '#EF4444',
          }}>
            {track.outcome === 'win' ? '✓ Win' : '✗ Loss'}
            {outcomePct !== null && outcomePct !== undefined ? ` ${outcomePct > 0 ? '+' : ''}${outcomePct.toFixed(1)}%` : ''}
          </span>
        )}
      </div>

      {/* Price row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 2 }}>Signal Price</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>₹{formatINR(result.price_at_signal)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 2 }}>RSI</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: rsiColor(result.rsi_at_signal) }}>
            {result.rsi_at_signal?.toFixed(1) ?? '—'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 2 }}>Strength</div>
          <PatternStrengthDots strength={(result.extra_data?.strength as number) ?? 0} />
        </div>
      </div>

      {/* Volume */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>Volume vs Avg</div>
        <VolumeBar ratio={vr} />
      </div>

      {/* Extra data */}
      {Object.keys(result.extra_data ?? {}).length > 0 && (
        <div style={{ fontSize: 10, color: 'var(--text3)', background: 'var(--bg)', padding: '6px 8px', borderRadius: 6 }}>
          {Object.entries(result.extra_data).slice(0, 3).map(([k, v]) => (
            <span key={k} style={{ marginRight: 10 }}>
              {k.replace(/_/g, ' ')}: <span style={{ color: 'var(--text2)' }}>{typeof v === 'number' ? v.toFixed(2) : String(v)}</span>
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
        {tab === 'queue' && (
          <>
            <button
              onClick={() => onAction(result.id, 'share')}
              style={{
                flex: 1, padding: '7px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: '#00C896', color: '#000', fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}
            >
              <Share2 size={12} /> Share Signal
            </button>
            <button
              onClick={() => onAction(result.id, 'ignore')}
              style={{
                padding: '7px 12px', borderRadius: 6, border: '1px solid var(--border)',
                background: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 12,
              }}
            >
              <X size={12} />
            </button>
          </>
        )}
        <button
          onClick={() => onChart(result)}
          style={{
            padding: '7px 12px', borderRadius: 6, border: '1px solid var(--border)',
            background: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: 12,
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          <BarChart2 size={12} /> Chart
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ScreenerAdminPage() {
  const [activeSegment, setActiveSegment] = useState<'swing' | 'intraday_1h' | 'intraday_15m' | 'stock_options' | 'index_options'>('swing')
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'queue' | 'shared' | 'missed'>('queue')
  const [bullishExpanded, setBullishExpanded] = useState(true)
  const [bearishExpanded, setBearishExpanded] = useState(true)
  const [results, setResults] = useState<ScreenerResult[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [chartResult, setChartResult] = useState<ScreenerResult | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Counts per bucket for sidebar badges
  const countByBucket = (code: string) => results.filter((r) => r.bucket_code === code).length

  const fetchResults = useCallback(async () => {
    if (activeSegment === 'stock_options' || activeSegment === 'index_options') return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ segment: activeSegment })
      if (selectedBucket) params.set('bucketCode', selectedBucket)
      const res = await fetch(`/api/screener/results?${params}`)
      const json = await res.json()
      if (json.success) setResults(json.data.results)
      else setError(json.error ?? 'Failed to load results')
    } catch {
      setError('Network error loading results')
    } finally {
      setLoading(false)
    }
  }, [activeSegment, selectedBucket])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/screener/stats')
      const json = await res.json()
      if (json.success) setStats(json.data)
    } catch { /* stats are non-critical */ }
  }, [])

  useEffect(() => {
    fetchResults()
    fetchStats()
  }, [fetchResults, fetchStats])

  async function handleAction(id: string, action: 'share' | 'ignore') {
    setActionLoading(id)
    try {
      const res = await fetch('/api/screener/signal-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId: id, action }),
      })
      const json = await res.json()
      if (json.success) {
        setResults((prev) => prev.map((r) => r.id === id ? { ...r, shared_with_users: action === 'share' } : r))
      }
    } finally {
      setActionLoading(null)
    }
  }

  function filteredResults() {
    let base = selectedBucket ? results.filter((r) => r.bucket_code === selectedBucket) : results
    if (activeTab === 'queue') return base.filter((r) => !r.shared_with_users)
    if (activeTab === 'shared') return base.filter((r) => r.shared_with_users)
    // missed: not shared
    return base.filter((r) => !r.shared_with_users)
  }

  const displayed = filteredResults()
  const selectedBucketDef = BUCKETS.find((b) => b.code === selectedBucket)
  const isComingSoon = activeSegment === 'stock_options' || activeSegment === 'index_options'

  const segmentTabs = [
    { id: 'swing', label: 'Swing' },
    { id: 'intraday_1h', label: 'Intraday' },
    { id: 'stock_options', label: 'Stock Options' },
    { id: 'index_options', label: 'Index Options' },
  ] as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-body)' }}>
      {/* Top Nav */}
      <div style={{
        height: 52, flexShrink: 0, borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 4,
        background: 'var(--surface)',
      }}>
        {segmentTabs.map((seg) => (
          <button
            key={seg.id}
            onClick={() => { setActiveSegment(seg.id); setSelectedBucket(null) }}
            style={{
              padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: activeSegment === seg.id ? 600 : 400,
              background: activeSegment === seg.id ? '#00C896' : 'transparent',
              color: activeSegment === seg.id ? '#000' : 'var(--text2)',
              transition: 'all 0.15s',
            }}
          >
            {seg.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => { fetchResults(); fetchStats() }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 6, display: 'flex', alignItems: 'center' }}
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Coming Soon Overlay */}
        {isComingSoon && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(6,9,15,0.8)', zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12,
          }}>
            <AlertCircle size={40} color="var(--text3)" strokeWidth={1} />
            <p style={{ color: 'var(--text3)', fontSize: 16, margin: 0 }}>Coming Soon</p>
            <p style={{ color: 'var(--text3)', fontSize: 12, margin: 0 }}>This screener segment is under development.</p>
          </div>
        )}

        {/* Left Sidebar */}
        <aside style={{
          width: 280, flexShrink: 0, height: '100%', overflowY: 'auto',
          borderRight: '1px solid var(--border)', padding: '12px 8px',
        }}>
          {/* Bullish section */}
          <button
            onClick={() => setBullishExpanded((v) => !v)}
            style={{
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 8px',
              color: '#00C896', fontSize: 12, fontWeight: 600, letterSpacing: 0.5,
            }}
          >
            {bullishExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <TrendingUp size={13} />
            BULLISH
          </button>
          {bullishExpanded && (
            <div style={{ marginBottom: 8 }}>
              {BULLISH_BUCKETS.map((b) => {
                const cnt = countByBucket(b.code)
                const active = selectedBucket === b.code
                return (
                  <button
                    key={b.code}
                    onClick={() => setSelectedBucket(active ? null : b.code)}
                    style={{
                      width: '100%', background: active ? 'rgba(0,200,150,0.1)' : 'none',
                      border: active ? '1px solid rgba(0,200,150,0.3)' : '1px solid transparent',
                      borderRadius: 6, cursor: 'pointer', padding: '7px 10px',
                      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2,
                      textAlign: 'left', transition: 'all 0.1s',
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#00C896', minWidth: 32 }}>{b.code}</span>
                    <span style={{ fontSize: 11, color: 'var(--text2)', flex: 1 }}>{b.name}</span>
                    {cnt > 0 && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, background: '#00C896', color: '#000',
                        borderRadius: 10, padding: '1px 6px', minWidth: 18, textAlign: 'center',
                      }}>{cnt}</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Bearish section */}
          <button
            onClick={() => setBearishExpanded((v) => !v)}
            style={{
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 8px',
              color: '#EF4444', fontSize: 12, fontWeight: 600, letterSpacing: 0.5,
            }}
          >
            {bearishExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <TrendingDown size={13} />
            BEARISH
          </button>
          {bearishExpanded && (
            <div>
              {BEARISH_BUCKETS.map((b) => {
                const cnt = countByBucket(b.code)
                const active = selectedBucket === b.code
                return (
                  <button
                    key={b.code}
                    onClick={() => setSelectedBucket(active ? null : b.code)}
                    style={{
                      width: '100%', background: active ? 'rgba(239,68,68,0.1)' : 'none',
                      border: active ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent',
                      borderRadius: 6, cursor: 'pointer', padding: '7px 10px',
                      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2,
                      textAlign: 'left', transition: 'all 0.1s',
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#EF4444', minWidth: 32 }}>{b.code}</span>
                    <span style={{ fontSize: 11, color: 'var(--text2)', flex: 1 }}>{b.name}</span>
                    {cnt > 0 && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, background: '#EF4444', color: '#fff',
                        borderRadius: 10, padding: '1px 6px', minWidth: 18, textAlign: 'center',
                      }}>{cnt}</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Content header */}
          <div style={{
            padding: '14px 20px 10px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                {selectedBucketDef ? `${selectedBucketDef.code} — ${selectedBucketDef.name}` : 'All Patterns'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                {displayed.length} signal{displayed.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 2, background: 'var(--bg)', borderRadius: 8, padding: 3 }}>
              {(['queue', 'shared', 'missed'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={{
                    padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: activeTab === t ? 600 : 400,
                    background: activeTab === t ? 'var(--surface)' : 'transparent',
                    color: activeTab === t ? 'var(--text)' : 'var(--text3)',
                    textTransform: 'capitalize',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ margin: 16, padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#EF4444', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Cards */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {loading ? (
              <Skeleton />
            ) : displayed.length === 0 ? (
              <EmptyState message={
                activeTab === 'queue'
                  ? 'No pending signals. Run the screener to find patterns.'
                  : activeTab === 'shared'
                  ? 'No shared signals today.'
                  : 'No missed opportunities in this period.'
              } />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
                {displayed.map((r) => (
                  <div key={r.id} style={{ opacity: actionLoading === r.id ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                    <SignalCard
                      result={r}
                      tab={activeTab}
                      onAction={handleAction}
                      onChart={setChartResult}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div style={{
        height: 52, flexShrink: 0, borderTop: '1px solid var(--border)',
        background: 'var(--surface)', display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 24, fontSize: 12,
      }}>
        <StatItem label="Bullish Today" value={stats?.bullishToday ?? '—'} color="#00C896" />
        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
        <StatItem label="Bearish Today" value={stats?.bearishToday ?? '—'} color="#EF4444" />
        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
        <StatItem label="Shared" value={stats?.sharedToday ?? '—'} />
        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
        <StatItem
          label="Best Bucket (30d)"
          value={stats?.bestBucket?.code && stats.bestBucket.code !== '—' ? `${stats.bestBucket.code}` : '—'}
          subtitle={stats?.bestBucket?.winRate ? `${stats.bestBucket.winRate.toFixed(0)}% WR` : undefined}
        />
        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
        <StatItem label="Win Rate (30d)" value={stats ? `${stats.winRate30d}%` : '—'} color={stats && stats.winRate30d >= 50 ? '#00C896' : '#EF4444'} />
        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
        <StatItem label="Missed >10%" value={stats?.missedOpportunities ?? '—'} color={stats && stats.missedOpportunities > 0 ? '#D4A843' : undefined} />
      </div>

      {/* Chart Modal */}
      {chartResult && <ChartModal result={chartResult} onClose={() => setChartResult(null)} />}
    </div>
  )
}

function StatItem({ label, value, color, subtitle }: { label: string; value: string | number; color?: string; subtitle?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.3 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: color ?? 'var(--text)' }}>{value}</span>
        {subtitle && <span style={{ fontSize: 10, color: 'var(--text3)' }}>{subtitle}</span>}
      </div>
    </div>
  )
}
