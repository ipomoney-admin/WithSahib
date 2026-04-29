import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Brand Assets — withSahib',
  description: 'Official brand assets, logo system, visiting card, and social media templates for withSahib.com.',
  robots: { index: false, follow: false },
}

// ─── COLOUR PALETTE ───────────────────────────────────────────────────────────
const COLORS = [
  { name: 'Orange',  hex: '#FF6B00', role: 'Primary CTA, dominant accent' },
  { name: 'Black',   hex: '#0A0A0A', role: 'Dark backgrounds' },
  { name: 'White',   hex: '#FAFAF7', role: 'Page backgrounds (light mode)' },
  { name: 'Cream',   hex: '#F5F3EE', role: 'Surface cards (light mode)' },
  { name: 'Green',   hex: '#1A7A4A', role: 'Logo "Sahib" text, success states' },
  { name: 'Gold',    hex: '#B8975A', role: 'Elite plan, premium badges' },
  { name: 'Muted',   hex: '#6E6E73', role: 'Secondary text, icons' },
  { name: 'Border',  hex: '#E8E6E0', role: 'Borders (light mode)' },
]

export default async function BrandPage() {
  // Auth: anon client reads the user's session cookie
  const authClient = createServerComponentClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/brand')

  // Role check: service role client bypasses RLS — queries admin_roles directly
  // public.users is not used; role data lives exclusively in admin_roles
  const db = createServiceRoleClient()
  const { data: adminRole } = await db
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'super_admin')
    .single()

  if (!adminRole) redirect('/dashboard')

  return (
    <div style={{ background: '#0A0A0A', color: '#FAFAF7', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #2A2A2A', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#555555', textTransform: 'uppercase', marginBottom: 4 }}>Internal Use Only · Noindex</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#FAFAF7', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <span style={{ fontWeight: 400 }}>with</span>
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', color: '#FF6B00' }}>Sahib</span>
            {' '}Brand Assets
          </h1>
        </div>
        <Link href="/" style={{ fontSize: 13, color: '#FF6B00', textDecoration: 'none' }}>← Back to site</Link>
      </div>

      <div style={{ padding: '48px', maxWidth: 1200, margin: '0 auto' }}>

        {/* ── SECTION 1: LOGO SYSTEM ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHeader n="01" title="Logo System" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Dark version */}
            <AssetCard label="Primary Logo — Dark Background">
              <div style={{ padding: '40px 32px', background: '#0A0A0A', border: '1px solid #2A2A2A', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="240" height="48" viewBox="0 0 240 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Green bars */}
                  <rect x="0" y="32" width="6" height="14" rx="2" fill="rgba(26,122,74,0.45)" />
                  <rect x="9" y="22" width="6" height="24" rx="2" fill="rgba(26,122,74,0.72)" />
                  <rect x="18" y="10" width="6" height="36" rx="2" fill="#1A7A4A" />
                  {/* Orange dot */}
                  <circle cx="32" cy="38" r="4" fill="#FF6B00" />
                  {/* Wordmark */}
                  <text x="44" y="36" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="22" fontWeight="400">with</text>
                  <text x="90" y="37" fill="#FF6B00" fontFamily="'Playfair Display', Georgia, serif" fontSize="22" fontWeight="700" fontStyle="italic">Sahib</text>
                  <text x="148" y="36" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="22" fontWeight="400">.com</text>
                </svg>
              </div>
              <p style={{ fontSize: 12, color: '#555555', marginTop: 10 }}>Use on dark backgrounds #0A0A0A, #111111</p>
            </AssetCard>

            {/* Light version */}
            <AssetCard label="Primary Logo — Light Background">
              <div style={{ padding: '40px 32px', background: '#FAFAF7', border: '1px solid #E8E6E0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="240" height="48" viewBox="0 0 240 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="32" width="6" height="14" rx="2" fill="rgba(26,122,74,0.45)" />
                  <rect x="9" y="22" width="6" height="24" rx="2" fill="rgba(26,122,74,0.72)" />
                  <rect x="18" y="10" width="6" height="36" rx="2" fill="#1A7A4A" />
                  <circle cx="32" cy="38" r="4" fill="#FF6B00" />
                  <text x="44" y="36" fill="#0A0A0A" fontFamily="Inter, system-ui" fontSize="22" fontWeight="400">with</text>
                  <text x="90" y="37" fill="#FF6B00" fontFamily="'Playfair Display', Georgia, serif" fontSize="22" fontWeight="700" fontStyle="italic">Sahib</text>
                  <text x="148" y="36" fill="#0A0A0A" fontFamily="Inter, system-ui" fontSize="22" fontWeight="400">.com</text>
                </svg>
              </div>
              <p style={{ fontSize: 12, color: '#555555', marginTop: 10 }}>Use on light backgrounds #FAFAF7, #F5F3EE</p>
            </AssetCard>

            {/* Icon only */}
            <AssetCard label="Icon Mark — Square (For favicons, app icons)">
              <div style={{ padding: '32px', background: '#0A0A0A', border: '1px solid #2A2A2A', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                {[32, 24, 16].map((size) => (
                  <svg key={size} width={size} height={size} viewBox="0 0 32 32" fill="none">
                    <rect x="2" y="20" width="5" height="10" rx="2" fill="rgba(26,122,74,0.45)" />
                    <rect x="10" y="12" width="5" height="18" rx="2" fill="rgba(26,122,74,0.72)" />
                    <rect x="18" y="4" width="5" height="26" rx="2" fill="#1A7A4A" />
                    <circle cx="27" cy="26" r="3" fill="#FF6B00" />
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: 12, color: '#555555', marginTop: 10 }}>32px · 24px · 16px sizes shown</p>
            </AssetCard>

            {/* Usage rules */}
            <AssetCard label="Logo Usage Guidelines">
              <div style={{ fontSize: 13, color: '#888888', lineHeight: 1.8 }}>
                {[
                  '✓ Use the dark version on dark backgrounds',
                  '✓ Use the light version on white/light backgrounds',
                  '✓ "with" is Inter 400, theme-aware (black/white)',
                  '✓ "Sahib" is Playfair Display 700 italic — always #FF6B00',
                  '✓ Maintain minimum clear space equal to the "S" height',
                  '✗ Do not stretch or distort the logo',
                  '✗ Do not change the orange accent on "Sahib"',
                  '✗ Do not add drop shadows or effects',
                  '✗ Do not reorder "with" and "Sahib" elements',
                ].map((rule, i) => (
                  <div key={i} style={{ marginBottom: 6, color: rule.startsWith('✗') ? '#F47B7B' : '#888888' }}>{rule}</div>
                ))}
              </div>
            </AssetCard>
          </div>
        </section>

        {/* ── SECTION 2: VISITING CARD ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHeader n="02" title="Visiting Card" />
          <p style={{ fontSize: 13, color: '#555555', marginBottom: 28 }}>Standard business card: 85mm × 50mm (shown at 2× scale)</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* Front */}
            <div>
              <p style={{ fontSize: 11, letterSpacing: 2, color: '#555555', textTransform: 'uppercase', marginBottom: 12 }}>Front</p>
              <svg width="510" height="300" viewBox="0 0 510 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', borderRadius: 8 }}>
                <rect width="510" height="300" fill="#0A0A0A" rx="8" />
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#2A2A2A" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="510" height="300" fill="url(#grid)" opacity="0.4" rx="8" />
                {/* Orange top bar */}
                <rect x="0" y="0" width="510" height="3" fill="#FF6B00" rx="1" />
                {/* Logo mark */}
                <rect x="32" y="28" width="4" height="10" rx="1.5" fill="rgba(26,122,74,0.45)" />
                <rect x="39" y="22" width="4" height="16" rx="1.5" fill="rgba(26,122,74,0.72)" />
                <rect x="46" y="14" width="4" height="24" rx="1.5" fill="#1A7A4A" />
                <circle cx="55" cy="36" r="3" fill="#FF6B00" />
                <text x="62" y="37" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="14" fontWeight="400">with</text>
                <text x="91" y="37" fill="#FF6B00" fontFamily="'Playfair Display', Georgia, serif" fontSize="14" fontWeight="700" fontStyle="italic">Sahib</text>
                <text x="128" y="37" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="14" fontWeight="400">.com</text>
                {/* Name */}
                <text x="32" y="140" fill="#FAFAF7" fontFamily="'Playfair Display', Georgia, serif" fontSize="26" fontWeight="400">Sahib Singh Hora</text>
                {/* Title */}
                <text x="32" y="168" fill="#6E6E73" fontFamily="Inter, system-ui" fontSize="13" fontWeight="300">SEBI Registered Research Analyst</text>
                {/* SEBI number */}
                <rect x="32" y="186" width="140" height="24" rx="4" fill="rgba(184,151,90,0.1)" />
                <rect x="32" y="186" width="140" height="24" rx="4" stroke="rgba(184,151,90,0.25)" strokeWidth="1" />
                <text x="102" y="202" fill="#B8975A" fontFamily="Courier New, monospace" fontSize="11" fontWeight="600" textAnchor="middle">INH000026266</text>
                {/* Bottom info */}
                <text x="32" y="258" fill="#555555" fontFamily="Courier New, monospace" fontSize="10">SEBI RA · withSahib.com</text>
                <text x="32" y="274" fill="#555555" fontFamily="Inter, system-ui" fontSize="10">connect@withsahib.com</text>
                {/* Gold corner accent */}
                <line x1="440" y1="260" x2="478" y2="260" stroke="#B8975A" strokeWidth="1.5" opacity="0.4" />
                <line x1="478" y1="260" x2="478" y2="224" stroke="#B8975A" strokeWidth="1.5" opacity="0.4" />
              </svg>
            </div>

            {/* Back */}
            <div>
              <p style={{ fontSize: 11, letterSpacing: 2, color: '#555555', textTransform: 'uppercase', marginBottom: 12 }}>Back</p>
              <svg width="510" height="300" viewBox="0 0 510 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', borderRadius: 8 }}>
                <rect width="510" height="300" fill="#111111" rx="8" />
                <rect width="510" height="300" fill="url(#grid)" opacity="0.3" rx="8" />
                {/* Orange bottom bar */}
                <rect x="0" y="297" width="510" height="3" fill="#FF6B00" rx="1" />
                {/* Large watermark */}
                <text x="255" y="200" fill="rgba(255,107,0,0.04)" fontFamily="'Playfair Display', Georgia, serif" fontSize="120" fontWeight="700" textAnchor="middle">wS</text>
                {/* Brand name */}
                <text x="255" y="85" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="11" fontWeight="400" textAnchor="middle" letterSpacing="3">with</text>
                <text x="255" y="108" fill="#FF6B00" fontFamily="'Playfair Display', Georgia, serif" fontSize="18" fontWeight="700" fontStyle="italic" textAnchor="middle">Sahib</text>
                {/* Service tags */}
                {['Positional Research', 'Intraday Research', 'Options Research', 'Index Options', 'Research Reports', '1-on-1 Mentorship'].map((svc, i) => {
                  const cols = 3
                  const col = i % cols
                  const row = Math.floor(i / cols)
                  const x = 90 + col * 115
                  const y = 148 + row * 36
                  return (
                    <g key={svc}>
                      <rect x={x - 48} y={y - 14} width="96" height="22" rx="4" fill="rgba(255,107,0,0.06)" stroke="rgba(255,107,0,0.15)" strokeWidth="0.8" />
                      <text x={x} y={y + 1} fill="#6E6E73" fontFamily="Inter, system-ui" fontSize="9" textAnchor="middle">{svc}</text>
                    </g>
                  )
                })}
                {/* Website */}
                <text x="255" y="228" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="14" fontWeight="500" textAnchor="middle">withsahib.com</text>
                <text x="255" y="246" fill="#555555" fontFamily="Inter, system-ui" fontSize="11" textAnchor="middle">connect@withsahib.com</text>
                {/* Disclaimer */}
                <text x="255" y="279" fill="#333333" fontFamily="Inter, system-ui" fontSize="8" textAnchor="middle">Investments subject to market risk · SEBI RA Reg. INH000026266 · withSahib.com</text>
              </svg>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: SOCIAL MEDIA TEMPLATES ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHeader n="03" title="Social Media Templates" />

          {/* Profile Photo */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: '#555555', textTransform: 'uppercase', marginBottom: 12 }}>Profile Photo — 400×400</p>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <svg width="160" height="160" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="200" r="200" fill="#0A0A0A" />
                <circle cx="200" cy="200" r="190" fill="none" stroke="#FF6B00" strokeWidth="8" />
                <circle cx="200" cy="200" r="140" fill="#111111" />
                <circle cx="200" cy="200" r="120" fill="rgba(255,107,0,0.06)" />
                <text x="200" y="230" fill="#FF6B00" fontFamily="'Playfair Display', Georgia, serif" fontSize="96" fontWeight="400" textAnchor="middle">SS</text>
                <rect x="70" y="320" width="260" height="40" rx="20" fill="rgba(184,151,90,0.15)" stroke="rgba(184,151,90,0.3)" strokeWidth="1" />
                <text x="200" y="346" fill="#B8975A" fontFamily="Courier New, monospace" fontSize="14" fontWeight="700" textAnchor="middle" letterSpacing="2">SEBI RA</text>
              </svg>
              <div style={{ flex: 1, minWidth: 240 }}>
                <p style={{ fontSize: 13, color: '#888888', lineHeight: 1.7 }}>
                  Use as profile photo on Twitter/X, LinkedIn, Instagram, and Facebook.<br />
                  Dark circular background with orange border ring.<br />
                  &ldquo;SS&rdquo; initials in Playfair Display serif, orange.<br />
                  Gold &ldquo;SEBI RA&rdquo; badge at bottom.
                </p>
              </div>
            </div>
          </div>

          {/* Twitter/X Cover */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: '#555555', textTransform: 'uppercase', marginBottom: 12 }}>Twitter / X Cover — 1500×500</p>
            <svg width="100%" viewBox="0 0 1500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 8 }}>
              <rect width="1500" height="500" fill="#0A0A0A" />
              <defs>
                <pattern id="tgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2A2A2A" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="1500" height="500" fill="url(#tgrid)" opacity="0.4" />
              <circle cx="200" cy="100" r="300" fill="rgba(255,107,0,0.05)" />
              <circle cx="1300" cy="400" r="250" fill="rgba(184,151,90,0.04)" />
              {/* Logo */}
              <rect x="80" y="60" width="7" height="20" rx="2" fill="rgba(26,122,74,0.45)" />
              <rect x="91" y="48" width="7" height="32" rx="2" fill="rgba(26,122,74,0.72)" />
              <rect x="102" y="34" width="7" height="46" rx="2" fill="#1A7A4A" />
              <circle cx="116" cy="74" r="5" fill="#FF6B00" />
              <text x="128" y="76" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="26" fontWeight="400">with</text>
              <text x="186" y="76" fill="#FF6B00" fontFamily="'Playfair Display', Georgia, serif" fontSize="26" fontWeight="700" fontStyle="italic">Sahib</text>
              <text x="270" y="76" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="26" fontWeight="400">.com</text>
              {/* Headline */}
              <text x="80" y="200" fill="#FAFAF7" fontFamily="'Playfair Display', Georgia, serif" fontSize="56" fontWeight="400">Research with clarity.</text>
              <text x="80" y="268" fill="#FAFAF7" fontFamily="'Playfair Display', Georgia, serif" fontSize="56" fontWeight="400">Trade with <tspan fill="#FF6B00">conviction.</tspan></text>
              {/* Subline */}
              <text x="80" y="318" fill="#6E6E73" fontFamily="Inter, system-ui" fontSize="20" fontWeight="300">SEBI Registered Research Analyst · Intraday · Options · Swing Trades · Research Reports</text>
              {/* SEBI badge */}
              <rect x="80" y="380" width="220" height="40" rx="6" fill="rgba(184,151,90,0.1)" stroke="rgba(184,151,90,0.25)" strokeWidth="1" />
              <text x="190" y="406" fill="#B8975A" fontFamily="Courier New, monospace" fontSize="14" fontWeight="600" textAnchor="middle">SEBI RA · INH000026266</text>
              {/* Right side decoration */}
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x={1320 + i * 22} y={100 + i * 30} width="10" height={200 - i * 30} rx="3" fill={`rgba(255,107,0,${0.15 + i * 0.12})`} />
              ))}
            </svg>
          </div>

          {/* LinkedIn Cover */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: '#555555', textTransform: 'uppercase', marginBottom: 12 }}>LinkedIn Cover — 1584×396</p>
            <svg width="100%" viewBox="0 0 1584 396" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 8 }}>
              <rect width="1584" height="396" fill="#111111" />
              <rect width="1584" height="396" fill="url(#tgrid)" opacity="0.3" />
              <rect x="0" y="0" width="6" height="396" fill="#FF6B00" opacity="0.8" />
              <circle cx="300" cy="198" r="280" fill="rgba(255,107,0,0.04)" />
              {/* Logo */}
              <rect x="60" y="48" width="6" height="16" rx="2" fill="rgba(26,122,74,0.45)" />
              <rect x="70" y="38" width="6" height="26" rx="2" fill="rgba(26,122,74,0.72)" />
              <rect x="80" y="26" width="6" height="38" rx="2" fill="#1A7A4A" />
              <circle cx="92" cy="60" r="4" fill="#FF6B00" />
              <text x="102" y="62" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="20" fontWeight="400">withSahib.com</text>
              {/* Headline */}
              <text x="60" y="160" fill="#FAFAF7" fontFamily="'Playfair Display', Georgia, serif" fontSize="44" fontWeight="400">Sahib Singh Hora</text>
              <text x="60" y="210" fill="#6E6E73" fontFamily="Inter, system-ui" fontSize="18" fontWeight="300">SEBI Registered Research Analyst · withSahib.com</text>
              {/* SEBI credential */}
              <rect x="60" y="240" width="200" height="34" rx="5" fill="rgba(184,151,90,0.1)" stroke="rgba(184,151,90,0.25)" strokeWidth="1" />
              <text x="160" y="262" fill="#B8975A" fontFamily="Courier New, monospace" fontSize="13" textAnchor="middle">INH000026266</text>
              {/* Services line */}
              <text x="60" y="330" fill="#555555" fontFamily="Inter, system-ui" fontSize="14">Positional Research  ·  Intraday Research  ·  Options Research  ·  Research Reports</text>
              {/* Right */}
              <text x="1500" y="340" fill="rgba(255,107,0,0.05)" fontFamily="'Playfair Display', Georgia, serif" fontSize="200" fontWeight="700" textAnchor="end">RA</text>
            </svg>
          </div>

          {/* Instagram Story */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: '#555555', textTransform: 'uppercase', marginBottom: 12 }}>Instagram Story Trade Call Template — 1080×1920 (shown at 25% scale)</p>
            <svg width="270" height="480" viewBox="0 0 1080 1920" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 12 }}>
              <rect width="1080" height="1920" fill="#0A0A0A" />
              <rect width="1080" height="1920" fill="url(#grid)" opacity="0.3" />
              <circle cx="540" cy="400" r="500" fill="rgba(255,107,0,0.05)" />
              {/* Top bar */}
              <rect x="0" y="0" width="1080" height="6" fill="#FF6B00" />
              {/* Logo top */}
              <rect x="60" y="60" width="10" height="28" rx="3" fill="rgba(26,122,74,0.45)" />
              <rect x="75" y="46" width="10" height="42" rx="3" fill="rgba(26,122,74,0.72)" />
              <rect x="90" y="30" width="10" height="58" rx="3" fill="#1A7A4A" />
              <circle cx="110" cy="78" r="7" fill="#FF6B00" />
              <text x="126" y="82" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="36" fontWeight="400">with</text>
              <text x="218" y="84" fill="#FF6B00" fontFamily="'Playfair Display', Georgia, serif" fontSize="36" fontWeight="700" fontStyle="italic">Sahib</text>
              {/* TRADE CALL badge */}
              <rect x="60" y="200" width="960" height="80" rx="12" fill="rgba(255,107,0,0.1)" stroke="rgba(255,107,0,0.25)" strokeWidth="2" />
              <text x="540" y="252" fill="#FF6B00" fontFamily="Inter, system-ui" fontSize="28" fontWeight="700" textAnchor="middle" letterSpacing="4">INTRADAY CALL · NSE</text>
              {/* Stock */}
              <text x="540" y="400" fill="#FAFAF7" fontFamily="'Playfair Display', Georgia, serif" fontSize="80" textAnchor="middle">STOCK NAME</text>
              {/* BUY badge */}
              <rect x="380" y="440" width="320" height="90" rx="12" fill="rgba(255,107,0,0.15)" stroke="#FF6B00" strokeWidth="2" />
              <text x="540" y="503" fill="#FF6B00" fontFamily="Inter, system-ui" fontSize="56" fontWeight="900" textAnchor="middle">BUY</text>
              {/* Price levels */}
              {[
                { label: 'ENTRY', value: '₹ XXX – XXX', color: '#FAFAF7', y: 620 },
                { label: 'TARGET 1', value: '₹ XXX', color: '#1A7A4A', y: 760 },
                { label: 'TARGET 2', value: '₹ XXX', color: '#1A7A4A', y: 900 },
                { label: 'STOP LOSS', value: '₹ XXX', color: '#F47B7B', y: 1040 },
              ].map((item) => (
                <g key={item.label}>
                  <rect x="80" y={item.y - 60} width="920" height="110" rx="10" fill="#111111" stroke="#2A2A2A" strokeWidth="1" />
                  <text x="140" y={item.y} fill="#555555" fontFamily="Inter, system-ui" fontSize="24" fontWeight="600" letterSpacing="2">{item.label}</text>
                  <text x="940" y={item.y} fill={item.color} fontFamily="Courier New, monospace" fontSize="36" fontWeight="700" textAnchor="end">{item.value}</text>
                </g>
              ))}
              {/* Watermark */}
              <text x="540" y="1220" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="32" fontWeight="300" textAnchor="middle">withsahib.com</text>
              {/* Disclaimer */}
              <rect x="40" y="1780" width="1000" height="100" rx="10" fill="rgba(184,151,90,0.06)" stroke="rgba(184,151,90,0.15)" strokeWidth="1" />
              <text x="540" y="1820" fill="#555555" fontFamily="Inter, system-ui" fontSize="18" textAnchor="middle">SEBI RA: Sahib Singh Hora · INH000026266</text>
              <text x="540" y="1848" fill="#333333" fontFamily="Inter, system-ui" fontSize="16" textAnchor="middle">Investments subject to market risk. Past performance not indicative of future results.</text>
            </svg>
          </div>

          {/* Facebook Cover */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: '#555555', textTransform: 'uppercase', marginBottom: 12 }}>Facebook Cover — 851×315</p>
            <svg width="100%" viewBox="0 0 851 315" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 8 }}>
              <rect width="851" height="315" fill="#111111" />
              <rect width="851" height="315" fill="url(#tgrid)" opacity="0.35" />
              <rect x="0" y="312" width="851" height="3" fill="#FF6B00" />
              <circle cx="700" cy="80" r="200" fill="rgba(255,107,0,0.04)" />
              <rect x="50" y="40" width="5" height="14" rx="1.5" fill="rgba(26,122,74,0.45)" />
              <rect x="59" y="32" width="5" height="22" rx="1.5" fill="rgba(26,122,74,0.72)" />
              <rect x="68" y="22" width="5" height="32" rx="1.5" fill="#1A7A4A" />
              <circle cx="79" cy="50" r="3.5" fill="#FF6B00" />
              <text x="88" y="52" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="18" fontWeight="400">with</text>
              <text x="127" y="52" fill="#FF6B00" fontFamily="'Playfair Display', Georgia, serif" fontSize="18" fontWeight="700" fontStyle="italic">Sahib</text>
              <text x="172" y="52" fill="#FAFAF7" fontFamily="Inter, system-ui" fontSize="18" fontWeight="400">.com</text>
              <text x="50" y="140" fill="#FAFAF7" fontFamily="'Playfair Display', Georgia, serif" fontSize="36" fontWeight="400">Sahib Singh Hora</text>
              <text x="50" y="175" fill="#6E6E73" fontFamily="Inter, system-ui" fontSize="15">SEBI Registered Research Analyst · withSahib.com</text>
              <rect x="50" y="198" width="180" height="28" rx="5" fill="rgba(184,151,90,0.1)" stroke="rgba(184,151,90,0.25)" strokeWidth="1" />
              <text x="140" y="217" fill="#B8975A" fontFamily="Courier New, monospace" fontSize="12" textAnchor="middle">INH000026266</text>
              <text x="50" y="268" fill="#555555" fontFamily="Inter, system-ui" fontSize="12">Positional Research · Intraday Calls · Options Research · Research Reports · 1-on-1 Advisory</text>
              <text x="50" y="288" fill="#555555" fontFamily="Inter, system-ui" fontSize="11">connect@withsahib.com  ·  withsahib.com</text>
            </svg>
          </div>
        </section>

        {/* ── SECTION 4: COLOUR PALETTE ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHeader n="04" title="Colour Palette" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {COLORS.map((c) => {
              const isLight = ['#FAFAF7', '#F5F3EE', '#E8E6E0'].includes(c.hex)
              return (
                <div key={c.hex} style={{ border: '1px solid #2A2A2A', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: 64, background: c.hex, border: isLight ? '1px solid #D0CEC8' : 'none' }} />
                  <div style={{ padding: '10px 12px', background: '#111111' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#FAFAF7', marginBottom: 2 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#FF6B00', fontFamily: 'Courier New, monospace', marginBottom: 4 }}>{c.hex}</div>
                    <div style={{ fontSize: 11, color: '#555555', lineHeight: 1.4 }}>{c.role}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── SECTION 5: TYPOGRAPHY ── */}
        <section style={{ marginBottom: 48 }}>
          <SectionHeader n="05" title="Typography" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <AssetCard label="Playfair Display — Headlines">
              <div style={{ fontFamily: '"Playfair Display", Georgia, serif', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { size: 56, weight: 400, label: 'H1 · 56px · 400' },
                  { size: 40, weight: 400, label: 'H2 · 40px · 400' },
                  { size: 28, weight: 400, label: 'H3 · 28px · 400' },
                  { size: 20, weight: 400, label: 'H4 · 20px · 400' },
                ].map((s) => (
                  <div key={s.size}>
                    <div style={{ fontSize: 10, color: '#555555', marginBottom: 2, fontFamily: 'Inter, system-ui', letterSpacing: 1 }}>{s.label}</div>
                    <div style={{ fontSize: s.size, fontWeight: s.weight, color: '#FAFAF7', lineHeight: 1.1 }}>withSahib</div>
                  </div>
                ))}
              </div>
            </AssetCard>

            <AssetCard label="Inter — Body Text">
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { size: 18, weight: 600, label: 'Large · 18px · 600' },
                  { size: 16, weight: 400, label: 'Body · 16px · 400' },
                  { size: 14, weight: 400, label: 'Small · 14px · 400' },
                  { size: 12, weight: 300, label: 'Caption · 12px · 300' },
                  { size: 11, weight: 700, label: 'Label · 11px · 700 · UPPERCASE', upper: true },
                ].map((s) => (
                  <div key={s.size + s.weight}>
                    <div style={{ fontSize: 10, color: '#555555', marginBottom: 2, letterSpacing: 1 }}>{s.label}</div>
                    <div style={{ fontSize: s.size, fontWeight: s.weight, color: '#888888', textTransform: s.upper ? 'uppercase' : undefined, letterSpacing: s.upper ? 2 : 0 }}>
                      SEBI Registered Research Analyst India
                    </div>
                  </div>
                ))}
              </div>
            </AssetCard>
          </div>
        </section>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #2A2A2A', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#333333' }}>© 2026 Sahib Singh Hora · SEBI RA INH000026266 · withSahib.com</p>
          <Link href="/" style={{ fontSize: 12, color: '#FF6B00', textDecoration: 'none' }}>← Back to withSahib.com</Link>
        </div>
      </div>
    </div>
  )
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function SectionHeader({ n, title }: { n: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, borderBottom: '1px solid #2A2A2A', paddingBottom: 16 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#FF6B00', letterSpacing: 2, fontFamily: 'Courier New, monospace' }}>{n}</span>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: '#FAFAF7', fontFamily: 'Inter, system-ui, sans-serif' }}>{title}</h2>
    </div>
  )
}

function AssetCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#111111', border: '1px solid #2A2A2A', borderRadius: 12, padding: '20px 24px' }}>
      <p style={{ fontSize: 11, letterSpacing: '1.5px', color: '#555555', textTransform: 'uppercase', marginBottom: 16, fontFamily: 'Inter, system-ui, sans-serif' }}>{label}</p>
      {children}
    </div>
  )
}
