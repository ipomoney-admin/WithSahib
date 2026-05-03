'use client'
// Access: super_admin role only — enforced server-side in layout.tsx
// Data fetching: all via API routes (service-role client) — never direct browser Supabase

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LogoMark } from '@/components/ui/Logo'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Department {
  id: string
  name: string
  icon: string
  description: string
}

interface Agent {
  id: string
  department_id: string
  name: string
  role: string
  skills: string[]
  model: string
  status: 'running' | 'idle' | 'done' | 'waiting' | 'error'
  current_task: string | null
  progress: number
  api_calls_today: number
  last_active: string | null
}

interface ApprovalItem {
  id: string
  agent_id: string
  task_id: string
  title: string
  content: string
  output_type: string
  status: string
  created_at: string
  agents?: { name: string }
}

interface FeedItem {
  id: string
  agent_id: string
  task_type: string
  status: string
  tokens_used: number
  model_used: string
  created_at: string
  agents?: { name: string }
}

interface Metrics {
  running: number
  doneToday: number
  pendingApprovals: number
  tokensToday: number
  tokenLimit: number
  tokenPct: number
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function useISTClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

async function apiFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const STATUS_COLOR: Record<string, string> = {
  running: '#00C896',
  idle: '#6A6A6A',
  done: '#1A7A4A',
  waiting: '#D4A843',
  error: '#FF5555',
}

const STATUS_BG: Record<string, string> = {
  running: 'rgba(0,200,150,0.1)',
  idle: 'rgba(106,106,106,0.1)',
  done: 'rgba(26,122,74,0.1)',
  waiting: 'rgba(212,168,67,0.1)',
  error: 'rgba(255,85,85,0.1)',
}

function StatusDot({ status }: { status: string }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 8, height: 8,
      borderRadius: '50%',
      background: STATUS_COLOR[status] ?? '#6A6A6A',
      flexShrink: 0,
      ...(status === 'running' ? {
        boxShadow: `0 0 6px ${STATUS_COLOR.running}`,
        animation: 'pulse-dot 1.5s ease-in-out infinite',
      } : {}),
    }} />
  )
}

function timeAgo(iso: string | null) {
  if (!iso) return 'never'
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

// ─── AGENT CARD ───────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div style={{
      background: '#111111',
      border: `1px solid ${agent.status === 'running' ? 'rgba(0,200,150,0.25)' : '#222222'}`,
      borderRadius: 12,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transition: 'border-color 0.3s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', margin: 0, fontFamily: '"Playfair Display", Georgia, serif' }}>
            {agent.name}
          </p>
          <p style={{ fontSize: 11, color: '#666666', margin: '2px 0 0', lineHeight: 1.4 }}>{agent.role}</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '3px 8px', borderRadius: 20,
          background: STATUS_BG[agent.status] ?? STATUS_BG.idle,
          flexShrink: 0,
        }}>
          <StatusDot status={agent.status} />
          <span style={{ fontSize: 10, fontWeight: 600, color: STATUS_COLOR[agent.status] ?? '#6A6A6A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {agent.status}
          </span>
        </div>
      </div>

      {/* Current task */}
      <div style={{ minHeight: 30 }}>
        {agent.current_task ? (
          <p style={{ fontSize: 11, color: '#AAAAAA', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
            {agent.current_task}
          </p>
        ) : (
          <p style={{ fontSize: 11, color: '#444444', margin: 0 }}>No active task</p>
        )}
      </div>

      {/* Progress bar — only when running */}
      {agent.status === 'running' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: '#666666' }}>Progress</span>
            <span style={{ fontSize: 10, color: '#00C896', fontWeight: 600 }}>{agent.progress}%</span>
          </div>
          <div style={{ height: 3, background: '#2A2A2A', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${agent.progress}%`,
              background: 'linear-gradient(90deg, #00C896aa, #00C896)',
              borderRadius: 100,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      )}

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {(agent.skills ?? []).slice(0, 3).map((skill) => (
          <span key={skill} style={{
            fontSize: 9, color: '#888888',
            background: '#1A1A1A', border: '1px solid #2A2A2A',
            borderRadius: 4, padding: '2px 6px',
          }}>
            {skill}
          </span>
        ))}
        {(agent.skills ?? []).length > 3 && (
          <span style={{ fontSize: 9, color: '#555555', padding: '2px 4px' }}>
            +{agent.skills.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #1A1A1A' }}>
        <span style={{ fontSize: 10, color: '#555555', fontFamily: 'Courier New, monospace' }}>
          {agent.model}
        </span>
        <span style={{ fontSize: 10, color: '#555555' }}>
          {agent.api_calls_today} calls · {timeAgo(agent.last_active)}
        </span>
      </div>
    </div>
  )
}

// ─── METRICS ROW ─────────────────────────────────────────────────────────────

function MetricsRow({ metrics }: { metrics: Metrics }) {
  const cards = [
    { label: 'Running', value: metrics.running, color: '#00C896', icon: '⚡' },
    { label: 'Done Today', value: metrics.doneToday, color: '#1A7A4A', icon: '✅' },
    { label: 'Pending Approvals', value: metrics.pendingApprovals, color: '#D4A843', icon: '⏳' },
    {
      label: 'Tokens Today',
      value: `${(metrics.tokensToday / 1000).toFixed(1)}K`,
      sub: `${metrics.tokenPct}% of 1M limit`,
      color: metrics.tokenPct >= 95 ? '#FF5555' : metrics.tokenPct >= 80 ? '#D4A843' : '#FF6B00',
      icon: '🪙',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
      {cards.map((card) => (
        <div key={card.label} style={{
          background: '#111111',
          border: '1px solid #222222',
          borderRadius: 10,
          padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 14 }}>{card.icon}</span>
            <span style={{ fontSize: 11, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {card.label}
            </span>
          </div>
          <p style={{ fontSize: 24, fontWeight: 700, color: card.color, margin: 0, fontFamily: '"Playfair Display", Georgia, serif' }}>
            {card.value}
          </p>
          {'sub' in card && card.sub && (
            <p style={{ fontSize: 10, color: '#555555', margin: '2px 0 0' }}>{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── COMMAND BAR ─────────────────────────────────────────────────────────────

function CommandBar({ agents, departments, onCommandSent }: {
  agents: Agent[]
  departments: Department[]
  onCommandSent: (cmd: string) => void
}) {
  const [command, setCommand] = useState('')
  const [targetType, setTargetType] = useState<'all' | 'department' | 'agent'>('all')
  const [targetDept, setTargetDept] = useState('')
  const [targetAgent, setTargetAgent] = useState('')
  const [sending, setSending] = useState(false)

  async function send() {
    if (!command.trim()) return
    setSending(true)
    try {
      const body: Record<string, string> = { command }
      if (targetType === 'department' && targetDept) body.target_department = targetDept
      if (targetType === 'agent' && targetAgent) body.target_agent_id = targetAgent

      const res = await fetch('/api/ops/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        onCommandSent(command)
        setCommand('')
      }
    } finally {
      setSending(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send()
  }

  return (
    <div style={{
      borderTop: '1px solid #1E1E1E',
      padding: '14px 20px',
      background: '#0D0D0D',
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      flexShrink: 0,
    }}>
      <select
        value={targetType}
        onChange={(e) => setTargetType(e.target.value as 'all' | 'department' | 'agent')}
        style={{
          background: '#1A1A1A', border: '1px solid #333333', color: '#AAAAAA',
          borderRadius: 8, padding: '8px 10px', fontSize: 12, cursor: 'pointer',
          outline: 'none', flexShrink: 0,
        }}
      >
        <option value="all">→ All Agents</option>
        <option value="department">→ Department</option>
        <option value="agent">→ Agent</option>
      </select>

      {targetType === 'department' && (
        <select
          value={targetDept}
          onChange={(e) => setTargetDept(e.target.value)}
          style={{
            background: '#1A1A1A', border: '1px solid #333333', color: '#AAAAAA',
            borderRadius: 8, padding: '8px 10px', fontSize: 12, cursor: 'pointer',
            outline: 'none', flexShrink: 0,
          }}
        >
          <option value="">Pick department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.name}>{d.icon} {d.name}</option>
          ))}
        </select>
      )}

      {targetType === 'agent' && (
        <select
          value={targetAgent}
          onChange={(e) => setTargetAgent(e.target.value)}
          style={{
            background: '#1A1A1A', border: '1px solid #333333', color: '#AAAAAA',
            borderRadius: 8, padding: '8px 10px', fontSize: 12, cursor: 'pointer',
            outline: 'none', flexShrink: 0,
          }}
        >
          <option value="">Pick agent</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      )}

      <input
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Enter command… (⌘+Enter to send)"
        style={{
          flex: 1,
          background: '#1A1A1A', border: '1px solid #333333', color: '#FFFFFF',
          borderRadius: 8, padding: '8px 14px', fontSize: 13,
          outline: 'none', fontFamily: 'Inter, system-ui, sans-serif',
        }}
      />

      <button
        onClick={send}
        disabled={sending || !command.trim()}
        style={{
          background: sending || !command.trim() ? '#2A2A2A' : '#FF6B00',
          color: sending || !command.trim() ? '#555555' : '#FFFFFF',
          border: 'none', borderRadius: 8, padding: '8px 18px',
          fontSize: 13, fontWeight: 700, cursor: sending ? 'wait' : 'pointer',
          transition: 'all 0.2s', flexShrink: 0,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {sending ? 'Sending…' : 'Send ↵'}
      </button>
    </div>
  )
}

// ─── APPROVALS PANEL ─────────────────────────────────────────────────────────

function ApprovalsPanel({ approvals, onAction }: {
  approvals: ApprovalItem[]
  onAction: (id: string, action: 'approve' | 'reject', edited?: string) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  if (approvals.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, color: '#444444' }}>
        <span style={{ fontSize: 28, marginBottom: 8 }}>✅</span>
        <p style={{ fontSize: 13 }}>No pending approvals</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {approvals.map((item) => (
        <div key={item.id} style={{
          background: '#111111',
          border: '1px solid rgba(212,168,67,0.2)',
          borderRadius: 10,
          padding: 14,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', margin: 0 }}>{item.title}</p>
              <p style={{ fontSize: 10, color: '#555555', margin: '2px 0 0' }}>
                {item.agents?.name ?? 'Agent'} · {item.output_type}
              </p>
            </div>
            <span style={{ fontSize: 9, color: '#D4A843', background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 4, padding: '2px 6px', flexShrink: 0 }}>
              PENDING
            </span>
          </div>

          {editingId === item.id ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              style={{
                width: '100%', background: '#0D0D0D', border: '1px solid #333333',
                color: '#FFFFFF', borderRadius: 6, padding: '8px 10px',
                fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif',
                resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              }}
            />
          ) : (
            <p style={{ fontSize: 12, color: '#AAAAAA', lineHeight: 1.6, margin: '0 0 12px', maxHeight: 80, overflow: 'hidden' }}>
              {item.content}
            </p>
          )}

          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {editingId === item.id ? (
              <>
                <button
                  onClick={() => { onAction(item.id, 'approve', editContent); setEditingId(null) }}
                  style={{ flex: 1, padding: '6px 0', background: 'rgba(26,122,74,0.15)', border: '1px solid rgba(26,122,74,0.4)', borderRadius: 6, color: '#1A7A4A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  Approve edit
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{ padding: '6px 10px', background: '#1A1A1A', border: '1px solid #333333', borderRadius: 6, color: '#666666', fontSize: 12, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onAction(item.id, 'approve')}
                  style={{ flex: 1, padding: '6px 0', background: 'rgba(26,122,74,0.15)', border: '1px solid rgba(26,122,74,0.4)', borderRadius: 6, color: '#1A7A4A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  Approve
                </button>
                <button
                  onClick={() => { setEditingId(item.id); setEditContent(item.content) }}
                  style={{ flex: 1, padding: '6px 0', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.3)', borderRadius: 6, color: '#FF6B00', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onAction(item.id, 'reject')}
                  style={{ flex: 1, padding: '6px 0', background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', borderRadius: 6, color: '#FF5555', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── LIVE FEED ────────────────────────────────────────────────────────────────

function LiveFeed({ items }: { items: FeedItem[] }) {
  const statusIcon: Record<string, string> = {
    completed: '✅', running: '⚡', pending: '⏳', failed: '❌',
  }

  if (items.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, color: '#444444' }}>
        <span style={{ fontSize: 28, marginBottom: 8 }}>📡</span>
        <p style={{ fontSize: 13 }}>No activity yet</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {items.map((item) => (
        <div key={item.id} style={{
          padding: '10px 12px',
          background: '#0D0D0D',
          borderRadius: 6,
          borderLeft: `3px solid ${item.status === 'completed' ? '#1A7A4A' : item.status === 'running' ? '#00C896' : item.status === 'failed' ? '#FF5555' : '#333333'}`,
          marginBottom: 4,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#CCCCCC', fontWeight: 500 }}>
              {statusIcon[item.status] ?? '·'} {item.agents?.name ?? 'Agent'} · {item.task_type}
            </span>
            <span style={{ fontSize: 10, color: '#444444', fontFamily: 'Courier New, monospace' }}>
              {timeAgo(item.created_at)}
            </span>
          </div>
          {item.tokens_used > 0 && (
            <p style={{ fontSize: 10, color: '#555555', margin: '3px 0 0', fontFamily: 'Courier New, monospace' }}>
              {item.tokens_used.toLocaleString()} tokens · {item.model_used}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── EMPTY / ERROR STATES ─────────────────────────────────────────────────────

function SetupBanner({ onSeed }: { onSeed: () => void }) {
  const [seeding, setSeeding] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function runSeed() {
    setSeeding(true)
    setResult(null)
    try {
      const res = await fetch('/api/ops/seed', { method: 'POST' })
      const json = await res.json()
      if (res.ok) {
        setResult(`✅ Seeded ${json.departments} departments + ${json.agents} agents`)
        setTimeout(onSeed, 1000)
      } else {
        setResult(`❌ ${json.error}`)
      }
    } catch {
      setResult('❌ Network error')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div style={{
      margin: '40px auto', maxWidth: 560,
      background: '#111111', border: '1px solid rgba(255,107,0,0.25)',
      borderRadius: 16, padding: '32px',
      textAlign: 'center',
    }}>
      <span style={{ fontSize: 36, display: 'block', marginBottom: 16 }}>🤖</span>
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 22, fontWeight: 400, color: '#FFFFFF', margin: '0 0 8px' }}>
        Agent system not initialised
      </h2>
      <p style={{ fontSize: 13, color: '#666666', marginBottom: 24, lineHeight: 1.6 }}>
        The Supabase tables exist but have no data yet.<br />
        Click below to seed the 7 departments and 19 agents.
      </p>

      {result && (
        <p style={{ fontSize: 13, color: result.startsWith('✅') ? '#00C896' : '#FF5555', marginBottom: 16 }}>
          {result}
        </p>
      )}

      <button
        onClick={runSeed}
        disabled={seeding}
        style={{
          background: seeding ? '#2A2A2A' : '#FF6B00',
          color: seeding ? '#666666' : '#FFFFFF',
          border: 'none', borderRadius: 10, padding: '12px 28px',
          fontSize: 14, fontWeight: 700, cursor: seeding ? 'wait' : 'pointer',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {seeding ? 'Seeding…' : 'Seed Departments + Agents →'}
      </button>

      <p style={{ fontSize: 11, color: '#333333', marginTop: 20 }}>
        Or run <code style={{ fontFamily: 'Courier New, monospace', color: '#555555' }}>supabase/migrations/006_agent_system.sql</code> + <code style={{ fontFamily: 'Courier New, monospace', color: '#555555' }}>007_agent_rls_fix.sql</code> in the Supabase SQL Editor.
      </p>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export function OpsClient() {
  // Supabase client used ONLY for realtime channel subscriptions
  const supabase = createClient()
  const clock = useISTClock()

  const [departments, setDepartments] = useState<Department[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [activeDept, setActiveDept] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<Metrics>({ running: 0, doneToday: 0, pendingApprovals: 0, tokensToday: 0, tokenLimit: 1_000_000, tokenPct: 0 })
  const [approvals, setApprovals] = useState<ApprovalItem[]>([])
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [rightTab, setRightTab] = useState<'feed' | 'approvals' | 'schedule'>('feed')
  const [feedLog, setFeedLog] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [needsSeed, setNeedsSeed] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)

  // ── Data fetchers (all use API routes → service-role client, bypasses RLS) ──

  const fetchDepartments = useCallback(async () => {
    const data = await apiFetch<Department[]>('/api/ops/departments')
    if (data === null) return
    setDepartments(data)
    if (data.length === 0) {
      setNeedsSeed(true)
    } else {
      setNeedsSeed(false)
      if (!activeDept) setActiveDept(data[0]?.id ?? null)
    }
  }, [activeDept])

  const fetchAgents = useCallback(async () => {
    const data = await apiFetch<Agent[]>('/api/ops/agents')
    if (data !== null) setAgents(data)
  }, [])

  const fetchMetrics = useCallback(async () => {
    const data = await apiFetch<Metrics>('/api/ops/status')
    if (data !== null) setMetrics(data)
  }, [])

  const fetchApprovals = useCallback(async () => {
    const data = await apiFetch<ApprovalItem[]>('/api/ops/approvals')
    if (data !== null) setApprovals(data)
  }, [])

  const fetchFeed = useCallback(async () => {
    const data = await apiFetch<FeedItem[]>('/api/ops/feed')
    if (data !== null) setFeedItems(data)
  }, [])

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchDepartments(), fetchAgents(), fetchMetrics(), fetchApprovals(), fetchFeed()])
  }, [fetchDepartments, fetchAgents, fetchMetrics, fetchApprovals, fetchFeed])

  // ── Mount ──

  useEffect(() => {
    refreshAll().finally(() => setLoading(false))

    const metricsInterval = setInterval(fetchMetrics, 30_000)

    // Realtime: use events as triggers to re-fetch via API routes (not direct DB reads)
    const channel = supabase
      .channel('ops-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_tasks' }, () => {
        fetchFeed()
        fetchMetrics()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, () => {
        fetchAgents()
        fetchMetrics()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'approval_queue' }, () => {
        fetchApprovals()
        fetchMetrics()
      })
      .subscribe()

    return () => {
      clearInterval(metricsInterval)
      supabase.removeChannel(channel)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight
  }, [feedLog])

  function handleCommandSent(cmd: string) {
    const entry = `[${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false })} IST] CMD → ${cmd}`
    setFeedLog((prev) => [...prev.slice(-99), entry])
    setRightTab('feed')
  }

  async function handleApprovalAction(id: string, action: 'approve' | 'reject', edited?: string) {
    await fetch('/api/ops/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approval_id: id, action, edited_content: edited }),
    })
    fetchApprovals()
    fetchMetrics()
  }

  const visibleAgents = activeDept
    ? agents.filter((a) => a.department_id === activeDept)
    : agents

  const deptAgentCount = (deptId: string) => agents.filter((a) => a.department_id === deptId).length

  // ── Loading skeleton ──

  if (loading) {
    return (
      <div style={{ height: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#444444' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid #2A2A2A', borderTopColor: '#FF6B00',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ fontSize: 13 }}>Loading Agent Command Center…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── Full render ──

  return (
    <div style={{
      height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      background: '#0A0A0A', color: '#FFFFFF', fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #00C896; }
          50% { opacity: 0.6; box-shadow: 0 0 12px #00C896; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 2px; }
        select option { background: #1A1A1A; }
      `}</style>

      {/* TOP BAR */}
      <header style={{
        height: 56, flexShrink: 0,
        background: '#0D0D0D',
        borderBottom: '1px solid #1E1E1E',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 16,
      }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark size={22} animated={false} />
          <span style={{ fontSize: 15 }}>
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>with</span>
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontWeight: 700, color: '#FF6B00' }}>Sahib</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, color: '#555555' }}>·</span>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 2,
            color: '#FF6B00', textTransform: 'uppercase',
            fontFamily: 'Courier New, monospace',
          }}>
            AGENT COMMAND CENTER
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: 1,
            color: '#333333', background: '#1A1A1A',
            border: '1px solid #2A2A2A', borderRadius: 4,
            padding: '2px 6px',
          }}>
            INTERNAL
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <span style={{
          fontSize: 13, fontFamily: 'Courier New, monospace', color: '#555555',
          border: '1px solid #1E1E1E', borderRadius: 6, padding: '4px 10px',
        }}>
          {clock} IST
        </span>

        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1,
          color: '#D4A843', background: 'rgba(212,168,67,0.1)',
          border: '1px solid rgba(212,168,67,0.3)', borderRadius: 4,
          padding: '4px 10px', textTransform: 'uppercase',
        }}>
          SUPER ADMIN
        </span>
      </header>

      {/* BODY */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT SIDEBAR */}
        <aside style={{
          width: 220, flexShrink: 0,
          borderRight: '1px solid #1E1E1E',
          display: 'flex', flexDirection: 'column',
          background: '#0D0D0D',
        }}>
          <div style={{ padding: '16px 12px 8px', flexShrink: 0 }}>
            <p style={{ fontSize: 9, color: '#444444', textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 10px', padding: '0 4px' }}>
              DEPARTMENTS
            </p>
          </div>
          <nav style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
            {/* All */}
            <button
              onClick={() => setActiveDept(null)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 12px', borderRadius: 8, marginBottom: 2, border: 'none', cursor: 'pointer',
                background: activeDept === null ? 'rgba(255,107,0,0.1)' : 'transparent',
                color: activeDept === null ? '#FF6B00' : '#888888',
                fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif',
                transition: 'all 0.15s',
              }}
            >
              <span>🤖 All Agents</span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                background: activeDept === null ? 'rgba(255,107,0,0.2)' : '#1A1A1A',
                color: activeDept === null ? '#FF6B00' : '#666666',
                borderRadius: 10, padding: '1px 7px',
              }}>
                {agents.length}
              </span>
            </button>

            {departments.map((dept) => {
              const active = activeDept === dept.id
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveDept(dept.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 12px', borderRadius: 8, marginBottom: 2, border: 'none', cursor: 'pointer',
                    background: active ? 'rgba(255,107,0,0.1)' : 'transparent',
                    color: active ? '#FF6B00' : '#888888',
                    fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif',
                    transition: 'all 0.15s', textAlign: 'left',
                  }}
                >
                  <span>{dept.icon} {dept.name}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    background: active ? 'rgba(255,107,0,0.2)' : '#1A1A1A',
                    color: active ? '#FF6B00' : '#666666',
                    borderRadius: 10, padding: '1px 7px', flexShrink: 0,
                  }}>
                    {deptAgentCount(dept.id)}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Token budget mini display */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #1E1E1E', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: '#444444', textTransform: 'uppercase', letterSpacing: 1 }}>Token Budget</span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: metrics.tokenPct >= 95 ? '#FF5555' : metrics.tokenPct >= 80 ? '#D4A843' : '#00C896',
              }}>
                {metrics.tokenPct}%
              </span>
            </div>
            <div style={{ height: 4, background: '#1A1A1A', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${metrics.tokenPct}%`,
                background: metrics.tokenPct >= 95 ? '#FF5555' : metrics.tokenPct >= 80 ? '#D4A843' : '#00C896',
                borderRadius: 100, transition: 'width 1s ease',
              }} />
            </div>
            <p style={{ fontSize: 9, color: '#333333', margin: '4px 0 0', fontFamily: 'Courier New, monospace' }}>
              {(metrics.tokensToday / 1000).toFixed(1)}K / 1,000K free
            </p>
          </div>
        </aside>

        {/* CENTER */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            <MetricsRow metrics={metrics} />

            {needsSeed ? (
              <SetupBanner onSeed={refreshAll} />
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h2 style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: 18, fontWeight: 400, color: '#FFFFFF', margin: 0,
                  }}>
                    {activeDept
                      ? departments.find((d) => d.id === activeDept)?.name ?? 'Agents'
                      : 'All Agents'}
                    <span style={{ fontSize: 13, color: '#444444', fontFamily: 'Inter, system-ui, sans-serif', marginLeft: 10 }}>
                      {visibleAgents.length} agents
                    </span>
                  </h2>
                  <span style={{ fontSize: 11, color: '#444444' }}>
                    {visibleAgents.filter((a) => a.status === 'running').length} running
                  </span>
                </div>

                {visibleAgents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#333333' }}>
                    <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>🤖</span>
                    <p style={{ fontSize: 13 }}>No agents in this department</p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: 12,
                  }}>
                    {visibleAgents.map((agent) => (
                      <AgentCard key={agent.id} agent={agent} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <CommandBar agents={agents} departments={departments} onCommandSent={handleCommandSent} />
        </main>

        {/* RIGHT PANEL */}
        <aside style={{
          width: 300, flexShrink: 0,
          borderLeft: '1px solid #1E1E1E',
          display: 'flex', flexDirection: 'column',
          background: '#0D0D0D',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #1E1E1E', flexShrink: 0 }}>
            {(['feed', 'approvals', 'schedule'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                style={{
                  flex: 1, padding: '12px 4px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: rightTab === tab ? 700 : 400,
                  color: rightTab === tab ? '#FF6B00' : '#555555',
                  textTransform: 'capitalize', letterSpacing: '0.5px',
                  borderBottom: `2px solid ${rightTab === tab ? '#FF6B00' : 'transparent'}`,
                  transition: 'all 0.15s',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {tab === 'approvals' && metrics.pendingApprovals > 0 && rightTab !== 'approvals'
                  ? <><span>Approvals</span> <span style={{ color: '#D4A843' }}>({metrics.pendingApprovals})</span></>
                  : tab === 'feed' ? 'Live Feed' : tab === 'approvals' ? 'Approvals' : 'Schedule'}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px' }}>
            {rightTab === 'feed' && (
              <>
                {feedLog.length > 0 && (
                  <div
                    ref={feedRef}
                    style={{
                      background: '#0A0A0A', border: '1px solid #1E1E1E',
                      borderRadius: 6, padding: '8px 10px', marginBottom: 12,
                      maxHeight: 120, overflowY: 'auto', fontFamily: 'Courier New, monospace',
                    }}
                  >
                    {feedLog.map((line, i) => (
                      <p key={i} style={{ fontSize: 10, color: '#00C896', margin: '2px 0' }}>{line}</p>
                    ))}
                  </div>
                )}
                <LiveFeed items={feedItems} />
              </>
            )}

            {rightTab === 'approvals' && (
              <ApprovalsPanel approvals={approvals} onAction={handleApprovalAction} />
            )}

            {rightTab === 'schedule' && (
              <div style={{ color: '#444444', textAlign: 'center', paddingTop: 60 }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>🗓</span>
                <p style={{ fontSize: 13 }}>Scheduled tasks coming soon</p>
                <p style={{ fontSize: 11, color: '#333333', marginTop: 8, lineHeight: 1.6 }}>
                  Agent cron schedules will appear here once the scheduler is wired up.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
