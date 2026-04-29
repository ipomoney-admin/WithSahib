'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, TrendingUp, TrendingDown } from 'lucide-react'

const SERVICES = [
  { value: 'intraday', label: 'Intraday Research' },
  { value: 'swing', label: 'Positional Research' },
  { value: 'stock-options', label: 'Stock Options Research' },
  { value: 'index-options', label: 'Index Options Research' },
]

export default function PublishResearchPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    stock: '',
    exchange: 'NSE',
    action: 'BUY',
    entryMin: '',
    entryMax: '',
    target1: '',
    target2: '',
    stopLoss: '',
    service: 'intraday',
    rationale: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const rr = (() => {
    const entry = (parseFloat(form.entryMin) + parseFloat(form.entryMax)) / 2
    const t1 = parseFloat(form.target1)
    const sl = parseFloat(form.stopLoss)
    if (!entry || !t1 || !sl || sl >= entry) return null
    return ((t1 - entry) / (entry - sl)).toFixed(2)
  })()

  const set = useCallback((k: string, v: string) => setForm((f) => ({ ...f, [k]: v })), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.rationale.trim().length < 100) {
      setResult({ success: false, message: 'Rationale must be at least 100 characters.' })
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/publish-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ success: true, message: data.message ?? 'Research note published.' })
        setForm({ stock: '', exchange: 'NSE', action: 'BUY', entryMin: '', entryMax: '', target1: '', target2: '', stopLoss: '', service: 'intraday', rationale: '' })
      } else {
        setResult({ success: false, message: data.error ?? 'Publish failed.' })
      }
    } catch {
      setResult({ success: false, message: 'Network error. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--surface)',
    color: 'var(--text)', fontSize: '14px', boxSizing: 'border-box',
    fontFamily: 'Inter, system-ui, sans-serif',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 600,
    letterSpacing: '0.8px', textTransform: 'uppercase',
    color: 'var(--text3)', marginBottom: '6px',
    fontFamily: 'Inter, system-ui, sans-serif',
  }

  return (
    <div style={{ padding: '32px', maxWidth: '680px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/admin" style={{ color: 'var(--text3)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '22px', fontWeight: 400, color: 'var(--text)', marginBottom: '2px' }}>
            Publish Research Note
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Creates a signal in the database and triggers WhatsApp delivery to subscribers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Stock + Exchange + Action */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Stock Name</label>
            <input style={inputStyle} value={form.stock} onChange={(e) => set('stock', e.target.value.toUpperCase())} placeholder="e.g. RELIANCE" required />
          </div>
          <div>
            <label style={labelStyle}>Exchange</label>
            <select style={inputStyle} value={form.exchange} onChange={(e) => set('exchange', e.target.value)}>
              <option>NSE</option>
              <option>BSE</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Action</label>
            <select style={{ ...inputStyle, color: form.action === 'BUY' ? '#1A7A4A' : '#F47B7B', fontWeight: 700 }} value={form.action} onChange={(e) => set('action', e.target.value)}>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>
        </div>

        {/* Entry zone */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Entry Min (₹)</label>
            <input style={inputStyle} type="number" step="0.01" value={form.entryMin} onChange={(e) => set('entryMin', e.target.value)} placeholder="e.g. 2450" required />
          </div>
          <div>
            <label style={labelStyle}>Entry Max (₹)</label>
            <input style={inputStyle} type="number" step="0.01" value={form.entryMax} onChange={(e) => set('entryMax', e.target.value)} placeholder="e.g. 2480" required />
          </div>
        </div>

        {/* Targets + SL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Target 1 (₹)</label>
            <input style={inputStyle} type="number" step="0.01" value={form.target1} onChange={(e) => set('target1', e.target.value)} placeholder="e.g. 2560" required />
          </div>
          <div>
            <label style={labelStyle}>Target 2 (₹)</label>
            <input style={inputStyle} type="number" step="0.01" value={form.target2} onChange={(e) => set('target2', e.target.value)} placeholder="e.g. 2620" />
          </div>
          <div>
            <label style={labelStyle}>Stop Loss (₹)</label>
            <input style={inputStyle} type="number" step="0.01" value={form.stopLoss} onChange={(e) => set('stopLoss', e.target.value)} placeholder="e.g. 2400" required />
          </div>
        </div>

        {/* R:R display */}
        {rr && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(26,122,74,0.08)', border: '1px solid rgba(26,122,74,0.2)', borderRadius: '8px' }}>
            {parseFloat(rr) >= 1.5 ? <TrendingUp size={14} color="#1A7A4A" /> : <TrendingDown size={14} color="#F47B7B" />}
            <span style={{ fontSize: '13px', color: parseFloat(rr) >= 1.5 ? '#1A7A4A' : '#F47B7B', fontWeight: 600 }}>
              R:R = {rr} {parseFloat(rr) < 1.5 ? '— below 1.5:1 threshold' : '✓'}
            </span>
          </div>
        )}

        {/* Service */}
        <div>
          <label style={labelStyle}>Service</label>
          <select style={inputStyle} value={form.service} onChange={(e) => set('service', e.target.value)}>
            {SERVICES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Rationale */}
        <div>
          <label style={labelStyle}>Rationale ({form.rationale.length} chars — min 100)</label>
          <textarea
            style={{ ...inputStyle, minHeight: '140px', resize: 'vertical', lineHeight: 1.6 }}
            value={form.rationale}
            onChange={(e) => set('rationale', e.target.value)}
            placeholder="Written rationale explaining the structural basis for this recommendation — chart setup, sector context, risk factors..."
            required
          />
        </div>

        {/* Result banner */}
        {result && (
          <div style={{
            padding: '12px 16px', borderRadius: '8px',
            background: result.success ? 'rgba(26,122,74,0.1)' : 'rgba(244,123,123,0.1)',
            border: `1px solid ${result.success ? 'rgba(26,122,74,0.25)' : 'rgba(244,123,123,0.25)'}`,
            color: result.success ? '#1A7A4A' : '#F47B7B',
            fontSize: '13px', fontWeight: 500,
          }}>
            {result.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '14px 28px', borderRadius: '10px', border: 'none',
            background: loading ? '#666' : '#FF6B00', color: '#FFFFFF',
            fontSize: '14px', fontWeight: 700, cursor: loading ? 'default' : 'pointer',
            boxShadow: loading ? 'none' : '0 0 20px rgba(255,107,0,0.35)',
            transition: 'all 0.2s',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <Send size={15} />
          {loading ? 'Publishing…' : 'Publish Research Note'}
        </button>
      </form>
    </div>
  )
}
