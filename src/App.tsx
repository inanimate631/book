import './styles/main.scss'
import { BookLandingPage } from './pages/BookLandingPage'
import { BusinessConsultingPage } from './pages/BusinessConsultingPage'
import { LegalPage } from './pages/LegalPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'

  if (pathname === '/privacy-policy') return <LegalPage type="privacy" />
  if (pathname === '/terms-of-use') return <LegalPage type="terms" />
  if (pathname === '/cookies') return <LegalPage type="cookies" />
  if (pathname === '/404') return <NotFoundPage />

  if (pathname.startsWith('/book')) return <BookLandingPage />
  if (pathname === '/') return <BusinessConsultingPage />
  return <NotFoundPage />
}

export default App
