import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-check'

export async function GET(req: NextRequest) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  const mode = req.nextUrl.searchParams.get('mode')

  if (mode === 'user') {
    const res = NextResponse.redirect(new URL('/dashboard', req.url))
    // Non-httpOnly so dashboard layout (client component) can read it too
    res.cookies.set('admin_view_mode', 'user', {
      path: '/',
      maxAge: 8 * 60 * 60,
      sameSite: 'strict',
      secure: true,
    })
    return res
  }

  // mode === 'admin' or anything else → clear cookie, back to admin
  const res = NextResponse.redirect(new URL('/admin/signals', req.url))
  res.cookies.set('admin_view_mode', '', { path: '/', maxAge: 0 })
  return res
}
