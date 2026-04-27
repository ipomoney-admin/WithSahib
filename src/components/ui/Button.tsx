'use client'

import React from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  href?: string
  loading?: boolean
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--emerald)', color: '#031A13', border: 'none' },
  secondary: { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)' },
  ghost: { background: 'transparent', color: 'var(--text2)', border: 'none' },
  gold: { background: 'var(--gold)', color: '#1A0F00', border: 'none' },
  danger: { background: '#EF4444', color: '#fff', border: 'none' },
}

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '7px 14px', fontSize: '13px', borderRadius: '8px' },
  md: { padding: '11px 22px', fontSize: '14px', borderRadius: '10px' },
  lg: { padding: '14px 28px', fontSize: '15px', borderRadius: '12px' },
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  loading = false,
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    textDecoration: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'opacity 0.15s, transform 0.1s',
    outline: 'none',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  }

  if (href) {
    return (
      <Link href={href} style={baseStyle} aria-disabled={disabled}>
        {loading ? 'Loading…' : children}
      </Link>
    )
  }

  return (
    <button style={baseStyle} disabled={disabled || loading} {...props}>
      {loading ? 'Loading…' : children}
    </button>
  )
}
