'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

const typeColors: Record<ToastType, string> = {
  success: 'var(--emerald)',
  error: '#EF4444',
  info: 'var(--sapphire)',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counterRef = useRef(0)

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++counterRef.current
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px',
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            style={{
              padding: '12px 18px',
              background: 'var(--surface)',
              border: `1px solid ${typeColors[t.type]}`,
              borderLeft: `4px solid ${typeColors[t.type]}`,
              borderRadius: '10px',
              fontSize: '14px',
              color: 'var(--text)',
              maxWidth: '340px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
