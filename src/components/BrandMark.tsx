import logo from '../assets/logo.svg'

type BrandMarkProps = {
  dark?: boolean
}

export function BrandMark({ dark = false }: BrandMarkProps) {
  return (
    <img
      className={`mark ${dark ? 'mark--dark' : ''}`}
      src={logo}
      width="48"
      height="48"
      alt="K logo"
    />
  )
}
