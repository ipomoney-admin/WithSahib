import { AVAILABLE_LANGUAGES, type AvailableLocale } from './languageMapping'

export type { AvailableLocale }
export { AVAILABLE_LANGUAGES }

export function getSavedLocale(): AvailableLocale | null {
  if (typeof window === 'undefined') return null
  const saved = localStorage.getItem('withsahib-locale') as AvailableLocale | null
  return saved && AVAILABLE_LANGUAGES.includes(saved) ? saved : null
}

export function saveLocalePreference(locale: AvailableLocale) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('withsahib-locale', locale)
  }
}
