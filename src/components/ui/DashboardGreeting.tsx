'use client'
import Link from 'next/link'
import { Crown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  name: string
  greetingEmoji: string
  userTier: string
  initials: string
  isFounder?: boolean
}

export function DashboardGreeting({ name, greetingEmoji, userTier, initials, isFounder }: Props) {
  const { t } = useLanguage()

  const ist = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  const h = new Date(ist).getHours()

  const greetingText =
    h >= 5 && h < 12 ? t('dashboard.good_morning') :
    h >= 12 && h < 17 ? t('dashboard.good_afternoon') :
    h >= 17 && h < 21 ? t('dashboard.good_evening') :
    t('dashboard.good_night')

  const badgeColor =
    userTier === 'elite' ? 'var(--gold)' :
    userTier === 'pro'   ? 'var(--emerald)' :
    'var(--sapphire)'

  const badgeBg =
    userTier === 'elite' ? 'rgba(212,168,67,0.1)' :
    userTier === 'pro'   ? 'rgba(0,200,150,0.1)' :
    'rgba(100,160,255,0.1)'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6B00, #C45200)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(255,107,0,0.35)',
        }}>
          <span style={{ color: 'white', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700, fontSize: 16 }}>
            {initials}
          </span>
        </div>
        {isFounder && (
          <div style={{ position: 'absolute', top: -6, right: -4, fontSize: 14 }}>👑</div>
        )}
      </div>

      {/* Greeting + name + badge */}
      <div>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(22px, 3vw, 30px)',
          fontWeight: 400,
          color: 'var(--text)',
          margin: 0,
          lineHeight: 1.2,
        }}>
          {greetingEmoji} {greetingText}, {name}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '3px 8px', borderRadius: '6px',
            background: badgeBg, color: badgeColor,
          }}>
            {userTier} plan
          </span>
          {(userTier === 'free' || userTier === 'basic') && (
            <Link
              href="/pricing"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}
            >
              <Crown size={12} /> Upgrade →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
