'use client'
import { useState } from 'react'

interface Props {
  onApplied: (code: string, discountPercent: number) => void
  onRemoved: () => void
  appliedCode?: string
  appliedDiscount?: number
}

export function CouponInput({ onApplied, onRemoved, appliedCode, appliedDiscount }: Props) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    const code = input.toUpperCase().trim()
    if (!code) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/payments/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, amount_paise: 699900 }),
      })
      const data = await res.json()
      if (data.valid) {
        onApplied(code, data.discount_percent)
        setInput('')
      } else {
        setError(data.message)
      }
    } catch {
      setError('Failed to apply coupon. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (appliedCode) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          background: 'rgba(26,122,74,0.07)',
          border: '1px solid rgba(26,122,74,0.25)',
          borderRadius: 'var(--r-sm)',
        }}
      >
        <span
          style={{
            color: 'var(--green)',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
          }}
        >
          ✓ {appliedCode} — {appliedDiscount}% additional off!
        </span>
        <button
          type="button"
          onClick={onRemoved}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text3)',
            fontSize: '16px',
            lineHeight: 1,
            padding: '0 2px',
            fontFamily: 'var(--font-body)',
          }}
          aria-label="Remove coupon"
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value.toUpperCase())
            setError('')
          }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleApply() }}
          placeholder="Enter coupon code"
          style={{
            padding: '10px 14px',
            border: `1px solid ${error ? 'var(--coral)' : 'var(--border2)'}`,
            borderRadius: 'var(--r-sm)',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text)',
            background: 'var(--surface)',
            outline: 'none',
            width: '180px',
            transition: 'border-color 0.2s',
          }}
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--r-sm)',
            border: '1px solid var(--border2)',
            background: 'var(--surface)',
            color: 'var(--text2)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.55 : 1,
            fontFamily: 'var(--font-body)',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          }}
        >
          {loading ? '...' : 'Apply'}
        </button>
      </div>
      {error && (
        <p
          style={{
            marginTop: '6px',
            fontSize: '12px',
            color: 'var(--coral)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
