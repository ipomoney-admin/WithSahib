import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

function cronGuard(req: NextRequest): boolean {
  return req.headers.get('x-cron-secret') === process.env.CRON_SECRET
}

function esc(s: string): string {
  return s.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
}

async function sendTelegram(chatId: string, message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'MarkdownV2' }),
  }).catch(() => {})
}

export async function GET(req: NextRequest) {
  if (!cronGuard(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceRoleClient()
  const todayIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000)
  const dateStr = todayIST.toISOString().split('T')[0]

  const { data: todaySignals } = await supabase
    .from('signals')
    .select('*')
    .gte('published_at', `${dateStr}T00:00:00.000Z`)
    .not('status', 'eq', 'open')

  const now = todayIST
  const month = now.getUTCMonth() + 1
  const year = now.getUTCFullYear()

  const { data: monthPerf } = await supabase
    .from('performance_summary')
    .select('*')
    .eq('month', month)
    .eq('year', year)
    .is('segment', null)
    .single()

  const signals = todaySignals ?? []
  const wins = signals.filter((s) => ['t1_hit', 't2_hit', 't3_hit'].includes(s.status))
  const losses = signals.filter((s) => s.status === 'sl_hit')

  const dateLabel = todayIST.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const winLines = wins
    .map((s) => `✅ ${esc(`${s.status.replace('_hit', '').toUpperCase()} Hit`)}: ${esc(s.scrip)}`)
    .join('\n')

  const lossLines = losses
    .map((s) => `❌ SL Hit: ${esc(s.scrip)}`)
    .join('\n')

  const monthWinRate = monthPerf?.win_rate ?? 0
  const monthTotal = monthPerf?.total_calls ?? 0
  const monthWins = (monthPerf?.t1_hit ?? 0) + (monthPerf?.t2_hit ?? 0) + (monthPerf?.t3_hit ?? 0)

  const message = [
    `📊 *withSahib Daily Recap — ${esc(dateLabel)}*`,
    ``,
    `Calls Today: ${esc(String(signals.length))}`,
    wins.length > 0 ? winLines : null,
    losses.length > 0 ? lossLines : null,
    ``,
    `Month: Win Rate ${esc(String(monthWinRate))}% \\| ${esc(String(monthTotal))} calls \\| ${esc(String(monthWins))} hits`,
    ``,
    `🔒 Live signals: withsahib\\.com/pricing`,
    `SEBI RA: INH000026266 \\| Not investment advice`,
  ].filter((l) => l !== null).join('\n')

  const freeChannelId = process.env.TELEGRAM_FREE_CHANNEL_ID
  if (freeChannelId) {
    await sendTelegram(freeChannelId, message)
  }

  await supabase.from('intelligence_reports').insert({
    month,
    year,
    report_type: 'weekly',
    report_data: {
      type: 'daily_recap',
      date: dateStr,
      total_signals: signals.length,
      wins: wins.length,
      losses: losses.length,
      month_win_rate: monthWinRate,
    },
    key_insights: [`${wins.length} wins, ${losses.length} losses on ${dateStr}`],
    generated_at: new Date().toISOString(),
    delivered_to_telegram: !!freeChannelId,
  })

  return NextResponse.json({
    success: true,
    data: { date: dateStr, total: signals.length, wins: wins.length, losses: losses.length },
  })
}
