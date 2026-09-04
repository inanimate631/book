import { useEffect, useRef, useState } from 'react'
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
  const navRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    const previousBodyOverflow = document.body.style.overflow
    const previousDocumentOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target

      if (!(target instanceof Node)) return
      if (navRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return

      setMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousDocumentOverflow
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMenuOpen])

  return (
    <>
      <header className={`site-header ${variant === 'book' ? 'site-header--book' : ''} ${compact ? 'site-header--compact' : ''}`}>
        <a className="brand" href="/" aria-label="К — головна">
          <BrandMark />
        </a>
        <nav ref={navRef} className={`nav ${isMenuOpen ? 'is-open' : ''}`} aria-label="Головна навігація">
          {navigation.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <a className="nav-mobile-book" href="/book" onClick={() => setMenuOpen(false)}>КНИГА</a>
        </nav>
        <button className="outline-button header-button" type="button" onClick={() => {
          setMenuOpen(false)
          setContactOpen(true)
        }}>
          ЗВ’ЯЗАТИСЯ
        </button>
        {compact && (
          <button
            ref={menuButtonRef}
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
      </header>
      <ContactModal key={isContactOpen ? 'open' : 'closed'} isOpen={isContactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
