'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/layout/ThemeProvider'
import type { User } from '@/types'
import {
  LayoutDashboard, TrendingUp, BarChart2, Target, RefreshCw,
  PieChart, Calendar, GraduationCap, FileText, Bell,
  Menu, X, ChevronRight, User as UserIcon,
  Crown, Shield, Check, FileEdit,
} from 'lucide-react'
import { LogoMark } from '@/components/ui/Logo'
import { PayButton } from '@/components/ui/PayButton'
import { useLanguage } from '@/contexts/LanguageContext'
import { DashboardProtection } from '@/components/dashboard/DashboardProtection'

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

// DB tier 'basic' = Positional plan (user-facing name)
// Pro gets all 4 services (their chosen one + swing); we default to showing all until pro_service is stored
function hasServiceAccess(tier: string, service: string): boolean {
  if (tier === 'elite') return true
  if (tier === 'pro') return ['swing', 'intraday', 'stock-options', 'index-options'].includes(service)
  if (tier === 'basic') return service === 'swing'
  return false
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
  const { t } = useLanguage()
  const configs: Record<string, {
    header: string; sub: string; availableIn: string; desc: string
  }> = {
    'intraday': {
      header: 'Intraday Research Picks',
      sub: 'Daily pre-market equity research for NSE stocks',
      availableIn: 'Pro (₹6,999/mo) · Elite (₹12,499/mo)',
      desc: 'Daily pre-market equity research. Entry zone, targets, stop-loss and written rationale — delivered before 9 AM.',
    },
    'stock-options': {
      header: 'Stock Options Research',
      sub: 'Weekly F&O research with full context',
      availableIn: 'Pro (₹6,999/mo) · Elite (₹12,499/mo)',
      desc: 'Weekly F&O research with strike selection, OI analysis, IV rank context and written rationale.',
    },
    'index-options': {
      header: 'Index Options Research',
      sub: 'Nifty, BankNifty, Sensex, FinNifty setups',
      availableIn: 'Pro (₹6,999/mo) · Elite (₹12,499/mo)',
      desc: 'Nifty, BankNifty, Sensex and FinNifty. Expiry plays and weekly setups with PCR and OI context.',
    },
    'swing': {
      header: 'Swing Trades',
      sub: '2–10 day NSE positional trade ideas — pattern-based, systematic',
      availableIn: 'Positional (₹3,999/mo) and above',
      desc: '3–5 NSE swing trade setups per week. Each pick includes the chart pattern, sector context, entry range, two targets, and a stop-loss. Research by SEBI RA Sahib Singh Hora (INH000026266).',
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

      {/* Available in */}
      <div style={{ background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#FF6B00', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Available in</p>
        <p style={{ fontSize: '13px', color: '#CCCCCC' }}>{cfg.availableIn}</p>
      </div>

      <p style={{ fontSize: '14px', color: '#BBBBBB', lineHeight: 1.7, marginBottom: '24px' }}>{cfg.desc}</p>

      <PayButton
        planName="pro"
        planDisplayName="Pro Plan — Unlock This Service"
        amountPaise={699900}
        style={{
          display: 'block', width: '100%', padding: '11px 22px',
          borderRadius: '8px', background: '#FF6B00', color: '#FFFFFF',
          border: 'none', fontSize: '14px', fontWeight: 700,
          cursor: 'pointer', marginBottom: '10px',
          fontFamily: 'var(--font-body)',
        }}
      >
        Upgrade to Pro — ₹6,999/mo →
      </PayButton>
      <Link
        href="/pricing"
        style={{ display: 'block', textAlign: 'center', fontSize: '12px', color: '#888888', textDecoration: 'none', marginBottom: '10px' }}
      >
        See all plans →
      </Link>
      <p style={{ fontSize: '11px', color: '#555555', marginTop: '12px', borderTop: '1px solid #2A2A2A', paddingTop: '16px' }}>
        Research by Sahib Singh Hora, SEBI RA INH000026266. Investments subject to market risk. Past performance not indicative of future results. Not investment advice.
      </p>
    </div>
  )
}

// ─── CONTENT POPUP — shown when user already has access ──────────────────
function ServiceContentPopup({ serviceKey }: { serviceKey: string }) {
  const configs: Record<string, { header: string; desc: string }> = {
    'intraday': {
      header: 'Intraday Research Picks',
      desc: 'Daily pre-market equity research. Entry zone, targets, stop-loss and written rationale — delivered before 9 AM.',
    },
    'stock-options': {
      header: 'Stock Options Research',
      desc: 'Weekly F&O research with strike selection, OI analysis, IV rank context and written rationale.',
    },
    'index-options': {
      header: 'Index Options Research',
      desc: 'Nifty, BankNifty, Sensex and FinNifty. Expiry plays and weekly setups with PCR and OI context.',
    },
    'swing': {
      header: 'Swing Trades',
      desc: '3–5 NSE swing trade setups per week. Each pick includes the chart pattern, sector context, entry range, two targets, and a stop-loss.',
    },
  }

  const cfg = configs[serviceKey]
  if (!cfg) return null

  return (
    <div>
      {/* Access badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(26,122,74,0.15)', border: '1px solid rgba(26,122,74,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Check size={11} style={{ color: '#1A7A4A' }} />
        </div>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A7A4A', letterSpacing: '0.5px' }}>Included in your plan</span>
      </div>

      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '24px', fontWeight: 400, color: '#FFFFFF', marginBottom: '6px' }}>
        {cfg.header}
      </h2>
      <p style={{ fontSize: '13px', color: '#888888', marginBottom: '24px' }}>{cfg.desc}</p>

      {/* Status */}
      <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF6B00', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#FF6B00', letterSpacing: '0.5px' }}>LIVE — publishes before 9 AM on trading days</span>
        </div>
        <p style={{ fontSize: '13px', color: '#888888', lineHeight: 1.6 }}>
          Research for this service will appear here once published. You&apos;ll receive WhatsApp alerts before 9 AM on every trading day.
        </p>
      </div>

      <p style={{ fontSize: '11px', color: '#555555', borderTop: '1px solid #2A2A2A', paddingTop: '16px' }}>
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
            cta: 'Book 15 Min — ₹1,999',
            planName: 'appointment_15',
            amountPaise: 199900,
          },
          {
            duration: '30 Min',
            price: '₹2,999',
            lines: ['Portfolio review or deep-dive', 'Multiple topics covered', 'Via Google Meet / Zoom'],
            cta: 'Book 30 Min — ₹2,999',
            planName: 'appointment_30',
            amountPaise: 299900,
          },
        ].map(({ duration, price, lines, cta, planName, amountPaise }) => (
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
            <PayButton
              planName={planName}
              planDisplayName={cta}
              amountPaise={amountPaise}
              style={{
                display: 'block', width: '100%', padding: '8px 12px',
                borderRadius: '8px', background: '#FF6B00', color: '#FFFFFF',
                border: 'none', fontSize: '13px', fontWeight: 700,
                cursor: 'pointer', textAlign: 'center',
                fontFamily: 'var(--font-body)',
              }}
            >
              {cta}
            </PayButton>
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
        Flagship Mentorship
      </h2>
      <p style={{ fontSize: '13px', color: '#888888', marginBottom: '24px' }}>
        One mentee. Three months. Direct access to Sahib Singh Hora.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {[
          '1-on-1 personalised mentorship — only 1 mentee per batch',
          '3 months direct access to Sahib Singh Hora, SEBI RA',
          'Covers research process, trade management, and market reading',
        ].map((point) => (
          <div key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ color: '#FF6B00', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>•</span>
            <span style={{ fontSize: '14px', color: '#CCCCCC', lineHeight: 1.6 }}>{point}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.2)', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px' }}>
        <p style={{ fontSize: '13px', color: '#FF6B00', fontWeight: 700, marginBottom: '2px' }}>Investment</p>
        <p style={{ fontSize: '15px', color: '#CCCCCC' }}>₹74,999 one-time <span style={{ color: '#666', fontSize: '13px' }}>or 3 × ₹26,999 instalments</span></p>
      </div>

      <Link
        href="/work-with-us"
        className="btn btn-primary btn-md"
        style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none', width: '100%', marginBottom: '10px' }}
      >
        Apply for Mentorship →
      </Link>

      <p style={{ fontSize: '11px', color: '#555555', marginTop: '16px', borderTop: '1px solid #2A2A2A', paddingTop: '16px' }}>
        Research by Sahib Singh Hora, SEBI RA INH000026266. Investments subject to market risk. Past performance not indicative of future results. Not investment advice.
      </p>
    </div>
  )
}

// ─── POPUP MODAL WRAPPER ──────────────────────────────────────────────────
const SERVICE_KEYS = ['intraday', 'stock-options', 'index-options', 'swing'] as const

function PopupModal({ popupKey, onClose, userTier }: { popupKey: PopupKey; onClose: () => void; userTier: string }) {
  const isService = (SERVICE_KEYS as readonly string[]).includes(popupKey)
  const userHasAccess = isService && hasServiceAccess(userTier, popupKey)

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

        {/* Service items: content if user has access, pricing if not */}
        {isService && userHasAccess && <ServiceContentPopup serviceKey={popupKey} />}
        {isService && !userHasAccess && <PricingPopupContent serviceKey={popupKey} />}

        {/* Non-service items — always show their own popup */}
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
  const { t } = useLanguage()

  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false)
  const [viewingAsUser, setViewingAsUser] = useState(false)
  const [activePopup, setActivePopup] = useState<PopupKey | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    if (!profileOpen) return
    const close = () => setProfileOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [profileOpen])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth/login'); return }

      supabase
        .from('admin_roles')
        .select('id, role')
        .eq('user_id', data.user.id)
        .limit(1)
        .single()
        .then(({ data: adminRow }) => {
          if (adminRow) {
            setIsAdminUser(true)
            if (adminRow.role === 'super_admin') setIsSuperAdminUser(true)
            const cookie = document.cookie.split(';').find((c) => c.trim().startsWith('admin_view_mode='))
            setViewingAsUser(cookie?.split('=')[1]?.trim() === 'user')
          }
        })

      // Try public.users first; fall back to user metadata then subscriptions table for tier
      supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()
        .then(async ({ data: profile }) => {
          if (profile) {
            setUser(profile)
          } else {
            // public.users is empty — priority: user_metadata.plan → subscriptions table → free
            const authMeta = data.user.user_metadata ?? {}
            const name = authMeta.full_name ?? authMeta.name ?? data.user.email?.split('@')[0] ?? 'User'
            // Check metadata first (Supabase admin can set plan directly on the user)
            const metaPlan = authMeta.plan as string | undefined
            if (metaPlan) {
              setUser({ id: data.user.id, name, email: data.user.email ?? '', tier: metaPlan } as unknown as import('@/types').User)
              setAuthLoading(false)
              return
            }
            // Fallback: active subscriptions row
            const { data: sub } = await supabase
              .from('subscriptions')
              .select('tier, status')
              .eq('user_id', data.user.id)
              .eq('status', 'active')
              .order('created_at', { ascending: false })
              .limit(1)
              .single()
            const tier = sub?.tier ?? 'free'
            setUser({ id: data.user.id, name, email: data.user.email ?? '', tier } as unknown as import('@/types').User)
          }
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
  // String tier for access checks — admins always get elite-level access
  const effectiveTier = isAdminUser && !viewingAsUser ? 'elite' : (user?.tier ?? 'free')

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
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LogoMark size={24} animated={false} />
          {(sidebarOpen || mobile) && (
            <span style={{ fontSize: '16px', whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>with</span>
              <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontWeight: 700, color: '#FF6B00' }}>Sahib</span>
            </span>
          )}
        </Link>
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

        {/* Letterhead — super admin only */}
        {isAdminUser && !viewingAsUser && (
          <Link
            href="/dashboard/letterhead"
            className={`sidebar-link ${pathname === '/dashboard/letterhead' ? 'active' : ''}`}
            style={{ justifyContent: sidebarOpen || mobile ? 'flex-start' : 'center', marginBottom: '2px' }}
            title={!sidebarOpen && !mobile ? 'Letterhead' : undefined}
          >
            <FileEdit size={17} strokeWidth={1.5} style={{ flexShrink: 0, color: pathname === '/dashboard/letterhead' ? '#FF6B00' : '#6A6A6A' }} />
            {(sidebarOpen || mobile) && <span>Letterhead</span>}
          </Link>
        )}

        {/* Popup items */}
        {POPUP_ITEMS.map((item) => {
          const Icon = item.icon
          const accessible = canAccess(item.tier)
          const isSoon = item.badge === 'SOON'
          const isServiceItem = (SERVICE_KEYS as readonly string[]).includes(item.key)
          // Crown shown only when user lacks access to this specific service
          const showCrown = isServiceItem
            ? !hasServiceAccess(effectiveTier, item.key)
            : !accessible

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
                  {showCrown && <Crown size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />}
                </>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: '8px 8px 16px', borderTop: '1px solid #2A2A2A' }}>
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
        {isSuperAdminUser && !viewingAsUser && (
          <Link
            href="/ops"
            className="sidebar-link"
            style={{ justifyContent: sidebarOpen || mobile ? 'flex-start' : 'center', marginBottom: '2px', color: '#FF6B00' }}
            title={!sidebarOpen && !mobile ? 'Ops' : undefined}
          >
            <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>◈</span>
            {(sidebarOpen || mobile) && <span style={{ fontSize: 13 }}>Ops</span>}
          </Link>
        )}
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
        <PopupModal popupKey={activePopup} onClose={() => setActivePopup(null)} userTier={effectiveTier} />
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
            position: 'relative',
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

          {/* Centered analyst identity — absolute so it doesn't push right-side actions */}
          <div
            className="hide-mobile"
            style={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              textAlign: 'center', pointerEvents: 'none',
            }}
          >
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif', margin: 0, lineHeight: 1.25 }}>
              Sahib Singh Hora
            </p>
            <p style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'Courier New, monospace', letterSpacing: '0.5px', margin: 0 }}>
              SEBI Regd. RA · INH000026266
            </p>
          </div>

          <span
            className="hide-mobile"
            style={{ fontSize: '10px', fontFamily: 'Courier New, monospace', color: 'var(--text3)', letterSpacing: '1px', border: '1px solid var(--border)', borderRadius: '4px', padding: '3px 7px' }}
          >
            SEBI · INH000026266
          </span>

          <button
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: 'var(--text2)', display: 'flex', alignItems: 'center', position: 'relative' }}
          >
            <Bell size={15} />
            {notifications > 0 && (
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--coral)', border: '1.5px solid var(--bg2)' }} />
            )}
          </button>

          {/* Profile avatar + dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={(e) => { e.stopPropagation(); setProfileOpen((v) => !v) }}
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

            {profileOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: '220px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  zIndex: 500,
                  overflow: 'hidden',
                }}
              >
                {/* User info */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{user?.name ?? 'User'}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text3)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email ?? ''}</p>
                </div>

                {/* Menu items */}
                <div style={{ padding: '6px' }}>
                  <Link
                    href="/settings?tab=language"
                    onClick={() => setProfileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', fontSize: '13px', color: 'var(--text2)', textDecoration: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg3, rgba(255,255,255,0.05))')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span>🌐</span> Language
                  </Link>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleTheme() }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 10px', borderRadius: '8px', fontSize: '13px', color: 'var(--text2)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg3, rgba(255,255,255,0.05))')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span>{theme === 'dark' ? '☀️' : '🌙'}</span> {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </button>

                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', fontSize: '13px', color: 'var(--text2)', textDecoration: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg3, rgba(255,255,255,0.05))')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span>⚙️</span> Settings
                  </Link>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', padding: '6px' }}>
                  <button
                    onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 10px', borderRadius: '8px', fontSize: '13px', color: '#FF5555', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,85,85,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span>🚪</span> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="dash-main" style={{ flex: 1, overflowY: 'auto' }}>
          <DashboardProtection>
            {children}
          </DashboardProtection>
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
