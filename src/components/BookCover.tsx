type BookCoverProps = {
  large?: boolean
}

export function BookCover({ large = false }: BookCoverProps) {
  return (
    <div
      className={`book-scene ${large ? 'book-scene--large' : ''}`}
      aria-label="Обкладинка книги Як продати майже все"
    >
      <div className="book-spine"><span>ДЕНИС КОБИЛЯНСКИЙ</span></div>
      <div className="book-cover">
        <p>ЯК</p>
        <p>ПРОДАТИ</p>
        <i>майже</i>
        <p>ВСЕ</p>
        <small>Покрокова інструкція для B2B</small>
      </div>
    </div>
  )
}
