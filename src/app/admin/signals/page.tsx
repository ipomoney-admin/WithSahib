import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin, isSuperAdmin } from '@/lib/admin-check'
import SebiDisclaimer from '@/components/ui/SebiDisclaimer'
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Signal Management | Admin — withSahib',
}

const SEGMENT_COLORS: Record<string, string> = {
  intraday: '#00C896',
  stock_options: '#D4A843',
  index_options: '#3B82F6',
  swing: '#8B5CF6',
}

const SEGMENT_LABELS: Record<string, string> = {
  intraday: 'Intraday',
  stock_options: 'Stock Options',
  index_options: 'Index Options',
  swing: 'Swing',
}

const STATUS_COLORS: Record<string, string> = {
  open: '#00C896',
  t1_hit: '#00C896',
  t2_hit: '#00C896',
  t3_hit: '#00C896',
  sl_hit: '#EF4444',
  expired: '#6B8AAA',
  cancelled: '#6B8AAA',
}

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  t1_hit: 'T1 Hit',
  t2_hit: 'T2 Hit',
  t3_hit: 'T3 Hit',
  sl_hit: 'SL Hit',
  expired: 'Expired',
  cancelled: 'Cancelled',
}

function fmt(n: number | null | undefined): string {
  if (n == null) return '—'
  return n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

interface Alert {
  id: string
  segment: string
  scrip: string
  strike?: string
  entry_low: number
  entry_high: number
  stop_loss: number
  target_1: number
  target_2?: number
  target_3?: number
  rr_ratio?: number
  rationale: string
  pattern_type?: string
  ml_score?: {
    win_probability: number
    confidence_level: string
  }
  created_at: string
}

interface Signal {
  id: string
  segment: string
  scrip: string
  entry_low: number
  entry_high?: number
  stop_loss: number
  target_1: number
  target_2?: number
  target_3?: number
  status: string
  published_at: string
  closed_at?: string
}

export default async function AdminSignalsPage() {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/auth/login')
  if (!(await isAdmin(user.id))) redirect('/auth/login')

  const superAdmin = await isSuperAdmin(user.id)
  const supabase = createServiceRoleClient()

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [alertsRes, openRes, historyRes] = await Promise.all([
    supabase
      .from('signal_alerts')
      .select('id, segment, scrip, strike, entry_low, entry_high, stop_loss, target_1, target_2, target_3, rr_ratio, rationale, pattern_type, ml_score, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('signals')
      .select('id, segment, scrip, entry_low, entry_high, stop_loss, target_1, target_2, target_3, status, published_at')
      .eq('status', 'open')
      .order('published_at', { ascending: false }),
    supabase
      .from('signals')
      .select('id, segment, scrip, entry_low, stop_loss, target_1, status, published_at, closed_at')
      .in('status', ['t1_hit', 't2_hit', 't3_hit', 'sl_hit', 'expired', 'cancelled'])
      .gte('closed_at', thirtyDaysAgo)
      .order('closed_at', { ascending: false })
      .limit(50),
  ])

  const alerts: Alert[] = alertsRes.data ?? []
  const openSignals: Signal[] = openRes.data ?? []
  const history: Signal[] = historyRes.data ?? []

  async function approveAlert(formData: FormData) {
    'use server'
    const alertId = formData.get('alertId') as string
    if (!alertId) return

    const db = createServiceRoleClient()
    const { data: alert } = await db
      .from('signal_alerts')
      .select('*')
      .eq('id', alertId)
      .single()

    if (!alert) return

    await db.from('signals').insert({
      segment: alert.segment,
      scrip: alert.scrip,
      strike: alert.strike ?? null,
      entry_low: alert.entry_low,
      entry_high: alert.entry_high,
      stop_loss: alert.stop_loss,
      target_1: alert.target_1,
      target_2: alert.target_2 ?? null,
      target_3: alert.target_3 ?? null,
      rationale: alert.rationale,
      status: 'open',
      published_at: new Date().toISOString(),
    })

    await db
      .from('signal_alerts')
      .update({ status: 'approved' })
      .eq('id', alertId)

    revalidatePath('/admin/signals')
  }

  async function rejectAlert(formData: FormData) {
    'use server'
    const alertId = formData.get('alertId') as string
    if (!alertId) return

    const db = createServiceRoleClient()
    await db
      .from('signal_alerts')
      .update({ status: 'rejected' })
      .eq('id', alertId)

    revalidatePath('/admin/signals')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 32px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#00C896', textTransform: 'uppercase', marginBottom: 6 }}>
          Signal Management
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-body)', margin: 0 }}>
          Signals Dashboard
        </h1>
      </div>

      {/* ── SECTION 1: ALERT QUEUE ── */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <AlertTriangle size={16} color="#D4A843" />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Alert Queue
          </h2>
          {alerts.length > 0 && (
            <span style={{
              minWidth: 20, height: 20, borderRadius: 10,
              background: '#00C896', color: '#000',
              fontSize: 11, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px',
            }}>
              {alerts.length}
            </span>
          )}
        </div>

        {alerts.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '28px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>No pending alerts</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.map((alert) => {
              const color = SEGMENT_COLORS[alert.segment] ?? '#00C896'
              const mlScore = alert.ml_score
              return (
                <div key={alert.id} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: 20,
                  borderLeft: `3px solid ${color}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    {/* Left: signal info */}
                    <div style={{ flex: 1, minWidth: 280 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: 1,
                          padding: '2px 7px', borderRadius: 4,
                          background: `${color}18`, color,
                        }}>
                          {SEGMENT_LABELS[alert.segment] ?? alert.segment}
                        </span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                          {alert.scrip}{alert.strike ? ` ${alert.strike}` : ''}
                        </span>
                        {alert.pattern_type && (
                          <span style={{ fontSize: 10, color: 'var(--text3)', background: 'var(--border)', padding: '2px 6px', borderRadius: 4 }}>
                            {alert.pattern_type}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '4px 20px', marginBottom: 10 }}>
                        {[
                          { label: 'Entry', value: `₹${fmt(alert.entry_low)}–${fmt(alert.entry_high)}` },
                          { label: 'SL', value: `₹${fmt(alert.stop_loss)}` },
                          { label: 'T1', value: `₹${fmt(alert.target_1)}` },
                          { label: 'R:R', value: alert.rr_ratio ? `${alert.rr_ratio.toFixed(2)}x` : '—' },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{value}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                        {alert.rationale}
                      </div>
                    </div>

                    {/* Middle: ML score */}
                    {mlScore && (
                      <div style={{
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        borderRadius: 8, padding: '10px 14px', minWidth: 110, textAlign: 'center',
                      }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: mlScore.win_probability >= 0.6 ? '#00C896' : '#D4A843' }}>
                          {(mlScore.win_probability * 100).toFixed(0)}%
                        </div>
                        <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1 }}>ML Win Prob</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{mlScore.confidence_level}</div>
                      </div>
                    )}

                    {/* Right: actions */}
                    {superAdmin ? (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', paddingTop: 2 }}>
                        <form action={approveAlert}>
                          <input type="hidden" name="alertId" value={alert.id} />
                          <button
                            type="submit"
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '8px 16px', borderRadius: 8,
                              background: 'rgba(0,200,150,0.12)', border: '1px solid rgba(0,200,150,0.3)',
                              color: '#00C896', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            }}
                          >
                            <CheckCircle size={14} />
                            Approve
                          </button>
                        </form>
                        <form action={rejectAlert}>
                          <input type="hidden" name="alertId" value={alert.id} />
                          <button
                            type="submit"
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              padding: '8px 16px', borderRadius: 8,
                              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                              color: '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            }}
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, color: 'var(--text3)', paddingTop: 4 }}>
                        Viewer — cannot approve
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 10 }}>
                    Generated {new Date(alert.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── SECTION 2: OPEN SIGNALS ── */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Clock size={16} color="#3B82F6" />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Open Signals
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>({openSignals.length})</span>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {openSignals.length === 0 ? (
            <div style={{ padding: '28px 24px', textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
              No open signals
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Date', 'Segment', 'Scrip', 'Entry', 'SL', 'T1', 'T2', 'T3', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: 'var(--text3)', fontWeight: 600, letterSpacing: 0.5 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {openSignals.map((sig, i) => {
                  const color = SEGMENT_COLORS[sig.segment] ?? '#00C896'
                  return (
                    <tr
                      key={sig.id}
                      style={{ borderBottom: i < openSignals.length - 1 ? '1px solid rgba(26,35,51,0.6)' : 'none' }}
                    >
                      <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text3)' }}>
                        {new Date(sig.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: 1,
                          padding: '2px 6px', borderRadius: 4,
                          background: `${color}18`, color,
                        }}>
                          {SEGMENT_LABELS[sig.segment] ?? sig.segment}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                        {sig.scrip}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text2)' }}>
                        ₹{fmt(sig.entry_low)}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: '#EF4444' }}>
                        ₹{fmt(sig.stop_loss)}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: '#00C896' }}>
                        ₹{fmt(sig.target_1)}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text2)' }}>
                        {sig.target_2 ? `₹${fmt(sig.target_2)}` : '—'}
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text2)' }}>
                        {sig.target_3 ? `₹${fmt(sig.target_3)}` : '—'}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
                          background: `${STATUS_COLORS[sig.status] ?? 'var(--text3)'}18`,
                          color: STATUS_COLORS[sig.status] ?? 'var(--text3)',
                        }}>
                          {STATUS_LABELS[sig.status] ?? sig.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ── SECTION 3: RECENT HISTORY ── */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Recent History
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>Last 30 days</span>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {history.length === 0 ? (
            <div style={{ padding: '28px 24px', textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
              No closed signals in last 30 days
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {history.map((sig, i) => {
                const color = SEGMENT_COLORS[sig.segment] ?? '#00C896'
                const sColor = STATUS_COLORS[sig.status] ?? 'var(--text3)'
                return (
                  <div
                    key={sig.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px',
                      borderBottom: i < history.length - 1 ? '1px solid rgba(26,35,51,0.6)' : 'none',
                    }}
                  >
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: 1,
                      padding: '2px 6px', borderRadius: 4,
                      background: `${color}18`, color, flexShrink: 0,
                    }}>
                      {SEGMENT_LABELS[sig.segment] ?? sig.segment}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>
                      {sig.scrip}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                      Entry ₹{fmt(sig.entry_low)}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                      SL ₹{fmt(sig.stop_loss)}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                      T1 ₹{fmt(sig.target_1)}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
                      background: `${sColor}18`, color: sColor, flexShrink: 0,
                    }}>
                      {STATUS_LABELS[sig.status] ?? sig.status}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text3)', flexShrink: 0 }}>
                      {sig.closed_at
                        ? new Date(sig.closed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                        : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <SebiDisclaimer variant="short" />
    </div>
  )
}
