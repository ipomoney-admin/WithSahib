'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getEntryStatus } from '@/lib/signal-utils'
import SebiDisclaimer from '@/components/ui/SebiDisclaimer'
import { Lock, TrendingUp, Clock, ChevronDown, ChevronUp, Crown } from 'lucide-react'
import Link from 'next/link'

type Segment = 'intraday' | 'stock_options' | 'index_options' | 'swing'

interface Signal {
  id: string
  segment: Segment
  scrip: string
  strike?: string
  entry_low: number
  entry_high: number
  stop_loss: number
  target_1: number
  target_2?: number
  target_3?: number
  rr_ratio?: number
  rationale: string
  status: string
  published_at: string
  analyst_holding?: boolean
  is_modified?: boolean
  t1_hit_at?: string
  t2_hit_at?: string
  t3_hit_at?: string
  sl_hit_at?: string
}

interface LivePrice {
  symbol: string
  ltp: number
  change_pct: number
}

interface Subscription {
  plan: string
  status: string
  current_period_end: string
}

const SEGMENT_COLORS: Record<string, string> = {
  intraday: '#00C896',
  stock_options: '#D4A843',
  index_options: '#3B82F6',
  swing: '#8B5CF6',
}

const SEGMENT_LABELS: Record<string, string> = {
  intraday: 'Intraday',
  stock_options: 'Stock Options',
  index_options: 'Index Options',
  swing: 'Swing',
}

const ALLOWED_SEGMENTS: Record<string, string[]> = {
  elite: ['intraday', 'stock_options', 'index_options', 'swing'],
  pro: ['intraday', 'stock_options', 'index_options', 'swing'],
  basic: ['swing'],
  free: [],
}

function SegmentTag({ segment }: { segment: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 1,
      padding: '3px 8px', borderRadius: 4,
      background: `${SEGMENT_COLORS[segment]}20`,
      color: SEGMENT_COLORS[segment],
      textTransform: 'uppercase',
    }}>
      {SEGMENT_LABELS[segment] ?? segment}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: 'var(--emerald)',
    t1_hit: '#22D3EE',
    t2_hit: '#22D3EE',
    t3_hit: '#22D3EE',
    sl_hit: '#EF4444',
    expired: 'var(--text3)',
    cancelled: 'var(--text3)',
  }
  const labels: Record<string, string> = {
    open: '● Live',
    t1_hit: '✓ T1 Hit',
    t2_hit: '✓ T2 Hit',
    t3_hit: '✓ T3 Hit',
    sl_hit: '✗ SL Hit',
    expired: 'Expired',
    cancelled: 'Cancelled',
  }
  const color = colors[status] ?? 'var(--text2)'
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
      background: `${color}20`, color,
      animation: status === 'open' ? 'none' : undefined,
    }}>
      {labels[status] ?? status}
    </span>
  )
}

function SignalCard({ signal, livePrice }: { signal: Signal; livePrice?: LivePrice }) {
  const [expanded, setExpanded] = useState(false)
  const price = livePrice?.ltp ?? signal.entry_low
  const entryStatus = getEntryStatus(signal, price)
  const isOpen = signal.status === 'open'

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${isOpen ? 'rgba(0,200,150,0.2)' : 'var(--border)'}`,
      borderRadius: 14, padding: 20, marginBottom: 12,
      transition: 'border-color 0.2s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <SegmentTag segment={signal.segment} />
        <div>
          <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{signal.scrip}</span>
          {signal.strike && <span style={{ fontSize: 13, color: 'var(--text2)', marginLeft: 6 }}>{signal.strike}</span>}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {livePrice && isOpen && (
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
              ₹{livePrice.ltp.toLocaleString('en-IN')}
              <span style={{ fontSize: 10, color: (livePrice.change_pct ?? 0) >= 0 ? 'var(--emerald)' : '#EF4444', marginLeft: 4 }}>
                {livePrice.change_pct >= 0 ? '+' : ''}{livePrice.change_pct?.toFixed(2)}%
              </span>
            </span>
          )}
          <StatusBadge status={signal.status} />
        </div>
      </div>

      {/* Entry status banner (open signals only) */}
      {isOpen && (
        <div style={{
          padding: '10px 14px', borderRadius: 10, marginBottom: 14,
          background: `${entryStatus.color}10`,
          border: `1px solid ${entryStatus.color}30`,
          fontSize: 13, color: entryStatus.color, fontWeight: 500,
        }}>
          {entryStatus.message}
        </div>
      )}

      {/* Signal details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr) repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Entry Range', value: `₹${signal.entry_low.toLocaleString('en-IN')} – ₹${signal.entry_high.toLocaleString('en-IN')}` },
          { label: 'Stop Loss', value: `₹${signal.stop_loss.toLocaleString('en-IN')}` },
          { label: 'Target 1', value: `₹${signal.target_1.toLocaleString('en-IN')}`, hit: !!signal.t1_hit_at },
          { label: 'Target 2', value: signal.target_2 ? `₹${signal.target_2.toLocaleString('en-IN')}` : '—', hit: !!signal.t2_hit_at },
          { label: 'R:R', value: signal.rr_ratio ? `${signal.rr_ratio}x` : '—' },
        ].map((item) => (
          <div key={item.label} style={{
            background: 'rgba(20,31,46,0.6)', borderRadius: 10, padding: '10px 12px',
            border: item.hit ? '1px solid rgba(0,200,150,0.3)' : '1px solid transparent',
          }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 3, fontWeight: 600, letterSpacing: 0.5 }}>{item.label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: item.hit ? 'var(--emerald)' : 'var(--text)' }}>
              {item.value} {item.hit && '✓'}
            </div>
          </div>
        ))}
      </div>

      {/* Modifications badge */}
      {signal.is_modified && (
        <div style={{ fontSize: 11, color: 'var(--gold)', padding: '6px 10px', background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)', borderRadius: 8, marginBottom: 10 }}>
          ⚠️ This signal has been modified since original publication. Full disclosure provided.
        </div>
      )}

      {/* Analyst holding */}
      {signal.analyst_holding && (
        <div style={{ fontSize: 11, color: 'var(--emerald)', marginBottom: 10 }}>
          ✅ Analyst holding this position
        </div>
      )}

      {/* Rationale (expandable) */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0',
          color: 'var(--text3)', fontSize: 12, textAlign: 'left',
        }}
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {expanded ? 'Hide' : 'Show'} Rationale
      </button>
      {expanded && (
        <div style={{
          marginTop: 8, padding: '10px 14px',
          background: 'rgba(26,35,51,0.4)', borderRadius: 8,
          fontSize: 13, color: 'var(--text2)', lineHeight: '1.7',
        }}>
          {signal.rationale}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <span style={{ fontSize: 10, color: 'var(--text3)' }}>
          {new Date(signal.published_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </span>
        <SebiDisclaimer variant="short" />
      </div>
    </div>
  )
}

function LockedSegmentCTA({ segment }: { segment: string }) {
  return (
    <div style={{
      textAlign: 'center', padding: '40px 20px',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14,
    }}>
      <Lock size={28} style={{ color: 'var(--text3)', marginBottom: 12 }} />
      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
        {SEGMENT_LABELS[segment]} calls require an upgrade
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
        Upgrade to Pro or Elite to access {SEGMENT_LABELS[segment]} signals
      </p>
      <Link
        href="/pricing"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '10px 20px', borderRadius: 10,
          background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)',
          color: 'var(--gold)', fontWeight: 600, fontSize: 13, textDecoration: 'none',
        }}
      >
        <Crown size={14} /> Upgrade Plan
      </Link>
    </div>
  )
}

export default function DashboardSignalsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [signals, setSignals] = useState<Signal[]>([])
  const [livePrices, setLivePrices] = useState<Record<string, LivePrice>>({})
  const [activeTab, setActiveTab] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [subRes, signalsRes] = await Promise.all([
        supabase.from('subscriptions').select('plan, status, current_period_end').eq('user_id', user.id).single(),
        fetch('/api/signals?limit=50').then((r) => r.json()),
      ])

      const sub = subRes.data as Subscription | null
      setSubscription(sub)

      if (signalsRes.success) {
        setSignals(signalsRes.data ?? [])
      } else {
        setError(signalsRes.error ?? 'Failed to load signals')
      }
      setLoading(false)
    }
    load()

    // Realtime price updates
    const channel = supabase
      .channel('live_prices_member')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_prices' }, (payload) => {
        const price = payload.new as LivePrice
        if (price?.symbol) setLivePrices((prev) => ({ ...prev, [price.symbol]: price }))
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'signals' }, () => {
        fetch('/api/signals?limit=50').then((r) => r.json()).then((json) => {
          if (json.success) setSignals(json.data ?? [])
        })
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'signals' }, (payload) => {
        const updated = payload.new as Signal
        setSignals((prev) => prev.map((s) => s.id === updated.id ? { ...s, ...updated } : s))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  const plan = subscription?.plan ?? 'free'
  const isActive = subscription && ['active', 'grace_period'].includes(subscription.status) && new Date(subscription.current_period_end) > new Date()
  const allowedSegments = isActive ? (ALLOWED_SEGMENTS[plan] ?? []) : []

  const TABS = ['all', 'intraday', 'stock_options', 'index_options', 'swing'] as const

  const activeSignals = signals.filter((s) => s.status === 'open')
  const historicalSignals = signals.filter((s) => s.status !== 'open')

  const filteredActive = activeTab === 'all' ? activeSignals : activeSignals.filter((s) => s.segment === activeTab)
  const filteredHistory = activeTab === 'all' ? historicalSignals : historicalSignals.filter((s) => s.segment === activeTab)

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3].map((i) => <div key={i} className="shimmer" style={{ height: 200, borderRadius: 14 }} />)}
      </div>
    )
  }

  if (!isActive) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Crown size={40} style={{ color: 'var(--gold)', marginBottom: 16 }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Subscribe to access live signals</h2>
        <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
          Get SEBI RA certified intraday calls, options signals, and swing trades with live entry/SL/target tracking.
        </p>
        <Link href="/pricing" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 10, background: 'var(--emerald)', color: '#000', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          View Plans from ₹999/month
        </Link>
        <div style={{ marginTop: 16 }}>
          <SebiDisclaimer variant="short" />
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Plan badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            padding: '4px 10px', borderRadius: 6,
            background: plan === 'elite' ? 'rgba(212,168,67,0.12)' : 'rgba(0,200,150,0.1)',
            color: plan === 'elite' ? 'var(--gold)' : 'var(--emerald)',
            textTransform: 'uppercase',
          }}>
            {plan} Plan
          </span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>
          {allowedSegments.length === 4 ? 'All signals included' : `${allowedSegments.map((s) => SEGMENT_LABELS[s]).join(', ')} included`}
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <SebiDisclaimer variant="short" />
        </div>
      </div>

      {/* Segment filter tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {TABS.map((t) => {
          const isLocked = t !== 'all' && !allowedSegments.includes(t)
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: '8px 14px', border: 'none', cursor: 'pointer', background: 'none',
                fontSize: 12, fontWeight: activeTab === t ? 600 : 400,
                color: isLocked ? 'var(--text3)' : activeTab === t ? 'var(--emerald)' : 'var(--text2)',
                borderBottom: activeTab === t ? '2px solid var(--emerald)' : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              {t === 'all' ? 'All' : SEGMENT_LABELS[t]}
              {isLocked && <Lock size={10} />}
            </button>
          )
        })}
      </div>

      {/* Active signals */}
      {filteredActive.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block', animation: 'pulseDot 2s infinite' }} />
            Active Signals ({filteredActive.length})
          </h2>
          {filteredActive.map((signal) => {
            if (!allowedSegments.includes(signal.segment)) {
              return <LockedSegmentCTA key={signal.id} segment={signal.segment} />
            }
            return (
              <SignalCard
                key={signal.id}
                signal={signal}
                livePrice={livePrices[`NSE:${signal.scrip}-EQ`]}
              />
            )
          })}
        </div>
      )}

      {activeTab !== 'all' && !allowedSegments.includes(activeTab) && (
        <LockedSegmentCTA segment={activeTab} />
      )}

      {/* Historical signals */}
      {filteredHistory.length > 0 && (
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>
            Past Signals
          </h2>
          {filteredHistory.slice(0, 20).map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}

      {filteredActive.length === 0 && filteredHistory.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
          <TrendingUp size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p>No signals yet — check back during market hours</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Signals are generated between 9:00 AM – 3:30 PM IST on weekdays</p>
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <SebiDisclaimer variant="full" />
      </div>
    </div>
  )
}
