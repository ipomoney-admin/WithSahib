import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a 1-on-1 Advisory Session | withSahib',
  description:
    'Schedule a personal advisory session with SEBI Registered Research Analyst Sahib Singh Hora (INH000026266). Portfolio review, trade planning, and market strategy — tailored to your risk profile.',
  alternates: { canonical: '/appointments' },
  openGraph: {
    url: 'https://www.withsahib.com/appointments',
    title: 'Book a 1-on-1 Advisory Session | withSahib',
    description:
      'Personal advisory with SEBI RA INH000026266 — portfolio review, trade strategy, market planning.',
  },
}

export default function AppointmentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
