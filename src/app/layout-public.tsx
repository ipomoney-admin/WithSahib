import { Navbar } from '@/components/layout/Navbar'
import { CredentialBar } from '@/components/layout/CredentialBar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <CredentialBar />
      <main>{children}</main>
      <BookingBanner />
      <Footer />
    </>
  )
}
