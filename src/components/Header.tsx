import { useState } from 'react'
import { BrandMark } from './BrandMark'
import { ContactModal } from './ContactModal'

const navigation = [
  { href: '/', label: 'ГОЛОВНА' },
  { href: '/book#contents', label: 'ПОРТФОЛІО' },
  { href: '/book#quotes', label: 'ПОСЛУГИ' },
  { href: '/book#footer', label: 'БЛОГ' },
]

type HeaderProps = { variant?: 'default' | 'book' }

export function Header({ variant = 'default' }: HeaderProps) {
  const [isContactOpen, setContactOpen] = useState(false)

  return (
    <header className={`site-header ${variant === 'book' ? 'site-header--book' : ''}`}>
      <a className="brand" href="/" aria-label="К — головна">
        <BrandMark />
      </a>
      <nav className="nav" aria-label="Головна навігація">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </nav>
      <button className="outline-button header-button" type="button" onClick={() => setContactOpen(true)}>
        ЗВ’ЯЗАТИСЯ
      </button>
      <ContactModal key={isContactOpen ? 'open' : 'closed'} isOpen={isContactOpen} onClose={() => setContactOpen(false)} />
    </header>
  )
}
