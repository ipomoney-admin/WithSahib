'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Crown, Filter, BarChart2 } from 'lucide-react'

interface Signal {
  id: string
  segment: string
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
}

const STATUS_LABEL: Record<string, string> = {
  open: 'ACTIVE',
  t1_hit: 'T1 HIT',
  t2_hit: 'T2 HIT',
  t3_hit: 'T3 HIT',
  sl_hit: 'SL HIT',
  expired: 'EXPIRED',
  cancelled: 'CANCELLED',
}

const STATUS_COLOR: Record<string, string> = {
  open: 'var(--emerald)',
  t1_hit: '#22D3EE',
  t2_hit: '#22D3EE',
  t3_hit: '#22D3EE',
  sl_hit: '#EF4444',
  expired: 'var(--text3)',
  cancelled: 'var(--text3)',
}

function CallCard({ signal, blur }: { signal: Signal; blur?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const isUp = signal.target_1 > signal.entry_low
  const statusColor = STATUS_COLOR[signal.status] ?? 'var(--text2)'

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: `1px solid ${signal.status === 'open' ? 'var(--border2)' : 'var(--border)'}`,
        borderRadius: '16px', overflow: 'hidden',
        filter: blur ? 'blur(4px)' : 'none',
        userSelect: blur ? 'none' : 'auto',
        transition: 'all 0.25s',
      }}
    >
      <div style={{ height: '3px', background: isUp ? 'var(--emerald)' : '#EF4444', opacity: signal.status === 'open' ? 1 : 0.3 }} />
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: isUp ? 'rgba(0,200,150,0.08)' : 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isUp ? <TrendingUp size={20} color="var(--emerald)" /> : <TrendingDown size={20} color="#EF4444" />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', fontFamily: 'Courier New, monospace' }}>{signal.scrip}</span>
                {signal.strike && <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{signal.strike}</span>}
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: isUp ? 'rgba(0,200,150,0.1)' : 'rgba(239,68,68,0.1)', color: isUp ? 'var(--emerald)' : '#EF4444' }}>
                  {isUp ? 'BUY' : 'SELL'}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'Courier New, monospace' }}>NSE</span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', background: `${statusColor}15`, color: statusColor }}>
                {STATUS_LABEL[signal.status] ?? signal.status.toUpperCase()}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '2px' }}>
              {new Date(signal.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
            {signal.rr_ratio && signal.status === 'open' && (
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gold)' }}>R:R {signal.rr_ratio}x</p>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
          {[
            { label: 'ENTRY', value: `₹${signal.entry_low.toLocaleString('en-IN')}–${signal.entry_high.toLocaleString('en-IN')}`, color: 'var(--text)' },
            { label: 'TARGET 1', value: `₹${signal.target_1.toLocaleString('en-IN')}`, color: 'var(--emerald)' },
            { label: signal.target_2 ? 'TARGET 2' : '', value: signal.target_2 ? `₹${signal.target_2.toLocaleString('en-IN')}` : '', color: 'var(--emerald)' },
            { label: 'STOP LOSS', value: `₹${signal.stop_loss.toLocaleString('en-IN')}`, color: '#EF4444' },
          ].filter(p => p.label).map((p) => (
            <div key={p.label} style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', marginBottom: '4px' }}>{p.label}</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: p.color, fontFamily: 'Courier New, monospace' }}>{p.value}</p>
            </div>
          ))}
        </div>

        {signal.rationale && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--text3)', padding: '0', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Outfit, sans-serif' }}
          >
            <span style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>›</span>
            {expanded ? 'Hide' : 'View'} rationale
          </button>
        )}
        {expanded && (
          <div style={{ marginTop: '10px', padding: '12px', background: 'var(--bg2)', borderRadius: '10px', fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, borderLeft: `2px solid ${isUp ? 'var(--emerald)' : '#EF4444'}` }}>
            {signal.rationale}
          </div>
        )}
      </div>
    </div>
  )
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to get SEBI-verified intraday stock picks',
  description: 'Get daily intraday stock calls from SEBI Registered Research Analyst Sahib Singh Hora (INH000026266)',
  step: [
    { '@type': 'HowToStep', name: 'Create free account', text: 'Register at withsahib.com/auth/register — no credit card required', url: 'https://www.withsahib.com/auth/register' },
    { '@type': 'HowToStep', name: 'Choose a plan', text: 'Select Pro or Elite plan for daily intraday calls', url: 'https://www.withsahib.com/pricing' },
    { '@type': 'HowToStep', name: 'Access dashboard', text: "Log in to your dashboard before 9 AM every trading day for the day's intraday pick", url: 'https://www.withsahib.com/dashboard' },
  ],
}

export default function IntradayPage() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [canAccess, setCanAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/signals?segment=intraday&limit=20')
        const json = await res.json()
        if (json.success) {
          setSignals(json.data ?? [])
          setCanAccess(true)
        } else if (res.status === 401 || res.status === 403) {
          setCanAccess(false)
        }
      } catch {
        setCanAccess(false)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const activeSignals = signals.filter(s => s.status === 'open')
  const closedSignals = signals.filter(s => s.status !== 'open')
  const t1Wins = signals.filter(s => ['t1_hit', 't2_hit', 't3_hit'].includes(s.status)).length
  const slHits = signals.filter(s => s.status === 'sl_hit').length
  const avgRR = activeSignals.length > 0
    ? (activeSignals.reduce((acc, s) => acc + (s.rr_ratio ?? 0), 0) / activeSignals.length).toFixed(1)
    : null

  const filtered = signals.filter(s =>
    filter === 'all' ? true : filter === 'active' ? s.status === 'open' : s.status !== 'open'
  )

  return (
    <div style={{ maxWidth: '820px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div className="section-tag">Intraday</div>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '32px', fontWeight: 400, color: 'var(--text)', marginBottom: '8px' }}>
          Intraday Picks
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.6 }}>
          Pre-market buy/sell levels with entry range, targets, and stop-loss. Published by 9:00 AM every trading day.
          <br />
          <span style={{ fontSize: '12px', color: 'var(--text3)' }}>SEBI RA Sahib Singh Hora · INH000026266 · Not investment advice</span>
        </p>
      </div>

      {/* Upgrade gate */}
      {!canAccess && !loading && (
        <div style={{ padding: '20px 24px', background: 'rgba(0,200,150,0.04)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Crown size={22} color="var(--gold)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px' }}>Pro plan required for live intraday picks</p>
            <p style={{ fontSize: '13px', color: 'var(--text3)' }}>Upgrade to Pro (₹2,499/mo) for real-time access to intraday calls.</p>
          </div>
          <Link href="/pricing?tier=pro" className="btn btn-primary btn-sm" style={{ textDecoration: 'none', flexShrink: 0 }}>
            Upgrade to Pro
          </Link>
        </div>
      )}

      {/* Stats — only shown when user has access and there are signals */}
      {canAccess && signals.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Active', value: String(activeSignals.length), color: 'var(--emerald)' },
            { label: 'Target Hit', value: String(t1Wins), color: '#22D3EE' },
            { label: 'SL Hit', value: String(slHits), color: '#EF4444' },
            { label: "Avg R:R", value: avgRR ? `${avgRR}x` : '--', color: 'var(--gold)' },
          ].map((s) => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <p style={{ fontSize: '22px', fontWeight: 700, color: s.color, fontFamily: 'DM Serif Display, serif', marginBottom: '2px' }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: 'var(--text3)', letterSpacing: '0.5px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      {canAccess && signals.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          {(['all', 'active', 'closed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 16px', borderRadius: '8px', border: `1px solid ${filter === f ? 'var(--emerald)' : 'var(--border)'}`,
                background: filter === f ? 'rgba(0,200,150,0.08)' : 'transparent',
                color: filter === f ? 'var(--emerald)' : 'var(--text3)',
                fontSize: '13px', fontWeight: filter === f ? 500 : 400, cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s', textTransform: 'capitalize',
              }}
            >
              {f === 'all' ? 'All calls' : f === 'active' ? 'Active' : 'Closed'}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--emerald)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald)', animation: 'pulseDot 2s ease-in-out infinite' }} />
            Live · Updated 9:00 AM
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer" style={{ height: 180, borderRadius: 16 }} />
          ))}
        </div>
      )}

      {/* Signals */}
      {!loading && canAccess && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((signal) => (
            <CallCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && canAccess && signals.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
          <BarChart2 size={36} style={{ color: 'var(--text3)', marginBottom: 16, opacity: 0.5 }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>No signals yet</h3>
          <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.7, maxWidth: 360, margin: '0 auto 20px' }}>
            Signals will appear here once published. Join our Telegram for updates.
          </p>
          <a
            href="https://t.me/withsahib"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, background: 'rgba(0,136,204,0.1)', border: '1px solid rgba(0,136,204,0.25)', color: '#0088CC', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}
          >
            Join Telegram
          </a>
        </div>
      )}

      {/* Sample Research Call Preview */}
      <div style={{ marginTop: '32px', marginBottom: '8px' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '20px', fontWeight: 400, color: 'var(--text)', marginBottom: '12px' }}>
          What a call looks like
        </h2>
        <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          {/* SAMPLE watermark */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-15deg)', fontSize: '64px', fontWeight: 900, color: 'rgba(0,200,150,0.05)', letterSpacing: '4px', pointerEvents: 'none', zIndex: 0, whiteSpace: 'nowrap' }}>
            SAMPLE
          </div>
          <div style={{ height: '3px', background: 'var(--emerald)' }} />
          <div style={{ padding: '20px 24px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Courier New, monospace', color: 'var(--text)' }}>[SAMPLE CALL]</span>
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: 'rgba(0,200,150,0.1)', color: 'var(--emerald)' }}>BUY</span>
              <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'Courier New, monospace' }}>NSE · INTRADAY</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
              {[
                { label: 'ENTRY RANGE', value: '₹XXX – ₹XXX', color: 'var(--text)' },
                { label: 'TARGET 1', value: '₹XXX (+X%)', color: 'var(--emerald)' },
                { label: 'TARGET 2', value: '₹XXX (+X%)', color: 'var(--emerald)' },
                { label: 'STOP LOSS', value: '₹XXX (-X%)', color: '#EF4444' },
              ].map((p) => (
                <div key={p.label} style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                  <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', marginBottom: '4px' }}>{p.label}</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: p.color, fontFamily: 'Courier New, monospace' }}>{p.value}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px', background: 'var(--bg2)', borderRadius: '10px', borderLeft: '2px solid var(--emerald)', fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '10px' }}>
              <strong style={{ color: 'var(--emerald)', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>Rationale: </strong>
              Stock has formed a base above 20 EMA with RSI showing positive divergence. Entry on breakout of resistance zone with volume confirmation.
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: 1.5 }}>
              Actual calls include the specific stock name, exact levels, and full written rationale. Subscribe to access live calls.
            </p>
          </div>
        </div>
      </div>

      {/* SEBI Disclaimer */}
      <div className="sebi-disclaimer" style={{ marginTop: '32px' }}>
        <strong style={{ color: 'var(--gold)' }}>Disclaimer: </strong>
        All intraday picks are published by Sahib Singh Hora, SEBI Registered Research Analyst (INH000026266).
        These are for informational purposes only and not investment advice. Intraday trading involves significant risk.
        Please read all risk disclosures. Investments are subject to market risk.
      </div>
    </div>
  )
}
