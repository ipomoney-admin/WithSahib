import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Brand Assets — withSahib',
  description: 'Official brand assets, logo system, visiting card, and social media templates for withSahib.com.',
  robots: { index: false, follow: false },
}

// ─── COLOUR PALETTE ───────────────────────────────────────────────────────────
const COLORS = [
  { name: 'Background', hex: '#06090F', role: 'Primary dark background' },
  { name: 'Surface', hex: '#141F2E', role: 'Card backgrounds' },
  { name: 'Emerald', hex: '#00C896', role: 'Primary accent — CTAs, icons' },
  { name: 'Emerald Deep', hex: '#00A87E', role: 'Hover states' },
  { name: 'Gold', hex: '#D4A843', role: 'SEBI badge, premium accents' },
  { name: 'Sapphire', hex: '#64A0FF', role: 'Basic tier, info states' },
  { name: 'Coral', hex: '#F47B7B', role: 'Alerts, stop-loss, errors' },
  { name: 'Text Primary', hex: '#E8EDF5', role: 'Main text (dark mode)' },
  { name: 'Text Secondary', hex: '#8FA8C0', role: 'Subtitles, descriptions' },
  { name: 'Border', hex: '#1A2333', role: 'Card borders' },
]

export default function BrandPage() {
  return (
    <div style={{ background: '#06090F', color: '#E8EDF5', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1A2333', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#4A6580', textTransform: 'uppercase', marginBottom: 4 }}>Internal Use Only · Noindex</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#E8EDF5' }}>
            with<span style={{ color: '#00C896' }}>Sahib</span> Brand Assets
          </h1>
        </div>
        <Link href="/" style={{ fontSize: 13, color: '#00C896', textDecoration: 'none' }}>← Back to site</Link>
      </div>

      <div style={{ padding: '48px', maxWidth: 1200, margin: '0 auto' }}>

        {/* ── SECTION 1: LOGO SYSTEM ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHeader n="01" title="Logo System" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Dark version */}
            <AssetCard label="Primary Logo — Dark Background">
              <div style={{ padding: '40px 32px', background: '#06090F', border: '1px solid #1A2333', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="220" height="48" viewBox="0 0 220 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Candle bars */}
                  <rect x="0" y="32" width="6" height="14" rx="2" fill="rgba(0,200,150,0.35)" />
                  <rect x="9" y="22" width="6" height="24" rx="2" fill="rgba(0,200,150,0.65)" />
                  <rect x="18" y="10" width="6" height="36" rx="2" fill="#00C896" />
                  {/* Pulse dot */}
                  <circle cx="32" cy="38" r="4" fill="#00C896" />
                  {/* Wordmark */}
                  <text x="44" y="36" fill="#E8EDF5" fontFamily="system-ui" fontSize="22" fontWeight="300">with</text>
                  <text x="88" y="36" fill="#00C896" fontFamily="system-ui" fontSize="22" fontWeight="700">Sahib</text>
                  <text x="144" y="36" fill="#E8EDF5" fontFamily="system-ui" fontSize="22" fontWeight="300">.com</text>
                </svg>
              </div>
              <p style={{ fontSize: 12, color: '#4A6580', marginTop: 10 }}>Use on dark backgrounds #06090F, #141F2E</p>
            </AssetCard>

            {/* Light version */}
            <AssetCard label="Primary Logo — Light Background">
              <div style={{ padding: '40px 32px', background: '#F0F4FA', border: '1px solid #D8E4F0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="220" height="48" viewBox="0 0 220 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="32" width="6" height="14" rx="2" fill="rgba(0,168,126,0.4)" />
                  <rect x="9" y="22" width="6" height="24" rx="2" fill="rgba(0,168,126,0.7)" />
                  <rect x="18" y="10" width="6" height="36" rx="2" fill="#00A87E" />
                  <circle cx="32" cy="38" r="4" fill="#00A87E" />
                  <text x="44" y="36" fill="#0D1A28" fontFamily="system-ui" fontSize="22" fontWeight="300">with</text>
                  <text x="88" y="36" fill="#00A87E" fontFamily="system-ui" fontSize="22" fontWeight="700">Sahib</text>
                  <text x="144" y="36" fill="#0D1A28" fontFamily="system-ui" fontSize="22" fontWeight="300">.com</text>
                </svg>
              </div>
              <p style={{ fontSize: 12, color: '#4A6580', marginTop: 10 }}>Use on light backgrounds #F0F4FA, #FFFFFF</p>
            </AssetCard>

            {/* Icon only */}
            <AssetCard label="Icon Mark — Square (For favicons, app icons)">
              <div style={{ padding: '32px', background: '#06090F', border: '1px solid #1A2333', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                {[32, 24, 16].map((size) => (
                  <svg key={size} width={size} height={size} viewBox="0 0 32 32" fill="none">
                    <rect x="2" y="20" width="5" height="10" rx="2" fill="rgba(0,200,150,0.35)" />
                    <rect x="10" y="12" width="5" height="18" rx="2" fill="rgba(0,200,150,0.65)" />
                    <rect x="18" y="4" width="5" height="26" rx="2" fill="#00C896" />
                    <circle cx="27" cy="26" r="3" fill="#00C896" />
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: 12, color: '#4A6580', marginTop: 10 }}>32px · 24px · 16px sizes shown</p>
            </AssetCard>

            {/* Usage rules */}
            <AssetCard label="Logo Usage Guidelines">
              <div style={{ fontSize: 13, color: '#8FA8C0', lineHeight: 1.8 }}>
                {[
                  '✓ Use the dark version on dark backgrounds',
                  '✓ Use the light version on white/light backgrounds',
                  '✓ Maintain minimum clear space equal to the \'S\' height',
                  '✗ Do not stretch or distort the logo',
                  '✗ Do not change the emerald green accent color',
                  '✗ Do not use on non-approved background colors',
                  '✗ Do not add drop shadows or effects',
                  '✗ Do not reorder "with" and "Sahib" elements',
                ].map((rule, i) => (
                  <div key={i} style={{ marginBottom: 6, color: rule.startsWith('✗') ? '#F47B7B' : '#8FA8C0' }}>{rule}</div>
                ))}
              </div>
            </AssetCard>
          </div>
        </section>

        {/* ── SECTION 2: VISITING CARD ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHeader n="02" title="Visiting Card" />
          <p style={{ fontSize: 13, color: '#4A6580', marginBottom: 28 }}>Standard business card: 85mm × 50mm (shown at 2× scale)</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* Front */}
            <div>
              <p style={{ fontSize: 11, letterSpacing: 2, color: '#4A6580', textTransform: 'uppercase', marginBottom: 12 }}>Front</p>
              <svg width="510" height="300" viewBox="0 0 510 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', borderRadius: 8 }}>
                {/* Background */}
                <rect width="510" height="300" fill="#06090F" rx="8" />
                {/* Grid pattern */}
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1A2333" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="510" height="300" fill="url(#grid)" opacity="0.4" rx="8" />
                {/* Emerald top bar */}
                <rect x="0" y="0" width="510" height="3" fill="#00C896" rx="1" />
                {/* Glow */}
                <circle cx="400" cy="60" r="120" fill="rgba(0,200,150,0.05)" />
                {/* Logo */}
                <rect x="32" y="28" width="4" height="10" rx="1.5" fill="rgba(0,200,150,0.35)" />
                <rect x="39" y="22" width="4" height="16" rx="1.5" fill="rgba(0,200,150,0.65)" />
                <rect x="46" y="14" width="4" height="24" rx="1.5" fill="#00C896" />
                <circle cx="55" cy="36" r="3" fill="#00C896" />
                <text x="62" y="37" fill="#E8EDF5" fontFamily="system-ui" fontSize="14" fontWeight="300">with</text>
                <text x="91" y="37" fill="#00C896" fontFamily="system-ui" fontSize="14" fontWeight="700">Sahib</text>
                <text x="127" y="37" fill="#E8EDF5" fontFamily="system-ui" fontSize="14" fontWeight="300">.com</text>
                {/* Name */}
                <text x="32" y="140" fill="#E8EDF5" fontFamily="Georgia, serif" fontSize="26" fontWeight="400">Sahib Singh Hora</text>
                {/* Title */}
                <text x="32" y="168" fill="#8FA8C0" fontFamily="system-ui" fontSize="13" fontWeight="300">SEBI Registered Research Analyst</text>
                {/* SEBI number */}
                <rect x="32" y="186" width="140" height="24" rx="4" fill="rgba(212,168,67,0.1)" />
                <rect x="32" y="186" width="140" height="24" rx="4" stroke="rgba(212,168,67,0.25)" strokeWidth="1" />
                <text x="102" y="202" fill="#D4A843" fontFamily="Courier New, monospace" fontSize="11" fontWeight="600" textAnchor="middle">INH000026266</text>
                {/* Bottom info */}
                <text x="32" y="258" fill="#4A6580" fontFamily="Courier New, monospace" fontSize="10">SEBI RA · Altitans Intelligence Pvt Ltd</text>
                <text x="32" y="274" fill="#4A6580" fontFamily="system-ui" fontSize="10">sahib13singh13@gmail.com</text>
                {/* Gold corner accent */}
                <line x1="440" y1="260" x2="478" y2="260" stroke="#D4A843" strokeWidth="1.5" opacity="0.4" />
                <line x1="478" y1="260" x2="478" y2="224" stroke="#D4A843" strokeWidth="1.5" opacity="0.4" />
              </svg>
            </div>

            {/* Back */}
            <div>
              <p style={{ fontSize: 11, letterSpacing: 2, color: '#4A6580', textTransform: 'uppercase', marginBottom: 12 }}>Back</p>
              <svg width="510" height="300" viewBox="0 0 510 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', borderRadius: 8 }}>
                <rect width="510" height="300" fill="#0C1219" rx="8" />
                <rect width="510" height="300" fill="url(#grid)" opacity="0.3" rx="8" />
                {/* Emerald bottom bar */}
                <rect x="0" y="297" width="510" height="3" fill="#00C896" rx="1" />
                {/* Large watermark */}
                <text x="255" y="200" fill="rgba(0,200,150,0.04)" fontFamily="Georgia, serif" fontSize="120" fontWeight="700" textAnchor="middle">RA</text>
                {/* Services */}
                <text x="255" y="100" fill="#00C896" fontFamily="system-ui" fontSize="11" fontWeight="600" textAnchor="middle" letterSpacing="3">RESEARCH ADVISORY SERVICES</text>
                {/* Service tags */}
                {['Intraday Calls', 'Nifty Options', 'Bank Nifty', 'Swing Trades', 'Model Portfolio', 'AI Research'].map((svc, i) => {
                  const cols = 3
                  const col = i % cols
                  const row = Math.floor(i / cols)
                  const x = 90 + col * 115
                  const y = 128 + row * 36
                  return (
                    <g key={svc}>
                      <rect x={x - 48} y={y - 14} width="96" height="22" rx="4" fill="rgba(0,200,150,0.06)" stroke="rgba(0,200,150,0.15)" strokeWidth="0.8" />
                      <text x={x} y={y + 1} fill="#8FA8C0" fontFamily="system-ui" fontSize="10" textAnchor="middle">{svc}</text>
                    </g>
                  )
                })}
                {/* Website */}
                <text x="255" y="218" fill="#E8EDF5" fontFamily="system-ui" fontSize="14" fontWeight="500" textAnchor="middle">withsahib.com</text>
                <text x="255" y="236" fill="#4A6580" fontFamily="system-ui" fontSize="11" textAnchor="middle">sahib13singh13@gmail.com</text>
                {/* Disclaimer */}
                <text x="255" y="274" fill="#2A3E52" fontFamily="system-ui" fontSize="8" textAnchor="middle">Investments subject to market risk · SEBI RA Reg. INH000026266 · Altitans Intelligence Pvt Ltd</text>
              </svg>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: SOCIAL MEDIA TEMPLATES ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHeader n="03" title="Social Media Templates" />

          {/* Profile Photo */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: '#4A6580', textTransform: 'uppercase', marginBottom: 12 }}>Profile Photo — 400×400</p>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <svg width="160" height="160" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="200" r="200" fill="#06090F" />
                <circle cx="200" cy="200" r="190" fill="none" stroke="#00C896" strokeWidth="8" />
                <circle cx="200" cy="200" r="140" fill="#0C1219" />
                <circle cx="200" cy="200" r="120" fill="rgba(0,200,150,0.06)" />
                <text x="200" y="230" fill="#00C896" fontFamily="Georgia, serif" fontSize="100" fontWeight="400" textAnchor="middle">S</text>
                <rect x="70" y="320" width="260" height="40" rx="20" fill="rgba(212,168,67,0.15)" stroke="rgba(212,168,67,0.3)" strokeWidth="1" />
                <text x="200" y="346" fill="#D4A843" fontFamily="Courier New, monospace" fontSize="14" fontWeight="700" textAnchor="middle" letterSpacing="2">SEBI RA</text>
              </svg>
              <div style={{ flex: 1, minWidth: 240 }}>
                <p style={{ fontSize: 13, color: '#8FA8C0', lineHeight: 1.7 }}>
                  Use as profile photo on Twitter/X, LinkedIn, Instagram, and Facebook.<br />
                  Dark circular background with emerald border ring.<br />
                  &ldquo;S&rdquo; initial in DM Serif Display / Georgia serif.<br />
                  Gold &ldquo;SEBI RA&rdquo; badge at bottom.
                </p>
              </div>
            </div>
          </div>

          {/* Twitter/X Cover */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: '#4A6580', textTransform: 'uppercase', marginBottom: 12 }}>Twitter / X Cover — 1500×500</p>
            <svg width="100%" viewBox="0 0 1500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 8 }}>
              <rect width="1500" height="500" fill="#06090F" />
              <defs>
                <pattern id="tgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A2333" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="1500" height="500" fill="url(#tgrid)" opacity="0.4" />
              <circle cx="200" cy="100" r="300" fill="rgba(0,200,150,0.06)" />
              <circle cx="1300" cy="400" r="250" fill="rgba(212,168,67,0.05)" />
              {/* Logo */}
              <rect x="80" y="60" width="7" height="20" rx="2" fill="rgba(0,200,150,0.35)" />
              <rect x="91" y="48" width="7" height="32" rx="2" fill="rgba(0,200,150,0.65)" />
              <rect x="102" y="34" width="7" height="46" rx="2" fill="#00C896" />
              <circle cx="116" cy="74" r="5" fill="#00C896" />
              <text x="128" y="76" fill="#E8EDF5" fontFamily="system-ui" fontSize="26" fontWeight="300">with</text>
              <text x="186" y="76" fill="#00C896" fontFamily="system-ui" fontSize="26" fontWeight="700">Sahib</text>
              <text x="268" y="76" fill="#E8EDF5" fontFamily="system-ui" fontSize="26" fontWeight="300">.com</text>
              {/* Headline */}
              <text x="80" y="200" fill="#E8EDF5" fontFamily="Georgia, serif" fontSize="56" fontWeight="400">Research with clarity.</text>
              <text x="80" y="268" fill="#E8EDF5" fontFamily="Georgia, serif" fontSize="56" fontWeight="400">Trade with <tspan fill="#00C896">conviction.</tspan></text>
              {/* Subline */}
              <text x="80" y="318" fill="#8FA8C0" fontFamily="system-ui" fontSize="20" fontWeight="300">SEBI Registered Research Analyst · Intraday Tips · Options · Swing Trades · AI Research</text>
              {/* SEBI badge */}
              <rect x="80" y="380" width="220" height="40" rx="6" fill="rgba(212,168,67,0.1)" stroke="rgba(212,168,67,0.25)" strokeWidth="1" />
              <text x="190" y="406" fill="#D4A843" fontFamily="Courier New, monospace" fontSize="14" fontWeight="600" textAnchor="middle">SEBI RA · INH000026266</text>
              {/* Right side decoration */}
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x={1320 + i * 22} y={100 + i * 30} width="10" height={200 - i * 30} rx="3" fill={`rgba(0,200,150,${0.2 + i * 0.15})`} />
              ))}
            </svg>
          </div>

          {/* LinkedIn Cover */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: '#4A6580', textTransform: 'uppercase', marginBottom: 12 }}>LinkedIn Cover — 1584×396</p>
            <svg width="100%" viewBox="0 0 1584 396" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 8 }}>
              <rect width="1584" height="396" fill="#0C1219" />
              <rect width="1584" height="396" fill="url(#tgrid)" opacity="0.3" />
              <rect x="0" y="0" width="6" height="396" fill="#00C896" opacity="0.8" />
              <circle cx="300" cy="198" r="280" fill="rgba(0,200,150,0.04)" />
              {/* Logo */}
              <rect x="60" y="48" width="6" height="16" rx="2" fill="rgba(0,200,150,0.35)" />
              <rect x="70" y="38" width="6" height="26" rx="2" fill="rgba(0,200,150,0.65)" />
              <rect x="80" y="26" width="6" height="38" rx="2" fill="#00C896" />
              <circle cx="92" cy="60" r="4" fill="#00C896" />
              <text x="102" y="62" fill="#E8EDF5" fontFamily="system-ui" fontSize="20" fontWeight="300">withSahib.com</text>
              {/* Headline */}
              <text x="60" y="160" fill="#E8EDF5" fontFamily="Georgia, serif" fontSize="44" fontWeight="400">Sahib Singh Hora</text>
              <text x="60" y="210" fill="#8FA8C0" fontFamily="system-ui" fontSize="18" fontWeight="300">SEBI Registered Research Analyst · Altitans Intelligence Pvt Ltd</text>
              {/* SEBI credential */}
              <rect x="60" y="240" width="200" height="34" rx="5" fill="rgba(212,168,67,0.1)" stroke="rgba(212,168,67,0.25)" strokeWidth="1" />
              <text x="160" y="262" fill="#D4A843" fontFamily="Courier New, monospace" fontSize="13" textAnchor="middle">INH000026266</text>
              {/* Services line */}
              <text x="60" y="330" fill="#4A6580" fontFamily="system-ui" fontSize="14">Intraday Calls  ·  Nifty Options  ·  Bank Nifty  ·  Swing Trades  ·  AI Research Reports</text>
              {/* Right */}
              <text x="1500" y="340" fill="rgba(0,200,150,0.06)" fontFamily="Georgia, serif" fontSize="200" fontWeight="700" textAnchor="end">RA</text>
            </svg>
          </div>

          {/* Instagram Story */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: '#4A6580', textTransform: 'uppercase', marginBottom: 12 }}>Instagram Story Trade Call Template — 1080×1920 (shown at 25% scale)</p>
            <svg width="270" height="480" viewBox="0 0 1080 1920" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 12 }}>
              <rect width="1080" height="1920" fill="#06090F" />
              <rect width="1080" height="1920" fill="url(#grid)" opacity="0.3" />
              <circle cx="540" cy="400" r="500" fill="rgba(0,200,150,0.06)" />
              {/* Top bar */}
              <rect x="0" y="0" width="1080" height="6" fill="#00C896" />
              {/* Logo top */}
              <rect x="60" y="60" width="10" height="28" rx="3" fill="rgba(0,200,150,0.35)" />
              <rect x="75" y="46" width="10" height="42" rx="3" fill="rgba(0,200,150,0.65)" />
              <rect x="90" y="30" width="10" height="58" rx="3" fill="#00C896" />
              <circle cx="110" cy="78" r="7" fill="#00C896" />
              <text x="126" y="82" fill="#E8EDF5" fontFamily="system-ui" fontSize="36" fontWeight="300">with</text>
              <text x="218" y="82" fill="#00C896" fontFamily="system-ui" fontSize="36" fontWeight="700">Sahib</text>
              {/* TRADE CALL badge */}
              <rect x="60" y="200" width="960" height="80" rx="12" fill="rgba(0,200,150,0.1)" stroke="rgba(0,200,150,0.25)" strokeWidth="2" />
              <text x="540" y="252" fill="#00C896" fontFamily="system-ui" fontSize="28" fontWeight="700" textAnchor="middle" letterSpacing="4">INTRADAY CALL · NSE</text>
              {/* Stock */}
              <text x="540" y="400" fill="#E8EDF5" fontFamily="Georgia, serif" fontSize="80" textAnchor="middle">STOCK NAME</text>
              {/* BUY badge */}
              <rect x="380" y="440" width="320" height="90" rx="12" fill="rgba(0,200,150,0.15)" stroke="#00C896" strokeWidth="2" />
              <text x="540" y="503" fill="#00C896" fontFamily="system-ui" fontSize="56" fontWeight="900" textAnchor="middle">BUY</text>
              {/* Price levels */}
              {[
                { label: 'ENTRY', value: '₹ XXX – XXX', color: '#E8EDF5', y: 620 },
                { label: 'TARGET 1', value: '₹ XXX', color: '#00C896', y: 760 },
                { label: 'TARGET 2', value: '₹ XXX', color: '#00C896', y: 900 },
                { label: 'STOP LOSS', value: '₹ XXX', color: '#F47B7B', y: 1040 },
              ].map((item) => (
                <g key={item.label}>
                  <rect x="80" y={item.y - 60} width="920" height="110" rx="10" fill="#0C1219" stroke="#1A2333" strokeWidth="1" />
                  <text x="140" y={item.y} fill="#4A6580" fontFamily="system-ui" fontSize="24" fontWeight="600" letterSpacing="2">{item.label}</text>
                  <text x="940" y={item.y} fill={item.color} fontFamily="Courier New, monospace" fontSize="36" fontWeight="700" textAnchor="end">{item.value}</text>
                </g>
              ))}
              {/* Watermark */}
              <text x="540" y="1220" fill="#E8EDF5" fontFamily="system-ui" fontSize="32" fontWeight="300" textAnchor="middle">withsahib.com</text>
              {/* Disclaimer */}
              <rect x="40" y="1780" width="1000" height="100" rx="10" fill="rgba(212,168,67,0.06)" stroke="rgba(212,168,67,0.15)" strokeWidth="1" />
              <text x="540" y="1820" fill="#4A6580" fontFamily="system-ui" fontSize="18" textAnchor="middle">SEBI RA: Sahib Singh Hora · INH000026266</text>
              <text x="540" y="1848" fill="#2A3E52" fontFamily="system-ui" fontSize="16" textAnchor="middle">Investments subject to market risk. Not guaranteed returns.</text>
            </svg>
          </div>

          {/* Facebook Cover */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, letterSpacing: 2, color: '#4A6580', textTransform: 'uppercase', marginBottom: 12 }}>Facebook Cover — 851×315</p>
            <svg width="100%" viewBox="0 0 851 315" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 8 }}>
              <rect width="851" height="315" fill="#0C1219" />
              <rect width="851" height="315" fill="url(#tgrid)" opacity="0.35" />
              <rect x="0" y="312" width="851" height="3" fill="#00C896" />
              <circle cx="700" cy="80" r="200" fill="rgba(0,200,150,0.05)" />
              <rect x="50" y="40" width="5" height="14" rx="1.5" fill="rgba(0,200,150,0.35)" />
              <rect x="59" y="32" width="5" height="22" rx="1.5" fill="rgba(0,200,150,0.65)" />
              <rect x="68" y="22" width="5" height="32" rx="1.5" fill="#00C896" />
              <circle cx="79" cy="50" r="3.5" fill="#00C896" />
              <text x="88" y="52" fill="#E8EDF5" fontFamily="system-ui" fontSize="18" fontWeight="300">with</text>
              <text x="126" y="52" fill="#00C896" fontFamily="system-ui" fontSize="18" fontWeight="700">Sahib</text>
              <text x="170" y="52" fill="#E8EDF5" fontFamily="system-ui" fontSize="18" fontWeight="300">.com</text>
              <text x="50" y="140" fill="#E8EDF5" fontFamily="Georgia, serif" fontSize="36" fontWeight="400">Sahib Singh Hora</text>
              <text x="50" y="175" fill="#8FA8C0" fontFamily="system-ui" fontSize="15">SEBI Registered Research Analyst · Altitans Intelligence Pvt Ltd</text>
              <rect x="50" y="198" width="180" height="28" rx="5" fill="rgba(212,168,67,0.1)" stroke="rgba(212,168,67,0.25)" strokeWidth="1" />
              <text x="140" y="217" fill="#D4A843" fontFamily="Courier New, monospace" fontSize="12" textAnchor="middle">INH000026266</text>
              <text x="50" y="268" fill="#4A6580" fontFamily="system-ui" fontSize="12">Intraday Calls · Options Tips · Swing Trades · AI Research · 1-on-1 Advisory</text>
              <text x="50" y="288" fill="#4A6580" fontFamily="system-ui" fontSize="11">sahib13singh13@gmail.com  ·  withsahib.com</text>
            </svg>
          </div>
        </section>

        {/* ── SECTION 4: COLOUR PALETTE ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHeader n="04" title="Colour Palette" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {COLORS.map((c) => {
              const isDark = ['#06090F', '#141F2E', '#0D1A28', '#1A2333'].includes(c.hex)
              return (
                <div key={c.hex} style={{ border: '1px solid #1A2333', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: 64, background: c.hex, border: isDark ? '1px solid #243040' : 'none' }} />
                  <div style={{ padding: '10px 12px', background: '#0C1219' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#E8EDF5', marginBottom: 2 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#00C896', fontFamily: 'Courier New, monospace', marginBottom: 4 }}>{c.hex}</div>
                    <div style={{ fontSize: 11, color: '#4A6580', lineHeight: 1.4 }}>{c.role}</div>
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
            <AssetCard label="DM Serif Display — Headlines">
              <div style={{ fontFamily: 'Georgia, serif', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { size: 56, weight: 400, label: 'H1 · 56px · 400' },
                  { size: 40, weight: 400, label: 'H2 · 40px · 400' },
                  { size: 28, weight: 400, label: 'H3 · 28px · 400' },
                  { size: 20, weight: 400, label: 'H4 · 20px · 400' },
                ].map((s) => (
                  <div key={s.size}>
                    <div style={{ fontSize: 10, color: '#4A6580', marginBottom: 2, fontFamily: 'system-ui', letterSpacing: 1 }}>{s.label}</div>
                    <div style={{ fontSize: s.size, fontWeight: s.weight, color: '#E8EDF5', lineHeight: 1.1 }}>withSahib</div>
                  </div>
                ))}
              </div>
            </AssetCard>

            <AssetCard label="Outfit — Body Text">
              <div style={{ fontFamily: 'system-ui', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { size: 18, weight: 600, label: 'Large · 18px · 600' },
                  { size: 16, weight: 400, label: 'Body · 16px · 400' },
                  { size: 14, weight: 400, label: 'Small · 14px · 400' },
                  { size: 12, weight: 300, label: 'Caption · 12px · 300' },
                  { size: 11, weight: 700, label: 'Label · 11px · 700 · UPPERCASE', upper: true },
                ].map((s) => (
                  <div key={s.size + s.weight}>
                    <div style={{ fontSize: 10, color: '#4A6580', marginBottom: 2, letterSpacing: 1 }}>{s.label}</div>
                    <div style={{ fontSize: s.size, fontWeight: s.weight, color: '#8FA8C0', textTransform: s.upper ? 'uppercase' : undefined, letterSpacing: s.upper ? 2 : 0 }}>
                      SEBI Registered Research Analyst India
                    </div>
                  </div>
                ))}
              </div>
            </AssetCard>
          </div>
        </section>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #1A2333', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#2A3E52' }}>© 2026 Altitans Intelligence Pvt Ltd · Sahib Singh Hora · SEBI RA INH000026266</p>
          <Link href="/" style={{ fontSize: 12, color: '#00C896', textDecoration: 'none' }}>← Back to withSahib.com</Link>
        </div>
      </div>
    </div>
  )
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function SectionHeader({ n, title }: { n: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, borderBottom: '1px solid #1A2333', paddingBottom: 16 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#00C896', letterSpacing: 2, fontFamily: 'Courier New, monospace' }}>{n}</span>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: '#E8EDF5' }}>{title}</h2>
    </div>
  )
}

function AssetCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0C1219', border: '1px solid #1A2333', borderRadius: 12, padding: '20px 24px' }}>
      <p style={{ fontSize: 11, letterSpacing: '1.5px', color: '#4A6580', textTransform: 'uppercase', marginBottom: 16 }}>{label}</p>
      {children}
    </div>
  )
}
