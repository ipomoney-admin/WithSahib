import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  // Admin-only gate
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appId = process.env.FYERS_APP_ID
  const redirectUri = process.env.FYERS_REDIRECT_URI

  if (!appId || !redirectUri) {
    return NextResponse.redirect(
      new URL('/admin/settings?fyers=error&reason=missing_env', req.url)
    )
  }

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state: 'withsahib_admin',
  })

  const fyersAuthUrl = `https://api-t1.fyers.in/api/v3/generate-authcode?${params.toString()}`
  return NextResponse.redirect(fyersAuthUrl)
}
