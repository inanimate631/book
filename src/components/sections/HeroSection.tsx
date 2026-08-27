import heroBackground from '../../assets/Hero.png'
import blackArrow from '../../assets/b-arrow.svg'
import { Reveal } from '../Reveal'
import { SocialLinks } from '../SocialLinks'

export function HeroSection() {
  return (
    <section className="hero" id="home">
      <Reveal className="hero-copy">
        <h1>BUSINESS<br />CONSULTING</h1>
      </Reveal>
      <Reveal className="hero-social" delay={180}>
        <SocialLinks />
      </Reveal>
      <Reveal className="hero-card" delay={100}>
        <img className="hero-background" src={heroBackground} alt="Інтер’єр палацу" />
        <a className="hero-b-arrow" href="/book" aria-label="Перейти до сторінки книги">
          <img src={blackArrow} alt="" aria-hidden="true" />
        </a>
      </Reveal>
      <Reveal className="hero-cta" delay={300}>
        <a className="outline-button" href="#order">ЗАМОВИТИ КНИГУ</a>
      </Reveal>
    </section>
  )
}
