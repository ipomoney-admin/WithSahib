import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

function cronGuard(req: NextRequest): boolean {
  return req.headers.get('x-cron-secret') === process.env.CRON_SECRET
}

async function sendTelegramAlert(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.SAHIB_TELEGRAM_ID
  if (!token || !chatId) return

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
  }).catch(() => {})
}

export async function GET(req: NextRequest) {
  if (!cronGuard(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceRoleClient()

  const { data: tokenRow } = await supabase
    .from('fyers_tokens')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!tokenRow) {
    await supabase.from('admin_alerts').insert({
      type: 'token_expired',
      message: 'No Fyers token found in database',
    })
    return NextResponse.json({ success: false, error: 'No token found' }, { status: 404 })
  }

  const appId = process.env.FYERS_APP_ID
  const secretKey = process.env.FYERS_SECRET_KEY

  if (!appId || !secretKey) {
    return NextResponse.json({ success: false, error: 'Fyers credentials not configured' }, { status: 500 })
  }

  try {
    const res = await fetch('https://api-t2.fyers.in/api/v3/validate-refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${appId}:${tokenRow.access_token}`,
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        appIdHash: appId,
        refresh_token: tokenRow.refresh_token,
        pin: '',
      }),
    })

    const json = await res.json()

    if (!res.ok || json.code !== 200) {
      await supabase.from('admin_alerts').insert({
        type: 'token_expired',
        message: `Fyers token refresh failed: ${json.message ?? 'Unknown error'}`,
        data: { response: json },
      })
      await sendTelegramAlert(`⚠️ *Fyers Token Expired*\n\nRefresh failed. Please re-authenticate at withsahib.com/admin/settings`)
      return NextResponse.json({ success: false, error: json.message }, { status: 400 })
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    await supabase
      .from('fyers_tokens')
      .update({
        access_token: json.access_token,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tokenRow.id)

    return NextResponse.json({ success: true, data: { expires_at: expiresAt } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error'
    await supabase.from('admin_alerts').insert({
      type: 'system_error',
      message: `Fyers token refresh exception: ${message}`,
    })
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
