'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { detectUserLanguage } from '@/lib/detectLanguage'
import { ALL_LANGUAGES, type AvailableLocale } from '@/lib/languageMapping'

export function LanguageWelcomeModal() {
  const { setLocale } = useLanguage()
  const [show, setShow] = useState(false)
  const [detectedState, setDetectedState] = useState('')
  const [suggestedLocale, setSuggestedLocale] = useState<AvailableLocale>('en')

  useEffect(() => {
    const alreadyShown = localStorage.getItem('withsahib-language-welcomed')
    const savedLocale = localStorage.getItem('withsahib-locale')
    if (!alreadyShown && !savedLocale) {
      detectUserLanguage().then(({ detectedLocale, state, showPicker }) => {
        if (showPicker && detectedLocale !== 'en') {
          setSuggestedLocale(detectedLocale)
          setDetectedState(state)
          setShow(true)
        }
      })
    }
  }, [])

  const handleChoice = (chosen: AvailableLocale) => {
    setLocale(chosen)
    localStorage.setItem('withsahib-language-welcomed', 'true')
    setShow(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('withsahib-language-welcomed', 'true')
    setShow(false)
  }

  if (!show) return null

  const suggestedLang = ALL_LANGUAGES.find((l) => l.code === suggestedLocale)

  return (
    <>
      <div onClick={handleDismiss} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }} />

      <div style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'var(--surface)',
        borderRadius: 16, padding: '24px 28px',
        maxWidth: 420, width: 'calc(100vw - 32px)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.22)',
        border: '1px solid var(--border)',
        borderLeft: '4px solid #FF6B00',
      }}>
        <button
          onClick={handleDismiss}
          aria-label="Close language prompt"
          style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 20, lineHeight: 1, padding: 4 }}
        >×</button>

        <div style={{ fontSize: 26, marginBottom: 8 }}>🌐</div>

        <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>
          {suggestedLang?.nativeLabel} में पढ़ें?
        </h3>

        <p style={{ fontSize: 13, color: 'var(--text2)', margin: '0 0 18px', lineHeight: 1.55 }}>
          {detectedState ? `We detected you're from ${detectedState}.` : 'We detected your location.'} Read withSahib in {suggestedLang?.label}?
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => handleChoice(suggestedLocale)}
            style={{
              flex: 1, padding: '10px 0',
              background: '#FF6B00', color: '#FFFFFF',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              fontWeight: 700, fontSize: 14, fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 12px rgba(255,107,0,0.3)',
            }}
          >
            {suggestedLang?.nativeLabel} में पढ़ें
          </button>
          <button
            onClick={() => handleChoice('en')}
            style={{
              flex: 1, padding: '10px 0',
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 8, cursor: 'pointer',
              fontWeight: 500, fontSize: 14, color: 'var(--text)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Continue in English
          </button>
        </div>

        <p style={{ fontSize: 11, color: 'var(--text4)', margin: '12px 0 0', textAlign: 'center', lineHeight: 1.5 }}>
          Change anytime via the language icon in the menu
        </p>
      </div>
    </>
  )
}
