'use client'

import React from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  href?: string
  loading?: boolean
  className?: string
}

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-surface',
  ghost: 'btn-ghost',
  gold: 'btn-gold',
  danger: 'btn-danger',
}

const sizeClass: Record<Size, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  loading = false,
  disabled,
  children,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const cls = `btn ${variantClass[variant]} ${sizeClass[size]} ${className}`.trim()

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        style={{ textDecoration: 'none', opacity: disabled ? 0.6 : 1, ...style }}
        aria-disabled={disabled}
      >
        {loading ? 'Loading…' : children}
      </Link>
    )
  }

  return (
    <button
      className={cls}
      style={{ opacity: disabled || loading ? 0.6 : 1, ...style }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading…' : children}
    </button>
  )
}
