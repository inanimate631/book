import { Header } from '../components/Header'
import { ContentsSection } from '../components/sections/ContentsSection'
import { BookIntroSection } from '../components/sections/BookIntroSection'
import { OrderSection } from '../components/sections/OrderSection'
import { QuotesSection } from '../components/sections/QuotesSection'
import { Footer } from '../components/Footer'

export function BookLandingPage() {
  return (
    <main className="book-page">
      <Header variant="book" compact />
      <BookIntroSection />
      <QuotesSection />
      <ContentsSection />
      <OrderSection />
      <Footer />
    </main>
  )
}
