'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react'
import { AnimatedLogo } from '@/components/ui/AnimatedLogo'

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

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
          background: scrolled ? undefined : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          backgroundColor: scrolled
            ? theme === 'dark'
              ? 'rgba(6,9,15,0.92)'
              : 'rgba(240,244,250,0.92)'
            : 'transparent',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }} aria-label="Go to withSahib homepage">
          <AnimatedLogo />
        </Link>

        {/* Desktop Links */}
        <div
          className="hide-mobile"
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: isActive(link.href) ? 500 : 400,
                color: isActive(link.href) ? 'var(--emerald)' : 'var(--text2)',
                background: isActive(link.href)
                  ? 'rgba(0,200,150,0.08)'
                  : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* SEBI badge — desktop only */}
          <span
            className="hide-mobile"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '1px',
              color: 'var(--text3)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '3px 7px',
              fontFamily: 'Courier New, monospace',
            }}
          >
            SEBI · INH000026266
          </span>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '7px 10px',
              cursor: 'pointer',
              color: 'var(--text2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              transition: 'all 0.2s',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span className="hide-mobile">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Login */}
          <Link
            href="/auth/login"
            style={{
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 400,
              color: 'var(--text2)',
              border: '1px solid var(--border)',
              transition: 'all 0.2s',
            }}
            className="hide-mobile"
          >
            Log in
          </Link>

          {/* CTA */}
          <Link
            href="/auth/register"
            className="btn btn-primary btn-sm"
            style={{ textDecoration: 'none' }}
          >
            Get Started
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="show-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
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
            animation: 'fadeIn 0.2s ease',
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
                borderRadius: 'var(--radius-sm)',
                fontSize: '16px',
                fontWeight: isActive(link.href) ? 500 : 300,
                color: isActive(link.href) ? 'var(--emerald)' : 'var(--text)',
                background: isActive(link.href)
                  ? 'rgba(0,200,150,0.08)'
                  : 'transparent',
                borderBottom: '1px solid var(--border)',
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
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: 400,
                color: 'var(--text)',
                border: '1px solid var(--border)',
                textAlign: 'center',
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
              Get Started Free
            </Link>
          </div>
          <div
            style={{
              marginTop: 'auto',
              padding: '16px',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}
          >
            <p style={{ fontSize: '11px', color: 'var(--text3)', letterSpacing: '1px', fontFamily: 'Courier New, monospace' }}>
              SEBI REGISTERED · INH000026266
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
              Investments are subject to market risk.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

