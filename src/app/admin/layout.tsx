import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { Zap, BarChart2, Settings, Home, Eye, ScanSearch, ShieldCheck } from 'lucide-react'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isAdmin, isSuperAdmin } from '@/lib/admin-check'
import { isPasskeySessionValid } from '@/lib/webauthn'

export const dynamic = 'force-dynamic'

const NAV = [
  { label: 'Signals', href: '/admin/signals', icon: Zap },
  { label: 'Screener', href: '/admin/screener', icon: ScanSearch },
  { label: 'Intelligence', href: '/admin/intelligence', icon: BarChart2 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

// Passkey setup and verify pages must bypass the passkey check to avoid infinite redirect
const PASSKEY_ROUTES = ['/admin/passkey']

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) redirect('/auth/login')
  if (!(await isAdmin(user.id))) redirect('/auth/login')

  const superAdmin = await isSuperAdmin(user.id)

  const headersList = headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isPasskeyRoute = PASSKEY_ROUTES.some((p) => pathname.startsWith(p))

  if (!isPasskeyRoute) {
    const supabase = createServiceRoleClient()

    const { data: passkeys } = await supabase
      .from('admin_passkeys')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)

    const hasPasskeys = (passkeys?.length ?? 0) > 0
    if (!hasPasskeys) redirect('/admin/passkey')

    const cookieStore = cookies()
    if (!isPasskeySessionValid(cookieStore)) {
      const encodedRedirect = encodeURIComponent(pathname || '/admin/signals')
      redirect(`/admin/passkey/verify?redirect=${encodedRedirect}`)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        height: '100%',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderBottom: '1px solid var(--border)',
          gap: 10,
          flexShrink: 0,
        }}>
          <Zap size={18} color="#00C896" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#00C896', fontFamily: 'var(--font-body)' }}>
              Admin
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 1 }}>withSahib</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="sidebar-link"
              style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{label}</span>
            </Link>
          ))}

          {superAdmin && (
            <>
              <div style={{ height: 1, background: 'var(--border)', margin: '8px 6px' }} />
              <Link
                href="/admin/super"
                className="sidebar-link"
                style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <ShieldCheck size={14} strokeWidth={1.5} color="#D4A843" />
                <span style={{ fontSize: 12, color: '#D4A843' }}>Super Admin</span>
              </Link>
            </>
          )}

          <div style={{ height: 1, background: 'var(--border)', margin: '8px 6px' }} />

          <Link
            href="/api/admin/view-mode?mode=user"
            className="sidebar-link"
            style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <Eye size={14} strokeWidth={1.5} />
            <span style={{ fontSize: 12 }}>View as User</span>
          </Link>

          <Link
            href="/"
            className="sidebar-link"
            style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <Home size={14} strokeWidth={1.5} />
            <span style={{ fontSize: 12 }}>Back to site</span>
          </Link>
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
            SEBI RA · INH000026266
          </div>
          <div style={{
            fontSize: 11,
            color: 'var(--text3)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {user.email}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
