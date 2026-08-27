import { ArrowIcon } from '../ArrowIcon'
import type { QuoteCardData } from '../../data/quotes'

type QuoteCardProps = QuoteCardData & {
  index: number
}

export function QuoteCard({ text, side, index }: QuoteCardProps) {
  const turnArrow = index % 2 === 0

  return (
    <article className={`quote-card quote-card--${side} quote-card--${index + 1}${turnArrow ? ' quote-card--turn' : ''}`}>
      <div className="quote-card__content">
        <p>{text}</p>
        <span className="quote-number">0{index + 1}</span>
      </div>
      <div className="quote-arrow"><ArrowIcon tone="green" /></div>
    </article>
  )
}
