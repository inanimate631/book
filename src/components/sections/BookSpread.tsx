import { useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'

import bookArrow from '../../assets/book-arrow.png'
import page03 from '../../assets/desc-book/page03.png'
import page04 from '../../assets/desc-book/page04.png'
import page05 from '../../assets/desc-book/page05.png'
import page06 from '../../assets/desc-book/page06.png'
import page07 from '../../assets/desc-book/page07.png'
import page08 from '../../assets/desc-book/page08.png'
import page09 from '../../assets/desc-book/page09.png'
import page10 from '../../assets/desc-book/page10.png'
import page11 from '../../assets/desc-book/page11.png'
import page12 from '../../assets/desc-book/page12.png'

const bookPages = [page03, page04, page05, page06, page07, page08, page09, page10, page11, page12]

type FlipBookApi = {
  flipNext: () => void
  flipPrev: () => void
}

type FlipBookRef = {
  pageFlip: () => FlipBookApi
}

export function BookSpread() {
  const flipBookRef = useRef<FlipBookRef | null>(null)
  const mobileFlipBookRef = useRef<FlipBookRef | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [mobileCurrentPage, setMobileCurrentPage] = useState(0)

  const handleDesktopFlip = (event: { data: number }) => {
    setCurrentPage(event.data)
  }

  const handleMobileFlip = (event: { data: number }) => {
    setMobileCurrentPage(event.data)
  }

  const flipNext = () => {
    flipBookRef.current?.pageFlip().flipNext()
  }

  const flipPrevious = () => {
    flipBookRef.current?.pageFlip().flipPrev()
  }

  const flipMobileNext = () => {
    mobileFlipBookRef.current?.pageFlip().flipNext()
  }

  const flipMobilePrevious = () => {
    mobileFlipBookRef.current?.pageFlip().flipPrev()
  }

  return (
    <>
      <div className="book-pages-desktop">
        <div className="book-pages-desktop-frame">
          <HTMLFlipBook
            ref={flipBookRef}
            className="book-flip"
            style={{}}
            width={580}
            height={830}
            size="stretch"
            minWidth={300}
            maxWidth={580}
            minHeight={430}
            maxHeight={830}
            drawShadow
            flippingTime={900}
            usePortrait={false}
            startPage={0}
            startZIndex={0}
            autoSize
            maxShadowOpacity={0.65}
            showCover={false}
            mobileScrollSupport={false}
            clickEventForward
            useMouseEvents
            swipeDistance={30}
            showPageCorners
            disableFlipByClick={false}
            onFlip={handleDesktopFlip}
          >
            {bookPages.map((page, index) => (
              <div className="book-flip-page" key={page}>
                <img src={page} alt={`Сторінка книги ${index + 3}`} />
              </div>
            ))}
          </HTMLFlipBook>

          {currentPage > 0 && (
            <button
              className="book-flip-arrow book-flip-arrow--previous"
              type="button"
              aria-label="Попередній розворот"
              onClick={flipPrevious}
            >
              <img src={bookArrow} alt="" aria-hidden="true" />
            </button>
          )}

          {currentPage < bookPages.length - 2 && (
            <button
              className="book-flip-arrow book-flip-arrow--next"
              type="button"
              aria-label="Наступний розворот"
              onClick={flipNext}
            >
              <img src={bookArrow} alt="" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="book-pages-mobile" aria-label="Сторінки книги">
        <div className="book-pages-mobile-frame">
          <HTMLFlipBook
            ref={mobileFlipBookRef}
            className="book-flip book-flip--mobile"
            style={{}}
            width={300}
            height={400}
            size="stretch"
            minWidth={260}
            maxWidth={300}
            minHeight={400}
            maxHeight={400}
            drawShadow
            flippingTime={900}
            usePortrait
            startPage={0}
            startZIndex={0}
            autoSize
            maxShadowOpacity={0.65}
            showCover={false}
            mobileScrollSupport
            clickEventForward
            useMouseEvents
            swipeDistance={30}
            showPageCorners
            disableFlipByClick={false}
            onFlip={handleMobileFlip}
          >
            {bookPages.map((page, index) => (
              <div className="book-flip-page book-flip-page--mobile" key={page}>
                <img src={page} alt={`Сторінка книги ${index + 3}`} />
              </div>
            ))}
          </HTMLFlipBook>

          {mobileCurrentPage > 0 && (
            <button
              className="book-pages-mobile-arrow book-pages-mobile-arrow--previous"
              type="button"
              aria-label="Попередня сторінка книги"
              onClick={flipMobilePrevious}
            >
              <img src={bookArrow} alt="" aria-hidden="true" />
            </button>
          )}

          {mobileCurrentPage < bookPages.length - 1 && (
            <button
              className="book-pages-mobile-arrow book-pages-mobile-arrow--next"
              type="button"
              aria-label="Наступна сторінка книги"
              onClick={flipMobileNext}
            >
              <img src={bookArrow} alt="" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
