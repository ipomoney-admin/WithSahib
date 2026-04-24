import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceRoleClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Accepts both Vercel cron pattern (Authorization: Bearer <secret>)
// and the legacy x-cron-secret header used in manual calls.
function cronGuard(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const bearer = req.headers.get('authorization')
  if (bearer === `Bearer ${secret}`) return true
  if (req.headers.get('x-cron-secret') === secret) return true
  return false
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

  const appId = process.env.FYERS_APP_ID
  const secretKey = process.env.FYERS_SECRET_KEY
  const mpin = process.env.FYERS_MPIN

  if (!appId || !secretKey) {
    return NextResponse.json({ success: false, error: 'FYERS_APP_ID or FYERS_SECRET_KEY not set' }, { status: 500 })
  }

  if (!mpin) {
    await sendTelegramAlert(`⚠️ *Fyers Token Refresh Failed*\n\nFYERS_MPIN env var is not set. Cannot auto-renew token.`)
    return NextResponse.json({ success: false, error: 'FYERS_MPIN not configured' }, { status: 500 })
  }

  const supabase = createServiceRoleClient()

  const { data: tokenRow } = await supabase
    .from('fyers_tokens')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!tokenRow) {
    await sendTelegramAlert(`⚠️ *Fyers Token Refresh Failed*\n\nNo token found in database. Please re-authenticate at withsahib.com/admin/settings`)
    return NextResponse.json({ success: false, error: 'No token found in database' }, { status: 404 })
  }

  if (!tokenRow.refresh_token) {
    await sendTelegramAlert(`⚠️ *Fyers Token Refresh Failed*\n\nNo refresh_token stored. Please re-authenticate at withsahib.com/admin/settings`)
    return NextResponse.json({ success: false, error: 'No refresh_token stored' }, { status: 400 })
  }

  // Fyers requires SHA256(appId:secretKey) as appIdHash
  const appIdHash = crypto.createHash('sha256').update(`${appId}:${secretKey}`).digest('hex')

  let json: Record<string, unknown>
  try {
    const res = await fetch('https://api-t2.fyers.in/api/v3/validate-refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        appIdHash,
        refresh_token: tokenRow.refresh_token,
        pin: mpin,
      }),
    })

    const rawText = await res.text()
    try {
      json = JSON.parse(rawText) as Record<string, unknown>
    } catch {
      console.error('[fyers/refresh-token] non-JSON response:', rawText.slice(0, 300))
      await sendTelegramAlert(`⚠️ *Fyers Token Refresh Failed*\n\nFyers returned a non-JSON response. Please re-authenticate.`)
      return NextResponse.json({ success: false, error: 'Fyers returned non-JSON' }, { status: 502 })
    }

    if (!res.ok || json['code'] !== 200 || !json['access_token']) {
      const msg = String(json['message'] ?? json['code'] ?? 'unknown error')
      console.error('[fyers/refresh-token] refresh failed:', json)

      void supabase.from('admin_alerts').insert({
        type: 'token_expired',
        message: `Fyers token refresh failed: ${msg}`,
        data: { response: json },
      })

      await sendTelegramAlert(`⚠️ *Fyers Token Refresh Failed*\n\n${msg}\n\nPlease re-authenticate at withsahib.com/admin/settings`)
      return NextResponse.json({ success: false, error: msg }, { status: 400 })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error'
    console.error('[fyers/refresh-token] fetch error:', message)

    void supabase.from('admin_alerts').insert({
      type: 'system_error',
      message: `Fyers token refresh exception: ${message}`,
    })

    await sendTelegramAlert(`⚠️ *Fyers Token Refresh Error*\n\n${message}`)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }

  // Token refreshed — update DB. New access_token valid for ~24h.
  const expiresAt = new Date(Date.now() + 23.5 * 60 * 60 * 1000).toISOString()

  const { error: updateError } = await supabase
    .from('fyers_tokens')
    .update({
      access_token: json['access_token'] as string,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tokenRow.id)

  if (updateError) {
    console.error('[fyers/refresh-token] DB update error:', updateError)
    return NextResponse.json({ success: false, error: 'DB update failed' }, { status: 500 })
  }

  console.log('[fyers/refresh-token] token renewed, expires at', expiresAt)
  return NextResponse.json({ success: true, data: { expires_at: expiresAt } })
}
