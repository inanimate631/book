import blueBook from '../../assets/blue.png'
import { Reveal } from '../Reveal'
import { SocialLinks } from '../SocialLinks'

export function BookIntroSection() {
  return (
    <section className="book-intro" id="book">
      <Reveal className="book-intro-card">
        <img className="book-intro-background" src={blueBook} alt="Синя обкладинка книги" />
      </Reveal>
      <Reveal className="book-intro-social" delay={120}>
        <SocialLinks />
      </Reveal>
      <Reveal className="book-intro-cta" delay={180}>
        <a className="outline-button" href="#order">ЗАМОВИТИ КНИГУ</a>
      </Reveal>
    </section>
  )
}
