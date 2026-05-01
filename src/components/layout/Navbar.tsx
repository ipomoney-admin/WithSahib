'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { LogoMark } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguagePicker } from '@/components/ui/LanguagePicker'

// ─── HIRING BAR ───────────────────────────────────────────────────────────────
function HiringBar() {
  const [dismissed, setDismissed] = useState<boolean | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    setDismissed(localStorage.getItem('hiring_bar_dismissed') === '1')
  }, [])

  if (dismissed !== false) return null

  return (
    <div style={{
      height: '36px', background: '#FF6B00',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 48px', position: 'relative', zIndex: 101, flexShrink: 0,
    }}>
      <p style={{
        fontSize: '13px', fontWeight: 500, color: '#FFFFFF',
        fontFamily: 'Inter, system-ui, sans-serif', textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        {t('nav.hiring_bar')}{' '}
        <Link href="/work-with-us" style={{
          color: '#FFFFFF', fontWeight: 700,
          textDecoration: 'underline', textUnderlineOffset: '3px',
        }}>
          {t('nav.hiring_link')}
        </Link>
      </p>
      <button
        onClick={() => {
          localStorage.setItem('hiring_bar_dismissed', '1')
          setDismissed(true)
        }}
        aria-label="Dismiss hiring bar"
        style={{
          position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.8)', padding: '4px',
          display: 'flex', alignItems: 'center',
        }}
      >
        <X size={15} />
      </button>
    </div>
  )
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: '1px solid var(--border2)',
        cursor: 'pointer',
        color: 'var(--text2)',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.color = 'var(--orange)'
        el.style.background = 'rgba(255,107,0,0.06)'
        el.style.borderColor = 'rgba(255,107,0,0.2)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.color = 'var(--text2)'
        el.style.background = 'transparent'
        el.style.borderColor = 'var(--border2)'
      }}
    >
      {dark ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}

const NAV_LINK_DEFS = [
  { key: 'nav.methodology', href: '/methodology' },
  { key: 'nav.services', href: '/services' },
  { key: 'nav.theAnalyst', href: '/about' },
  { key: 'nav.whoItsFor', href: '/who-its-for' },
  { key: 'nav.pricing', href: '/pricing' },
  { key: 'nav.blog', href: '/blog' },
  { key: 'nav.learn', href: '/courses' },
]

const SOCIAL_LINKS = [
  { href: 'https://x.com/WithSahib_', label: 'X / Twitter', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.856-8.179-10.644h7.077l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { href: 'https://www.instagram.com/withsahib_/', label: 'Instagram', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { href: 'https://www.linkedin.com/in/sahibsinghhora/', label: 'LinkedIn', svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [firstName, setFirstName] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])
  const { t } = useLanguage()

  const NAV_LINKS = NAV_LINK_DEFS.map((d) => ({ label: t(d.key), href: d.href }))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const meta = data.user.user_metadata
        const name = meta?.name || meta?.full_name || data.user.email?.split('@')[0] || ''
        setFirstName(name.split(' ')[0] || null)
      }
    })
  }, [supabase])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href.split('#')[0] + '/')

  const navBg = scrolled
    ? (dark ? 'rgba(10,10,10,0.97)' : 'rgba(250,250,248,0.95)')
    : 'transparent'

  return (
    <>
      <HiringBar />
      <nav
        aria-label="Main navigation"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          backgroundColor: navBg,
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo + SEBI subline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }} aria-label="withSahib homepage">
            <LogoMark size={26} animated={true} />
            <span style={{ fontSize: '20px', letterSpacing: '-0.3px' }}>
              <span className="navbar-logo-with" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 400 }}>with</span>
              <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontWeight: 700, color: '#FF6B00' }}>Sahib</span>
            </span>
          </Link>
          <Link
            href="/sebi-certificate"
            className="hide-mobile"
            style={{
              fontSize: '10px',
              color: 'var(--text3)',
              fontFamily: 'Inter, system-ui, sans-serif',
              textDecoration: 'none',
              paddingLeft: '36px',
              letterSpacing: '0.2px',
              lineHeight: 1,
              display: 'block',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--orange)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text3)' }}
          >
            Sahib Singh Hora · SEBI RA INH000026266
          </Link>
        </div>

        {/* Desktop Links */}
        <div
          className="hide-mobile"
          style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--r-sm)',
                fontSize: '14px',
                fontWeight: isActive(link.href) ? 500 : 400,
                color: isActive(link.href) ? 'var(--orange)' : 'var(--text2)',
                background: isActive(link.href) ? 'rgba(255,107,0,0.06)' : 'transparent',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-body)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Desktop: stacked column — lang/theme/cta top row, social icons bottom row */}
          <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LanguagePicker />
              <ThemeToggle />
              {firstName ? (
                <Link
                  href="/dashboard"
                  className="btn btn-primary btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  {firstName}&apos;s Dashboard →
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    style={{
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: 'var(--r-sm)',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: 'var(--text2)',
                      border: '1px solid var(--border2)',
                      transition: 'all 0.2s',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn btn-primary btn-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    {t('nav.startFree')}
                  </Link>
                </>
              )}
            </div>
            {/* Social icons row below CTA */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end' }}>
              <a href="https://x.com/WithSahib_" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"
                style={{ color: 'var(--text4)', display: 'flex', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#FF6B00' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text4)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.856-8.179-10.644h7.077l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.instagram.com/withsahib_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                style={{ color: 'var(--text4)', display: 'flex', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#FF6B00' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text4)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/sahibsinghhora/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                style={{ color: 'var(--text4)', display: 'flex', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#FF6B00' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text4)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Mobile: CTA button */}
          <Link
            href={firstName ? '/dashboard' : '/auth/register'}
            className="show-mobile btn btn-primary btn-sm"
            style={{ textDecoration: 'none' }}
          >
            {firstName ? `${firstName}'s Dashboard →` : t('nav.startFree')}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              background: 'none',
              border: '1px solid var(--border2)',
              borderRadius: 'var(--r-sm)',
              padding: '7px',
              cursor: 'pointer',
              color: 'var(--text2)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bg)',
            zIndex: 99,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            borderTop: '1px solid var(--border)',
            overflowY: 'auto',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: 'none',
                padding: '14px 16px',
                borderRadius: 'var(--r-sm)',
                fontSize: '16px',
                fontWeight: isActive(link.href) ? 500 : 400,
                color: isActive(link.href) ? 'var(--orange)' : 'var(--text)',
                background: isActive(link.href) ? 'rgba(255,107,0,0.06)' : 'transparent',
                borderBottom: '1px solid var(--border)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {firstName ? (
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary btn-lg"
                style={{ textDecoration: 'none', justifyContent: 'center' }}
              >
                {firstName}&apos;s Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textDecoration: 'none',
                    padding: '14px',
                    borderRadius: 'var(--r-md)',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: 'var(--text)',
                    border: '1px solid var(--border2)',
                    textAlign: 'center',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-primary btn-lg"
                  style={{ textDecoration: 'none', justifyContent: 'center' }}
                >
                  {t('nav.startFree')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile social links */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', padding: '0 4px' }}>
            {SOCIAL_LINKS.map(({ href, label, svg }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', textDecoration: 'none' }}>
                {svg}
              </a>
            ))}
          </div>

          <div
            style={{
              marginTop: 'auto',
              padding: '16px',
              background: 'var(--surface)',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)',
            }}
          >
            <p style={{ fontSize: '11px', color: 'var(--text3)', letterSpacing: '1px', fontFamily: 'var(--font-mono)' }}>
              SEBI REGISTERED · INH000026266
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text4)', marginTop: '4px', fontFamily: 'var(--font-body)' }}>
              Investments are subject to market risk.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
