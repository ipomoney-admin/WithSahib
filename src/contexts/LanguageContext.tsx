'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { AVAILABLE_LANGUAGES, ALL_LANGUAGES, type AvailableLocale } from '@/lib/languageMapping'
import { detectUserLanguage, saveLocalePreference, getSavedLocale } from '@/lib/detectLanguage'

type Translations = Record<string, unknown>

interface LanguageContextType {
  locale: AvailableLocale
  setLocale: (locale: AvailableLocale) => void
  t: (key: string) => string
  isLoading: boolean
  allLanguages: typeof ALL_LANGUAGES
  availableLanguages: typeof AVAILABLE_LANGUAGES
}

const LanguageContext = createContext<LanguageContextType | null>(null)

function getNestedValue(obj: Translations, key: string): string {
  const keys = key.split('.')
  let current: unknown = obj
  for (const k of keys) {
    if (typeof current !== 'object' || current === null) return key
    current = (current as Record<string, unknown>)[k]
  }
  return typeof current === 'string' ? current : key
}

async function loadMessages(loc: AvailableLocale): Promise<Translations> {
  try {
    const mod = await import(`../../messages/${loc}.json`)
    return mod.default as Translations
  } catch {
    const mod = await import('../../messages/en.json')
    return mod.default as Translations
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AvailableLocale>('en')
  const [translations, setTranslations] = useState<Translations>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const saved = getSavedLocale()
      if (saved) {
        const msgs = await loadMessages(saved)
        setTranslations(msgs)
        setLocaleState(saved)
      } else {
        const { detectedLocale } = await detectUserLanguage()
        const msgs = await loadMessages(detectedLocale)
        setTranslations(msgs)
        setLocaleState(detectedLocale)
      }
      setIsLoading(false)
    }
    init()
  }, [])

  const setLocale = async (newLocale: AvailableLocale) => {
    const msgs = await loadMessages(newLocale)
    setTranslations(msgs)
    setLocaleState(newLocale)
    saveLocalePreference(newLocale)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
    }
  }

  const t = (key: string): string => {
    if (Object.keys(translations).length === 0) return key
    return getNestedValue(translations, key) || key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isLoading, allLanguages: ALL_LANGUAGES, availableLanguages: AVAILABLE_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
