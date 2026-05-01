'use client'

export function CertificateViewer() {
  return (
    <iframe
      src="/certificates/INH000026266-Sahib.pdf"
      width="100%"
      style={{ minHeight: '80vh', border: '1px solid var(--border)', borderRadius: 12, display: 'block' }}
      title="SEBI Registration Certificate INH000026266"
      onContextMenu={(e) => e.preventDefault()}
    />
  )
}
