'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { AvailableLocale } from '@/lib/languageMapping'

export function LanguagePicker() {
  const { locale, setLocale, allLanguages } = useLanguage()
  const [open, setOpen] = useState(false)
  const [showMobileSheet, setShowMobileSheet] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const handleButtonClick = () => {
    if (isMobile) {
      setShowMobileSheet(true)
    } else {
      setOpen(!open)
    }
  }

  const handleSelect = (code: string) => {
    setLocale(code as AvailableLocale)
    setOpen(false)
    setShowMobileSheet(false)
  }

  return (
    <>
      <div ref={containerRef} style={{ position: 'relative' }}>
        <button
          onClick={handleButtonClick}
          aria-label="Change language"
          title="Change language"
          className="flex items-center gap-1 border border-[var(--border2)] rounded-lg cursor-pointer text-[var(--text2)] hover:text-[var(--orange)] hover:bg-[rgba(255,107,0,0.06)] hover:border-[rgba(255,107,0,0.2)] transition-all"
          style={{
            background: 'transparent',
            padding: '5px 8px',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            height: 32,
            whiteSpace: 'nowrap',
            minWidth: 32,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span className="hidden md:inline" style={{ fontSize: 11, fontWeight: 700 }}>{locale.toUpperCase()}</span>
          <span className="hidden md:inline" style={{ fontSize: 7 }}>▼</span>
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
              minWidth: 200,
              maxHeight: 320,
              overflowY: 'auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.12em', padding: '4px 8px 6px', textTransform: 'uppercase' }}>
                Language
              </div>
              {allLanguages.map((lang) => {
                const isActive = locale === lang.code
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '10px 8px',
                      border: 'none', borderRadius: 6,
                      background: isActive ? 'rgba(255,107,0,0.08)' : 'transparent',
                      color: isActive ? '#FF6B00' : 'var(--text)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.1s',
                    }}
                  >
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: isActive ? 700 : 500, lineHeight: 1.2 }}>
                        {lang.nativeLabel}
                      </span>
                      <span style={{ fontSize: 11, color: isActive ? 'rgba(255,107,0,0.7)' : 'var(--text3)', fontFamily: 'Inter, sans-serif' }}>
                        {lang.label}
                      </span>
                    </span>
                    {isActive && (
                      <span style={{ fontSize: 12, color: '#FF6B00', fontWeight: 700 }}>✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {showMobileSheet && (
        <>
          <div
            onClick={() => setShowMobileSheet(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9998,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
            }}
          />

          <div style={{
            position: 'fixed',
            bottom: 0, left: 0, right: 0,
            zIndex: 9999,
            background: 'var(--surface)',
            borderRadius: '20px 20px 0 0',
            padding: '0 0 32px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
            animation: 'slideUp 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--border)' }} />
            </div>

            <div style={{
              padding: '8px 20px 16px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                Select Language
              </h3>
              <button
                onClick={() => setShowMobileSheet(false)}
                aria-label="Close"
                style={{ background: 'transparent', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text3)', lineHeight: 1, padding: 4 }}
              >×</button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              padding: '16px',
            }}>
              {allLanguages.map((lang) => {
                const isActive = locale === lang.code
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    style={{
                      padding: '14px 12px',
                      border: isActive ? '2px solid #FF6B00' : '1px solid var(--border)',
                      borderRadius: 12,
                      background: isActive ? 'rgba(255,107,0,0.06)' : 'var(--bg)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 700, color: isActive ? '#FF6B00' : 'var(--text)', lineHeight: 1.2 }}>
                      {lang.nativeLabel}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'Inter, sans-serif' }}>
                      {lang.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </>
      )}
    </>
  )
}
