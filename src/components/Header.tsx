import { useState } from 'react'
import { BrandMark } from './BrandMark'
import { ContactModal } from './ContactModal'

const navigation = [
  { href: '/', label: 'ГОЛОВНА' },
  { href: '/404', label: 'ПОРТФОЛІО' },
  { href: '/404', label: 'ПОСЛУГИ' },
  { href: '/404', label: 'БЛОГ' },
]

type HeaderProps = { variant?: 'default' | 'book' }

type ExtendedHeaderProps = HeaderProps & { compact?: boolean }

export function Header({ variant = 'default', compact = false }: ExtendedHeaderProps) {
  const [isContactOpen, setContactOpen] = useState(false)
  const [isMenuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className={`site-header ${variant === 'book' ? 'site-header--book' : ''} ${compact ? 'site-header--compact' : ''}`}>
        <a className="brand" href="/" aria-label="К — головна">
          <BrandMark />
        </a>
        <nav className={`nav ${isMenuOpen ? 'is-open' : ''}`} aria-label="Головна навігація">
          {navigation.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <a className="nav-mobile-book" href="/book" onClick={() => setMenuOpen(false)}>КНИГА</a>
        </nav>
        {compact && (
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={isMenuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        )}
        <span className="header-button-slot" aria-hidden="true" />
      </header>
      <button className="outline-button header-button header-button--fixed" type="button" onClick={() => setContactOpen(true)}>
        ЗВ’ЯЗАТИСЯ
      </button>
      <ContactModal key={isContactOpen ? 'open' : 'closed'} isOpen={isContactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
