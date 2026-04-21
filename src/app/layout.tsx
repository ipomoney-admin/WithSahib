import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Toaster } from 'sonner'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'withSahib — SEBI Registered Research Analyst',
    template: '%s | withSahib',
  },
  description:
    'Institutional-grade research, intraday calls, options picks, and AI-powered analysis by Sahib Singh Hora — SEBI Registered Research Analyst (INH000026266).',
  keywords: [
    'SEBI Research Analyst',
    'stock market calls',
    'intraday tips',
    'options trading',
    'swing trading',
    'NSE stocks',
    'technical analysis',
    'INH000026266',
    'Sahib Singh Hora',
  ],
  authors: [{ name: 'Sahib Singh Hora', url: 'https://withsahib.com' }],
  creator: 'Sahib Singh Hora',
  publisher: 'Altitans Intelligence Private Limited',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://withsahib.com',
    siteName: 'withSahib',
    title: 'withSahib — SEBI Registered Research Analyst',
    description:
      'Institutional-grade research and trade calls by Sahib Singh Hora, SEBI RA (INH000026266).',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'withSahib — SEBI Registered Research Analyst',
    description: 'Research with clarity. Trade with confidence.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#06090F' },
    { media: '(prefers-color-scheme: light)', color: '#F0F4FA' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={outfit.variable}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--surface)',
                border: '1px solid var(--border2)',
                color: 'var(--text)',
                fontFamily: 'Outfit, sans-serif',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
