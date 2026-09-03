import { useEffect, useRef } from 'react'
import type { CSSProperties, PropsWithChildren } from 'react'

type RevealProps = PropsWithChildren<{
  className?: string
  delay?: number
  rootMargin?: string
}>

export function Reveal({ children, className = '', delay = 0, rootMargin = '0px 0px -40px' }: RevealProps) {
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !('IntersectionObserver' in window)) {
      element.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        element.classList.add('is-visible')
        observer.unobserve(element)
      },
      { threshold: 0.14, rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  const revealStyle = { '--reveal-delay': `${delay}ms` } as CSSProperties

  return (
    <div ref={elementRef} className={`reveal ${className}`} style={revealStyle}>
      {children}
    </div>
  )
}
