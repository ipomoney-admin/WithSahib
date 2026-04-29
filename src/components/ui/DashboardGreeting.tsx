'use client'

import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  name: string
  greetingEmoji: string
}

export function DashboardGreeting({ name, greetingEmoji }: Props) {
  const { t } = useLanguage()

  const ist = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  const h = new Date(ist).getHours()

  const greetingText =
    h >= 5 && h < 12 ? t('dashboard.good_morning') :
    h >= 12 && h < 17 ? t('dashboard.good_afternoon') :
    h >= 17 && h < 21 ? t('dashboard.good_evening') :
    t('dashboard.good_night')

  return (
    <p style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '12px' }}>
      {greetingEmoji} {greetingText},
    </p>
  )
}
