import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Get in Touch | withSahib',
  description:
    'Reach out to withSahib for support, advisory inquiries, or partnership questions. SEBI Registered Research Analyst Sahib Singh Hora (INH000026266) — Jabalpur, Madhya Pradesh.',
  alternates: { canonical: '/contact' },
  openGraph: {
    url: 'https://www.withsahib.com/contact',
    title: 'Contact withSahib | withSahib',
    description:
      'Contact SEBI RA INH000026266 — support, advisory inquiries, partnerships.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
