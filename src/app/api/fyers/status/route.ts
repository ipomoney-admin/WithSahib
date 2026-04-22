import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'

export async function GET(req: NextRequest) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('fyers_tokens')
    .select('access_token, expires_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) {
    return NextResponse.json({ success: true, data: { connected: false, expires_at: null, time_remaining_mins: 0 } })
  }

  const expiresAt = new Date(data.expires_at)
  const now = new Date()
  const connected = expiresAt > now
  const timeRemainingMins = connected ? Math.floor((expiresAt.getTime() - now.getTime()) / 60000) : 0

  return NextResponse.json({
    success: true,
    data: { connected, expires_at: data.expires_at, time_remaining_mins: timeRemainingMins },
  })
}
