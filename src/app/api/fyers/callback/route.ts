import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('auth_code')
  const state = searchParams.get('state')

  const settingsUrl = new URL('/admin/settings', req.url)

  if (state !== 'withsahib_admin' || !code) {
    console.error('[fyers-callback] invalid state or missing code', { state, hasCode: !!code })
    settingsUrl.searchParams.set('fyers', 'error')
    settingsUrl.searchParams.set('reason', 'invalid_state_or_code')
    return NextResponse.redirect(settingsUrl)
  }

  const appId = process.env.FYERS_APP_ID
  const secretKey = process.env.FYERS_SECRET_KEY

  if (!appId || !secretKey) {
    console.error('[fyers-callback] missing FYERS_APP_ID or FYERS_SECRET_KEY')
    settingsUrl.searchParams.set('fyers', 'error')
    settingsUrl.searchParams.set('reason', 'missing_fyers_env')
    return NextResponse.redirect(settingsUrl)
  }

  // Step 1: compute appIdHash
  let appIdHash: string
  try {
    const hashInput = `${appId}:${secretKey}`
    appIdHash = crypto.createHash('sha256').update(hashInput).digest('hex')
  } catch (err) {
    console.error('[fyers-callback] hash computation failed:', err)
    settingsUrl.searchParams.set('fyers', 'error')
    settingsUrl.searchParams.set('reason', 'hash_failed')
    return NextResponse.redirect(settingsUrl)
  }

  // Step 2: exchange auth code for access token
  let json: Record<string, unknown>
  try {
    const res = await fetch('https://api-t1.fyers.in/api/v3/validate-authcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'authorization_code', appIdHash, code }),
    })
    const rawText = await res.text()
    try {
      json = JSON.parse(rawText)
    } catch {
      console.error('[fyers-callback] fyers returned non-JSON (HTML/text):', rawText.substring(0, 500))
      settingsUrl.searchParams.set('fyers', 'error')
      settingsUrl.searchParams.set('reason', 'fyers_returned_html')
      return NextResponse.redirect(settingsUrl)
    }

    if (!res.ok || json.code !== 200 || !json.access_token) {
      settingsUrl.searchParams.set('fyers', 'error')
      settingsUrl.searchParams.set('reason', String(json.message ?? json.code ?? 'token_exchange_failed'))
      return NextResponse.redirect(settingsUrl)
    }
  } catch (err) {
    console.error('[fyers-callback] token exchange fetch failed:', err)
    settingsUrl.searchParams.set('fyers', 'error')
    settingsUrl.searchParams.set('reason', 'fetch_failed')
    return NextResponse.redirect(settingsUrl)
  }

  // Step 3: store token in Supabase
  try {
    const supabase = createServiceRoleClient()
    const expiresAt = new Date(Date.now() + 23.5 * 60 * 60 * 1000).toISOString()

    const { error: deleteError } = await supabase
      .from('fyers_tokens')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    if (deleteError) console.error('[fyers-callback] delete error:', deleteError)

    const { error: insertError } = await supabase.from('fyers_tokens').insert({
      access_token: json.access_token,
      refresh_token: (json.refresh_token as string) ?? null,
      expires_at: expiresAt,
    })
    if (insertError) {
      console.error('[fyers-callback] insert error:', insertError)
      settingsUrl.searchParams.set('fyers', 'error')
      settingsUrl.searchParams.set('reason', 'db_insert_failed')
      return NextResponse.redirect(settingsUrl)
    }
  } catch (err) {
    console.error('[fyers-callback] supabase operation failed:', err)
    settingsUrl.searchParams.set('fyers', 'error')
    settingsUrl.searchParams.set('reason', 'db_error')
    return NextResponse.redirect(settingsUrl)
  }

  settingsUrl.searchParams.set('fyers', 'connected')
  return NextResponse.redirect(settingsUrl)
}
