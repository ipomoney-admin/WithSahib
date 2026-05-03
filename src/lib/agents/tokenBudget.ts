import { createServiceRoleClient } from '@/lib/supabase/server'

const DAILY_LIMIT = 1_000_000 // Gemini Flash free tier

export interface TokenBudgetStatus {
  tokensUsed: number
  limit: number
  pct: number
  status: 'healthy' | 'warning' | 'critical'
  date: string
}

export async function getTokenBudgetStatus(): Promise<TokenBudgetStatus> {
  const db = createServiceRoleClient()
  const today = new Date().toISOString().split('T')[0] ?? new Date().toISOString().substring(0, 10)

  const { data } = await db
    .from('token_usage')
    .select('tokens_in, tokens_out')
    .eq('date', today)

  const tokensUsed = (data ?? []).reduce(
    (sum, r) => sum + (r.tokens_in ?? 0) + (r.tokens_out ?? 0),
    0
  )

  const pct = Math.min(100, Math.round((tokensUsed / DAILY_LIMIT) * 100))
  const status: 'healthy' | 'warning' | 'critical' = pct >= 95 ? 'critical' : pct >= 80 ? 'warning' : 'healthy'

  return { tokensUsed, limit: DAILY_LIMIT, pct, status, date: today }
}

// Called by agent orchestrator before each task. Returns false if budget is exhausted.
export async function checkBudgetAllowsRun(agentId: string, priority: 'critical' | 'normal' = 'normal'): Promise<boolean> {
  const budget = await getTokenBudgetStatus()

  if (budget.status === 'critical' && priority !== 'critical') {
    // Halt non-critical agents at 95%+
    await notifyBudgetAlert(budget)
    return false
  }

  if (budget.status === 'warning' && priority === 'normal') {
    // Switch lower-priority agents to idle at 80%+
    const db = createServiceRoleClient()
    await db.from('agents').update({ status: 'idle' }).eq('id', agentId)
    return false
  }

  return true
}

async function notifyBudgetAlert(budget: TokenBudgetStatus) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  const msg = `⚠️ *Token Budget Alert*\nUsage: ${budget.pct}% (${budget.tokensUsed.toLocaleString()} / ${budget.limit.toLocaleString()} tokens)\nAll non-critical agents halted for today.`

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' }),
  }).catch(() => null)
}
