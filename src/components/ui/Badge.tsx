import React from 'react'

type BadgeVariant = 'emerald' | 'gold' | 'sapphire' | 'red' | 'neutral'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  style?: React.CSSProperties
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  emerald: { background: 'rgba(0,200,150,0.1)', color: 'var(--emerald)', border: '1px solid rgba(0,200,150,0.2)' },
  gold: { background: 'rgba(212,168,67,0.1)', color: 'var(--gold)', border: '1px solid rgba(212,168,67,0.2)' },
  sapphire: { background: 'rgba(100,160,255,0.08)', color: 'var(--sapphire)', border: '1px solid rgba(100,160,255,0.2)' },
  red: { background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' },
  neutral: { background: 'var(--bg2)', color: 'var(--text3)', border: '1px solid var(--border)' },
}

export function Badge({ children, variant = 'neutral', style }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.5px',
        padding: '3px 10px',
        borderRadius: '6px',
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
