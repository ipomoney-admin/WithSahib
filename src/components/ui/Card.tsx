import React from 'react'

interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  accent?: 'emerald' | 'gold' | 'sapphire' | 'none'
  padding?: 'sm' | 'md' | 'lg'
}

const accentBorders: Record<string, string> = {
  emerald: 'rgba(0,200,150,0.2)',
  gold: 'rgba(212,168,67,0.2)',
  sapphire: 'rgba(100,160,255,0.2)',
  none: 'var(--border)',
}

const paddings = { sm: '16px', md: '24px', lg: '32px' }

export function Card({ children, style, className, accent = 'none', padding = 'md' }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${accentBorders[accent]}`,
        borderRadius: '14px',
        padding: paddings[padding],
        ...style,
      }}
    >
      {children}
    </div>
  )
}
