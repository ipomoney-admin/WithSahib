'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Crown, Filter, RefreshCw, AlertCircle, Clock } from 'lucide-react'
import type { User, TradeCall } from '@/types'

const SAMPLE: TradeCall[] = [
  { id: '1', service_type: 'intraday', symbol: 'RELIANCE', exchange: 'NSE', direction: 'BUY', entry_price: 2828, entry_range_low: 2820, entry_range_high: 2835, target_1: 2875, target_2: 2910, stop_loss: 2800, status: 'active', rationale: 'Breakout above 20-day consolidation zone on above-average volume. RSI momentum building. Risk-reward 1:2.5. SEBI RA INH000026266. Not investment advice.', tier_required: 'pro', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', service_type: 'intraday', symbol: 'HDFCBANK', exchange: 'NSE', direction: 'BUY', entry_price: 1628, entry_range_low: 1622, entry_range_high: 1632, target_1: 1660, target_2: 1680, stop_loss: 1610, status: 'active', rationale: 'Demand zone support at 1620. OI buildup at 1600 PE. Hourly chart showing bullish engulfing. SEBI RA INH000026266. Not investment advice.', tier_required: 'pro', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', service_type: 'intraday', symbol: 'INFY', exchange: 'NSE', direction: 'SELL', entry_price: 1438, entry_range_low: 1435, entry_range_high: 1442, target_1: 1410, target_2: 1395, stop_loss: 1455, status: 'active', rationale: 'Distribution pattern near resistance. Volume divergence on recent bounce. 15-min MACD bearish crossover. SEBI RA INH000026266. Not investment advice.', tier_required: 'pro', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', service_type: 'intraday', symbol: 'TCS', exchange: 'NSE', direction: 'BUY', entry_price: 3880, target_1: 3940, stop_loss: 3845, status: 'target_hit', exit_price: 3942, pnl_pct: 1.6, rationale: 'Gap fill play on results day. Strong institutional buying visible in delivery data.', tier_required: 'pro', created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString() },
]

function CallCard({ call, blur }: { call: TradeCall; blur?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const isUp = call.direction === 'BUY'
  const statusColor = call.status === 'active' ? 'var(--emerald)' : call.status === 'target_hit' ? 'var(--sapphire)' : 'var(--coral)'
  const rr = call.target_1 && call.stop_loss && call.entry_price
    ? ((call.target_1 - call.entry_price) / (call.entry_price - call.stop_loss)).toFixed(1)
    : null

  return (
    <div
      style={{
        background: 'var(--surface)', border: `1px solid ${call.status === 'active' ? 'var(--border2)' : 'var(--border)'}`,
        borderRadius: '16px', overflow: 'hidden',
        filter: blur ? 'blur(4px)' : 'none',
        userSelect: blur ? 'none' : 'auto',
        transition: 'all 0.25s',
      }}
    >
      {/* Top bar */}
      <div style={{ height: '3px', background: isUp ? 'var(--emerald)' : 'var(--coral)', opacity: call.status === 'active' ? 1 : 0.3 }} />

      <div style={{ padding: '20px 24px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: isUp ? 'rgba(0,200,150,0.08)' : 'rgba(244,123,123,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isUp ? <TrendingUp size={20} color="var(--emerald)" /> : <TrendingDown size={20} color="var(--coral)" />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', fontFamily: 'Courier New, monospace' }}>{call.symbol}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: isUp ? 'rgba(0,200,150,0.1)' : 'rgba(244,123,123,0.1)', color: isUp ? 'var(--emerald)' : 'var(--coral)' }}>{call.direction}</span>
                <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'Courier New, monospace' }}>{call.exchange}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', background: call.status === 'active' ? 'rgba(0,200,150,0.08)' : 'var(--bg2)', color: statusColor }}>{call.status.replace('_', ' ').toUpperCase()}</span>
                {call.pnl_pct && (
                  <span style={{ fontSize: '12px', fontWeight: 700, color: call.pnl_pct > 0 ? 'var(--emerald)' : 'var(--coral)' }}>
                    {call.pnl_pct > 0 ? '+' : ''}{call.pnl_pct.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '2px' }}>
              {new Date(call.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
            {rr && call.status === 'active' && (
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gold)' }}>R:R {rr}x</p>
            )}
          </div>
        </div>

        {/* Price levels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
          {[
            { label: 'ENTRY', value: call.entry_range_low ? `₹${call.entry_range_low}–${call.entry_range_high}` : `₹${call.entry_price}`, color: 'var(--text)' },
            { label: 'TARGET 1', value: `₹${call.target_1}`, color: 'var(--emerald)' },
            { label: call.target_2 ? 'TARGET 2' : '', value: call.target_2 ? `₹${call.target_2}` : '', color: 'var(--emerald)' },
            { label: 'STOP LOSS', value: `₹${call.stop_loss}`, color: 'var(--coral)' },
          ].filter(p => p.label).map((p) => (
            <div key={p.label} style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text3)', marginBottom: '4px' }}>{p.label}</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: p.color, fontFamily: 'Courier New, monospace' }}>{p.value}</p>
            </div>
          ))}
        </div>

        {/* Rationale toggle */}
        {call.rationale && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--text3)', padding: '0', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Outfit, sans-serif' }}
          >
            <span style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>›</span>
            {expanded ? 'Hide' : 'View'} rationale
          </button>
        )}
        {expanded && call.rationale && (
          <div style={{ marginTop: '10px', padding: '12px', background: 'var(--bg2)', borderRadius: '10px', fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, borderLeft: `2px solid ${isUp ? 'var(--emerald)' : 'var(--coral)'}`, animation: 'fadeIn 0.2s ease' }}>
            {call.rationale}
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
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase.from('users').select('*').eq('id', data.user.id).single().then(({ data: p }) => { if (p) setUser(p) })
    })
  }, [])

  const tierLevel = { free: 0, basic: 1, pro: 2, elite: 3 }[user?.tier ?? 'free']
  const canAccess = tierLevel >= 2

  const filtered = SAMPLE.filter(c => filter === 'all' ? true : filter === 'active' ? c.status === 'active' : c.status !== 'active')

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
      {!canAccess && (
        <div style={{ padding: '20px 24px', background: 'rgba(0,200,150,0.04)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Crown size={22} color="var(--gold)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px' }}>Pro plan required for live intraday picks</p>
            <p style={{ fontSize: '13px', color: 'var(--text3)' }}>Showing blurred preview. Upgrade to Pro (₹2,499/mo) for real-time access.</p>
          </div>
          <Link href="/pricing?tier=pro" className="btn btn-primary btn-sm" style={{ textDecoration: 'none', flexShrink: 0 }}>
            Upgrade to Pro
          </Link>
        </div>
      )}

      {/* Stats */}
      {canAccess && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Active', value: String(SAMPLE.filter(c => c.status === 'active').length), color: 'var(--emerald)' },
            { label: 'Target Hit', value: String(SAMPLE.filter(c => c.status === 'target_hit').length), color: 'var(--sapphire)' },
            { label: 'SL Hit', value: String(SAMPLE.filter(c => c.status === 'sl_hit').length), color: 'var(--coral)' },
            { label: "Today's R:R", value: '2.4x', color: 'var(--gold)' },
          ].map((s) => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <p style={{ fontSize: '22px', fontWeight: 700, color: s.color, fontFamily: 'DM Serif Display, serif', marginBottom: '2px' }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: 'var(--text3)', letterSpacing: '0.5px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
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

      {/* Calls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map((call, i) => (
          <CallCard key={call.id} call={call} blur={!canAccess && i > 0} />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="sebi-disclaimer" style={{ marginTop: '32px' }}>
        <strong style={{ color: 'var(--gold)' }}>Disclaimer: </strong>
        All intraday picks are published by Sahib Singh Hora, SEBI Registered Research Analyst (INH000026266).
        These are for informational purposes only and not investment advice. Intraday trading involves significant risk.
        Please read all risk disclosures. Investments are subject to market risk.
      </div>
    </div>
  )
}
