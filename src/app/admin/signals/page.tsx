'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculateRR, getEntryStatus } from '@/lib/signal-utils'
import SebiDisclaimer from '@/components/ui/SebiDisclaimer'
import {
  CheckCircle, XCircle, Edit3, Send, Wifi, WifiOff, AlertTriangle,
  RefreshCw, Clock, TrendingUp, Plus, Filter,
} from 'lucide-react'

type Segment = 'intraday' | 'stock_options' | 'index_options' | 'swing'
type Tab = 'queue' | 'open' | 'history' | 'create'

const SEGMENT_COLORS: Record<Segment, string> = {
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

interface Alert {
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
  pattern_type?: string
  trigger_conditions?: Record<string, unknown>
  created_at: string
  ml_score?: {
    win_probability: number
    confidence_level: string
    top_risk_factors: Array<{ factor: string; impact: string; direction: string }>
    suggested_sl_adjustment?: number
  }
}

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
}

interface LivePrice {
  symbol: string
  ltp: number
  change_pct: number
}

interface FyersStatus {
  connected: boolean
  time_remaining_mins: number
}

function SegmentTag({ segment }: { segment: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 1,
      padding: '3px 8px', borderRadius: 4,
      background: `${SEGMENT_COLORS[segment as Segment]}20`,
      color: SEGMENT_COLORS[segment as Segment],
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
    open: 'Open',
    t1_hit: 'T1 Hit',
    t2_hit: 'T2 Hit',
    t3_hit: 'T3 Hit',
    sl_hit: 'SL Hit',
    expired: 'Expired',
    cancelled: 'Cancelled',
  }
  const color = colors[status] ?? 'var(--text2)'
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
      background: `${color}20`, color,
    }}>
      {labels[status] ?? status}
    </span>
  )
}

function MLScorePanel({ alertId }: { alertId: string }) {
  const [score, setScore] = useState<Alert['ml_score'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/ml/score/${alertId}`)
      .then((r) => r.json())
      .then((j) => { setScore(j.data ?? null); setLoading(false) })
      .catch(() => setLoading(false))
  }, [alertId])

  if (loading) return <div className="shimmer" style={{ height: 80, borderRadius: 8 }} />
  if (!score) return (
    <div style={{ padding: 12, background: 'rgba(107,138,170,0.05)', borderRadius: 8, fontSize: 11, color: 'var(--text3)' }}>
      ML score not available — model needs more training data
    </div>
  )

  const pct = Math.round((score.win_probability ?? 0) * 100)
  const color = pct >= 65 ? 'var(--emerald)' : pct >= 50 ? 'var(--gold)' : '#EF4444'

  return (
    <div style={{ padding: 12, background: 'rgba(26,35,51,0.6)', borderRadius: 8, border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color }}>{pct}%</div>
          <div style={{ fontSize: 9, color: 'var(--text3)' }}>Win Probability</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.5s' }} />
          </div>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
          background: `${color}20`, color,
        }}>
          {score.confidence_level}
        </span>
      </div>
      {score.top_risk_factors?.slice(0, 3).map((f, i) => (
        <div key={i} style={{ fontSize: 10, color: f.direction === 'risk' ? '#EF4444' : 'var(--emerald)', marginBottom: 2 }}>
          {f.direction === 'risk' ? '⚠️' : '✅'} {f.factor} ({f.impact})
        </div>
      ))}
    </div>
  )
}

function AlertQueueCard({ alert, onApprove, onReject }: {
  alert: Alert
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)
  const rr = alert.rr_ratio ?? calculateRR(alert.entry_low, alert.entry_high, alert.stop_loss, alert.target_1)

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 12, padding: 16, marginBottom: 12,
    }}>
      <div style={{ display: 'flex', gap: 16 }}>
        {/* Left */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <SegmentTag segment={alert.segment} />
            <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 16 }}>{alert.scrip}</span>
            {alert.strike && <span style={{ fontSize: 12, color: 'var(--text2)' }}>{alert.strike}</span>}
            {alert.pattern_type && (
              <span style={{ fontSize: 10, color: 'var(--text3)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px' }}>
                {alert.pattern_type.replace(/_/g, ' ')}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
            {[
              { label: 'Entry', value: `₹${alert.entry_low.toLocaleString('en-IN')}–${alert.entry_high.toLocaleString('en-IN')}` },
              { label: 'SL', value: `₹${alert.stop_loss.toLocaleString('en-IN')}` },
              { label: 'T1', value: `₹${alert.target_1.toLocaleString('en-IN')}` },
              { label: 'R:R', value: `${rr}x` },
            ].map((item) => (
              <div key={item.label} style={{ background: 'rgba(26,35,51,0.6)', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.value}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: '1.5', marginBottom: 10 }}>
            {alert.rationale}
          </p>

          {alert.trigger_conditions && (
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 10 }}>
              {Object.entries(alert.trigger_conditions).map(([k, v]) => (
                <span key={k} style={{ marginRight: 10 }}>{k.replace(/_/g, ' ')}: <strong>{String(v)}</strong></span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => onApprove(alert.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'rgba(0,200,150,0.12)', color: 'var(--emerald)', fontSize: 12, fontWeight: 600,
              }}
            >
              <CheckCircle size={14} /> Approve
            </button>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer',
                background: 'none', color: 'var(--text2)', fontSize: 12,
              }}
            >
              <Edit3 size={14} /> Edit & Approve
            </button>
            <button
              onClick={() => setShowRejectInput(!showRejectInput)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'rgba(239,68,68,0.08)', color: '#EF4444', fontSize: 12,
              }}
            >
              <XCircle size={14} /> Reject
            </button>
          </div>

          {showRejectInput && (
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              <input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Rejection reason..."
                className="input"
                style={{ flex: 1, fontSize: 12 }}
              />
              <button
                onClick={() => { onReject(alert.id, rejectReason); setShowRejectInput(false) }}
                style={{ padding: '8px 14px', borderRadius: 8, background: '#EF4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12 }}
              >
                Confirm Reject
              </button>
            </div>
          )}
        </div>

        {/* Right: ML Score */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6, fontWeight: 600, letterSpacing: 1 }}>ML SCORE</div>
          <MLScorePanel alertId={alert.id} />
        </div>
      </div>
    </div>
  )
}

function OpenSignalCard({ signal, fyersConnected, onPush, onCancel }: {
  signal: Signal
  fyersConnected: boolean
  livePrice?: LivePrice
  onPush: (id: string, channel: string) => void
  onCancel: (id: string) => void
}) {
  const [modSL, setModSL] = useState('')
  const [modT1, setModT1] = useState('')
  const [modReason, setModReason] = useState('')
  const [showMod, setShowMod] = useState(false)
  const [pushDelivery, setPushDelivery] = useState<{ total: number; delivered: number } | null>(null)

  const entryStatus = getEntryStatus(signal, signal.entry_low)

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <SegmentTag segment={signal.segment} />
        <span style={{ fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>{signal.scrip}</span>
        {signal.strike && <span style={{ fontSize: 12, color: 'var(--text2)' }}>{signal.strike}</span>}
        <StatusBadge status={signal.status} />
        {signal.is_modified && (
          <span style={{ fontSize: 10, color: 'var(--gold)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 4, padding: '2px 6px' }}>
            Modified
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)' }}>
          {new Date(signal.published_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Entry status */}
      <div style={{
        padding: '8px 12px', borderRadius: 8, marginBottom: 10,
        background: `${entryStatus.color}15`,
        border: `1px solid ${entryStatus.color}40`,
        fontSize: 12, color: entryStatus.color,
      }}>
        {entryStatus.message}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 12 }}>
        {[
          { label: 'Entry', value: `₹${signal.entry_low.toLocaleString('en-IN')}–${signal.entry_high.toLocaleString('en-IN')}` },
          { label: 'SL', value: `₹${signal.stop_loss.toLocaleString('en-IN')}` },
          { label: 'T1', value: `₹${signal.target_1.toLocaleString('en-IN')}` },
          { label: 'T2', value: signal.target_2 ? `₹${signal.target_2.toLocaleString('en-IN')}` : '—' },
          { label: 'R:R', value: `${signal.rr_ratio ?? '—'}x` },
        ].map((item) => (
          <div key={item.label} style={{ background: 'rgba(26,35,51,0.6)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <button
          onClick={() => onPush(signal.id, 'whatsapp')}
          disabled={!fyersConnected}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
            borderRadius: 8, border: 'none', cursor: fyersConnected ? 'pointer' : 'not-allowed',
            background: fyersConnected ? 'rgba(0,200,150,0.1)' : 'rgba(107,138,170,0.05)',
            color: fyersConnected ? 'var(--emerald)' : 'var(--text3)', fontSize: 11,
            opacity: fyersConnected ? 1 : 0.5,
          }}
          title={!fyersConnected ? 'Fyers disconnected — cannot push' : ''}
        >
          <Send size={13} /> Push WhatsApp
        </button>
        <button
          onClick={() => onPush(signal.id, 'telegram_paid')}
          disabled={!fyersConnected}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
            borderRadius: 8, border: 'none', cursor: fyersConnected ? 'pointer' : 'not-allowed',
            background: fyersConnected ? 'rgba(59,130,246,0.1)' : 'rgba(107,138,170,0.05)',
            color: fyersConnected ? '#3B82F6' : 'var(--text3)', fontSize: 11,
            opacity: fyersConnected ? 1 : 0.5,
          }}
        >
          <Send size={13} /> Push Telegram
        </button>
        <button
          onClick={() => setShowMod(!showMod)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
            borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer',
            background: 'none', color: 'var(--text2)', fontSize: 11,
          }}
        >
          <Edit3 size={13} /> Modify
        </button>
        <button
          onClick={() => onCancel(signal.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
            borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'rgba(239,68,68,0.06)', color: '#EF4444', fontSize: 11,
          }}
        >
          <XCircle size={13} /> Cancel
        </button>
      </div>

      {showMod && (
        <div style={{ padding: 12, background: 'rgba(26,35,51,0.6)', borderRadius: 8, border: '1px solid var(--border)', marginTop: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--gold)', marginBottom: 8 }}>
            ⚠️ Entry range locked. SL can only be tightened. Targets can only be raised.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>New SL</label>
              <input value={modSL} onChange={(e) => setModSL(e.target.value)} className="input" style={{ fontSize: 12 }} placeholder={String(signal.stop_loss)} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>New T1</label>
              <input value={modT1} onChange={(e) => setModT1(e.target.value)} className="input" style={{ fontSize: 12 }} placeholder={String(signal.target_1)} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>Reason</label>
              <input value={modReason} onChange={(e) => setModReason(e.target.value)} className="input" style={{ fontSize: 12 }} placeholder="Reason for modification" />
            </div>
          </div>
          <button
            onClick={async () => {
              const body: Record<string, unknown> = { reason: modReason }
              if (modSL) body.stop_loss = Number(modSL)
              if (modT1) body.target_1 = Number(modT1)
              const res = await fetch(`/api/signals/${signal.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
              if (res.ok) { setShowMod(false); setModSL(''); setModT1('') }
            }}
            style={{ padding: '8px 14px', borderRadius: 8, background: 'var(--emerald)', color: '#000', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
          >
            Apply Modification
          </button>
        </div>
      )}

      <SebiDisclaimer variant="signal" />
    </div>
  )
}

function CreateSignalForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    segment: 'swing', scrip: '', strike: '',
    entry_low: '', entry_high: '', stop_loss: '',
    target_1: '', target_2: '', target_3: '',
    rationale: '', validity_date: '', pattern_type: '',
    analyst_holding: false, stop_loss_type: 'hard',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const rrCalc = form.entry_low && form.entry_high && form.stop_loss && form.target_1
    ? calculateRR(Number(form.entry_low), Number(form.entry_high), Number(form.stop_loss), Number(form.target_1))
    : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/signals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        entry_low: Number(form.entry_low),
        entry_high: Number(form.entry_high),
        stop_loss: Number(form.stop_loss),
        target_1: Number(form.target_1),
        target_2: form.target_2 ? Number(form.target_2) : null,
        target_3: form.target_3 ? Number(form.target_3) : null,
      }),
    })
    const json = await res.json()
    setLoading(false)
    if (json.success) { onSuccess() }
    else setError(json.error ?? 'Failed to publish signal')
  }

  const F = ({ label, name, type = 'number', placeholder = '' }: { label: string; name: string; type?: string; placeholder?: string }) => (
    <div>
      <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>{label}</label>
      <input
        type={type}
        value={(form as Record<string, unknown>)[name] as string}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="input"
        placeholder={placeholder}
        style={{ fontSize: 13, width: '100%' }}
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>Segment</label>
          <select
            value={form.segment}
            onChange={(e) => setForm({ ...form, segment: e.target.value })}
            className="input"
            style={{ fontSize: 13, width: '100%' }}
          >
            <option value="intraday">Intraday</option>
            <option value="stock_options">Stock Options</option>
            <option value="index_options">Index Options</option>
            <option value="swing">Swing</option>
          </select>
        </div>
        <F label="Scrip" name="scrip" type="text" placeholder="RELIANCE" />
        <F label="Strike (optional)" name="strike" type="text" placeholder="24000CE" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
        <F label="Entry Low" name="entry_low" placeholder="2850" />
        <F label="Entry High" name="entry_high" placeholder="2880" />
        <F label="Stop Loss" name="stop_loss" placeholder="2810" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
        <F label="Target 1 *" name="target_1" placeholder="2950" />
        <F label="Target 2" name="target_2" placeholder="3050" />
        <F label="Target 3" name="target_3" placeholder="3150" />
        <div>
          <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>R:R Ratio</label>
          <div style={{
            padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
            fontSize: 16, fontWeight: 700,
            color: rrCalc !== null && rrCalc >= 2 ? 'var(--emerald)' : rrCalc !== null ? '#EF4444' : 'var(--text3)',
          }}>
            {rrCalc !== null ? `${rrCalc}x` : '—'}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>Rationale *</label>
        <textarea
          value={form.rationale}
          onChange={(e) => setForm({ ...form, rationale: e.target.value })}
          className="input"
          rows={4}
          placeholder="Explain the setup, pattern, and key levels..."
          style={{ fontSize: 13, width: '100%', resize: 'vertical', fontFamily: 'Outfit, sans-serif' }}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        <F label="Validity Date" name="validity_date" type="date" />
        <F label="Pattern Type" name="pattern_type" type="text" placeholder="breakout" />
        <div>
          <label style={{ fontSize: 11, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>SL Type</label>
          <select value={form.stop_loss_type} onChange={(e) => setForm({ ...form, stop_loss_type: e.target.value })} className="input" style={{ fontSize: 13, width: '100%' }}>
            <option value="hard">Hard</option>
            <option value="trailing">Trailing</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <input
          type="checkbox"
          id="analyst_holding"
          checked={form.analyst_holding}
          onChange={(e) => setForm({ ...form, analyst_holding: e.target.checked })}
        />
        <label htmlFor="analyst_holding" style={{ fontSize: 12, color: 'var(--text2)' }}>
          Analyst is holding this position
        </label>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#EF4444', fontSize: 12, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '12px 24px', borderRadius: 10, border: 'none', cursor: loading ? 'wait' : 'pointer',
          background: 'var(--emerald)', color: '#000', fontWeight: 700, fontSize: 14,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Publishing...' : 'Publish Signal'}
      </button>
    </form>
  )
}

export default function AdminSignalsPage() {
  const [tab, setTab] = useState<Tab>('queue')
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [openSignals, setOpenSignals] = useState<Signal[]>([])
  const [history, setHistory] = useState<Signal[]>([])
  const [fyersStatus, setFyersStatus] = useState<FyersStatus | null>(null)
  const [livePrices, setLivePrices] = useState<Record<string, LivePrice>>({})
  const [loading, setLoading] = useState(true)
  const [headerData, setHeaderData] = useState({ nifty: null as LivePrice | null, bankNifty: null as LivePrice | null, vix: null as LivePrice | null })
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  const loadData = useCallback(async () => {
    const [alertsRes, signalsRes, historyRes, fyersRes, adminAlertsRes] = await Promise.all([
      fetch('/api/signals?status=pending&limit=50').then((r) => r.json()).catch(() => ({ data: [] })),
      fetch('/api/signals?status=open').then((r) => r.json()).catch(() => ({ data: [] })),
      fetch('/api/signals?limit=30').then((r) => r.json()).catch(() => ({ data: [] })),
      fetch('/api/fyers/status').then((r) => r.json()).catch(() => ({ data: { connected: false } })),
      fetch('/api/admin/alerts').then((r) => r.json()).catch(() => ({ data: [] })),
    ])
    setOpenSignals((signalsRes.data ?? []).filter((s: Signal) => s.status === 'open'))
    setHistory((historyRes.data ?? []).filter((s: Signal) => !['open', 'pending'].includes(s.status)))
    setFyersStatus(fyersRes.data ?? null)
    setUnreadCount((adminAlertsRes.data ?? []).length)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()

    // Subscribe to live_prices via Supabase Realtime
    const channel = supabase
      .channel('live_prices_admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_prices' }, (payload) => {
        const price = payload.new as LivePrice
        if (!price?.symbol) return
        setLivePrices((prev) => ({ ...prev, [price.symbol]: price }))
        if (price.symbol === 'NSE:NIFTY50-INDEX') setHeaderData((p) => ({ ...p, nifty: price }))
        if (price.symbol === 'NSE:BANKNIFTY-INDEX') setHeaderData((p) => ({ ...p, bankNifty: price }))
        if (price.symbol === 'NSE:INDIA VIX-INDEX') setHeaderData((p) => ({ ...p, vix: price }))
      })
      .subscribe()

    // Subscribe to signal_alerts for realtime new alerts
    const alertsChannel = supabase
      .channel('signal_alerts_admin')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'signal_alerts' }, () => {
        loadData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(alertsChannel)
    }
  }, [loadData])

  async function handleApprove(alertId: string) {
    const alert = alerts.find((a) => a.id === alertId)
    if (!alert) return
    const res = await fetch('/api/signals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alert_id: alertId,
        segment: alert.segment,
        scrip: alert.scrip,
        strike: alert.strike,
        entry_low: alert.entry_low,
        entry_high: alert.entry_high,
        stop_loss: alert.stop_loss,
        target_1: alert.target_1,
        target_2: alert.target_2,
        target_3: alert.target_3,
        rationale: alert.rationale,
        pattern_type: alert.pattern_type,
      }),
    })
    if (res.ok) {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId))
      await loadData()
    }
  }

  async function handleReject(alertId: string, reason: string) {
    await fetch(`/api/signals/${alertId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rejection_reason: reason, review_status: 'rejected' }),
    })
    setAlerts((prev) => prev.filter((a) => a.id !== alertId))
  }

  async function handlePush(signalId: string, channel: string) {
    await fetch(`/api/signals/${signalId}/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel }),
    })
  }

  async function handleCancel(signalId: string) {
    if (!confirm('Cancel this signal? Subscribers will be notified.')) return
    await fetch(`/api/signals/${signalId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Cancelled by admin' }),
    })
    await loadData()
  }

  const tabs: Array<{ id: Tab; label: string; count?: number }> = [
    { id: 'queue', label: 'Alert Queue', count: alerts.length },
    { id: 'open', label: 'Open Signals', count: openSignals.length },
    { id: 'history', label: 'History' },
    { id: 'create', label: 'Create Manual' },
  ]

  const isConnected = fyersStatus?.connected ?? false

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header Strip */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, flexWrap: 'wrap' }}>
          {headerData.nifty && (
            <div style={{ fontSize: 12 }}>
              <span style={{ color: 'var(--text3)', fontSize: 10 }}>NIFTY</span>{' '}
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>₹{headerData.nifty.ltp?.toLocaleString('en-IN')}</span>{' '}
              <span style={{ color: (headerData.nifty.change_pct ?? 0) >= 0 ? 'var(--emerald)' : '#EF4444', fontSize: 11 }}>
                {(headerData.nifty.change_pct ?? 0) >= 0 ? '+' : ''}{headerData.nifty.change_pct?.toFixed(2)}%
              </span>
            </div>
          )}
          {headerData.bankNifty && (
            <div style={{ fontSize: 12 }}>
              <span style={{ color: 'var(--text3)', fontSize: 10 }}>BANK NIFTY</span>{' '}
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>₹{headerData.bankNifty.ltp?.toLocaleString('en-IN')}</span>{' '}
              <span style={{ color: (headerData.bankNifty.change_pct ?? 0) >= 0 ? 'var(--emerald)' : '#EF4444', fontSize: 11 }}>
                {(headerData.bankNifty.change_pct ?? 0) >= 0 ? '+' : ''}{headerData.bankNifty.change_pct?.toFixed(2)}%
              </span>
            </div>
          )}
          {headerData.vix && (
            <div style={{ fontSize: 12 }}>
              <span style={{ color: 'var(--text3)', fontSize: 10 }}>VIX</span>{' '}
              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{headerData.vix.ltp?.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            {isConnected
              ? <><Wifi size={14} color="var(--emerald)" /> <span style={{ color: 'var(--emerald)' }}>Fyers Connected</span></>
              : <><WifiOff size={14} color="#EF4444" /> <span style={{ color: '#EF4444' }}>Fyers Disconnected</span></>
            }
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            Open: <strong style={{ color: 'var(--emerald)' }}>{openSignals.length}</strong>
          </div>
          {unreadCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--gold)' }}>
              <AlertTriangle size={14} />
              <span>{unreadCount} alerts</span>
            </div>
          )}
          <button onClick={loadData} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: 'var(--text2)', display: 'flex', alignItems: 'center' }}>
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 16px', border: 'none', cursor: 'pointer',
                background: 'none', fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
                color: tab === t.id ? 'var(--emerald)' : 'var(--text2)',
                borderBottom: tab === t.id ? '2px solid var(--emerald)' : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span style={{ minWidth: 18, height: 18, borderRadius: 9, background: 'var(--emerald)', color: '#000', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map((i) => <div key={i} className="shimmer" style={{ height: 160, borderRadius: 12 }} />)}
          </div>
        ) : (
          <>
            {tab === 'queue' && (
              <div>
                {alerts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
                    <TrendingUp size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <p>No pending alerts in queue</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <AlertQueueCard key={alert.id} alert={alert} onApprove={handleApprove} onReject={handleReject} />
                  ))
                )}
              </div>
            )}

            {tab === 'open' && (
              <div>
                {openSignals.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
                    <Clock size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <p>No open signals</p>
                  </div>
                ) : (
                  openSignals.map((signal) => (
                    <OpenSignalCard
                      key={signal.id}
                      signal={signal}
                      fyersConnected={isConnected}
                      livePrice={livePrices[`NSE:${signal.scrip}-EQ`]}
                      onPush={handlePush}
                      onCancel={handleCancel}
                    />
                  ))
                )}
              </div>
            )}

            {tab === 'history' && (
              <div>
                {history.map((signal) => (
                  <div key={signal.id} style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: 16, marginBottom: 10,
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <SegmentTag segment={signal.segment} />
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{signal.scrip}</span>
                    {signal.strike && <span style={{ fontSize: 12, color: 'var(--text2)' }}>{signal.strike}</span>}
                    <StatusBadge status={signal.status} />
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)' }}>
                      {new Date(signal.published_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'create' && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>Create Manual Signal</h2>
                <CreateSignalForm onSuccess={() => { setTab('open'); loadData() }} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
