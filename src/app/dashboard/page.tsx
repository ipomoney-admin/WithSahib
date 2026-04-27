export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false } }

import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'
import type { User } from '@/types'
import {
  TrendingUp, TrendingDown, ArrowRight, Crown, Zap,
  FileText, Calendar, Target, CheckCircle, Clock, AlertCircle,
} from 'lucide-react'

function StatCard({ label, value, sub, color = 'var(--emerald)' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '8px' }}>
        {label}
      </p>
      <p style={{ fontSize: '28px', fontWeight: 700, color, fontFamily: 'Playfair Display, serif', marginBottom: '4px' }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: '12px', color: 'var(--text3)' }}>{sub}</p>}
    </div>
  )
}

function CallRow({ signal }: { signal: RecentSignal }) {
  const isUp = signal.target_1 > signal.entry_low
  const isOpen = signal.status === 'open'
  const isWin = ['t1_hit', 't2_hit', 't3_hit'].includes(signal.status)
  const isLoss = signal.status === 'sl_hit'
  const statusColor = isOpen ? 'var(--emerald)' : isWin ? '#22D3EE' : isLoss ? '#EF4444' : 'var(--text3)'

  const SEGMENT_LABELS: Record<string, string> = {
    intraday: 'Intraday', stock_options: 'Stock Options', index_options: 'Index Options', swing: 'Swing'
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
        background: isUp ? 'rgba(0,200,150,0.08)' : 'rgba(239,68,68,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isUp ? <TrendingUp size={16} color="var(--emerald)" /> : <TrendingDown size={16} color="#EF4444" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{signal.scrip}</span>
          <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'Courier New, monospace' }}>{SEGMENT_LABELS[signal.segment] ?? signal.segment}</span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text3)', display: 'flex', gap: '12px' }}>
          <span>Entry: <strong style={{ color: 'var(--text2)' }}>₹{signal.entry_low.toLocaleString('en-IN')}</strong></span>
          <span>Target: <strong style={{ color: 'var(--emerald)' }}>₹{signal.target_1.toLocaleString('en-IN')}</strong></span>
          <span>SL: <strong style={{ color: '#EF4444' }}>₹{signal.stop_loss.toLocaleString('en-IN')}</strong></span>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: `${statusColor}15`, color: statusColor }}>
          {signal.status.replace(/_/g, ' ').toUpperCase()}
        </div>
      </div>
    </div>
  )
}

interface RecentSignal {
  id: string
  segment: string
  scrip: string
  entry_low: number
  target_1: number
  stop_loss: number
  status: string
}

export default async function DashboardPage() {
  // Fetch user server-side
  const authClient = createServerComponentClient()
  const { data: { user: authUser } } = await authClient.auth.getUser()

  // Derive name: full_name → name → email prefix
  const displayName =
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.email?.split('@')[0] ||
    'Investor'

  // Admin bypass: admins get elite access unless they're in "view as user" mode
  const adminUser = authUser ? await isAdmin(authUser.id) : false
  const adminViewMode = cookies().get('admin_view_mode')?.value
  const viewingAsUser = adminViewMode === 'user'

  // Get subscription tier from subscriptions table
  let userTier: User['tier'] = 'free'
  const supabaseService = createServiceRoleClient()
  if (authUser) {
    if (adminUser && !viewingAsUser) {
      userTier = 'elite'
    } else {
      const { data: sub } = await supabaseService
        .from('subscriptions')
        .select('plan')
        .eq('user_id', authUser.id)
        .single()
      if (sub?.plan) userTier = sub.plan as User['tier']
    }
  }

  // Fetch real recent signals for Pro+ users
  let recentSignals: RecentSignal[] = []
  let activeCount = 0
  if (authUser && { free: 0, basic: 1, pro: 2, elite: 3 }[userTier] >= 2) {
    const { data: signalRows } = await supabaseService
      .from('signals')
      .select('id, segment, scrip, entry_low, target_1, stop_loss, status')
      .order('published_at', { ascending: false })
      .limit(5)
    recentSignals = (signalRows ?? []) as RecentSignal[]
    activeCount = recentSignals.filter(s => s.status === 'open').length
  }

  // Time-based greeting in IST
  const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const h = nowIST.getHours()
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'

  const tierLevel = { free: 0, basic: 1, pro: 2, elite: 3 }[userTier]
  const isProPlus = tierLevel >= 2

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Admin "viewing as user" banner */}
      {adminUser && viewingAsUser && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', marginBottom: 24,
          background: 'rgba(212,168,67,0.08)',
          border: '1px solid rgba(212,168,67,0.25)',
          borderRadius: 10, gap: 12,
        }}>
          <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 500 }}>
            Admin Mode: Viewing as user
          </span>
          <Link
            href="/api/admin/view-mode?mode=admin"
            style={{
              fontSize: 12, fontWeight: 700, color: '#06090F',
              background: 'var(--gold)', borderRadius: 6,
              padding: '5px 12px', textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            Back to Admin
          </Link>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '4px' }}>{greeting},</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 400, color: 'var(--text)', marginBottom: '8px' }}>
          {displayName} 👋
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: '6px',
            background: userTier === 'elite' ? 'rgba(212,168,67,0.1)' : userTier === 'pro' ? 'rgba(0,200,150,0.1)' : 'rgba(100,160,255,0.1)',
            color: userTier === 'elite' ? 'var(--gold)' : userTier === 'pro' ? 'var(--emerald)' : 'var(--sapphire)',
          }}>
            {userTier} plan
          </span>
          {userTier !== 'elite' && (
            <Link href="/pricing" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>
              <Crown size={12} /> Upgrade
            </Link>
          )}
        </div>
      </div>

      {/* Upgrade banner for free/basic */}
      {!isProPlus && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
          padding: '16px 20px', marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(0,200,150,0.06), rgba(212,168,67,0.04))',
          border: '1px solid rgba(0,200,150,0.15)', borderRadius: '14px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={18} color="var(--emerald)" />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>Unlock live intraday calls & research reports</p>
              <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Upgrade to Pro for ₹2,499/month — everything you need to trade actively.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
            <a
              href="https://t.me/withsahib"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,136,204,0.3)', color: '#0088CC', fontSize: '13px', fontWeight: 500, textDecoration: 'none', background: 'rgba(0,136,204,0.06)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Telegram
            </a>
            <Link href="/pricing?tier=pro" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
              Upgrade to Pro <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '32px' }}>
        <StatCard label="Active Calls" value={isProPlus ? String(activeCount) : '--'} sub="Open signals now" />
        <StatCard label="Signals (Recent)" value={isProPlus ? String(recentSignals.length) : '--'} sub="Last fetched" color="var(--emerald)" />
        <StatCard label="Subscription" value={userTier.toUpperCase()} sub="Current plan" color={userTier === 'elite' ? 'var(--gold)' : 'var(--emerald)'} />
        <StatCard label="Performance" value="May 2026" sub="Track record begins" color="var(--text3)" />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Live calls */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>Recent Trade Calls</h2>
              <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Latest published signals</p>
            </div>
            {isProPlus ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--emerald)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald)', animation: 'pulseDot 2s ease-in-out infinite' }} />
                Live
              </span>
            ) : (
              <Link href="/pricing" style={{ fontSize: '12px', color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Crown size={12} /> Unlock
              </Link>
            )}
          </div>

          {isProPlus ? (
            <div>
              {recentSignals.length > 0 ? (
                <>
                  {recentSignals.map((signal) => <CallRow key={signal.id} signal={signal} />)}
                  <Link href="/dashboard/signals" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', fontSize: '13px', color: 'var(--emerald)', textDecoration: 'none', fontWeight: 500 }}>
                    View all signals <ArrowRight size={14} />
                  </Link>
                </>
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', background: 'var(--bg2)', borderRadius: '12px' }}>
                  <AlertCircle size={24} color="var(--text3)" style={{ marginBottom: 12, opacity: 0.5 }} />
                  <p style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '4px' }}>No signals yet</p>
                  <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Signals will appear here once published during market hours.</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', background: 'var(--bg2)', borderRadius: '12px' }}>
              <Crown size={28} color="var(--gold)" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '8px' }}>Upgrade to Pro to see live calls</p>
              <Link href="/pricing?tier=pro" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Upgrade Now</Link>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'View Swing Picks', href: '/services/swing', icon: Target, tier: 'basic' },
                { label: 'Book Appointment', href: '/appointments', icon: Calendar, tier: 'pro' },
                { label: 'Research Reports', href: '/reports', icon: FileText, tier: 'pro' },
                { label: 'Live Signals Feed', href: '/dashboard/signals', icon: TrendingUp, tier: 'basic' },
              ].map((action) => {
                const Icon = action.icon
                const tierMap: Record<string, number> = { free: 0, basic: 1, pro: 2, elite: 3 }
                const canAccess = tierLevel >= (tierMap[action.tier] ?? 0)
                return (
                  <Link
                    key={action.href}
                    href={canAccess ? action.href : '/pricing'}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '10px',
                      background: 'var(--bg2)', border: '1px solid var(--border)',
                      textDecoration: 'none', color: canAccess ? 'var(--text2)' : 'var(--text3)',
                      fontSize: '13px', transition: 'all 0.2s',
                      opacity: canAccess ? 1 : 0.6,
                    }}
                  >
                    <Icon size={15} strokeWidth={1.5} color={canAccess ? 'var(--emerald)' : 'var(--text3)'} />
                    <span style={{ flex: 1 }}>{action.label}</span>
                    {canAccess ? <ChevronRight size={14} /> : <Crown size={12} color="var(--gold)" />}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Telegram CTA */}
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(0,136,204,0.15)', borderRadius: '16px', padding: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Get Signal Alerts</h2>
            <p style={{ fontSize: '12px', color: 'var(--text3)', lineHeight: 1.6, marginBottom: '14px' }}>
              Join our Telegram channel for real-time signal notifications.
            </p>
            <a
              href="https://t.me/withsahib"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: '1px solid rgba(0,136,204,0.3)', color: '#0088CC', fontSize: '13px', fontWeight: 600, textDecoration: 'none', background: 'rgba(0,136,204,0.06)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Join Telegram
            </a>
          </div>
        </div>
      </div>

      {/* SEBI footer note */}
      <div style={{ marginTop: '32px', padding: '14px 18px', background: 'rgba(212,168,67,0.03)', border: '1px solid rgba(212,168,67,0.1)', borderRadius: '10px' }}>
        <p style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--gold)', fontWeight: 600 }}>Disclaimer: </strong>
          All trade calls and research on withSahib.com are published by Sahib Singh Hora, SEBI Registered Research Analyst (INH000026266).
          Investments in securities are subject to market risk. Past performance does not guarantee future results.
          Please read all disclosures before acting on any recommendation.
        </p>
      </div>
    </div>
  )
}

function ChevronRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
