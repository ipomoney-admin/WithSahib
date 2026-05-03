import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(_req: NextRequest) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceRoleClient()
  const { data: role } = await db
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'super_admin')
    .single()

  if (!role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Check if already seeded
  const { count } = await db
    .from('agent_departments')
    .select('*', { count: 'exact', head: true })

  if ((count ?? 0) > 0) {
    return NextResponse.json({ ok: true, message: 'Already seeded', count })
  }

  // Insert departments
  const { data: depts, error: deptErr } = await db
    .from('agent_departments')
    .insert([
      { name: 'Research',      icon: '🔬', description: 'Market opportunity scanning and analysis' },
      { name: 'Distribution',  icon: '📡', description: 'Multi-channel content delivery pipeline' },
      { name: 'Chart Reading', icon: '📈', description: 'Technical analysis and pattern detection' },
      { name: 'Sales',         icon: '💼', description: 'Lead qualification and conversion' },
      { name: 'Support',       icon: '🎧', description: 'User query resolution and escalation' },
      { name: 'Finance',       icon: '💰', description: 'Revenue tracking and financial operations' },
      { name: 'HR',            icon: '👥', description: 'Onboarding and feedback analysis' },
    ])
    .select()

  if (deptErr) return NextResponse.json({ error: `Departments: ${deptErr.message}` }, { status: 500 })

  const byName = Object.fromEntries((depts ?? []).map((d) => [d.name, d.id]))

  // Insert agents
  const agents = [
    // Research (4)
    { department_id: byName['Research'],     name: 'MarketScout',   role: 'Market Opportunity Scanner',   skills: ['NSE screener','sector rotation','OI analysis','F&O scanner'],           model: 'gemini-flash', status: 'idle' },
    { department_id: byName['Research'],     name: 'SectorSage',    role: 'Sector Rotation Analyst',      skills: ['sector heatmaps','FII/DII flow','thematic analysis','macro mapping'],    model: 'gemini-flash', status: 'idle' },
    { department_id: byName['Research'],     name: 'ChartMind',     role: 'Technical Pattern Engine',     skills: ['candlestick patterns','EMA/SMA','RSI/MACD','Fibonacci','volume profile'], model: 'gemini-flash', status: 'idle' },
    { department_id: byName['Research'],     name: 'NewsRadar',     role: 'News Sentiment Processor',     skills: ['NLP','event extraction','sentiment scoring','breaking news triage'],     model: 'gemini-flash', status: 'idle' },
    // Distribution (3)
    { department_id: byName['Distribution'], name: 'TeleBot',      role: 'Telegram Channel Publisher',   skills: ['Telegram Bot API','markdown formatting','channel scheduling'],         model: 'gemini-flash', status: 'idle' },
    { department_id: byName['Distribution'], name: 'WhatsAppBeam', role: 'WhatsApp Delivery Agent',      skills: ['AiSensy API','template messages','delivery confirmation'],             model: 'gemini-flash', status: 'idle' },
    { department_id: byName['Distribution'], name: 'MailCraft',    role: 'Email Broadcast Agent',        skills: ['Resend API','HTML templates','subscriber segmentation','A/B subject'], model: 'gemini-flash', status: 'idle' },
    // Chart Reading (3)
    { department_id: byName['Chart Reading'], name: 'PatternHunter', role: 'Chart Pattern Detector',      skills: ['Head & Shoulders','Double top/bottom','Flags','Wedges','Triangles'],   model: 'gemini-flash', status: 'idle' },
    { department_id: byName['Chart Reading'], name: 'LevelMapper',   role: 'Support / Resistance Finder', skills: ['horizontal levels','pivot points','OI buildup zones','VWAP bands'],    model: 'gemini-flash', status: 'idle' },
    { department_id: byName['Chart Reading'], name: 'TrendOracle',   role: 'Trend Direction Analyzer',    skills: ['multi-timeframe','EMA stacks','ADX','price structure','higher highs'], model: 'gemini-flash', status: 'idle' },
    // Sales (3)
    { department_id: byName['Sales'],    name: 'LeadSense',    role: 'Lead Qualification Agent',  skills: ['CRM integration','lead scoring','intent signals','UTM tracking'],        model: 'gemini-flash', status: 'idle' },
    { department_id: byName['Sales'],    name: 'ConvertMax',   role: 'Conversion Optimizer',      skills: ['funnel analysis','drop-off detection','A/B insights','pricing nudge'],    model: 'gemini-flash', status: 'idle' },
    { department_id: byName['Sales'],    name: 'UpgradeNudge', role: 'Upsell Opportunity Agent',  skills: ['tier gap analysis','upgrade triggers','personalised outreach drafting'],  model: 'gemini-flash', status: 'idle' },
    // Support (2)
    { department_id: byName['Support'],  name: 'QueryBot',    role: 'User Query Resolver',       skills: ['FAQ matching','context-aware replies','escalation detection','tickets'],   model: 'gemini-flash', status: 'idle' },
    { department_id: byName['Support'],  name: 'EscalateAI', role: 'Complex Issue Manager',     skills: ['sentiment escalation','priority scoring','SLA tracking','SEBI routing'],  model: 'gemini-flash', status: 'idle' },
    // Finance (2)
    { department_id: byName['Finance'],  name: 'RevenueTrack', role: 'Revenue Metrics Tracker',    skills: ['MRR/ARR calc','churn signals','Razorpay API','cohort reporting'],       model: 'gemini-flash', status: 'idle' },
    { department_id: byName['Finance'],  name: 'TaxBot',       role: 'Tax & Compliance Assistant', skills: ['GST calculation','invoice generation','TDS computation','AY mapping'], model: 'gemini-flash', status: 'idle' },
    // HR (2)
    { department_id: byName['HR'],       name: 'OnboardBot',   role: 'New User Onboarding Agent', skills: ['welcome sequence','drip emails','activation milestones','progress nudge'], model: 'gemini-flash', status: 'idle' },
    { department_id: byName['HR'],       name: 'FeedbackLens', role: 'User Feedback Analyzer',   skills: ['NPS scoring','review sentiment','churn risk tagging','insight summary'],  model: 'gemini-flash', status: 'idle' },
  ]

  const { error: agentErr } = await db.from('agents').insert(agents)
  if (agentErr) return NextResponse.json({ error: `Agents: ${agentErr.message}` }, { status: 500 })

  return NextResponse.json({ ok: true, departments: depts?.length ?? 0, agents: agents.length })
}
