'use client'

import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, TrendingDown, ExternalLink, BarChart2 } from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Post {
  id: string
  created_at: string
  post_date: string
  symbol: string
  entry_price: number
  current_price: number | null
  price_updated_at: string | null
  change_pct: number | null
  source: 'X' | 'Telegram' | 'Both'
  x_post_url: string | null
  caption: string | null
  outcome: 'Win' | 'Loss' | 'Ongoing' | null
  notes: string | null
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0]

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: '1px solid var(--border)', background: 'var(--surface)',
  color: 'var(--text)', fontSize: '13px', boxSizing: 'border-box',
  fontFamily: 'Inter, system-ui, sans-serif', outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.8px', textTransform: 'uppercase',
  color: 'var(--text3)', marginBottom: '5px',
  fontFamily: 'Inter, system-ui, sans-serif',
}

function fmt(n: number | null | undefined): string {
  if (n == null) return '—'
  return n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
}

// ─── SOURCE BADGE ─────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: Post['source'] }) {
  const colors: Record<string, { bg: string; color: string }> = {
    X: { bg: 'rgba(255,255,255,0.08)', color: '#FFFFFF' },
    Telegram: { bg: 'rgba(0,136,204,0.15)', color: '#0088CC' },
    Both: { bg: 'rgba(255,107,0,0.12)', color: '#FF6B00' },
  }
  const c = colors[source] ?? { bg: 'rgba(255,107,0,0.12)', color: '#FF6B00' }
  return (
    <span style={{
      fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
      padding: '2px 8px', borderRadius: '4px',
      background: c.bg, color: c.color,
    }}>
      {source}
    </span>
  )
}

// ─── OUTCOME BADGE ────────────────────────────────────────────────────────────

function OutcomeBadge({ outcome }: { outcome: Post['outcome'] }) {
  if (!outcome || outcome === 'Ongoing') {
    return <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Ongoing</span>
  }
  const color = outcome === 'Win' ? '#1A7A4A' : '#EF4444'
  const bg = outcome === 'Win' ? 'rgba(26,122,74,0.1)' : 'rgba(239,68,68,0.1)'
  return (
    <span style={{
      fontSize: '10px', fontWeight: 700,
      padding: '2px 8px', borderRadius: '4px',
      background: bg, color,
    }}>
      {outcome}
    </span>
  )
}

// ─── INLINE EDITABLE CELL ─────────────────────────────────────────────────────

function InlineNumber({
  value, onSave, placeholder = '—',
}: {
  value: number | null
  onSave: (v: number | null) => void
  placeholder?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value != null ? String(value) : '')

  function commit() {
    setEditing(false)
    const n = parseFloat(draft)
    onSave(isNaN(n) ? null : n)
  }

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        step="0.01"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
        style={{
          width: '90px', padding: '4px 8px', borderRadius: '6px',
          border: '1px solid var(--border)', background: 'var(--surface)',
          color: 'var(--text)', fontSize: '13px', fontFamily: 'Inter, system-ui, sans-serif',
        }}
      />
    )
  }

  return (
    <span
      onClick={() => { setDraft(value != null ? String(value) : ''); setEditing(true) }}
      title="Click to edit"
      style={{
        cursor: 'pointer', borderBottom: '1px dashed var(--border)',
        paddingBottom: '1px', fontSize: '13px', color: value != null ? 'var(--text)' : 'var(--text3)',
      }}
    >
      {value != null ? fmt(value) : placeholder}
    </span>
  )
}

function InlineSelect({
  value, options, onSave,
}: {
  value: string | null
  options: string[]
  onSave: (v: string) => void
}) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onSave(e.target.value)}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        color: 'var(--text)', borderRadius: '6px', padding: '3px 6px',
        fontSize: '12px', cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {options.map((o) => <option key={o} value={o}>{o || '—'}</option>)}
    </select>
  )
}

function InlineText({
  value, onSave, placeholder = 'Add note…',
}: {
  value: string | null
  onSave: (v: string) => void
  placeholder?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')

  function commit() {
    setEditing(false)
    onSave(draft.trim())
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
        style={{
          width: '160px', padding: '4px 8px', borderRadius: '6px',
          border: '1px solid var(--border)', background: 'var(--surface)',
          color: 'var(--text)', fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif',
        }}
      />
    )
  }

  return (
    <span
      onClick={() => { setDraft(value ?? ''); setEditing(true) }}
      title="Click to edit"
      style={{
        cursor: 'pointer', borderBottom: '1px dashed var(--border)',
        paddingBottom: '1px', fontSize: '12px',
        color: value ? 'var(--text2)' : 'var(--text3)',
        maxWidth: '160px', display: 'inline-block',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}
    >
      {value || placeholder}
    </span>
  )
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────

function StatsBar({ posts }: { posts: Post[] }) {
  const total = posts.length
  const wins = posts.filter((p) => p.outcome === 'Win').length
  const losses = posts.filter((p) => p.outcome === 'Loss').length
  const ongoing = posts.filter((p) => !p.outcome || p.outcome === 'Ongoing').length
  const closed = wins + losses
  const winRate = closed > 0 ? Math.round((wins / closed) * 100) : null

  const stats = [
    { label: 'Total Posts', value: String(total), color: 'var(--text)' },
    { label: 'Wins', value: String(wins), color: '#1A7A4A' },
    { label: 'Losses', value: String(losses), color: '#EF4444' },
    { label: 'Ongoing', value: String(ongoing), color: 'var(--text3)' },
    { label: 'Win Rate', value: winRate != null ? `${winRate}%` : '—', color: winRate != null && winRate >= 50 ? '#1A7A4A' : '#EF4444' },
  ]

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
      {stats.map(({ label, value, color }) => (
        <div key={label} style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: '12px 18px', flex: '1 1 100px',
        }}>
          <p style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px', fontWeight: 600 }}>
            {label}
          </p>
          <p style={{ fontSize: '22px', fontWeight: 700, color, margin: 0, fontFamily: '"Playfair Display", Georgia, serif' }}>
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr>
      {[...Array(10)].map((_, i) => (
        <td key={i} style={{ padding: '12px 14px' }}>
          <div className="shimmer" style={{ height: 14, borderRadius: 4, width: i === 1 ? 60 : '80%' }} />
        </td>
      ))}
    </tr>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function PostTrackerPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [form, setForm] = useState({
    post_date: today,
    symbol: '',
    entry_price: '',
    source: 'X' as Post['source'],
    x_post_url: '',
    caption: '',
  })

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/post-tracker')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setPosts(data)
    } catch {
      setError('Could not load posts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.symbol.trim() || !form.entry_price) return
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/post-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          symbol: form.symbol.toUpperCase(),
          entry_price: parseFloat(form.entry_price),
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Failed')
      }
      setSuccess(`✓ ${form.symbol.toUpperCase()} added`)
      setForm({ post_date: today, symbol: '', entry_price: '', source: 'X', x_post_url: '', caption: '' })
      fetchPosts()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add post')
    } finally {
      setSubmitting(false)
    }
  }

  async function patch(id: string, updates: Record<string, unknown>) {
    try {
      const res = await fetch('/api/post-tracker', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      if (!res.ok) return
      const updated: Post = await res.json()
      setPosts((prev) => prev.map((p) => p.id === id ? updated : p))
    } catch {
      // silent — UI stays optimistic
    }
  }

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const thStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: '10px', fontWeight: 700,
    letterSpacing: '0.8px', textTransform: 'uppercase',
    color: 'var(--text3)', textAlign: 'left', whiteSpace: 'nowrap',
    borderBottom: '1px solid var(--border)', background: 'var(--surface)',
    position: 'sticky', top: 0, zIndex: 1,
  }

  const tdStyle: React.CSSProperties = {
    padding: '11px 14px', borderBottom: '1px solid var(--border)',
    fontSize: '13px', color: 'var(--text)', verticalAlign: 'middle',
  }

  return (
    <div style={{ padding: '28px 32px', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <BarChart2 size={20} color="var(--text3)" strokeWidth={1.5} />
        <div>
          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '22px', fontWeight: 400, color: 'var(--text)', margin: 0 }}>
            Post Tracker
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text3)', margin: '2px 0 0' }}>
            Track X &amp; Telegram posts against market outcomes
          </p>
        </div>
      </div>

      {/* Add New Post form */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '20px 24px', marginBottom: '24px',
      }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text3)', margin: '0 0 16px' }}>
          Add New Post
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" style={inputStyle} value={form.post_date} onChange={(e) => set('post_date', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Symbol</label>
              <input
                style={inputStyle} placeholder="NIFTY50"
                value={form.symbol}
                onChange={(e) => set('symbol', e.target.value.toUpperCase())}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Entry Price</label>
              <input
                type="number" step="0.01" style={inputStyle} placeholder="24500"
                value={form.entry_price}
                onChange={(e) => set('entry_price', e.target.value)}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Source</label>
              <select
                style={inputStyle}
                value={form.source}
                onChange={(e) => set('source', e.target.value as Post['source'])}
              >
                <option value="X">X</option>
                <option value="Telegram">Telegram</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>X Post URL</label>
              <input
                type="url" style={inputStyle} placeholder="https://x.com/…"
                value={form.x_post_url}
                onChange={(e) => set('x_post_url', e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Caption (optional)</label>
            <textarea
              style={{ ...inputStyle, minHeight: '60px', resize: 'vertical', lineHeight: 1.5 }}
              placeholder="Post caption or trade rationale…"
              value={form.caption}
              onChange={(e) => set('caption', e.target.value)}
            />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: '13px', marginBottom: '12px' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(26,122,74,0.08)', border: '1px solid rgba(26,122,74,0.2)', color: '#1A7A4A', fontSize: '13px', marginBottom: '12px' }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '9px 22px', borderRadius: '8px', border: 'none',
              background: submitting ? 'var(--border)' : '#FF6B00',
              color: submitting ? 'var(--text3)' : '#FFFFFF',
              fontSize: '13px', fontWeight: 700, cursor: submitting ? 'default' : 'pointer',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {submitting ? 'Adding…' : '+ Add Post'}
          </button>
        </form>
      </div>

      {/* Stats bar */}
      {!loading && posts.length > 0 && <StatsBar posts={posts} />}

      {/* Table */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '12px', overflow: 'hidden',
      }}>
        {loading ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        ) : posts.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text3)' }}>
            <BarChart2 size={36} strokeWidth={1} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p style={{ fontSize: '15px', fontWeight: 500, marginBottom: '6px', color: 'var(--text2)' }}>No posts yet</p>
            <p style={{ fontSize: '13px' }}>Add your first post above to start tracking outcomes.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr>
                  {['Date', 'Symbol', 'Entry ₹', 'Current ₹', '% Change', 'Source', 'X Link', 'Outcome', 'Notes', ''].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post, idx) => {
                  const changePct = post.change_pct
                  const isPositive = changePct != null && changePct > 0
                  const isNegative = changePct != null && changePct < 0

                  return (
                    <tr key={post.id} style={{ background: idx % 2 === 0 ? 'transparent' : 'var(--bg, rgba(0,0,0,0.02))' }}>
                      <td style={tdStyle}>
                        <span style={{ fontSize: '12px', color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                          {fmtDate(post.post_date)}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <span style={{ fontWeight: 700, fontFamily: 'Courier New, monospace', fontSize: '13px' }}>
                          {post.symbol}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <span style={{ fontSize: '13px' }}>₹{fmt(post.entry_price)}</span>
                      </td>

                      <td style={tdStyle}>
                        <InlineNumber
                          value={post.current_price}
                          placeholder="click to add"
                          onSave={(v) => patch(post.id, { current_price: v })}
                        />
                      </td>

                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                        {changePct == null ? (
                          <span style={{ color: 'var(--text3)', fontSize: '12px' }}>—</span>
                        ) : (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            fontSize: '13px', fontWeight: 600,
                            color: isPositive ? '#1A7A4A' : isNegative ? '#EF4444' : 'var(--text3)',
                          }}>
                            {isPositive ? <TrendingUp size={13} /> : isNegative ? <TrendingDown size={13} /> : null}
                            {isPositive ? '+' : ''}{changePct.toFixed(2)}%
                          </span>
                        )}
                      </td>

                      <td style={tdStyle}>
                        <SourceBadge source={post.source} />
                      </td>

                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        {post.x_post_url ? (
                          <a
                            href={post.x_post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--text3)', display: 'inline-flex' }}
                            title="Open post"
                          >
                            <ExternalLink size={14} />
                          </a>
                        ) : (
                          <span style={{ color: 'var(--border)', fontSize: '11px' }}>—</span>
                        )}
                      </td>

                      <td style={tdStyle}>
                        <InlineSelect
                          value={post.outcome ?? 'Ongoing'}
                          options={['Ongoing', 'Win', 'Loss']}
                          onSave={(v) => patch(post.id, { outcome: v === 'Ongoing' ? null : v })}
                        />
                      </td>

                      <td style={tdStyle}>
                        <InlineText
                          value={post.notes}
                          onSave={(v) => patch(post.id, { notes: v || null })}
                        />
                      </td>

                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        {post.outcome && post.outcome !== 'Ongoing' && (
                          <OutcomeBadge outcome={post.outcome} />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
