import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

function cronGuard(req: NextRequest): boolean {
  return req.headers.get('x-cron-secret') === process.env.CRON_SECRET
}

async function sendWhatsApp(recipientPhone: string, message: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.AISENSY_API_KEY
  const campaignName = process.env.AISENSY_CAMPAIGN_NAME ?? 'withsahib_signal'

  if (!apiKey) return { ok: false, error: 'AiSensy API key not configured' }

  const res = await fetch('https://backend.aisensy.com/campaign/t1/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-aisensy-api-key': apiKey,
    },
    body: JSON.stringify({
      apiKey,
      campaignName,
      destination: recipientPhone,
      userName: 'withSahib',
      source: 'new-landing-page form',
      media: {},
      templateParams: [message],
      tags: ['signal'],
      attributes: {},
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => 'unknown')
    return { ok: false, error: `AiSensy ${res.status}: ${text}` }
  }
  return { ok: true }
}

async function sendTelegram(chatId: string, message: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return { ok: false, error: 'Telegram bot token not configured' }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'MarkdownV2',
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    return { ok: false, error: `Telegram ${res.status}: ${json.description ?? 'unknown'}` }
  }
  return { ok: true }
}

export async function GET(req: NextRequest) {
  if (!cronGuard(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceRoleClient()
  const { data: items } = await supabase
    .from('signal_push_queue')
    .select('*')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(50)

  if (!items || items.length === 0) {
    return NextResponse.json({ success: true, data: { processed: 0 } })
  }

  let sent = 0
  let failed = 0

  for (const item of items) {
    await supabase
      .from('signal_push_queue')
      .update({ attempted_at: new Date().toISOString() })
      .eq('id', item.id)

    let result: { ok: boolean; error?: string }

    if (item.channel === 'whatsapp') {
      result = await sendWhatsApp(item.recipient_id, item.message_content)
      // WhatsApp rate limit: 1 per 1.2 seconds
      await new Promise((r) => setTimeout(r, 1200))
    } else {
      result = await sendTelegram(item.recipient_id, item.message_content)
      await new Promise((r) => setTimeout(r, 50))
    }

    if (result.ok) {
      await supabase.from('signal_push_queue').update({
        status: 'sent',
        delivered_at: new Date().toISOString(),
      }).eq('id', item.id)
      sent++
    } else {
      const newRetryCount = (item.retry_count ?? 0) + 1
      const finalStatus = newRetryCount >= 3 ? 'failed' : 'queued'
      await supabase.from('signal_push_queue').update({
        status: finalStatus,
        retry_count: newRetryCount,
        failure_reason: result.error ?? 'Unknown',
      }).eq('id', item.id)
      failed++
    }
  }

  return NextResponse.json({ success: true, data: { processed: items.length, sent, failed } })
}
