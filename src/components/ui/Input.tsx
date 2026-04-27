'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, id, style, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text2)' }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: 'var(--bg2)',
          border: `1px solid ${error ? '#EF4444' : 'var(--border)'}`,
          borderRadius: '10px',
          fontSize: '14px',
          color: 'var(--text)',
          outline: 'none',
          transition: 'border-color 0.15s',
          boxSizing: 'border-box',
          ...style,
        }}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} style={{ fontSize: '12px', color: '#EF4444', margin: 0 }} role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} style={{ fontSize: '12px', color: 'var(--text3)', margin: 0 }}>
          {hint}
        </p>
      )}
    </div>
  )
}
