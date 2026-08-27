import { quoteCards } from '../../data/quotes'
import { Reveal } from '../Reveal'
import { QuoteCard } from './QuoteCard'

export function QuotesSection() {
  return (
    <section className="quotes section" id="quotes">
      <Reveal className="section-heading section-heading--right">
        <h2>ЦИТАТИ</h2>
      </Reveal>
      <div className="quote-list">
        {quoteCards.map((quote, index) => (
          <Reveal key={quote.text} delay={index * 100} className={`quote-reveal quote-reveal--${quote.side}`}>
            <QuoteCard {...quote} index={index} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
