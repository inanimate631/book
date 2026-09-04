import heroBackground from '../../assets/Hero.png'
import blackArrow from '../../assets/b-arrow.svg'
import mobileBlackArrow from '../../assets/black-arrow.svg'
import bookMobileShape from '../../assets/Subtract.png'
import mobileHeroBackground from '../../assets/mobile/mobile-main.png'
import { Reveal } from '../Reveal'
import { SocialLinks } from '../SocialLinks'

export function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-wrapper">
        <Reveal className="hero-copy">
          <h1>BUSINESS<br />CONSULTING</h1>
        </Reveal>
        <Reveal className="hero-social" delay={180}>
          <SocialLinks />
        </Reveal>
        <Reveal className="hero-card" delay={100}>
          <picture className="hero-background-picture">
            <source media="(max-width: 700px)" srcSet={mobileHeroBackground} />
            <img className="hero-background" src={heroBackground} alt="Інтер’єр палацу" />
          </picture>
          <a className="hero-b-arrow" href="/book" aria-label="Перейти до сторінки книги">
            <img src={blackArrow} alt="" aria-hidden="true" />
          </a>
        </Reveal>
        <Reveal className="hero-cta" delay={300} rootMargin="0px">
          <a className="outline-button" href="/book#order-form">ЗАМОВИТИ КНИГУ</a>
        </Reveal>
        <a className="hero-book-mobile" href="/book" aria-label="Перейти до книги">
          <img className="hero-book-mobile-shape" src={bookMobileShape} alt="Обкладинка книги «Як продати майже все»" />
          <span className="hero-phone-arrow" aria-hidden="true">
            <img src={mobileBlackArrow} alt="" />
          </span>
        </a>
      </div>
    </section>
  )
}
