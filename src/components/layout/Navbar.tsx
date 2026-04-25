'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { LogoMark } from '@/components/ui/Logo'

const NAV_LINKS = [
  { label: 'Methodology', href: '/about' },
  { label: "The Analyst", href: '/about#analyst' },
  { label: "Who It's For", href: '/who-its-for' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Learn', href: '/courses' },
]

const SOCIAL_LINKS = [
  { href: 'https://x.com/WithSahib_', label: 'X / Twitter', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.856-8.179-10.644h7.077l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { href: 'https://www.instagram.com/withsahib_/', label: 'Instagram', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { href: 'https://www.linkedin.com/in/sahibsinghhora/', label: 'LinkedIn', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
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
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }} aria-label="withSahib homepage">
          <LogoMark size={26} animated={true} />
          <span style={{ fontSize: '20px', letterSpacing: '-0.3px' }}>
            <span style={{ fontFamily: 'var(--font-body)', color: '#0A0A0A', fontWeight: 400 }}>with</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontWeight: 700, color: '#FF6B00' }}>Sahib</span>
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
          {/* Social icons */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
            {SOCIAL_LINKS.map(({ href, label, svg }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text3)',
                  textDecoration: 'none',
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.color = 'var(--text)'
                  el.style.background = 'var(--bg2)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.color = 'var(--text3)'
                  el.style.background = 'transparent'
                }}
              >
                {svg}
              </a>
            ))}
          </div>

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
