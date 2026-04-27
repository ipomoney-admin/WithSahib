'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/layout/ThemeProvider'
import type { User } from '@/types'
import {
  LayoutDashboard, TrendingUp, BarChart2, Target, RefreshCw,
  PieChart, Calendar, BookOpen, FileText, Bell, Settings,
  LogOut, Menu, X, Sun, Moon, ChevronRight, User as UserIcon,
  Zap, Crown,
} from 'lucide-react'
import { LogoMark } from '@/components/ui/Logo'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, tier: 'free' },
  { label: 'Intraday Calls', href: '/services/intraday', icon: TrendingUp, tier: 'pro', badge: 'Live' },
  { label: 'Stock Options', href: '/services/stock-options', icon: BarChart2, tier: 'pro' },
  { label: 'Index Options', href: '/services/index-options', icon: Target, tier: 'pro' },
  { label: 'Swing Trades', href: '/services/swing', icon: RefreshCw, tier: 'basic', badge: 'New' },
  { label: 'Model Portfolio', href: '/portfolio', icon: PieChart, tier: 'basic' },
  { label: 'Research Reports', href: '/reports', icon: FileText, tier: 'pro' },
  { label: 'Appointments', href: '/appointments', icon: Calendar, tier: 'pro' },
  { label: 'Courses', href: '/courses', icon: BookOpen, tier: 'basic' },
]

const TIER_ORDER: Record<string, number> = { free: 0, basic: 1, pro: 2, elite: 3 }

function tierColor(tier: string) {
  return tier === 'elite' ? 'var(--gold)' :
         tier === 'pro'   ? 'var(--emerald)' :
         tier === 'basic' ? 'var(--sapphire)' : 'var(--text3)'
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const supabase = useMemo(() => createClient(), [])

  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [viewingAsUser, setViewingAsUser] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth/login'); return }

      // Check admin status
      supabase
        .from('admin_roles')
        .select('id')
        .eq('user_id', data.user.id)
        .limit(1)
        .single()
        .then(({ data: adminRow }) => {
          if (adminRow) {
            setIsAdminUser(true)
            const cookie = document.cookie.split(';').find((c) => c.trim().startsWith('admin_view_mode='))
            setViewingAsUser(cookie?.split('=')[1]?.trim() === 'user')
          }
        })

      supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile) setUser(profile)
          setAuthLoading(false)
        })
    })
  }, [supabase, router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const userTierLevel = TIER_ORDER[user?.tier ?? 'free'] ?? 0
  // Admins get elite-level nav access unless in "view as user" mode
  const effectiveTierLevel = isAdminUser && !viewingAsUser ? 3 : (userTierLevel ?? 0)

  function canAccess(requiredTier: string) {
    return effectiveTierLevel >= (TIER_ORDER[requiredTier] ?? 0)
  }

  const Sidebar = ({ mobile = false }) => (
    <div
      style={{
        width: mobile ? '100%' : sidebarOpen ? '240px' : '64px',
        height: '100%',
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderBottom: '1px solid var(--border)',
          gap: '10px',
          flexShrink: 0,
        }}
      >
        <LogoMark size={24} animated={false} />
        {(sidebarOpen || mobile) && (
          <span style={{ fontSize: '16px', whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 400, color: 'var(--text)' }}>with</span>
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontWeight: 700, color: '#FF6B00' }}>Sahib</span>
          </span>
        )}
      </div>

      {/* User tier badge */}
      {(sidebarOpen || mobile) && user && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(0,200,150,0.1)',
                border: '1.5px solid rgba(0,200,150,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 600, color: 'var(--emerald)',
                flexShrink: 0,
              }}
            >
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </p>
              <span
                style={{
                  fontSize: '10px', fontWeight: 700, letterSpacing: '1px',
                  color: tierColor(user.tier),
                  textTransform: 'uppercase',
                }}
              >
                {user.tier} plan
              </span>
            </div>
          </div>
          {user.tier !== 'elite' && !(isAdminUser && !viewingAsUser) && (
            <Link
              href="/pricing"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                marginTop: '10px', padding: '7px 10px',
                background: 'rgba(212,168,67,0.06)',
                border: '1px solid rgba(212,168,67,0.15)',
                borderRadius: '8px',
                fontSize: '11px', fontWeight: 600,
                color: 'var(--gold)', textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              <Crown size={12} />
              Upgrade to Elite
              <ChevronRight size={11} style={{ marginLeft: 'auto' }} />
            </Link>
          )}
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          const accessible = canAccess(item.tier)

          return (
            <Link
              key={item.href}
              href={accessible ? item.href : '/pricing'}
              className={`sidebar-link ${active ? 'active' : ''}`}
              style={{
                opacity: accessible ? 1 : 0.5,
                justifyContent: sidebarOpen || mobile ? 'flex-start' : 'center',
                padding: sidebarOpen || mobile ? '10px 14px' : '10px',
                marginBottom: '2px',
                position: 'relative',
              }}
              title={!sidebarOpen && !mobile ? item.label : undefined}
            >
              <Icon size={17} strokeWidth={1.5} style={{ flexShrink: 0 }} />
              {(sidebarOpen || mobile) && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,200,150,0.12)', color: 'var(--emerald)' }}>
                      {item.badge}
                    </span>
                  )}
                  {!accessible && <Crown size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: '8px 8px 16px', borderTop: '1px solid var(--border)' }}>
        {[
          { icon: Settings, label: 'Settings', href: '/settings' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-link"
              style={{ justifyContent: sidebarOpen || mobile ? 'flex-start' : 'center', marginBottom: '2px' }}
            >
              <Icon size={17} strokeWidth={1.5} />
              {(sidebarOpen || mobile) && <span>{item.label}</span>}
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            justifyContent: sidebarOpen || mobile ? 'flex-start' : 'center',
            color: 'var(--coral)',
          }}
        >
          <LogOut size={17} strokeWidth={1.5} />
          {(sidebarOpen || mobile) && <span>Sign out</span>}
        </button>
      </div>
    </div>
  )

  // Loading skeleton while auth resolves
  if (authLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
        {/* Sidebar skeleton */}
        <div style={{ width: 240, background: 'var(--bg2)', borderRight: '1px solid var(--border)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="shimmer" style={{ height: 32, borderRadius: 8, marginBottom: 16 }} />
          <div className="shimmer" style={{ height: 48, borderRadius: 10, marginBottom: 8 }} />
          {[...Array(7)].map((_, i) => (
            <div key={i} className="shimmer" style={{ height: 36, borderRadius: 8, opacity: 1 - i * 0.08 }} />
          ))}
        </div>
        {/* Main skeleton */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 64, background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }} />
          <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="shimmer" style={{ height: 36, width: 260, borderRadius: 8 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="shimmer" style={{ height: 100, borderRadius: 12 }} />
              ))}
            </div>
            <div className="shimmer" style={{ height: 200, borderRadius: 12 }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Desktop sidebar */}
      <div className="hide-mobile" style={{ height: '100%' }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            display: 'flex',
          }}
        >
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div style={{ width: '280px', height: '100%', position: 'relative', zIndex: 1, animation: 'slideIn 0.25s ease' }}>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <header
          style={{
            height: '64px', flexShrink: 0,
            background: 'var(--bg2)',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center',
            padding: '0 24px', gap: '12px',
          }}
        >
          {/* Mobile menu */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', display: 'flex' }}
          >
            <Menu size={20} />
          </button>

          {/* Sidebar toggle desktop */}
          <button
            className="hide-mobile"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', display: 'flex', padding: '4px' }}
          >
            <Menu size={18} />
          </button>

          <div style={{ flex: 1 }} />

          {/* SEBI badge */}
          <span
            className="hide-mobile"
            style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: 'var(--text3)', letterSpacing: '1px', border: '1px solid var(--border)', borderRadius: '4px', padding: '3px 7px' }}
          >
            SEBI · INH000026266
          </span>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: 'var(--text2)', display: 'flex', alignItems: 'center' }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Notifications */}
          <button
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: 'var(--text2)', display: 'flex', alignItems: 'center', position: 'relative' }}
          >
            <Bell size={15} />
            {notifications > 0 && (
              <span
                style={{
                  position: 'absolute', top: '4px', right: '4px',
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: 'var(--coral)', border: '1.5px solid var(--bg2)',
                }}
              />
            )}
          </button>

          {/* User avatar */}
          <div
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(0,200,150,0.1)',
              border: '1.5px solid rgba(0,200,150,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 600, color: 'var(--emerald)',
              cursor: 'pointer',
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? <UserIcon size={14} />}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
