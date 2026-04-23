import { cache } from 'react'
import { createServiceRoleClient } from '@/lib/supabase/server'

export const isAdmin = cache(async (userId: string): Promise<boolean> => {
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('admin_roles')
    .select('id')
    .eq('user_id', userId)
    .single()
  return !!data
})

export const isSuperAdmin = cache(async (userId: string): Promise<boolean> => {
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  return data?.role === 'super_admin'
})

export const getAdminRole = cache(async (userId: string): Promise<'super_admin' | 'viewer_admin' | null> => {
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  return (data?.role as 'super_admin' | 'viewer_admin') ?? null
})
