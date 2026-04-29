'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { AvailableLocale } from '@/lib/languageMapping'

export function LanguagePicker() {
  const { locale, setLocale, allLanguages, availableLanguages } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change language"
        title="Change language"
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'transparent',
          border: '1px solid var(--border2)',
          borderRadius: 6,
          padding: '5px 8px',
          cursor: 'pointer',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text2)',
          fontFamily: 'Inter, sans-serif',
          transition: 'all 0.15s',
          height: 32,
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.color = 'var(--orange)'
          el.style.background = 'rgba(255,107,0,0.06)'
          el.style.borderColor = 'rgba(255,107,0,0.2)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.color = 'var(--text2)'
          el.style.background = 'transparent'
          el.style.borderColor = 'var(--border2)'
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        {locale.toUpperCase()}
        <span style={{ fontSize: 7 }}>▼</span>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 4,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 6,
            zIndex: 50,
            minWidth: 190,
            boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.12em', padding: '4px 8px 6px', textTransform: 'uppercase' }}>
              Language
            </div>
            {allLanguages.map((lang) => {
              const isAvailable = (availableLanguages as readonly string[]).includes(lang.code)
              const isActive = locale === lang.code
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    if (isAvailable) { setLocale(lang.code as AvailableLocale); setOpen(false) }
                  }}
                  disabled={!isAvailable}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '7px 8px',
                    border: 'none', borderRadius: 6,
                    background: isActive ? 'rgba(255,107,0,0.08)' : 'transparent',
                    color: isActive ? '#FF6B00' : isAvailable ? 'var(--text)' : 'var(--text4)',
                    cursor: isAvailable ? 'pointer' : 'default',
                    fontSize: 13, fontFamily: 'Inter, sans-serif', textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                >
                  <span>{lang.nativeLabel}</span>
                  <span style={{ fontSize: 10, color: isActive ? '#FF6B00' : 'var(--text4)' }}>
                    {isActive ? '✓' : !isAvailable ? 'Soon' : ''}
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
