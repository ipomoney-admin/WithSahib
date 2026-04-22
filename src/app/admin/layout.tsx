'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  BarChart2, Brain, Settings, LogOut, Activity, Bell, AlertTriangle,
} from 'lucide-react'

const NAV = [
  { label: 'Signals', href: '/admin/signals', icon: Activity },
  { label: 'Intelligence', href: '/admin/intelligence', icon: Brain },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [unreadAlerts, setUnreadAlerts] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/auth/login'); return }
      const res = await fetch('/api/admin/alerts')
      if (!res.ok) { router.push('/dashboard'); return }
      const json = await res.json()
      setUnreadAlerts((json.data ?? []).length)
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', alignItems: 'center', justifyContent: 'center' }}>
        <div className="shimmer" style={{ width: 200, height: 32, borderRadius: 8 }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <div style={{
        width: 220, height: '100%', background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid var(--border)', gap: 10 }}>
          <BarChart2 size={18} color="var(--emerald)" />
          <div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--emerald)' }}>Admin</span>
            <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 1 }}>withSahib</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {NAV.map((item) => {
            const Icon = item.icon
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${active ? 'active' : ''}`}
                style={{ marginBottom: 2, justifyContent: 'flex-start', padding: '10px 14px', position: 'relative' }}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span>{item.label}</span>
                {item.label === 'Signals' && unreadAlerts > 0 && (
                  <span style={{
                    marginLeft: 'auto', minWidth: 18, height: 18, borderRadius: 9,
                    background: 'var(--emerald)', color: '#000', fontSize: 10,
                    fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                  }}>
                    {unreadAlerts}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* SEBI badge */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 1, marginBottom: 8 }}>
            SEBI RA · INH000026266
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: '8px 0' }}
          >
            <LogOut size={14} strokeWidth={1.5} />
            <span style={{ fontSize: 12 }}>Sign out</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
