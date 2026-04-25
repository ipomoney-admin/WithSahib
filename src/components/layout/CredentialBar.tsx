import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export function CredentialBar() {
  return (
    <div
      style={{
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        padding: '7px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'wrap',
        fontFamily: 'var(--font-body)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text3)' }}>
        <ShieldCheck size={13} color="var(--green)" strokeWidth={2.5} />
        <strong style={{ color: 'var(--green)', fontWeight: 600 }}>SEBI RA</strong>
        <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>INH000026266</span>
      </span>
      <span style={{ color: 'var(--border2)', fontSize: '12px' }}>|</span>
      <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
        <strong style={{ color: 'var(--text2)', fontWeight: 500 }}>NISM</strong> Certified
      </span>
      <span style={{ color: 'var(--border2)', fontSize: '12px' }}>|</span>
      <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
        <strong style={{ color: 'var(--text2)', fontWeight: 500 }}>14+</strong> Years Experience
      </span>
      <span style={{ color: 'var(--border2)', fontSize: '12px' }}>|</span>
      <Link
        href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: '12px', color: 'var(--green)', textDecoration: 'none', fontWeight: 500 }}
      >
        Verify on SEBI.gov.in →
      </Link>
    </div>
  )
}
