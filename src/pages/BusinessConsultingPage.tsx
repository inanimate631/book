import { Header } from '../components/Header'
import { HeroSection } from '../components/sections/HeroSection'
import { Footer } from '../components/Footer'

export function BusinessConsultingPage() {
  return (
    <main className="business-page">
      <Header compact />
      <HeroSection />
      <Footer />
    </main>
  )
}
