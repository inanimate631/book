import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { SocialLinks } from '../components/SocialLinks'

function DownArrow() {
  return (
    <svg className="not-found-arrow" viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r="34" />
      <path d="M36 19v29m0 0 14-14m-14 14L22 34" />
    </svg>
  )
}

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <Header variant="book" compact />

      <section className="not-found-content" aria-labelledby="not-found-title">
        <h1 id="not-found-title" className="sr-only">Сторінка не знайдена</h1>
        <div className="not-found-copy">
          <p>Дякую, за те що зацікавились мною та моїми послугами.</p>
          <p>На поточний момент сайт знаходиться в процесі розробки.</p>
          <p>Повноцінна робоча версія з'явиться найближчим часом.</p>
          <p>А поки можете придбати мою книгу ось тут</p>
        </div>

        <a className="not-found-scroll" href="#not-found-order" aria-label="Перейти до замовлення книги">
          <DownArrow />
        </a>

        <a id="not-found-order" className="not-found-order" href="/book#order">
          ЗАМОВИТИ КНИГУ
        </a>

        <div className="not-found-social">
          <SocialLinks />
        </div>
      </section>

      <Footer />
    </main>
  )
}
