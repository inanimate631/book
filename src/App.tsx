import './App.css'
import { BookLandingPage } from './pages/BookLandingPage'
import { BusinessConsultingPage } from './pages/BusinessConsultingPage'
import { LegalPage } from './pages/LegalPage'

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'

  if (pathname === '/privacy-policy') return <LegalPage type="privacy" />
  if (pathname === '/terms-of-use') return <LegalPage type="terms" />
  if (pathname === '/cookies') return <LegalPage type="cookies" />

  return pathname.startsWith('/book') ? <BookLandingPage /> : <BusinessConsultingPage />
}

export default App
