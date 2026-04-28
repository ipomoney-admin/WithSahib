'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/layout/ThemeProvider'
import type { User } from '@/types'
import {
  LayoutDashboard, TrendingUp, BarChart2, Target, RefreshCw,
  PieChart, Calendar, GraduationCap, FileText, Bell, Settings,
  LogOut, Menu, X, Sun, Moon, ChevronRight, User as UserIcon,
  Crown, Shield, Check,
} from 'lucide-react'
import { LogoMark } from '@/components/ui/Logo'

// ─── POPUP ITEMS (open modal, no navigation) ──────────────────────────────
type PopupKey = 'intraday' | 'stock-options' | 'index-options' | 'swing' | 'model-portfolio' | 'research-reports' | 'appointments' | 'mentorship'

interface PopupItem {
  label: string
  key: PopupKey
  icon: React.ElementType
  tier: string
  badge?: string
}

const POPUP_ITEMS: PopupItem[] = [
  { label: 'Intraday Calls',    key: 'intraday',          icon: TrendingUp,    tier: 'pro',   badge: 'Live' },
  { label: 'Stock Options',     key: 'stock-options',     icon: BarChart2,     tier: 'pro' },
  { label: 'Index Options',     key: 'index-options',     icon: Target,        tier: 'pro' },
  { label: 'Swing Trades',      key: 'swing',             icon: RefreshCw,     tier: 'basic', badge: 'New' },
  { label: 'Model Portfolio',   key: 'model-portfolio',   icon: PieChart,      tier: 'basic', badge: 'SOON' },
  { label: 'Research Reports',  key: 'research-reports',  icon: FileText,      tier: 'pro',   badge: 'SOON' },
  { label: 'Appointments',      key: 'appointments',      icon: Calendar,      tier: 'free' },
  { label: 'Mentorship',        key: 'mentorship',        icon: GraduationCap, tier: 'free' },
]

const TIER_ORDER: Record<string, number> = { free: 0, basic: 1, pro: 2, elite: 3 }

function tierColor(tier: string) {
  return tier === 'elite' ? 'var(--gold)' :
         tier === 'pro'   ? 'var(--emerald)' :
         tier === 'basic' ? 'var(--sapphire)' : 'var(--text3)'
}

// ─── POPUP CONTENT ────────────────────────────────────────────────────────

function CheckRow({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
      <Check size={14} style={{ color: '#1A7A4A', flexShrink: 0, marginTop: 2 }} />
      <span style={{ fontSize: '13px', color: '#CCCCCC', lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

function PricingPopupContent({ serviceKey }: { serviceKey: string }) {
  const configs: Record<string, {
    header: string; sub: string; price: string; features: string[]; cta: string
  }> = {
    'intraday': {
      header: 'Intraday Research',
      sub: 'Daily pre-market equity research for NSE stocks',
      price: '₹2,499 / month',
      features: [
        'Daily intraday research picks',
        'Entry zone, 2 targets, stop-loss',
        'Written rationale on every pick',
        'WhatsApp delivery before 9 AM',
        'SEBI RA INH000026266',
      ],
      cta: 'Subscribe to Intraday →',
    },
    'stock-options': {
      header: 'Stock Options Research',
      sub: 'Weekly F&O research on NSE-listed stocks',
      price: '₹2,499 / month',
      features: [
        'Weekly F&O research recommendations',
        'Strike selection, premium targets, max-risk',
        'OI analysis, IV rank context',
        'Written rationale every call',
        'SEBI RA INH000026266',
      ],
      cta: 'Subscribe to Options →',
    },
    'index-options': {
      header: 'Index Options Research',
      sub: 'Nifty, BankNifty, Sensex, FinNifty setups',
      price: '₹2,499 / month',
      features: [
        'Nifty, BankNifty, Sensex, FinNifty',
        'Expiry-day plays + weekly setups',
        'PCR, OI, multi-timeframe analysis',
        'Written rationale every call',
        'SEBI RA INH000026266',
      ],
      cta: 'Subscribe to Index Options →',
    },
    'swing': {
      header: 'Swing Trade Research',
      sub: '2–10 day positional setups for NSE stocks',
      price: '₹999 / month',
      features: [
        '2–10 day positional setups',
        'Entry zone, 2 targets, stop-loss',
        'Cup-handle, flags, triangle breakouts',
        'Weekly research digest',
        'SEBI RA INH000026266',
      ],
      cta: 'Subscribe to Swing →',
    },
  }

  const cfg = configs[serviceKey]
  if (!cfg) return null

  return (
    <div>
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '24px', fontWeight: 400, color: '#FFFFFF', marginBottom: '6px' }}>
        {cfg.header}
      </h2>
      <p style={{ fontSize: '13px', color: '#888888', marginBottom: '20px' }}>{cfg.sub}</p>
      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '32px', fontWeight: 700, color: '#FF6B00' }}>{cfg.price}</span>
      </div>
      <div style={{ marginBottom: '24px' }}>
        {cfg.features.map((f) => <CheckRow key={f} text={f} />)}
      </div>
      <Link
        href="/pricing"
        className="btn btn-primary btn-md"
        style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none', width: '100%', marginBottom: '10px' }}
      >
        {cfg.cta}
      </Link>
      <Link
        href="/pricing"
        style={{ display: 'block', textAlign: 'center', fontSize: '13px', color: '#666666', textDecoration: 'none' }}
      >
        View full pricing
      </Link>
      <p style={{ fontSize: '11px', color: '#555555', marginTop: '20px', borderTop: '1px solid #2A2A2A', paddingTop: '16px' }}>
        Research by Sahib Singh Hora, SEBI RA INH000026266. Investments subject to market risk. Past performance not indicative of future results. Not investment advice.
      </p>
    </div>
  )
}

function ModelPortfolioPopup() {
  return (
    <div>
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '24px', fontWeight: 400, color: '#FFFFFF', marginBottom: '8px' }}>
        Model Portfolio
      </h2>
      <p style={{ fontSize: '13px', color: '#888888', marginBottom: '24px' }}>Conviction-based. Defined allocation. Rebalanced with logic.</p>

      {/* Animated bars */}
      <div style={{ marginBottom: '24px' }}>
        {[
          { label: 'Large Cap', pct: 45, color: '#FF6B00' },
          { label: 'Mid Cap',   pct: 35, color: '#1A7A4A' },
          { label: 'Cash',      pct: 20, color: '#B8975A' },
        ].map(({ label, pct, color }) => (
          <div key={label} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: '#AAAAAA' }}>{label}</span>
              <span style={{ fontSize: '12px', color: color, fontWeight: 600 }}>{pct}%</span>
            </div>
            <div style={{ height: '6px', background: '#2A2A2A', borderRadius: '100px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color}99, ${color})`,
                  borderRadius: '100px',
                  animation: 'bar-fill 1.5s ease forwards',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '13px', color: '#CCCCCC', lineHeight: 1.7, marginBottom: '24px' }}>
        Sahib Singh Hora is personally building a conviction-based model portfolio with defined allocation, entry levels, and rebalancing logic. Available to Elite subscribers first.
      </p>
      <a
        href="mailto:connect@withsahib.com?subject=Model Portfolio Waitlist"
        className="btn btn-primary btn-md"
        style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none', width: '100%' }}
      >
        Notify me →
      </a>
    </div>
  )
}

function ResearchReportsPopup() {
  return (
    <div>
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '24px', fontWeight: 400, color: '#FFFFFF', marginBottom: '8px' }}>
        Research Reports
      </h2>
      <p style={{ fontSize: '13px', color: '#888888', marginBottom: '24px' }}>Deep-dive equity research. Beyond the trade.</p>

      {/* Animated document stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {['Balance Sheet Analysis', 'Annual Report Deep-Dive', 'Sector Positioning'].map((title, i) => (
          <div
            key={title}
            style={{
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '8px',
              padding: '12px 14px',
              animation: `popup-in 0.4s ease ${i * 0.1}s both`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={14} style={{ color: '#FF6B00', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#CCCCCC', fontWeight: 500 }}>{title}</span>
            </div>
            {/* Fake content lines */}
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[80, 60, 75].map((w, j) => (
                <div key={j} style={{ height: '3px', width: `${w}%`, background: '#333333', borderRadius: '2px' }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '13px', color: '#CCCCCC', lineHeight: 1.7, marginBottom: '24px' }}>
        Deep-dive equity research reports — earnings quality, management analysis, sector positioning. Published for Elite and HNI subscribers.
      </p>
      <a
        href="mailto:connect@withsahib.com?subject=Research Reports Waitlist"
        className="btn btn-primary btn-md"
        style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none', width: '100%' }}
      >
        Join waitlist →
      </a>
    </div>
  )
}

function AppointmentsPopup() {
  return (
    <div>
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '24px', fontWeight: 400, color: '#FFFFFF', marginBottom: '6px' }}>
        Book a Session
      </h2>
      <p style={{ fontSize: '13px', color: '#888888', marginBottom: '24px' }}>One-on-one with Sahib Singh Hora, SEBI RA</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          {
            duration: '15 Min',
            price: '₹1,999',
            lines: ['Strategy review or Q&A', 'One specific topic / trade', 'Via Google Meet / Zoom'],
            cta: 'Book 15 Min →',
          },
          {
            duration: '30 Min',
            price: '₹2,999',
            lines: ['Portfolio review or deep-dive', 'Multiple topics covered', 'Via Google Meet / Zoom'],
            cta: 'Book 30 Min →',
          },
        ].map(({ duration, price, lines, cta }) => (
          <div
            key={duration}
            style={{
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#FF6B00', marginBottom: '2px' }}>{duration}</p>
              <p style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF' }}>{price}</p>
            </div>
            <div>
              {lines.map((l) => (
                <p key={l} style={{ fontSize: '12px', color: '#888888', marginBottom: '4px' }}>· {l}</p>
              ))}
            </div>
            <Link
              href="/appointments"
              className="btn btn-primary btn-sm"
              style={{ textDecoration: 'none', justifyContent: 'center', display: 'flex' }}
            >
              {cta}
            </Link>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '12px', color: '#666666', textAlign: 'center', marginBottom: '4px' }}>
        Sessions are personal. Direct access to Sahib Singh Hora.
      </p>
      <p style={{ fontSize: '11px', color: '#555555', textAlign: 'center' }}>
        SEBI RA INH000026266 · connect@withsahib.com
      </p>
    </div>
  )
}

function MentorshipPopup() {
  return (
    <div>
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '24px', fontWeight: 400, color: '#FFFFFF', marginBottom: '6px' }}>
        Live 1-on-1 Mentorship
      </h2>
      <p style={{ fontSize: '13px', color: '#888888', marginBottom: '24px' }}>Personalised. Live. Built around you.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {[
          { name: 'Market Foundations', sub: 'Equity focus — for beginners & intermediates', price: '₹24,999' },
          { name: 'Options Positioning System', sub: 'F&O strategy building from scratch', price: '₹34,999' },
          { name: 'Research Framework', sub: 'Pro-level equity research skills', price: '₹44,999' },
        ].map(({ name, sub, price }) => (
          <div
            key={name}
            style={{
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '10px',
              padding: '14px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginBottom: '2px' }}>{name}</p>
              <p style={{ fontSize: '11px', color: '#888888' }}>{sub}</p>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#FF6B00', whiteSpace: 'nowrap', marginLeft: '12px' }}>{price}</span>
          </div>
        ))}
      </div>

      {/* Flagship */}
      <div
        style={{
          background: 'rgba(184,151,90,0.08)',
          border: '1px solid rgba(184,151,90,0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#B8975A', marginBottom: '3px' }}>Flagship Mentorship</p>
            <p style={{ fontSize: '11px', color: '#999999' }}>Only 1 mentee per batch · 3 months · Direct access</p>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#B8975A' }}>₹74,999</span>
        </div>
        <a
          href="mailto:connect@withsahib.com?subject=Flagship Mentorship Application"
          className="btn btn-gold btn-sm"
          style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', marginTop: '12px' }}
        >
          Apply Now →
        </a>
      </div>

      <Link
        href="/courses"
        style={{ display: 'block', textAlign: 'center', fontSize: '13px', color: '#666666', textDecoration: 'none' }}
      >
        View all programs →
      </Link>
    </div>
  )
}

// ─── POPUP MODAL WRAPPER ──────────────────────────────────────────────────
function PopupModal({ popupKey, onClose }: { popupKey: PopupKey; onClose: () => void }) {
  const isPricing = ['intraday', 'stock-options', 'index-options', 'swing'].includes(popupKey)
  const isComingSoon = ['model-portfolio', 'research-reports'].includes(popupKey)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '520px',
          background: '#111111',
          border: '1px solid #2A2A2A',
          borderRadius: '16px',
          padding: '28px',
          position: 'relative',
          animation: 'popup-in 0.25s ease',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#666666', display: 'flex', padding: '4px',
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {isPricing && <PricingPopupContent serviceKey={popupKey} />}
        {popupKey === 'model-portfolio' && <ModelPortfolioPopup />}
        {popupKey === 'research-reports' && <ResearchReportsPopup />}
        {popupKey === 'appointments' && <AppointmentsPopup />}
        {popupKey === 'mentorship' && <MentorshipPopup />}
      </div>
    </div>
  )
}

// ─── MAIN LAYOUT ─────────────────────────────────────────────────────────

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
  const [activePopup, setActivePopup] = useState<PopupKey | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth/login'); return }

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
  const effectiveTierLevel = isAdminUser && !viewingAsUser ? 3 : (userTierLevel ?? 0)

  function canAccess(requiredTier: string) {
    return effectiveTierLevel >= (TIER_ORDER[requiredTier] ?? 0)
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      style={{
        width: mobile ? '100%' : sidebarOpen ? '240px' : '64px',
        height: '100%',
        background: '#1A1A1A',
        borderRight: '1px solid #2A2A2A',
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
          borderBottom: '1px solid #2A2A2A',
          gap: '10px',
          flexShrink: 0,
          background: '#111111',
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
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2A2A2A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF6B00, #FF8C33)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 700, color: '#FFFFFF',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              {user.name?.[0]?.toUpperCase() ?? 'U'}
              {(isAdminUser && !viewingAsUser) && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', fontSize: '10px' }}>👑</span>
              )}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </p>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: tierColor(user.tier), textTransform: 'uppercase' }}>
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

      {/* Top nav — Dashboard link */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        <Link
          href="/dashboard"
          className={`sidebar-link ${pathname === '/dashboard' ? 'active' : ''}`}
          style={{ justifyContent: sidebarOpen || mobile ? 'flex-start' : 'center', marginBottom: '2px' }}
          title={!sidebarOpen && !mobile ? 'Dashboard' : undefined}
        >
          <LayoutDashboard size={17} strokeWidth={1.5} style={{ flexShrink: 0, color: pathname === '/dashboard' ? '#FF6B00' : '#6A6A6A' }} />
          {(sidebarOpen || mobile) && <span>Dashboard</span>}
        </Link>

        {/* Popup items */}
        {POPUP_ITEMS.map((item) => {
          const Icon = item.icon
          const accessible = canAccess(item.tier)
          const isSoon = item.badge === 'SOON'

          return (
            <button
              key={item.key}
              onClick={() => setActivePopup(item.key as PopupKey)}
              className="sidebar-link"
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                opacity: accessible ? 1 : 0.5,
                justifyContent: sidebarOpen || mobile ? 'flex-start' : 'center',
                padding: sidebarOpen || mobile ? '10px 14px' : '10px',
                marginBottom: '2px',
              }}
              title={!sidebarOpen && !mobile ? item.label : undefined}
            >
              <Icon size={17} strokeWidth={1.5} style={{ flexShrink: 0, color: '#6A6A6A' }} />
              {(sidebarOpen || mobile) && (
                <>
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                  {item.badge && !isSoon && (
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,200,150,0.12)', color: 'var(--emerald)' }}>
                      {item.badge}
                    </span>
                  )}
                  {isSoon && (
                    <span className="badge-soon">{item.badge}</span>
                  )}
                  {!accessible && <Crown size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />}
                </>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: '8px 8px 16px', borderTop: '1px solid #2A2A2A' }}>
        <Link
          href="/settings"
          className="sidebar-link"
          style={{ justifyContent: sidebarOpen || mobile ? 'flex-start' : 'center', marginBottom: '2px' }}
        >
          <Settings size={17} strokeWidth={1.5} style={{ color: '#6A6A6A' }} />
          {(sidebarOpen || mobile) && <span>Settings</span>}
        </Link>
        {isAdminUser && !viewingAsUser && (
          <Link
            href="/admin"
            className="sidebar-link"
            style={{ justifyContent: sidebarOpen || mobile ? 'flex-start' : 'center', marginBottom: '2px', color: 'var(--gold)' }}
            title={!sidebarOpen && !mobile ? 'Admin Panel' : undefined}
          >
            <Shield size={17} strokeWidth={1.5} style={{ color: 'var(--gold)' }} />
            {(sidebarOpen || mobile) && <span>Admin Panel</span>}
          </Link>
        )}
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

  if (authLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
        <div style={{ width: 240, background: '#1A1A1A', borderRight: '1px solid #2A2A2A', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="shimmer" style={{ height: 32, borderRadius: 8, marginBottom: 16 }} />
          <div className="shimmer" style={{ height: 48, borderRadius: 10, marginBottom: 8 }} />
          {[...Array(7)].map((_, i) => (
            <div key={i} className="shimmer" style={{ height: 36, borderRadius: 8, opacity: 1 - i * 0.08 }} />
          ))}
        </div>
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ width: '280px', height: '100%', position: 'relative', zIndex: 1, animation: 'slideIn 0.25s ease' }}>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Popup modal */}
      {activePopup && (
        <PopupModal popupKey={activePopup} onClose={() => setActivePopup(null)} />
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
          <button
            className="show-mobile"
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', display: 'flex' }}
          >
            <Menu size={20} />
          </button>

          <button
            className="hide-mobile"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', display: 'flex', padding: '4px' }}
          >
            <Menu size={18} />
          </button>

          <div style={{ flex: 1 }} />

          <span
            className="hide-mobile"
            style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: 'var(--text3)', letterSpacing: '1px', border: '1px solid var(--border)', borderRadius: '4px', padding: '3px 7px' }}
          >
            SEBI · INH000026266
          </span>

          <button
            onClick={toggleTheme}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: 'var(--text2)', display: 'flex', alignItems: 'center' }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: 'var(--text2)', display: 'flex', alignItems: 'center', position: 'relative' }}
          >
            <Bell size={15} />
            {notifications > 0 && (
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--coral)', border: '1.5px solid var(--bg2)' }} />
            )}
          </button>

          <div
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B00, #FF8C33)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: '#FFFFFF',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? <UserIcon size={14} />}
            {(isAdminUser && !viewingAsUser) && (
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '10px' }}>👑</span>
            )}
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {children}
        </main>
      </div>

      {/* Bar-fill animation for model portfolio popup */}
      <style>{`
        @keyframes bar-fill {
          from { width: 0%; }
        }
      `}</style>
    </div>
  )
}
