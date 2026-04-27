import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'
import { Brain, TrendingUp, TrendingDown, FileText, AlertTriangle, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Intelligence | Admin — withSahib',
}

const SEGMENT_LABELS: Record<string, string> = {
  intraday: 'Intraday',
  stock_options: 'Stock Options',
  index_options: 'Index Options',
  swing: 'Swing',
}

const SEGMENT_COLORS: Record<string, string> = {
  intraday: '#00C896',
  stock_options: '#D4A843',
  index_options: '#3B82F6',
  swing: '#8B5CF6',
}

const FAILURE_COLORS: Record<string, string> = {
  macro_event: '#EF4444',
  pattern_failure: '#D4A843',
  timing: '#3B82F6',
  liquidity: '#8B5CF6',
  news_driven: '#F97316',
  black_swan: '#DC2626',
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
  expired: number
  cancelled: number
  win_rate: number
  avg_rr_promised: number
  avg_rr_achieved: number
}

interface MLModel {
  id: string
  segment?: string
  model_type: string
  accuracy?: number
  train_samples?: number
  is_active: boolean
  created_at: string
}

interface Postmortem {
  id: string
  signal_id: string
  failure_type: string
  primary_miss: string
  reviewed_by_sahib: boolean
  sahib_notes?: string
  created_at: string
  signals?: { scrip: string; segment: string; published_at: string }
}

interface Report {
  id: string
  report_type: string
  week_number?: number
  month?: number
  year?: number
  key_insights: string[]
  generated_at: string
  delivery_status?: string
}

export default async function AdminIntelligencePage() {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/auth/login')
  if (!(await isAdmin(user.id))) redirect('/auth/login')

  const supabase = createServiceRoleClient()

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const [perfRes, mlRes, postmortemsRes, reportsRes] = await Promise.all([
    supabase
      .from('performance_summary')
      .select('month, year, segment, total_calls, t1_hit, t2_hit, t3_hit, sl_hit, expired, cancelled, win_rate, avg_rr_promised, avg_rr_achieved')
      .gte('year', sixMonthsAgo.getFullYear())
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(60),
    supabase
      .from('ml_models')
      .select('id, segment, model_type, accuracy, train_samples, is_active, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('signal_postmortems')
      .select('id, signal_id, failure_type, primary_miss, reviewed_by_sahib, sahib_notes, created_at, signals(scrip, segment, published_at)')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('intelligence_reports')
      .select('id, report_type, week_number, month, year, key_insights, generated_at, delivery_status')
      .order('generated_at', { ascending: false })
      .limit(5),
  ])

  const perfRows: PerfRow[] = perfRes.data ?? []
  const mlModels: MLModel[] = mlRes.data ?? []
  const postmortems: Postmortem[] = ((postmortemsRes.data as unknown) as Postmortem[]) ?? []
  const reports: Report[] = reportsRes.data ?? []

  // Overall: aggregate all rows
  const overall = perfRows.reduce(
    (acc, r) => {
      acc.total_calls += r.total_calls ?? 0
      acc.t1_hit += r.t1_hit ?? 0
      acc.t2_hit += r.t2_hit ?? 0
      acc.t3_hit += r.t3_hit ?? 0
      acc.sl_hit += r.sl_hit ?? 0
      return acc
    },
    { total_calls: 0, t1_hit: 0, t2_hit: 0, t3_hit: 0, sl_hit: 0 }
  )
  const overallWins = overall.t1_hit + overall.t2_hit + overall.t3_hit
  const overallWR = overall.total_calls > 0
    ? ((overallWins / (overallWins + overall.sl_hit)) * 100)
    : 0

  // Latest month per segment
  const latestBySegment = (['intraday', 'stock_options', 'index_options', 'swing'] as const).map((seg) => {
    const rows = perfRows.filter((r) => r.segment === seg)
    return rows[0] ?? null
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 32px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#00C896', textTransform: 'uppercase', marginBottom: 6 }}>
          Intelligence
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-body)', margin: 0 }}>
          Performance Matrix
        </h1>
      </div>

      {/* ── KPI CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          {
            label: 'Overall Win Rate (6mo)',
            value: `${overallWR.toFixed(1)}%`,
            color: overallWR >= 60 ? '#00C896' : '#D4A843',
          },
          {
            label: 'Total Calls (6mo)',
            value: overall.total_calls.toLocaleString('en-IN'),
            color: 'var(--text)',
          },
          {
            label: 'Wins / Losses',
            value: `${overallWins}W / ${overall.sl_hit}L`,
            color: 'var(--text)',
          },
          {
            label: 'Active ML Models',
            value: mlModels.length.toString(),
            color: '#3B82F6',
          },
        ].map((kpi) => (
          <div key={kpi.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '20px 18px',
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: kpi.color, marginBottom: 4 }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* ── SEGMENT BREAKDOWN ── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 16, margin: '0 0 16px' }}>
          Segment Breakdown — Latest Month
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {latestBySegment.map((row, idx) => {
            const segs = ['intraday', 'stock_options', 'index_options', 'swing'] as const
            const seg = segs[idx] ?? 'intraday'
            const color = SEGMENT_COLORS[seg]
            if (!row) {
              return (
                <div key={seg} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: 18,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{SEGMENT_LABELS[seg]}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>No data this period</div>
                </div>
              )
            }
            const wins = (row.t1_hit ?? 0) + (row.t2_hit ?? 0) + (row.t3_hit ?? 0)
            const wr = row.win_rate ?? 0
            const wrColor = wr >= 65 ? '#00C896' : wr >= 50 ? '#D4A843' : '#EF4444'
            return (
              <div key={seg} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: 18,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                  <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{SEGMENT_LABELS[seg]}</span>
                  <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 'auto' }}>
                    {row.month}/{row.year}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: wrColor }}>{wr.toFixed(1)}%</div>
                    <div style={{ fontSize: 9, color: 'var(--text3)' }}>Win Rate</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{row.total_calls}</div>
                    <div style={{ fontSize: 9, color: 'var(--text3)' }}>Total</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{wins}W/{row.sl_hit}L</div>
                    <div style={{ fontSize: 9, color: 'var(--text3)' }}>W/L</div>
                  </div>
                </div>
                <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${wr}%`, background: wrColor, borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--text3)' }}>
                    Avg R:R {row.avg_rr_promised?.toFixed(2) ?? '—'}x promised / {row.avg_rr_achieved?.toFixed(2) ?? '—'}x achieved
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── ML MODELS ── */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Brain size={16} color="#3B82F6" />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Active ML Models
          </h2>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {mlModels.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
              No trained models yet — run <code style={{ background: 'var(--bg)', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>/api/ml/train</code> to generate.
            </div>
          ) : (
            mlModels.map((model, i) => {
              const seg = model.segment
              const color = seg ? (SEGMENT_COLORS[seg] ?? '#6B8AAA') : '#6B8AAA'
              const acc = model.accuracy ?? 0
              const accColor = acc >= 0.65 ? '#00C896' : acc >= 0.55 ? '#D4A843' : '#EF4444'
              return (
                <div
                  key={model.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                    borderBottom: i < mlModels.length - 1 ? '1px solid rgba(26,35,51,0.6)' : 'none',
                  }}
                >
                  <Brain size={14} color={color} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                      {model.model_type} {seg ? `— ${SEGMENT_LABELS[seg] ?? seg}` : '(all)'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>
                      {model.train_samples?.toLocaleString('en-IN') ?? '—'} training samples ·{' '}
                      Trained {new Date(model.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: accColor }}>
                      {(acc * 100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1 }}>Accuracy</div>
                  </div>
                  {model.is_active && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: '2px 6px', borderRadius: 4,
                      background: 'rgba(0,200,150,0.12)', color: '#00C896',
                    }}>
                      ACTIVE
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* ── POSTMORTEMS ── */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <AlertTriangle size={16} color="#D4A843" />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Signal Postmortems
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>Last 10</span>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {postmortems.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
              No postmortems yet
            </div>
          ) : (
            postmortems.map((pm, i) => {
              const fColor = FAILURE_COLORS[pm.failure_type] ?? '#6B8AAA'
              const signal = pm.signals
              return (
                <div
                  key={pm.id}
                  style={{
                    padding: '14px 18px',
                    borderBottom: i < postmortems.length - 1 ? '1px solid rgba(26,35,51,0.6)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        {signal && (
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                            {signal.scrip}
                          </span>
                        )}
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: '2px 6px', borderRadius: 4,
                          background: `${fColor}18`, color: fColor,
                        }}>
                          {pm.failure_type.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        {pm.reviewed_by_sahib && (
                          <CheckCircle size={12} color="#00C896" />
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                        {pm.primary_miss}
                      </div>
                      {pm.sahib_notes && (
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4, fontStyle: 'italic' }}>
                          Note: {pm.sahib_notes}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', flexShrink: 0 }}>
                      {new Date(pm.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* ── INTELLIGENCE REPORTS ── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <FileText size={16} color="#8B5CF6" />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            Intelligence Reports
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>Last 5</span>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {reports.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
              No reports generated yet
            </div>
          ) : (
            reports.map((report, i) => {
              const delivered = report.delivery_status === 'sent'
              return (
                <div
                  key={report.id}
                  style={{
                    padding: '16px 18px',
                    borderBottom: i < reports.length - 1 ? '1px solid rgba(26,35,51,0.6)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                          {report.report_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                          {report.week_number ? ` — Week ${report.week_number}` : ''}
                          {report.month && report.year ? ` — ${report.month}/${report.year}` : ''}
                        </span>
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: '2px 6px', borderRadius: 4,
                          background: delivered ? 'rgba(0,200,150,0.12)' : 'rgba(107,138,170,0.12)',
                          color: delivered ? '#00C896' : 'var(--text3)',
                        }}>
                          {delivered ? 'DELIVERED' : (report.delivery_status?.toUpperCase() ?? 'PENDING')}
                        </span>
                      </div>
                      {report.key_insights && report.key_insights.length > 0 && (
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {report.key_insights.slice(0, 3).map((insight, idx) => (
                            <li key={idx} style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 2 }}>
                              {insight}
                            </li>
                          ))}
                          {report.key_insights.length > 3 && (
                            <li style={{ fontSize: 11, color: 'var(--text3)', listStyle: 'none', marginLeft: -16, marginTop: 2 }}>
                              +{report.key_insights.length - 3} more insights
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', flexShrink: 0 }}>
                      {new Date(report.generated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
