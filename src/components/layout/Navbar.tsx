'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Methodology', href: '/about' },
  { label: 'The Analyst', href: '/about#analyst' },
  { label: 'Who It\'s For', href: '/about#who' },
  { label: 'Plans', href: '/pricing' },
  { label: 'Track Record', href: '/track-record' },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href.split('#')[0] + '/')

  return (
    <>
      <nav
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
          backgroundColor: scrolled ? 'rgba(250,250,248,0.95)' : 'transparent',
          transition: 'all 0.3s ease',
          background: scrolled ? undefined : 'transparent',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }} aria-label="withSahib homepage">
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px' }}>
            <span style={{ color: 'var(--black)' }}>with</span>
            <span style={{ color: 'var(--green)' }}>Sahib</span>
          </span>
        </Link>

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
                color: isActive(link.href) ? 'var(--green)' : 'var(--text2)',
                background: isActive(link.href) ? 'rgba(26,122,74,0.06)' : 'transparent',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-body)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Login */}
          <Link
            href="/auth/login"
            className="hide-mobile"
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
            Log in
          </Link>

          {/* CTA */}
          <Link
            href="/auth/register"
            className="btn btn-primary btn-sm"
            style={{ textDecoration: 'none' }}
          >
            Start Free
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
                color: isActive(link.href) ? 'var(--green)' : 'var(--text)',
                background: isActive(link.href) ? 'rgba(26,122,74,0.06)' : 'transparent',
                borderBottom: '1px solid var(--border)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              Log in
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setMenuOpen(false)}
              className="btn btn-primary btn-lg"
              style={{ textDecoration: 'none', justifyContent: 'center' }}
            >
              Start Free
            </Link>
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
