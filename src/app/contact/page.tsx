import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Sahib Singh Hora — SEBI RA INH000026266',
  description:
    'Get in touch with Sahib Singh Hora, SEBI Registered Research Analyst INH000026266. Book appointments, ask about services, or reach out for research queries.',
  alternates: { canonical: 'https://www.withsahib.com/contact' },
  openGraph: {
    title: 'Contact — withSahib SEBI RA',
    description: 'Get in touch with Sahib Singh Hora, SEBI Registered Research Analyst INH000026266.',
    url: 'https://www.withsahib.com/contact',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
