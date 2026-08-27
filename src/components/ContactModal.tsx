import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type ContactModalProps = {
  isOpen: boolean
  onClose: () => void
}

type SubmitState = 'idle' | 'sending' | 'success' | 'error'

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitState('sending')

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = new URLSearchParams()
    payload.set('name', String(formData.get('name') ?? ''))
    payload.set('email', String(formData.get('email') ?? ''))
    payload.set('comment', String(formData.get('comment') ?? ''))
    payload.set('_replyto', String(formData.get('email') ?? ''))
    payload.set('_subject', 'Нове повідомлення з сайту K PRODATY')
    payload.set('_template', 'table')

    try {
      const response = await fetch('https://formsubmit.co/ajax/info@denkiiashko.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: payload,
      })

      if (!response.ok) throw new Error('Contact form request failed')
      setSubmitState('success')
      form.reset()
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <div className="contact-modal" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <div className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <button className="contact-close" type="button" onClick={onClose} aria-label="Закрити вікно">×</button>
        <h2 id="contact-title">ЗВ’ЯЗАТИСЯ</h2>
        {submitState === 'success' ? (
          <div className="contact-result contact-result--success">
            <strong>ДЯКУЄМО!</strong>
            <span>Ваше повідомлення надіслано.</span>
            <button className="outline-button" type="button" onClick={onClose}>ЗАКРИТИ</button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>ВАШЕ ІМ’Я<input name="name" autoComplete="name" required /></label>
            <label>E-MAIL<input name="email" type="email" autoComplete="email" required /></label>
            <label>КОМЕНТАРІЙ<textarea name="comment" rows={4} required /></label>
            {submitState === 'error' && <p className="contact-error">Не вдалося надіслати повідомлення. Спробуйте ще раз.</p>}
            <button className="outline-button contact-submit" type="submit" disabled={submitState === 'sending'}>
              {submitState === 'sending' ? 'НАДСИЛАЄМО...' : 'ВІДПРАВИТИ'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
