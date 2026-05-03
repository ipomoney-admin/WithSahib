import type { Metadata } from 'next'
import { OpsClient } from './OpsClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Agent Command Center — withSahib',
  robots: { index: false, follow: false },
}

export default function OpsPage() {
  return <OpsClient />
}
