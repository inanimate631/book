import { ArrowIcon } from '../ArrowIcon'
import type { QuoteCardData } from '../../data/quotes'

type QuoteCardProps = QuoteCardData & {
  index: number
}

export function QuoteCard({ text, side, mobileText, index }: QuoteCardProps) {
  const turnArrow = index % 2 === 0

  return (
    <article className={`quote-card quote-card--${side} quote-card--${index + 1}${turnArrow ? ' quote-card--turn' : ''}`}>
      <div className="quote-card__content">
        <p className="quote-card__text quote-card__text--desktop">{text}</p>
        {mobileText && (
          <p className="quote-card__text quote-card__text--mobile">
            {mobileText.beforeQuestion}
            <strong>«{mobileText.question}»</strong>
          </p>
        )}
        <span className="quote-number">0{index + 1}</span>
      </div>
      <div className="quote-arrow"><ArrowIcon tone="green" /></div>
    </article>
  )
}
