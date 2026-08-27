import blackArrow from '../assets/b-arrow.svg'
import greenArrow from '../assets/g-arrow.svg'

type ArrowIconProps = { tone?: 'green' | 'black' }

export function ArrowIcon({ tone = 'green' }: ArrowIconProps) {
  return (
    <img
      className={`arrow-icon arrow-icon--${tone}`}
      src={tone === 'black' ? blackArrow : greenArrow}
      alt=""
      aria-hidden="true"
    />
  )
}
