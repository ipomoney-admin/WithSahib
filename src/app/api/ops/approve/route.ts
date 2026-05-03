import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceRoleClient()
  const { data: role } = await db
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'super_admin')
    .single()

  if (!role) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { approval_id, action, edited_content } = await req.json()
  if (!approval_id || !action) return NextResponse.json({ error: 'approval_id and action required' }, { status: 400 })
  if (!['approve', 'reject'].includes(action)) return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  const { data: item, error: fetchErr } = await db
    .from('approval_queue')
    .select('*')
    .eq('id', approval_id)
    .single()

  if (fetchErr || !item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updatePayload: Record<string, unknown> = {
    status: action === 'approve' ? 'approved' : 'rejected',
    decided_by: user.id,
    decided_at: new Date().toISOString(),
  }
  if (edited_content) updatePayload.content = edited_content

  const { error: updateErr } = await db
    .from('approval_queue')
    .update(updatePayload)
    .eq('id', approval_id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  // For approve: mark linked task as completed
  if (action === 'approve' && item.task_id) {
    await db
      .from('agent_tasks')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', item.task_id)
  }

  return NextResponse.json({ ok: true, action })
}
