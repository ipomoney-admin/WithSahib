'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FileText, Download, Crown, TrendingUp, TrendingDown, Minus, Search, ChevronRight } from 'lucide-react'
import type { User, ResearchReport } from '@/types'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

const REPORT_TYPES = [
  { value: 'quarterly_results', label: 'Quarterly Results', desc: 'Q1/Q2/Q3/Q4 earnings analysis with YoY/QoQ comparison' },
  { value: 'dcf', label: 'DCF Valuation', desc: 'Discounted cash flow model with intrinsic value calculation' },
  { value: 'technical', label: 'Technical Analysis', desc: 'Chart patterns, support/resistance, RSI, MACD analysis' },
  { value: 'company_overview', label: 'Company Overview', desc: 'Business model, moat, sector analysis, key risks' },
]


function ReportCard({ report }: { report: Partial<ResearchReport> }) {
  const rec = report.recommendation
  const recColor = rec === 'BUY' ? 'var(--emerald)' : rec === 'SELL' ? 'var(--coral)' : 'var(--gold)'
  const RecIcon = rec === 'BUY' ? TrendingUp : rec === 'SELL' ? TrendingDown : Minus
  const upside = report.target_price && report.current_price
    ? (((report.target_price - report.current_price) / report.current_price) * 100).toFixed(1)
    : null

  return (
    <div className="card" style={{ padding: '22px 24px', cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Courier New, monospace', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{report.company_symbol}</span>
            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: 'rgba(0,200,150,0.08)', color: 'var(--emerald)', fontWeight: 600 }}>
              {REPORT_TYPES.find(t => t.value === report.report_type)?.label ?? report.report_type}
            </span>
            {report.ai_generated && (
              <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: 'rgba(100,160,255,0.08)', color: 'var(--sapphire)', fontWeight: 600 }}>
                Research
              </span>
            )}
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.35, marginBottom: '8px' }}>{report.title}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>{report.summary}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {rec && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px', justifyContent: 'flex-end' }}>
              <RecIcon size={14} color={recColor} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: recColor }}>{rec}</span>
            </div>
          )}
          {upside && <p style={{ fontSize: '12px', color: Number(upside) > 0 ? 'var(--emerald)' : 'var(--coral)', fontWeight: 600 }}>{Number(upside) > 0 ? '+' : ''}{upside}% upside</p>}
          {report.target_price && <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>Target ₹{report.target_price}</p>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {report.tags?.map(tag => (
            <span key={tag} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: 'var(--bg2)', color: 'var(--text3)', border: '1px solid var(--border)' }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{report.published_at ? new Date(report.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
          <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', color: 'var(--text2)', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <Download size={11} /> PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [reports, setReports] = useState<Partial<ResearchReport>[]>([])
  const [generating, setGenerating] = useState(false)
  const [genForm, setGenForm] = useState({ symbol: '', type: 'quarterly_results' })
  const [search, setSearch] = useState('')
  const [loadingReports, setLoadingReports] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { setLoadingReports(false); return }
      supabase.from('users').select('*').eq('id', data.user.id).single().then(({ data: p }) => { if (p) setUser(p) })
      // Fetch real reports from intelligence_reports (weekly/monthly) as supplementary content
      supabase
        .from('intelligence_reports')
        .select('id, report_type, report_data, key_insights, generated_at')
        .order('generated_at', { ascending: false })
        .limit(10)
        .then(({ data: rows }) => {
          if (rows && rows.length > 0) {
            setReports(rows.map((r) => ({
              id: r.id,
              report_type: r.report_type,
              title: `${r.report_type === 'weekly' ? 'Weekly' : 'Monthly'} Intelligence Report`,
              summary: (r.key_insights ?? []).slice(0, 2).join(' '),
              published_at: r.generated_at,
              ai_generated: true,
              tags: [r.report_type],
            })))
          }
          setLoadingReports(false)
        })
    })
  }, [])

  const tierLevel = { free: 0, basic: 1, pro: 2, elite: 3 }[user?.tier ?? 'free']
  const canAccess = tierLevel >= 2

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!genForm.symbol.trim()) return
    setGenerating(true)
    try {
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_symbol: genForm.symbol.toUpperCase(), company_name: genForm.symbol.toUpperCase(), report_type: genForm.type }),
      })
      const { report } = await res.json()
      if (report) {
        setReports((prev) => [report, ...prev])
        setGenForm({ symbol: '', type: 'quarterly_results' })
      }
    } catch { alert('Generation failed. Please try again.') }
    finally { setGenerating(false) }
  }

  const filtered = reports.filter(r =>
    !search || r.company_symbol?.toLowerCase().includes(search.toLowerCase()) || r.company_name?.toLowerCase().includes(search.toLowerCase()) || r.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div className="section-tag">Research</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 400, color: 'var(--text)', marginBottom: '8px' }}>Research Reports</h1>
        <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.6 }}>
          Institutional-grade research reports — DCF models, quarterly results analysis, and technical notes.
          <br /><span style={{ fontSize: '12px', color: 'var(--text3)' }}>Published by Sahib Singh Hora, SEBI RA INH000026266</span>
        </p>
      </div>

      {!canAccess ? (
        <div style={{ padding: '24px', background: 'rgba(0,200,150,0.04)', border: '1px solid rgba(0,200,150,0.15)', borderRadius: '16px', marginBottom: '28px', textAlign: 'center' }}>
          <Crown size={28} color="var(--gold)" style={{ marginBottom: '12px' }} />
          <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>Pro plan required for research reports</p>
          <p style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '16px' }}>Access DCF models, quarterly results analysis, and technical reports for any NSE stock.</p>
          <Button href="/pricing?tier=pro" variant="primary" size="md">Upgrade to Pro</Button>
        </div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FileText size={18} color="var(--emerald)" />
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>Generate a new report</h2>
          </div>
          <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input className="input" placeholder="NSE symbol e.g. TATAMOTORS, SUNPHARMA" value={genForm.symbol} onChange={e => setGenForm(f => ({ ...f, symbol: e.target.value }))} style={{ flex: '1', minWidth: '180px' }} />
            <select className="input" value={genForm.type} onChange={e => setGenForm(f => ({ ...f, type: e.target.value }))} style={{ minWidth: '200px' }}>
              {REPORT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <Button type="submit" variant="primary" size="md" disabled={generating} loading={generating} style={{ flexShrink: 0 }}>
              Generate Report
            </Button>
          </form>
          <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '10px' }}>
            Generates research using publicly available data. Takes 15–30 seconds.
          </p>
        </div>
      )}

      {/* Search */}
      {reports.length > 0 && (
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
          <input className="input" placeholder="Search by company or symbol..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '40px' }} />
        </div>
      )}

      {/* Reports list or empty state */}
      {!loadingReports && filtered.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((report) => (
            <div key={report.id} style={{ filter: !canAccess ? 'blur(3px)' : 'none', userSelect: !canAccess ? 'none' : 'auto' }}>
              <ReportCard report={report} />
            </div>
          ))}
        </div>
      ) : !loadingReports ? (
        <div style={{ textAlign: 'center', padding: '56px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
          <FileText size={32} style={{ color: 'var(--text3)', marginBottom: 16, opacity: 0.4 }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>No reports yet</h3>
          <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.7, maxWidth: 360, margin: '0 auto' }}>
            {canAccess
              ? 'Generate your first report using the form above. Enter any NSE stock symbol to get started.'
              : 'Upgrade to Pro to generate and access research reports for any NSE-listed company.'}
          </p>
        </div>
      ) : null}

      <div className="sebi-disclaimer" style={{ marginTop: '32px' }}>
        <strong style={{ color: 'var(--gold)' }}>Disclaimer: </strong>
        All research reports are prepared by Sahib Singh Hora, SEBI Registered Research Analyst (INH000026266).
        Reports are for informational purposes only and do not constitute investment advice.
        All research is reviewed by Sahib Singh Hora, SEBI RA INH000026266. Investments are subject to market risk.
      </div>
      </div>
      <BookingBanner />
      <Footer />
    </div>
  )
}
