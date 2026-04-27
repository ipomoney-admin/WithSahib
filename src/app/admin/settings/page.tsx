import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'
import { getAdminRole } from '@/lib/admin-check'
import { CheckCircle, XCircle, Wifi, Shield, Database, Bell } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Settings | Admin — withSahib',
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 8, height: 8, borderRadius: '50%',
      background: ok ? '#00C896' : '#EF4444',
      flexShrink: 0,
    }} />
  )
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: { fyers?: string; reason?: string }
}) {
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/auth/login')

  const role = await getAdminRole(user.id)
  if (!role) redirect('/auth/login')

  const supabase = createServiceRoleClient()

  // Fyers token — check if a valid (not expired) token exists
  const now = new Date().toISOString()
  const { data: fyersToken } = await supabase
    .from('fyers_tokens')
    .select('expires_at, access_token')
    .gt('expires_at', now)
    .order('expires_at', { ascending: false })
    .limit(1)
    .single()

  const fyersConnected = !!fyersToken?.access_token

  // Telegram and AiSensy — check env vars server-side
  const telegramConnected = !!(
    process.env.TELEGRAM_BOT_TOKEN &&
    process.env.TELEGRAM_BOT_TOKEN !== 'PLACEHOLDER'
  )
  const aiSensyConnected = !!(
    process.env.AISENSY_API_KEY &&
    process.env.AISENSY_API_KEY !== 'PLACEHOLDER'
  )
  const razorpayConnected = !!(
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_ID !== 'PLACEHOLDER'
  )

  const integrations = [
    {
      name: 'Fyers API',
      description: 'Market data & order management',
      icon: Wifi,
      connected: fyersConnected,
      detail: fyersConnected
        ? `Token valid until ${new Date(fyersToken!.expires_at!).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })} IST`
        : 'Not connected — visit myapi.fyers.in to set up',
      setupPath: 'myapi.fyers.in → create app → add FYERS_APP_ID + FYERS_SECRET_KEY in Vercel',
    },
    {
      name: 'Telegram Bot',
      description: 'Signal distribution to free & paid channels',
      icon: Bell,
      connected: telegramConnected,
      detail: telegramConnected
        ? 'Bot token configured'
        : 'Not configured — add TELEGRAM_BOT_TOKEN to Vercel env vars',
      setupPath: '@BotFather → /newbot → copy token → add to Vercel',
    },
    {
      name: 'AiSensy WhatsApp',
      description: 'WhatsApp signal broadcasting',
      icon: Bell,
      connected: aiSensyConnected,
      detail: aiSensyConnected
        ? 'API key configured'
        : 'Not configured — add AISENSY_API_KEY to Vercel env vars',
      setupPath: 'aisensy.com → create account → copy API key → add to Vercel',
    },
    {
      name: 'Razorpay',
      description: 'Subscription payments',
      icon: Shield,
      connected: razorpayConnected,
      detail: razorpayConnected
        ? 'Keys configured'
        : 'Not configured — account pending approval',
      setupPath: 'razorpay.com → get RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET → add to Vercel',
    },
  ]

  const fyersToast = searchParams.fyers

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 32px 64px' }}>
      {/* Fyers OAuth toast */}
      {fyersToast === 'connected' && (
        <div style={{
          marginBottom: 24,
          padding: '12px 18px',
          borderRadius: 10,
          background: 'rgba(0,200,150,0.1)',
          border: '1px solid rgba(0,200,150,0.25)',
          color: '#00C896',
          fontSize: 13,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <CheckCircle size={16} />
          Fyers connected successfully. Token is valid for ~23.5 hours.
        </div>
      )}
      {fyersToast === 'error' && (
        <div style={{
          marginBottom: 24,
          padding: '12px 18px',
          borderRadius: 10,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          color: '#EF4444',
          fontSize: 13,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <XCircle size={16} />
          Fyers connection failed. Check that FYERS_APP_ID, FYERS_SECRET_KEY, and FYERS_REDIRECT_URI are set in Vercel.
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#00C896', textTransform: 'uppercase', marginBottom: 6 }}>
          Settings
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-body)', margin: 0 }}>
          Platform Settings
        </h1>
      </div>

      {/* ── INTEGRATION STATUS ── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '0 0 16px' }}>
          Integration Status
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {integrations.map(({ name, description, icon: Icon, connected, detail, setupPath }) => (
            <div
              key={name}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${connected ? 'rgba(0,200,150,0.2)' : 'var(--border)'}`,
                borderRadius: 12,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
              }}
            >
              {/* Icon */}
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: connected ? 'rgba(0,200,150,0.1)' : 'rgba(107,138,170,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} color={connected ? '#00C896' : 'var(--text3)'} />
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <StatusDot ok={connected} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{name}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: '1px 6px', borderRadius: 4,
                    background: connected ? 'rgba(0,200,150,0.12)' : 'rgba(239,68,68,0.1)',
                    color: connected ? '#00C896' : '#EF4444',
                  }}>
                    {connected ? 'CONNECTED' : 'NOT CONNECTED'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>{description}</div>
                <div style={{ fontSize: 12, color: connected ? 'var(--text2)' : 'var(--text3)' }}>{detail}</div>
                {!connected && name === 'Fyers API' ? (
                  <a
                    href="/api/fyers/auth"
                    style={{
                      display: 'inline-block',
                      marginTop: 10,
                      padding: '7px 16px',
                      borderRadius: 8,
                      background: '#00C896',
                      color: '#06090F',
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: 'none',
                      letterSpacing: 0.3,
                    }}
                  >
                    Connect Fyers
                  </a>
                ) : !connected && (
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4, fontStyle: 'italic' }}>
                    Setup: {setupPath}
                  </div>
                )}
              </div>

              {/* Status icon */}
              <div style={{ flexShrink: 0 }}>
                {connected
                  ? <CheckCircle size={18} color="#00C896" />
                  : <XCircle size={18} color="#EF4444" />
                }
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLATFORM INFO ── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '0 0 16px' }}>
          Platform Information
        </h2>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {[
            { label: 'Platform', value: 'withSahib — withsahib.com' },
            { label: 'SEBI Registration', value: 'INH000026266' },
            { label: 'Registered Analyst', value: 'Sahib Singh Hora' },
            { label: 'Valid Period', value: 'Apr 20, 2026 – Apr 19, 2031' },
            { label: 'Entity', value: 'Altitans Intelligence Private Limited' },
            { label: 'CIN', value: 'U62011MP2026PTC083080' },
            { label: 'Address', value: '86/2 Prem Nagar, Madan Mahal, Jabalpur, MP 482001' },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 20px',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(26,35,51,0.6)' : 'none',
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--text3)', width: 160, flexShrink: 0 }}>{label}</div>
              <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CURRENT SESSION ── */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '0 0 16px' }}>
          Current Session
        </h2>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {[
            { label: 'User', value: user.email ?? '—' },
            { label: 'User ID', value: user.id },
            { label: 'Role', value: role === 'super_admin' ? 'Super Admin' : 'Viewer Admin' },
            { label: 'Email verified', value: user.email_confirmed_at ? 'Yes' : 'No' },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 20px',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(26,35,51,0.6)' : 'none',
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--text3)', width: 160, flexShrink: 0 }}>{label}</div>
              <div style={{
                fontSize: label === 'User ID' ? 11 : 13,
                color: label === 'Role' ? '#00C896' : 'var(--text)',
                fontWeight: label === 'Role' ? 600 : 400,
                fontFamily: label === 'User ID' ? 'monospace' : 'inherit',
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ENVIRONMENT CHECKLIST ── */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '0 0 16px' }}>
          Required Environment Variables
        </h2>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.8 }}>
            {[
              { key: 'NEXT_PUBLIC_SUPABASE_URL', required: true },
              { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true },
              { key: 'SUPABASE_SERVICE_ROLE_KEY', required: true },
              { key: 'CRON_SECRET', required: true },
              { key: 'ANTHROPIC_API_KEY', required: true },
              { key: 'RESEND_API_KEY', required: false },
              { key: 'FYERS_APP_ID', required: false },
              { key: 'FYERS_SECRET_KEY', required: false },
              { key: 'TELEGRAM_BOT_TOKEN', required: false },
              { key: 'TELEGRAM_FREE_CHANNEL_ID', required: false },
              { key: 'TELEGRAM_PAID_CHANNEL_ID', required: false },
              { key: 'AISENSY_API_KEY', required: false },
              { key: 'RAZORPAY_KEY_ID', required: false },
              { key: 'RAZORPAY_KEY_SECRET', required: false },
            ].map(({ key, required }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Database size={11} color="var(--text3)" />
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text2)' }}>{key}</span>
                <span style={{
                  fontSize: 9, padding: '1px 5px', borderRadius: 3,
                  background: required ? 'rgba(239,68,68,0.1)' : 'rgba(107,138,170,0.1)',
                  color: required ? '#EF4444' : 'var(--text3)',
                  fontWeight: 600, letterSpacing: 0.5,
                }}>
                  {required ? 'REQUIRED' : 'OPTIONAL'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
