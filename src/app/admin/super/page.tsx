import { redirect } from 'next/navigation'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/admin-check'
import { Users, CreditCard, TrendingUp, Activity, ShieldCheck, Database } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SuperAdminPage() {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user || !(await isSuperAdmin(user.id))) {
    redirect('/admin/signals')
  }

  const supabase = createServiceRoleClient()

  const [
    { count: userCount },
    { count: subCount },
    { data: recentSubs },
    { data: auditLog },
    { data: fyersStatus },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('subscriptions')
      .select('user_id, tier, status, billing_cycle, price_paid, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('notifications')
      .select('id, title, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase.from('settings').select('value').eq('key', 'fyers_token_valid_until').single(),
  ])

  const { data: tierBreakdown } = await supabase
    .from('users')
    .select('tier')
    .not('tier', 'eq', 'free')

  const tierCounts: Record<string, number> = {}
  for (const row of tierBreakdown ?? []) {
    const t = row.tier ?? 'free'
    tierCounts[t] = (tierCounts[t] ?? 0) + 1
  }

  const monthlyRevenue = (recentSubs ?? [])
    .filter((s) => s.billing_cycle === 'monthly')
    .reduce((acc, s) => acc + Math.round((s.price_paid ?? 0) / 100), 0)

  const fyersTokenExpiry = fyersStatus?.value
  const fyersOk = fyersTokenExpiry
    ? new Date(fyersTokenExpiry as string) > new Date()
    : false

  const TIER_COLOR: Record<string, string> = {
    basic: '#8FA8C0',
    pro: '#00C896',
    elite: '#D4A843',
  }

  return (
    <div style={{ padding: '32px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
          Super Admin
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text3)' }}>Platform overview and system health</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { icon: Users, label: 'Total Users', value: userCount ?? 0, color: '#8FA8C0' },
          { icon: CreditCard, label: 'Active Subscribers', value: subCount ?? 0, color: '#00C896' },
          { icon: TrendingUp, label: 'Positional', value: tierCounts['basic'] ?? 0, color: TIER_COLOR['basic'] },
          { icon: TrendingUp, label: 'Pro', value: tierCounts['pro'] ?? 0, color: TIER_COLOR['pro'] },
          { icon: TrendingUp, label: 'Elite', value: tierCounts['elite'] ?? 0, color: TIER_COLOR['elite'] },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '20px',
            }}
          >
            <Icon size={18} color={color} style={{ marginBottom: '10px' }} />
            <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{value.toLocaleString()}</p>
            <p style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* System status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {/* Fyers status */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Activity size={16} color="var(--text3)" />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Fyers API Status</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: fyersOk ? '#00C896' : '#F47B7B', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: fyersOk ? '#00C896' : '#F47B7B', fontWeight: 500 }}>
              {fyersOk ? 'Token valid' : 'Token expired / missing'}
            </span>
          </div>
          {fyersTokenExpiry && (
            <p style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '8px' }}>
              Expires: {new Date(fyersTokenExpiry as string).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
            </p>
          )}
          {!fyersOk && (
            <a
              href="/admin/settings"
              style={{ display: 'inline-block', marginTop: '12px', fontSize: '12px', color: '#00C896', textDecoration: 'none' }}
            >
              → Re-authenticate in Settings
            </a>
          )}
        </div>

        {/* DB status */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Database size={16} color="var(--text3)" />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Database</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00C896', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#00C896', fontWeight: 500 }}>Supabase connected</span>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Users: {(userCount ?? 0).toLocaleString()} rows</p>
            <p style={{ fontSize: '12px', color: 'var(--text3)' }}>Active subs: {(subCount ?? 0).toLocaleString()} rows</p>
          </div>
        </div>
      </div>

      {/* Recent subscriptions */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <ShieldCheck size={16} color="var(--text3)" />
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Recent Subscriptions</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {['User ID', 'Tier', 'Cycle', 'Amount', 'Date'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px 8px 0', color: 'var(--text3)', fontWeight: 500, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentSubs ?? []).map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 12px 10px 0', color: 'var(--text3)', fontFamily: 'Courier New, monospace', fontSize: '11px' }}>
                    {s.user_id?.slice(0, 12)}…
                  </td>
                  <td style={{ padding: '10px 12px 10px 0' }}>
                    <span style={{ color: TIER_COLOR[s.tier] ?? 'var(--text)', fontWeight: 600, textTransform: 'capitalize' }}>
                      {s.tier}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px 10px 0', color: 'var(--text3)', textTransform: 'capitalize' }}>{s.billing_cycle}</td>
                  <td style={{ padding: '10px 12px 10px 0', color: 'var(--text)' }}>
                    ₹{Math.round((s.price_paid ?? 0) / 100).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '10px 12px 10px 0', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                    {s.created_at ? new Date(s.created_at).toLocaleDateString('en-IN') : '—'}
                  </td>
                </tr>
              ))}
              {(recentSubs ?? []).length === 0 && (
                <tr><td colSpan={5} style={{ padding: '20px 0', color: 'var(--text3)', textAlign: 'center' }}>No subscriptions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Activity size={16} color="var(--text3)" />
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Recent System Notifications</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(auditLog ?? []).map((n) => (
            <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '2px' }}>{n.title}</p>
                <p style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'Courier New, monospace' }}>{n.user_id?.slice(0, 14)}…</p>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text3)', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                {n.created_at ? new Date(n.created_at).toLocaleDateString('en-IN') : '—'}
              </p>
            </div>
          ))}
          {(auditLog ?? []).length === 0 && (
            <p style={{ fontSize: '13px', color: 'var(--text3)', textAlign: 'center', padding: '20px 0' }}>No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )
}
