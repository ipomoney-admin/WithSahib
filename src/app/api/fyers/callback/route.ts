import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('auth_code')
  const state = searchParams.get('state')

  const settingsUrl = new URL('/admin/settings', req.url)

  if (state !== 'withsahib_admin' || !code) {
    settingsUrl.searchParams.set('fyers', 'error')
    return NextResponse.redirect(settingsUrl)
  }

  const appId = process.env.FYERS_APP_ID
  const secretKey = process.env.FYERS_SECRET_KEY

  if (!appId || !secretKey) {
    settingsUrl.searchParams.set('fyers', 'error')
    return NextResponse.redirect(settingsUrl)
  }

  try {
    // Fyers v3: appIdHash = SHA256(appId:secretKey) in hex
    const hashInput = `${appId}:${secretKey}`
    const appIdHash = crypto.createHash('sha256').update(hashInput).digest('hex')

    console.log('[fyers-callback] appId:', appId)
    console.log('[fyers-callback] appIdHash:', appIdHash)

    const res = await fetch('https://api-t2.fyers.in/api/v3/validate-authcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'authorization_code', appIdHash, code }),
    })

    const json = await res.json()
    console.log('[fyers-callback] fyers response:', JSON.stringify(json))

    if (!res.ok || json.code !== 200 || !json.access_token) {
      settingsUrl.searchParams.set('fyers', 'error')
      settingsUrl.searchParams.set('reason', json.message ?? json.code ?? 'unknown')
      return NextResponse.redirect(settingsUrl)
    }

    const supabase = createServiceRoleClient()

    // expires_at: 23.5 hours from now (Fyers tokens expire ~24h)
    const expiresAt = new Date(Date.now() + 23.5 * 60 * 60 * 1000).toISOString()

    // Delete stale tokens, insert fresh one
    await supabase.from('fyers_tokens').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('fyers_tokens').insert({
      access_token: json.access_token,
      refresh_token: json.refresh_token ?? null,
      expires_at: expiresAt,
    })

    settingsUrl.searchParams.set('fyers', 'connected')
    return NextResponse.redirect(settingsUrl)
  } catch {
    settingsUrl.searchParams.set('fyers', 'error')
    return NextResponse.redirect(settingsUrl)
  }
}
