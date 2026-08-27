import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createCardInvoice, submitCashOrder } from '../../services/orderService'
import { Reveal } from '../Reveal'

export function OrderSection() {
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const order = {
      name: String(formData.get('name') ?? ''),
      surname: String(formData.get('surname') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      email: String(formData.get('email') ?? ''),
      address: String(formData.get('address') ?? ''),
      payment: String(formData.get('payment') ?? 'card') === 'cash' ? 'cash' as const : 'card' as const,
      comment: String(formData.get('comment') ?? ''),
    }

    setSubmitState('sending')
    setErrorMessage('')

    try {
      if (order.payment === 'card') {
        const pageUrl = await createCardInvoice(order)
        window.location.assign(pageUrl)
        return
      }

      await submitCashOrder(order)
      form.reset()
      setSubmitState('success')
    } catch (error) {
      setSubmitState('error')
      setErrorMessage(error instanceof Error ? error.message : 'Спробуйте ще раз')
    }
  }

  return (
    <section className="order section" id="order">
      <Reveal className="section-heading section-heading--center section-heading--order">
        <h2>ЦІНА — 700 ГРН.</h2>
      </Reveal>
      <Reveal className="order-form-reveal" delay={120}>
        <form className="order-form" onSubmit={handleSubmit}>
          <div className="form-grid form-grid--two">
            <FormField label="ІМ’Я" name="name" placeholder="Ваше ім’я" required />
            <FormField label="ПРІЗВИЩЕ" name="surname" placeholder="Ваше прізвище" required />
          </div>
          <FormField label="ТЕЛЕФОН" name="phone" placeholder="+380 (__) ___ __ __" type="tel" required />
          <FormField label="E-MAIL" name="email" placeholder="name@company.com" type="email" required />
          <FormField label="АДРЕСА ДОСТАВКИ" name="address" placeholder="Місто, відділення або адреса" required />
          <label className="payment-field">
            <span>СПОСІБ ОПЛАТИ</span>
            <PaymentSelect />
          </label>
          <label>КОМЕНТАР<textarea name="comment" placeholder="Ваш коментар" rows={3} /></label>
          <button className="outline-button submit-button" type="submit">
            {submitState === 'sending' ? 'ОБРОБЛЯЄМО...' : submitState === 'success' ? 'ЗАЯВКУ ОТРИМАНО' : 'ЗАМОВИТИ'}
          </button>
          {submitState === 'error' && <p className="order-error">{errorMessage}</p>}
        </form>
      </Reveal>
    </section>
  )
}

type FormFieldProps = {
  label: string
  name: string
  placeholder: string
  type?: string
  required?: boolean
}

function FormField({ label, name, placeholder, type = 'text', required = false }: FormFieldProps) {
  return (
    <label>{label}<input name={name} placeholder={placeholder} type={type} required={required} /></label>
  )
}

const paymentOptions = [
  { value: 'card', label: 'Онлайн-оплата карткою' },
  { value: 'cash', label: 'Післяплата' },
] as const

function PaymentSelect() {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState<(typeof paymentOptions)[number]['value']>('card')
  const selectRef = useRef<HTMLDivElement>(null)
  const selectedOption = paymentOptions.find((option) => option.value === value) ?? paymentOptions[0]

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) setIsOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="payment-select" ref={selectRef}>
      <input type="hidden" name="payment" value={value} />
      <button
        className="payment-select__trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{selectedOption.label}</span>
        <span className="select-chevron" aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="payment-select__menu" role="listbox" aria-label="Спосіб оплати">
          {paymentOptions.map((option) => (
            <button
              className={`payment-select__option ${option.value === value ? 'is-selected' : ''}`}
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                setValue(option.value)
                setIsOpen(false)
              }}
            >
              <span>{option.label}</span>
              {option.value === value && <span className="payment-select__check" aria-hidden="true">↗</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
