import { Metadata } from 'next'
import Link from 'next/link'
import SebiDisclaimer from '@/components/ui/SebiDisclaimer'
import { Lock } from 'lucide-react'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Performance Track Record | withSahib — SEBI RA INH000026266',
  description: 'Transparent performance record of all research calls by Sahib Singh Hora, SEBI Registered Research Analyst INH000026266.',
}

interface PerfRow {
  month: number
  year: number
  segment?: string
  total_calls: number
  t1_hit: number
  t2_hit: number
  t3_hit: number
  sl_hit: number
  win_rate: number
  avg_rr_promised: number
  avg_rr_achieved: number
  expectancy?: number
}

interface CallLog {
  id: string
  segment: string
  scrip: string
  status: string
  published_at: string
}

async function getPerformanceData(): Promise<{
  overall: PerfRow | null
  by_segment: PerfRow[]
  recent_calls_log: CallLog[]
  all_time_calls: number
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/performance`, { next: { revalidate: 300 } })
    if (!res.ok) return { overall: null, by_segment: [], recent_calls_log: [], all_time_calls: 0 }
    const json = await res.json()
    return json.data ?? { overall: null, by_segment: [], recent_calls_log: [], all_time_calls: 0 }
  } catch {
    return { overall: null, by_segment: [], recent_calls_log: [], all_time_calls: 0 }
  }
}

const SEGMENT_LABELS: Record<string, string> = {
  intraday: 'Intraday',
  stock_options: 'Stock Options',
  index_options: 'Index Options',
  swing: 'Swing Trades',
}

const SEGMENT_COLORS: Record<string, string> = {
  intraday: '#00C896',
  stock_options: '#D4A843',
  index_options: '#3B82F6',
  swing: '#8B5CF6',
}

const STATUS_LABELS: Record<string, string> = {
  t1_hit: 'T1 Hit',
  t2_hit: 'T2 Hit',
  t3_hit: 'T3 Hit',
  sl_hit: 'SL Hit',
  expired: 'Expired',
  cancelled: 'Cancelled',
}

const STATUS_COLORS: Record<string, string> = {
  t1_hit: '#00C896',
  t2_hit: '#00C896',
  t3_hit: '#00C896',
  sl_hit: '#EF4444',
  expired: '#6B8AAA',
  cancelled: '#6B8AAA',
}

export default async function PerformancePage() {
  const data = await getPerformanceData()
  const { overall, by_segment, recent_calls_log, all_time_calls } = data

  const now = new Date()
  const monthName = now.toLocaleString('default', { month: 'long' })
  const year = now.getFullYear()

  const totalWins = (overall?.t1_hit ?? 0) + (overall?.t2_hit ?? 0) + (overall?.t3_hit ?? 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Hero */}
      <div style={{
        padding: '80px 24px 48px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(0,200,150,0.04) 0%, transparent 100%)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--emerald)', marginBottom: 12, textTransform: 'uppercase' }}>
          Performance Track Record
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 700, fontFamily: 'DM Serif Display, serif', color: 'var(--text)', marginBottom: 12, lineHeight: 1.2 }}>
          Transparent. Auditable. SEBI Compliant.
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text2)', maxWidth: 480, margin: '0 auto 8px' }}>
          Every call logged and tracked. No cherry-picking. No hindsight analysis.
        </p>
        <SebiDisclaimer variant="short" />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

        {/* Coming soon notice */}
        <div style={{
          background: 'rgba(212,168,67,0.06)',
          border: '1px solid rgba(212,168,67,0.25)',
          borderRadius: 16,
          padding: '20px 24px',
          marginBottom: 36,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
        }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>📋</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--gold)', marginBottom: 4 }}>
              Track record publishing begins from May 2026
            </p>
            <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.7, margin: 0 }}>
              Every signal will be logged here — entries, exits, win/loss, and full rationale. No cherry-picking.
              All data is publicly auditable under SEBI RA regulations. SEBI RA INH000026266.
            </p>
          </div>
        </div>

        {/* Hero Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
          {[
            {
              label: `Win Rate — ${monthName} ${year}`,
              value: overall ? `${overall.win_rate?.toFixed(1) ?? 0}%` : 'N/A',
              color: overall && (overall.win_rate ?? 0) >= 60 ? '#00C896' : '#D4A843',
            },
            {
              label: 'Total Calls (All Time)',
              value: all_time_calls.toLocaleString('en-IN'),
              color: 'var(--text)',
            },
            {
              label: `${monthName} — Wins | Losses`,
              value: overall ? `${totalWins}W / ${overall.sl_hit ?? 0}L` : 'N/A',
              color: 'var(--text)',
            },
            {
              label: 'Avg R:R Promised',
              value: overall ? `${overall.avg_rr_promised?.toFixed(2) ?? '—'}x` : 'N/A',
              color: 'var(--gold)',
            },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '24px 20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: stat.color, marginBottom: 6 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Segment Breakdown */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
            Segment Breakdown — {monthName} {year}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {(['intraday', 'stock_options', 'index_options', 'swing'] as const).map((seg) => {
              const segData = by_segment.find((p) => p.segment === seg)
              const wins = (segData?.t1_hit ?? 0) + (segData?.t2_hit ?? 0) + (segData?.t3_hit ?? 0)
              const wr = segData?.win_rate ?? 0
              const color = SEGMENT_COLORS[seg]
              const wrColor = wr >= 65 ? '#00C896' : wr >= 50 ? '#D4A843' : '#EF4444'

              return (
                <div key={seg} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: 20,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{SEGMENT_LABELS[seg]}</span>
                    {!segData && <span style={{ fontSize: 11, color: 'var(--text3)' }}>(no data this month)</span>}
                  </div>
                  {segData ? (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 22, fontWeight: 700, color: wrColor }}>{wr.toFixed(1)}%</div>
                          <div style={{ fontSize: 10, color: 'var(--text3)' }}>Win Rate</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{segData.total_calls}</div>
                          <div style={{ fontSize: 10, color: 'var(--text3)' }}>Total Calls</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{wins}W/{segData.sl_hit}L</div>
                          <div style={{ fontSize: 10, color: 'var(--text3)' }}>Wins / Losses</div>
                        </div>
                      </div>
                      <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${wr}%`, background: wrColor, borderRadius: 3 }} />
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: '16px 0' }}>
                      No completed calls this month yet
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Call Log */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            Recent Calls — Last 30 Days
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 20 }}>
            Status only shown publicly. Subscribe to see entry, SL, and targets with live tracking.
          </p>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Date', 'Segment', 'Scrip', 'Status', ''].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent_calls_log.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                      No completed calls yet
                    </td>
                  </tr>
                ) : (
                  recent_calls_log.map((call, i) => (
                    <tr key={call.id} style={{ borderBottom: i < recent_calls_log.length - 1 ? '1px solid rgba(26,35,51,0.5)' : 'none' }}>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text3)' }}>
                        {new Date(call.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: 1,
                          padding: '2px 6px', borderRadius: 4,
                          background: `${SEGMENT_COLORS[call.segment]}15`,
                          color: SEGMENT_COLORS[call.segment],
                        }}>
                          {SEGMENT_LABELS[call.segment] ?? call.segment}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                        {call.scrip}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
                          background: `${STATUS_COLORS[call.status] ?? 'var(--text3)'}20`,
                          color: STATUS_COLORS[call.status] ?? 'var(--text3)',
                        }}>
                          {STATUS_LABELS[call.status] ?? call.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text3)' }}>
                          <Lock size={11} /> Full details
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center', padding: '40px 24px',
          background: 'rgba(0,200,150,0.04)', border: '1px solid rgba(0,200,150,0.1)',
          borderRadius: 20, marginBottom: 40,
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            Get live signals from ₹999/month
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24 }}>
            Real-time entry, SL & target tracking. SEBI RA certified research calls.
          </p>
          <Link
            href="/pricing"
            style={{
              display: 'inline-block', padding: '14px 28px', borderRadius: 12,
              background: 'var(--emerald)', color: '#000', fontWeight: 700, fontSize: 15,
              textDecoration: 'none', letterSpacing: 0.3,
            }}
          >
            View Pricing → withsahib.com/pricing
          </Link>
        </div>

        <SebiDisclaimer variant="full" />
      </div>
    </div>
  )
}
