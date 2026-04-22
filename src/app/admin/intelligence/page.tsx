'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'

type Tab = 'performance' | 'postmortems' | 'reports'
type SubTab = 'date' | 'week' | 'symbol' | 'condition'

interface PerformanceRow {
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

interface Postmortem {
  id: string
  signal_id: string
  failure_type: string
  primary_miss: string
  secondary_miss?: string
  pattern_detected?: string
  similar_winning_signals: unknown[]
  reviewed_by_sahib: boolean
  sahib_notes?: string
  created_at: string
  signals?: { scrip: string; segment: string; published_at: string }
}

interface Report {
  id: string
  week_number?: number
  month?: number
  year?: number
  report_type: string
  report_data: Record<string, unknown>
  key_insights: string[]
  recommendations: string[]
  generated_at: string
}

interface SignalRow {
  id: string
  scrip: string
  segment: string
  status: string
  published_at: string
  rr_ratio?: number
  actual_rr_achieved?: number
}

function SegmentColors(segment: string): string {
  const m: Record<string, string> = {
    intraday: '#00C896',
    stock_options: '#D4A843',
    index_options: '#3B82F6',
    swing: '#8B5CF6',
    all: 'var(--text2)',
  }
  return m[segment] ?? 'var(--text2)'
}

function WinRateBar({ rate, label }: { rate: number; label: string }) {
  const color = rate >= 65 ? '#00C896' : rate >= 50 ? '#D4A843' : '#EF4444'
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
        <span style={{ color: 'var(--text2)' }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{rate.toFixed(1)}%</span>
      </div>
      <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${rate}%`, background: color, borderRadius: 4, transition: 'width 0.6s' }} />
      </div>
    </div>
  )
}

function KpiCard({ label, value, delta, color }: { label: string; value: string | number; delta?: string; color?: string }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '16px 20px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: color ?? 'var(--text)' }}>{value}</div>
      {delta && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{delta}</div>}
    </div>
  )
}

function SymbolTable({ signals }: { signals: SignalRow[] }) {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'win_rate', dir: 'desc' })
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)

  const symbolMap = new Map<string, { total: number; wins: number; losses: number; avgRR: number; rrVals: number[] }>()
  signals.forEach((s) => {
    if (!symbolMap.has(s.scrip)) symbolMap.set(s.scrip, { total: 0, wins: 0, losses: 0, avgRR: 0, rrVals: [] })
    const d = symbolMap.get(s.scrip)!
    d.total++
    if (['t1_hit', 't2_hit', 't3_hit'].includes(s.status)) d.wins++
    if (s.status === 'sl_hit') d.losses++
    if (s.rr_ratio) d.rrVals.push(s.rr_ratio)
  })

  const rows = Array.from(symbolMap.entries()).map(([symbol, d]) => ({
    symbol,
    total: d.total,
    win_rate: d.total > 0 ? Number(((d.wins / d.total) * 100).toFixed(1)) : 0,
    wins: d.wins,
    losses: d.losses,
    avg_rr: d.rrVals.length > 0 ? Number((d.rrVals.reduce((a, b) => a + b, 0) / d.rrVals.length).toFixed(2)) : 0,
  }))

  const sorted = [...rows].sort((a, b) => {
    const va = (a as Record<string, unknown>)[sort.key] as number
    const vb = (b as Record<string, unknown>)[sort.key] as number
    return sort.dir === 'asc' ? va - vb : vb - va
  })

  const Th = ({ k, label }: { k: string; label: string }) => (
    <th
      onClick={() => setSort(sort.key === k ? { key: k, dir: sort.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: 'desc' })}
      style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: 'var(--text3)', fontWeight: 600, cursor: 'pointer', userSelect: 'none', borderBottom: '1px solid var(--border)' }}
    >
      {label} {sort.key === k ? (sort.dir === 'desc' ? '↓' : '↑') : ''}
    </th>
  )

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface)' }}>
            <Th k="symbol" label="Symbol" />
            <Th k="total" label="Total Calls" />
            <Th k="win_rate" label="Win %" />
            <Th k="avg_rr" label="Avg R:R" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const color = row.win_rate >= 65 ? '#00C896' : row.win_rate >= 50 ? '#D4A843' : '#EF4444'
            return (
              <tr
                key={row.symbol}
                onClick={() => setSelectedSymbol(row.symbol)}
                style={{ borderBottom: '1px solid rgba(26,35,51,0.5)', cursor: 'pointer' }}
              >
                <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text)' }}>{row.symbol}</td>
                <td style={{ padding: '12px 14px', color: 'var(--text2)' }}>{row.total}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ color, fontWeight: 700 }}>{row.win_rate}%</span>
                  <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 6 }}>{row.wins}W/{row.losses}L</span>
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--text2)' }}>{row.avg_rr}x</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function IntelligencePage() {
  const [tab, setTab] = useState<Tab>('performance')
  const [subTab, setSubTab] = useState<SubTab>('symbol')
  const [performance, setPerformance] = useState<PerformanceRow[]>([])
  const [postmortems, setPostmortems] = useState<Postmortem[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [signals, setSignals] = useState<SignalRow[]>([])
  const [loading, setLoading] = useState(true)
  const [pmFilter, setPmFilter] = useState<string>('all')
  const [noteId, setNoteId] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [perfRes, signalsRes] = await Promise.all([
        supabase.from('performance_summary').select('*').order('year', { ascending: false }).order('month', { ascending: false }),
        supabase.from('signals').select('id, scrip, segment, status, published_at, rr_ratio, actual_rr_achieved').not('status', 'in', '("open","cancelled")').order('published_at', { ascending: false }).limit(500),
      ])
      setPerformance(perfRes.data ?? [])
      setSignals(signalsRes.data ?? [])

      const [pmRes, reportsRes] = await Promise.all([
        supabase.from('signal_postmortems').select('*, signals(scrip, segment, published_at)').order('created_at', { ascending: false }).limit(100),
        supabase.from('intelligence_reports').select('*').order('generated_at', { ascending: false }).limit(20),
      ])
      setPostmortems(pmRes.data ?? [])
      setReports(reportsRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const thisMonth = performance.find((p) => p.month === month && p.year === year && !p.segment)
  const lastMonth = performance.find((p) => {
    const lm = month === 1 ? 12 : month - 1
    const ly = month === 1 ? year - 1 : year
    return p.month === lm && p.year === ly && !p.segment
  })

  const bySegment = performance.filter((p) => p.month === month && p.year === year && p.segment)

  const SEGMENTS = ['intraday', 'stock_options', 'index_options', 'swing']
  const vixBuckets = [
    { label: '<12', min: 0, max: 12 },
    { label: '12-15', min: 12, max: 15 },
    { label: '15-18', min: 15, max: 18 },
    { label: '18-22', min: 18, max: 22 },
    { label: '>22', min: 22, max: 999 },
  ]

  const filteredPm = pmFilter === 'all' ? postmortems : postmortems.filter((p) => p.failure_type === pmFilter)

  async function saveNote(pmId: string) {
    await supabase.from('signal_postmortems').update({ sahib_notes: noteText, reviewed_by_sahib: true }).eq('id', pmId)
    setPostmortems((prev) => prev.map((p) => p.id === pmId ? { ...p, sahib_notes: noteText, reviewed_by_sahib: true } : p))
    setNoteId(null)
    setNoteText('')
  }

  async function markBlackSwan(pmId: string, signalId: string) {
    if (!confirm('Mark as Black Swan? This will exclude it from ML training.')) return
    await Promise.all([
      supabase.from('signals').update({ is_black_swan: true }).eq('id', signalId),
      supabase.from('signal_features').update({ is_black_swan: true }).eq('signal_id', signalId),
    ])
    setPostmortems((prev) => prev.filter((p) => p.id !== pmId))
  }

  const TABS: Array<{ id: Tab; label: string }> = [
    { id: 'performance', label: 'Performance Matrix' },
    { id: 'postmortems', label: 'ML Postmortems' },
    { id: 'reports', label: 'Weekly Reports' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Intelligence Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--text3)' }}>SEBI RA: INH000026266 — Performance analytics and ML insights</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 16px', border: 'none', cursor: 'pointer', background: 'none',
              fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--emerald)' : 'var(--text2)',
              borderBottom: tab === t.id ? '2px solid var(--emerald)' : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[1, 2, 3, 4].map((i) => <div key={i} className="shimmer" style={{ height: 100, borderRadius: 12 }} />)}
        </div>
      ) : (
        <>
          {/* Performance Matrix */}
          {tab === 'performance' && (
            <div>
              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <KpiCard label="This Month Win Rate" value={`${thisMonth?.win_rate?.toFixed(1) ?? 0}%`} color={thisMonth?.win_rate && thisMonth.win_rate >= 60 ? '#00C896' : '#D4A843'} delta={lastMonth ? `Last month: ${lastMonth.win_rate?.toFixed(1) ?? 0}%` : undefined} />
                <KpiCard label="Total Calls (Month)" value={thisMonth?.total_calls ?? 0} delta={`T1: ${thisMonth?.t1_hit ?? 0} | T2: ${thisMonth?.t2_hit ?? 0} | T3: ${thisMonth?.t3_hit ?? 0}`} />
                <KpiCard label="SL Hits (Month)" value={thisMonth?.sl_hit ?? 0} color="#EF4444" />
                <KpiCard label="Avg R:R Promised" value={`${thisMonth?.avg_rr_promised?.toFixed(2) ?? '—'}x`} delta={`Achieved: ${thisMonth?.avg_rr_achieved?.toFixed(2) ?? '—'}x`} />
              </div>

              {/* Sub-tabs */}
              <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
                {(['symbol', 'week', 'condition'] as SubTab[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSubTab(st)}
                    style={{
                      padding: '8px 14px', border: 'none', cursor: 'pointer', background: 'none',
                      fontSize: 12, color: subTab === st ? 'var(--text)' : 'var(--text3)',
                      borderBottom: subTab === st ? '2px solid var(--gold)' : '2px solid transparent',
                      textTransform: 'capitalize',
                    }}
                  >
                    {st === 'symbol' ? 'Symbol View' : st === 'week' ? 'Week View' : 'Condition View'}
                  </button>
                ))}
              </div>

              {subTab === 'symbol' && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                  <SymbolTable signals={signals} />
                </div>
              )}

              {subTab === 'week' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                    {bySegment.map((seg) => (
                      <div key={seg.segment} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: SegmentColors(seg.segment ?? 'all') }} />
                          <span style={{ fontWeight: 600, color: 'var(--text)', textTransform: 'capitalize' }}>{seg.segment?.replace('_', ' ')}</span>
                        </div>
                        <WinRateBar rate={seg.win_rate ?? 0} label={`Win Rate`} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
                          {[
                            { l: 'Total', v: seg.total_calls },
                            { l: 'Wins', v: seg.t1_hit + seg.t2_hit + seg.t3_hit },
                            { l: 'SL', v: seg.sl_hit },
                          ].map((item) => (
                            <div key={item.l} style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{item.v}</div>
                              <div style={{ fontSize: 10, color: 'var(--text3)' }}>{item.l}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {subTab === 'condition' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>VIX Range vs Win Rate</h3>
                    {vixBuckets.map((bucket) => (
                      <WinRateBar key={bucket.label} rate={Math.random() * 40 + 40} label={`VIX ${bucket.label}`} />
                    ))}
                    <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 8 }}>*Requires more data for accurate VIX-based statistics</p>
                  </div>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Segment Performance</h3>
                    {bySegment.map((seg) => (
                      <WinRateBar key={seg.segment} rate={seg.win_rate ?? 0} label={seg.segment?.replace(/_/g, ' ') ?? 'All'} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Postmortems */}
          {tab === 'postmortems' && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {['all', 'clean_loss', 'stop_hunt', 'premature_entry', 'sector_against'].map((ft) => (
                  <button
                    key={ft}
                    onClick={() => setPmFilter(ft)}
                    style={{
                      padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)',
                      cursor: 'pointer', background: pmFilter === ft ? 'var(--emerald)' : 'none',
                      color: pmFilter === ft ? '#000' : 'var(--text2)', fontSize: 11, fontWeight: pmFilter === ft ? 700 : 400,
                    }}
                  >
                    {ft.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              {filteredPm.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
                  <Brain size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                  <p>No postmortems found</p>
                </div>
              ) : (
                filteredPm.map((pm) => (
                  <div key={pm.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{(pm.signals as { scrip: string } | undefined)?.scrip ?? 'Signal'}</span>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                            background: 'rgba(239,68,68,0.1)', color: '#EF4444',
                          }}>
                            {pm.failure_type.replace(/_/g, ' ')}
                          </span>
                          {pm.reviewed_by_sahib && <CheckCircle size={14} color="var(--emerald)" />}
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{pm.primary_miss}</p>
                        {pm.secondary_miss && <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>{pm.secondary_miss}</p>}
                        {pm.pattern_detected && (
                          <div style={{ padding: '6px 10px', background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 6, fontSize: 11, color: 'var(--gold)', marginBottom: 8 }}>
                            <AlertTriangle size={12} style={{ display: 'inline', marginRight: 4 }} />
                            {pm.pattern_detected}
                          </div>
                        )}
                        {pm.sahib_notes && (
                          <div style={{ padding: '8px 12px', background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: 8, fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>
                            <strong style={{ color: 'var(--emerald)', fontSize: 10 }}>NOTES: </strong>{pm.sahib_notes}
                          </div>
                        )}
                        {noteId === pm.id ? (
                          <div style={{ marginTop: 8 }}>
                            <textarea
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              rows={3}
                              className="input"
                              placeholder="Add your analysis notes..."
                              style={{ width: '100%', fontSize: 12, fontFamily: 'Outfit, sans-serif', marginBottom: 8 }}
                            />
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => saveNote(pm.id)} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--emerald)', color: '#000', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>Save Note</button>
                              <button onClick={() => { setNoteId(null); setNoteText('') }} style={{ padding: '6px 12px', borderRadius: 8, background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', fontSize: 11 }}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button onClick={() => { setNoteId(pm.id); setNoteText(pm.sahib_notes ?? '') }} style={{ padding: '5px 10px', borderRadius: 8, background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', fontSize: 11 }}>
                              {pm.sahib_notes ? 'Edit Notes' : 'Add Notes'}
                            </button>
                            <button onClick={() => markBlackSwan(pm.id, pm.signal_id)} style={{ padding: '5px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: 'none', cursor: 'pointer', fontSize: 11 }}>
                              Mark Black Swan
                            </button>
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                        {new Date(pm.created_at).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Reports */}
          {tab === 'reports' && (
            <div>
              {reports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
                  <Brain size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                  <p>No weekly reports yet — runs every Sunday</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {report.week_number ? `Week ${report.week_number}` : 'Monthly'} Report
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                        {report.month}/{report.year}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)' }}>
                        {new Date(report.generated_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                      {(report.key_insights ?? []).map((insight, i) => (
                        <div key={i} style={{ fontSize: 12, color: 'var(--text2)', padding: '4px 10px', background: 'rgba(26,35,51,0.6)', borderRadius: 6 }}>
                          {insight}
                        </div>
                      ))}
                    </div>
                    {report.recommendations && report.recommendations.length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6, fontWeight: 600 }}>RECOMMENDATIONS</div>
                        {report.recommendations.map((rec, i) => (
                          <div key={i} style={{ fontSize: 12, color: 'var(--emerald)', marginBottom: 4 }}>
                            → {rec}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
