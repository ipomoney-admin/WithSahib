import { getLocaleForState, AVAILABLE_LANGUAGES, type AvailableLocale } from './languageMapping'

export interface DetectResult {
  detectedLocale: AvailableLocale
  state: string
  country: string
  showPicker: boolean
  suggestedLanguages: string[]
}

export async function detectUserLanguage(): Promise<DetectResult> {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('withsahib-locale') as AvailableLocale | null
    if (saved && (AVAILABLE_LANGUAGES as readonly string[]).includes(saved)) {
      return { detectedLocale: saved, state: '', country: '', showPicker: false, suggestedLanguages: [saved] }
    }
  }

  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(3000),
    })
    const data = await response.json()
    const country = data.country_code || 'IN'
    const state = data.region || ''

    if (country !== 'IN') {
      return { detectedLocale: 'en', state, country, showPicker: false, suggestedLanguages: ['en'] }
    }

    const detectedLocale = getLocaleForState(state)
    const showPicker = detectedLocale !== 'en'

    return {
      detectedLocale,
      state,
      country,
      showPicker,
      suggestedLanguages: detectedLocale !== 'en' ? [detectedLocale, 'en'] : ['en'],
    }
  } catch {
    return { detectedLocale: 'en', state: '', country: '', showPicker: false, suggestedLanguages: ['en'] }
  }
}

export function saveLocalePreference(locale: AvailableLocale) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('withsahib-locale', locale)
  }
}

export function getSavedLocale(): AvailableLocale | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('withsahib-locale') as AvailableLocale | null
    return saved && (AVAILABLE_LANGUAGES as readonly string[]).includes(saved) ? saved : null
  }
  return null
}
