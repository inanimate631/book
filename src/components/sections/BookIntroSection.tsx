import blueBook from '../../assets/blue.png'
import mobileHero2 from '../../assets/mobile/Hero-2.png'
import { Reveal } from '../Reveal'
import { SocialLinks } from '../SocialLinks'

export function BookIntroSection() {
  return (
    <section className="book-intro" id="book">
      <div className="book-intro-stage">
        <Reveal className="book-intro-card">
          <picture className="book-intro-picture">
            <source media="(max-width: 700px)" srcSet={mobileHero2} />
            <img className="book-intro-background" src={blueBook} alt="Синя обкладинка книги" />
          </picture>
        </Reveal>
        <Reveal className="book-intro-social" delay={120}>
          <SocialLinks />
        </Reveal>
        <Reveal className="book-intro-cta" delay={180} rootMargin="0px">
          <a className="outline-button" href="#order-form">ЗАМОВИТИ КНИГУ</a>
        </Reveal>
      </div>
    </section>
  )
}
