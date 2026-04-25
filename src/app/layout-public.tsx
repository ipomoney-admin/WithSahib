import { Navbar } from '@/components/layout/Navbar'
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
      <main>{children}</main>
      <BookingBanner />
      <Footer />
    </>
  )
}
