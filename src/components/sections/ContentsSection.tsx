import { Reveal } from '../Reveal'
import { BookSpread } from './BookSpread'

export function ContentsSection() {
  return (
    <section className="contents section" id="contents">
      <Reveal className="section-heading section-heading--contents">
        <h2>
          <span className="contents-heading-desktop">ЗМІСТ</span>
          <span className="contents-heading-mobile">ДЕМО</span>
        </h2>
      </Reveal>
      <div className="contents-layout">
        <Reveal className="contents-visual">
          <BookSpread />
        </Reveal>
      </div>
    </section>
  )
}
