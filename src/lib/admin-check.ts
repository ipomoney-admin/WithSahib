import { createServiceRoleClient } from '@/lib/supabase/server'

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('admin_roles')
    .select('id')
    .eq('user_id', userId)
    .single()
  return !!data
}

export async function isSuperAdmin(userId: string): Promise<boolean> {
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  return data?.role === 'super_admin'
}

export async function getAdminRole(userId: string): Promise<'super_admin' | 'viewer_admin' | null> {
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  return (data?.role as 'super_admin' | 'viewer_admin') ?? null
}
