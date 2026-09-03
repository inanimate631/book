import blackArrow from '../assets/b-arrow.svg'
import orangeArrow from '../assets/orange-arrow.svg'

type ArrowIconProps = { tone?: 'green' | 'black' }

export function ArrowIcon({ tone = 'green' }: ArrowIconProps) {
  return (
    <img
      className={`arrow-icon arrow-icon--${tone}`}
      src={tone === 'black' ? blackArrow : orangeArrow}
      alt=""
      aria-hidden="true"
    />
  )
}
