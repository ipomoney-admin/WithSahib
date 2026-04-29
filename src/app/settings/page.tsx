'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User as UserIcon, CreditCard, Bell, Shield, ChevronRight, Check, AlertCircle, Crown, Globe } from 'lucide-react'
import type { User } from '@/types'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'
import type { AvailableLocale } from '@/lib/languageMapping'

export default function SettingsPage() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tab, setTab] = useState<'profile' | 'subscription' | 'notifications' | 'security' | 'language'>('profile')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '' })
  const { locale, setLocale, allLanguages, availableLanguages } = useLanguage()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth/login'); return }
      supabase.from('users').select('*').eq('id', data.user.id).single().then(({ data: p }) => {
        if (p) { setUser(p); setForm({ name: p.name, phone: p.phone ?? '' }) }
      })
    })
  }, [supabase, router])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const { error } = await supabase.from('users').update({ name: form.name, phone: form.phone }).eq('id', user!.id)
    setSaving(false)
    if (error) toast.error('Failed to save profile')
    else { toast.success('Profile updated!'); setUser(u => u ? { ...u, ...form } : u) }
  }

  const tierLevel = { free: 0, basic: 1, pro: 2, elite: 3 }[user?.tier ?? 'free']

  const TABS: Array<{ id: typeof tab; label: string; icon: React.ElementType }> = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'language', label: 'Language', icon: Globe },
  ]

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 400, color: 'var(--text)', marginBottom: '6px' }}>Settings</h1>
        <p style={{ fontSize: '14px', color: 'var(--text3)' }}>Manage your account, subscription, and preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
        {/* Sidebar tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '10px', border: 'none',
                  background: tab === t.id ? 'rgba(0,200,150,0.08)' : 'transparent',
                  color: tab === t.id ? 'var(--emerald)' : 'var(--text3)',
                  cursor: 'pointer', fontSize: '14px', fontWeight: tab === t.id ? 500 : 400,
                  fontFamily: 'Inter, system-ui, sans-serif', textAlign: 'left', transition: 'all 0.15s',
                }}
              >
                <Icon size={16} strokeWidth={1.5} />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>

          {/* PROFILE */}
          {tab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '20px' }}>Profile</h2>
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,200,150,0.1)', border: '2px solid rgba(0,200,150,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 600, color: 'var(--emerald)', fontFamily: 'Playfair Display, serif' }}>
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>{user?.name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text3)' }}>{user?.email}</p>
                </div>
              </div>
              <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'name', label: 'FULL NAME', type: 'text' },
                  { key: 'phone', label: 'PHONE NUMBER', type: 'tel' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', color: 'var(--text3)', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                    <input className="input" type={f.type} value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', color: 'var(--text3)', display: 'block', marginBottom: '6px' }}>EMAIL</label>
                  <input className="input" type="email" value={user?.email ?? ''} disabled style={{ opacity: 0.6 }} />
                  <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>Email cannot be changed. Contact support if needed.</p>
                </div>
                <button type="submit" className="btn btn-primary btn-md" disabled={saving} style={{ width: 'fit-content' }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* SUBSCRIPTION */}
          {tab === 'subscription' && (
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '20px' }}>Subscription</h2>
              <div style={{ padding: '20px', background: 'var(--bg2)', borderRadius: '12px', marginBottom: '20px', border: `1px solid ${user?.tier === 'elite' ? 'rgba(212,168,67,0.3)' : user?.tier === 'pro' ? 'rgba(0,200,150,0.2)' : 'var(--border)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '12px', letterSpacing: '1.5px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Current Plan</p>
                    <p style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Playfair Display, serif', color: user?.tier === 'elite' ? 'var(--gold)' : user?.tier === 'pro' ? 'var(--emerald)' : 'var(--text)' }}>
                      {(user?.tier ?? 'free').charAt(0).toUpperCase() + (user?.tier ?? 'free').slice(1)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', background: user?.subscription_status === 'active' ? 'rgba(0,200,150,0.1)' : 'rgba(244,123,123,0.1)', color: user?.subscription_status === 'active' ? 'var(--emerald)' : 'var(--coral)' }}>
                      {(user?.subscription_status ?? 'inactive').toUpperCase()}
                    </span>
                    {user?.subscription_ends_at && (
                      <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
                        Renews {new Date(user.subscription_ends_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
                {user?.tier !== 'elite' && (
                  <Link href="/pricing" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Crown size={13} color="var(--gold)" /> Upgrade Plan <ChevronRight size={13} />
                  </Link>
                )}
              </div>
              {user?.tier !== 'free' && (
                <div style={{ padding: '14px 16px', background: 'rgba(244,123,123,0.04)', border: '1px solid rgba(244,123,123,0.12)', borderRadius: '10px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '8px' }}>Need to cancel your subscription?</p>
                  <button style={{ fontSize: '13px', color: 'var(--coral)', background: 'none', border: '1px solid rgba(244,123,123,0.2)', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Cancel subscription
                  </button>
                </div>
              )}
            </div>
          )}

          {/* NOTIFICATIONS */}
          {tab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '20px' }}>Notification Preferences</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { label: 'Intraday call alerts', sub: 'Notified when new calls are published', defaultOn: true },
                  { label: 'Target hit alerts', sub: 'When a call hits its target', defaultOn: true },
                  { label: 'Stop-loss alerts', sub: 'When stop-loss is triggered', defaultOn: true },
                  { label: 'New research reports', sub: 'When AI generates a new report', defaultOn: true },
                  { label: 'Portfolio rebalancing', sub: 'Model portfolio updates', defaultOn: false },
                  { label: 'Weekly market summary', sub: 'Every Monday morning', defaultOn: true },
                  { label: 'Promotional emails', sub: 'Offers and plan updates', defaultOn: false },
                ].map((item, i, arr) => (
                  <NotifRow key={item.label} {...item} last={i === arr.length - 1} />
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGE */}
          {tab === 'language' && (
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>Language & Region</h2>
              <p style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '24px' }}>Choose your preferred language for withSahib. Hindi, Marathi, and Gujarati are fully available.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {allLanguages.map((lang) => {
                  const isAvailable = (availableLanguages as readonly string[]).includes(lang.code)
                  const isActive = locale === lang.code
                  return (
                    <button
                      key={lang.code}
                      onClick={() => isAvailable && setLocale(lang.code as AvailableLocale)}
                      disabled={!isAvailable}
                      style={{
                        padding: '12px 16px',
                        border: isActive ? '2px solid #FF6B00' : '1px solid var(--border)',
                        borderRadius: '10px',
                        background: isActive ? 'rgba(255,107,0,0.06)' : 'var(--bg2)',
                        cursor: isAvailable ? 'pointer' : 'default',
                        textAlign: 'left',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'all 0.15s',
                        opacity: isAvailable ? 1 : 0.55,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: isActive ? '#FF6B00' : 'var(--text)' }}>{lang.nativeLabel}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '1px' }}>{lang.label}</div>
                      </div>
                      {isActive && <Check size={16} color="#FF6B00" />}
                      {!isAvailable && <span style={{ fontSize: '10px', color: 'var(--text4)', fontWeight: 600 }}>Soon</span>}
                    </button>
                  )
                })}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text4)', marginTop: '16px' }}>
                More languages coming soon — Tamil, Telugu, Kannada, Bengali, Punjabi, Malayalam.
              </p>
            </div>
          )}

          {/* SECURITY */}
          {tab === 'security' && (
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '20px' }}>Security</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '16px 18px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '3px' }}>Password</p>
                    <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Last changed: —</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (!user?.email) return
                      const supabase2 = createClient()
                      await supabase2.auth.resetPasswordForEmail(user.email)
                      toast.success('Password reset email sent!')
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    Change password
                  </button>
                </div>
                <div style={{ padding: '16px 18px', background: 'rgba(244,123,123,0.04)', border: '1px solid rgba(244,123,123,0.12)', borderRadius: '12px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', marginBottom: '6px' }}>Delete Account</p>
                  <p style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '12px' }}>This will permanently delete your account and all data. This cannot be undone.</p>
                  <button style={{ fontSize: '13px', color: 'var(--coral)', background: 'none', border: '1px solid rgba(244,123,123,0.2)', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Delete my account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NotifRow({ label, sub, defaultOn, last }: { label: string; sub: string; defaultOn: boolean; last: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: last ? 'none' : '1px solid var(--border)', gap: '12px' }}>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text)', marginBottom: '2px' }}>{label}</p>
        <p style={{ fontSize: '12px', color: 'var(--text3)' }}>{sub}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
          background: on ? 'var(--emerald)' : 'var(--border2)', position: 'relative', flexShrink: 0, transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute', top: '3px', left: on ? '23px' : '3px',
          width: '18px', height: '18px', borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
        }} />
      </button>
    </div>
  )
}
