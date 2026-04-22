import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'

export async function GET(req: NextRequest) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
  }

  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('admin_alerts')
    .select('*')
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json({ success: true, data: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
  }

  const { ids } = await req.json()
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ success: false, error: 'ids array required' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()
  await supabase.from('admin_alerts').update({ is_read: true }).in('id', ids)

  return NextResponse.json({ success: true, data: { marked_read: ids.length } })
}
