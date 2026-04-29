export const STATE_LANGUAGE_MAP: Record<string, { primary: string; secondary: string; label: string }> = {
  // Hindi belt
  'Uttar Pradesh': { primary: 'hi', secondary: 'en', label: 'हिन्दी / English' },
  'Madhya Pradesh': { primary: 'hi', secondary: 'en', label: 'हिन्दी / English' },
  'Rajasthan': { primary: 'hi', secondary: 'en', label: 'हिन्दी / English' },
  'Bihar': { primary: 'hi', secondary: 'en', label: 'हिन्दी / English' },
  'Jharkhand': { primary: 'hi', secondary: 'en', label: 'हिन्दी / English' },
  'Chhattisgarh': { primary: 'hi', secondary: 'en', label: 'हिन्दी / English' },
  'Uttarakhand': { primary: 'hi', secondary: 'en', label: 'हिन्दी / English' },
  'Himachal Pradesh': { primary: 'hi', secondary: 'en', label: 'हिन्दी / English' },
  'Haryana': { primary: 'hi', secondary: 'en', label: 'हिन्दी / English' },
  'Delhi': { primary: 'hi', secondary: 'en', label: 'हिन्दी / English' },

  // Marathi
  'Maharashtra': { primary: 'mr', secondary: 'en', label: 'मराठी / English' },
  'Goa': { primary: 'mr', secondary: 'en', label: 'मराठी / English' },

  // Gujarati
  'Gujarat': { primary: 'gu', secondary: 'en', label: 'ગુજરાતી / English' },
  'Dadra and Nagar Haveli': { primary: 'gu', secondary: 'en', label: 'ગુજરાતી / English' },
  'Daman and Diu': { primary: 'gu', secondary: 'en', label: 'ગુજરાતી / English' },

  // Punjabi
  'Punjab': { primary: 'pa', secondary: 'en', label: 'ਪੰਜਾਬੀ / English' },
  'Chandigarh': { primary: 'pa', secondary: 'en', label: 'ਪੰਜਾਬੀ / English' },

  // Tamil
  'Tamil Nadu': { primary: 'ta', secondary: 'en', label: 'தமிழ் / English' },
  'Puducherry': { primary: 'ta', secondary: 'en', label: 'தமிழ் / English' },

  // Telugu
  'Andhra Pradesh': { primary: 'te', secondary: 'en', label: 'తెలుగు / English' },
  'Telangana': { primary: 'te', secondary: 'en', label: 'తెలుగు / English' },

  // Kannada
  'Karnataka': { primary: 'kn', secondary: 'en', label: 'ಕನ್ನಡ / English' },

  // Malayalam
  'Kerala': { primary: 'ml', secondary: 'en', label: 'മലയാളം / English' },
  'Lakshadweep': { primary: 'ml', secondary: 'en', label: 'മലയാളം / English' },

  // Bengali
  'West Bengal': { primary: 'bn', secondary: 'en', label: 'বাংলা / English' },
  'Tripura': { primary: 'bn', secondary: 'en', label: 'বাংলা / English' },

  // English default
  'Assam': { primary: 'en', secondary: 'en', label: 'English' },
  'Meghalaya': { primary: 'en', secondary: 'en', label: 'English' },
  'Manipur': { primary: 'en', secondary: 'en', label: 'English' },
  'Nagaland': { primary: 'en', secondary: 'en', label: 'English' },
  'Mizoram': { primary: 'en', secondary: 'en', label: 'English' },
  'Arunachal Pradesh': { primary: 'en', secondary: 'en', label: 'English' },
  'Sikkim': { primary: 'en', secondary: 'en', label: 'English' },
  'Jammu and Kashmir': { primary: 'en', secondary: 'en', label: 'English' },
  'Ladakh': { primary: 'en', secondary: 'en', label: 'English' },
  'Odisha': { primary: 'en', secondary: 'en', label: 'English' },
}

export const AVAILABLE_LANGUAGES = ['en', 'hi', 'mr', 'gu'] as const
export type AvailableLocale = typeof AVAILABLE_LANGUAGES[number]

export const ALL_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
]

export function getLocaleForState(state: string): AvailableLocale {
  const mapping = STATE_LANGUAGE_MAP[state]
  if (!mapping) return 'en'
  const primary = mapping.primary as AvailableLocale
  return (AVAILABLE_LANGUAGES as readonly string[]).includes(primary) ? primary : 'en'
}
