'use client'

export const BILLING_OPTIONS = [
  { label: 'Monthly', value: 'monthly', discount: 0, months: 1 },
  { label: 'Quarterly', value: 'quarterly', discount: 5, months: 3 },
  { label: 'Half-Yearly', value: 'half_yearly', discount: 8, months: 6 },
  { label: 'Yearly', value: 'yearly', discount: 10, months: 12 },
] as const

export type BillingValue = (typeof BILLING_OPTIONS)[number]['value']

interface Props {
  value: BillingValue
  onChange: (v: BillingValue) => void
}

export function BillingSelector({ value, onChange }: Props) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-sm)',
        padding: '4px',
        gap: '4px',
        flexWrap: 'wrap',
      }}
    >
      {BILLING_OPTIONS.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--r-sm)',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: active ? 700 : 500,
              cursor: 'pointer',
              background: active ? 'var(--orange)' : 'transparent',
              color: active ? '#FFFFFF' : 'var(--text2)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
          >
            {opt.label}
            {opt.discount > 0 && (
              <span
                style={{
                  marginLeft: '5px',
                  fontSize: '10px',
                  fontWeight: 700,
                  opacity: active ? 0.85 : 0.6,
                }}
              >
                −{opt.discount}%
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
