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

  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const weekNumber = Math.ceil(now.getDate() / 7)
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const { data: weekSignals } = await supabase
    .from('signals')
    .select('*')
    .gte('published_at', oneWeekAgo.toISOString())
    .not('status', 'eq', 'open')

  const { data: monthPerf } = await supabase
    .from('performance_summary')
    .select('*')
    .eq('month', month)
    .eq('year', year)
    .is('segment', null)
    .single()

  const { data: postmortems } = await supabase
    .from('signal_postmortems')
    .select('*, signals!inner(scrip, segment, published_at)')
    .gte('created_at', oneWeekAgo.toISOString())

  const { data: mlModels } = await supabase
    .from('ml_models')
    .select('symbol, accuracy, training_samples, trained_at')
    .eq('status', 'active')
    .order('trained_at', { ascending: false })
    .limit(10)

  const signals = weekSignals ?? []
  const wins = signals.filter((s) => ['t1_hit', 't2_hit', 't3_hit'].includes(s.status))
  const losses = signals.filter((s) => s.status === 'sl_hit')

  // Best and worst symbols
  const symbolStats = new Map<string, { wins: number; losses: number }>()
  signals.forEach((s) => {
    if (!symbolStats.has(s.scrip)) symbolStats.set(s.scrip, { wins: 0, losses: 0 })
    const stat = symbolStats.get(s.scrip)!
    if (['t1_hit', 't2_hit', 't3_hit'].includes(s.status)) stat.wins++
    else if (s.status === 'sl_hit') stat.losses++
  })

  let bestSymbol = { symbol: 'N/A', winRate: 0 }
  let worstSymbol = { symbol: 'N/A', winRate: 100 }
  symbolStats.forEach((stats, symbol) => {
    const total = stats.wins + stats.losses
    if (total === 0) return
    const wr = (stats.wins / total) * 100
    if (wr > bestSymbol.winRate) bestSymbol = { symbol, winRate: wr }
    if (wr < worstSymbol.winRate) worstSymbol = { symbol, winRate: wr }
  })

  const reportData = {
    week_number: weekNumber,
    week_performance: {
      total_signals: signals.length,
      wins: wins.length,
      losses: losses.length,
      win_rate: signals.length > 0 ? ((wins.length / signals.length) * 100).toFixed(1) : '0',
    },
    best_symbol: bestSymbol,
    worst_symbol: worstSymbol,
    month_performance: monthPerf ?? {},
    ml_model_updates: (mlModels ?? []).map((m) => ({
      symbol: m.symbol ?? 'global',
      accuracy: m.accuracy,
      samples: m.training_samples,
    })),
    postmortem_count: (postmortems ?? []).length,
    failure_types: (postmortems ?? []).reduce<Record<string, number>>((acc, p) => {
      acc[p.failure_type] = (acc[p.failure_type] ?? 0) + 1
      return acc
    }, {}),
    recommendations: [
      losses.length > wins.length ? 'Consider tighter SL criteria for current market conditions' : null,
      bestSymbol.winRate > 70 ? `Focus on ${bestSymbol.symbol} setups — strong historical performance this week` : null,
      worstSymbol.winRate < 30 ? `Avoid ${worstSymbol.symbol} until pattern improves` : null,
    ].filter(Boolean),
  }

  await supabase.from('intelligence_reports').insert({
    week_number: weekNumber,
    month,
    year,
    report_type: 'weekly',
    report_data: reportData,
    key_insights: [
      `Week ${weekNumber}: ${wins.length}W/${losses.length}L (${reportData.week_performance.win_rate}% win rate)`,
      `Best: ${bestSymbol.symbol} | Worst: ${worstSymbol.symbol}`,
      `ML models active: ${(mlModels ?? []).length}`,
    ],
    recommendations: reportData.recommendations as string[],
    generated_at: now.toISOString(),
    delivered_to_telegram: false,
  })

  // Send to Sahib
  const sahibId = process.env.SAHIB_TELEGRAM_ID
  if (sahibId) {
    const message = [
      `📈 *withSahib Weekly Intelligence Report — Week ${esc(String(weekNumber))}*`,
      ``,
      `*Performance:* ${esc(String(wins.length))}W / ${esc(String(losses.length))}L`,
      `Win Rate: ${esc(reportData.week_performance.win_rate)}%`,
      ``,
      `*Best Symbol:* ${esc(bestSymbol.symbol)} \\(${esc(bestSymbol.winRate.toFixed(0))}% WR\\)`,
      `*Worst Symbol:* ${esc(worstSymbol.symbol)} \\(${esc(worstSymbol.winRate.toFixed(0))}% WR\\)`,
      ``,
      `*ML Models:* ${esc(String((mlModels ?? []).length))} active`,
      `*Postmortems:* ${esc(String((postmortems ?? []).length))} generated this week`,
      ``,
      `_SEBI RA: INH000026266_`,
    ].join('\n')

    await sendTelegram(sahibId, message)
    await supabase
      .from('intelligence_reports')
      .update({ delivered_to_telegram: true })
      .order('generated_at', { ascending: false })
      .limit(1)
  }

  return NextResponse.json({ success: true, data: reportData })
}
