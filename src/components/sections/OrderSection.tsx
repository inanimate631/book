import { useState } from 'react'
import type { FormEvent } from 'react'
import { createCardInvoice } from '../../services/orderService'
import { NovaPoshtaFields } from '../NovaPoshtaFields'
import type { NovaPoshtaSelection } from '../NovaPoshtaFields'
import { Reveal } from '../Reveal'
import costImage from '../../assets/cost.png'

export function OrderSection() {
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [delivery, setDelivery] = useState<NovaPoshtaSelection>({ city: null, warehouse: null })

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
      payment: 'card' as const,
      comment: String(formData.get('comment') ?? ''),
    }

    if (!delivery.city || !delivery.warehouse) {
      setSubmitState('error')
      setErrorMessage('Оберіть місто та відділення Нової пошти')
      return
    }

    setSubmitState('sending')
    setErrorMessage('')

    try {
      const pageUrl = await createCardInvoice(order)
      window.location.assign(pageUrl)
    } catch (error) {
      setSubmitState('error')
      setErrorMessage(error instanceof Error ? error.message : 'Спробуйте ще раз')
    }
  }

  return (
    <section className="order section" id="order">
      <Reveal className="section-heading section-heading--center section-heading--order">
        <h2>ЦІНА</h2>
      </Reveal>
      <Reveal className="order-cost-reveal" delay={60}>
        <div className="order-products">
          <article className="order-product order-product--digital" aria-disabled="true">
            <span className="order-product-label">Електронна книга</span>
            <strong className="order-product-price">00 <small>грн</small></strong>
            <span className="order-product-status">СКОРО В ПРОДАЖУ</span>
          </article>
          <article className="order-product order-product--paper">
            <picture className="order-cost-picture">
              <img className="order-cost" src={costImage} alt="Вартість паперової книги — 700 гривень" />
            </picture>
            <div className="order-cost-copy">
              <span>Паперова книга</span>
              <strong>700 <small>грн</small></strong>
              <a href="#order-form">ЗАМОВИТИ</a>
            </div>
          </article>
        </div>
      </Reveal>
      <Reveal className="section-heading section-heading--order-form" delay={100}>
        <h2>ФОРМА ЗАМОВЛЕННЯ</h2>
      </Reveal>
      <Reveal className="order-form-reveal" delay={120}>
        <form id="order-form" className="order-form" onSubmit={handleSubmit}>
          <div className="form-grid form-grid--two">
            <FormField label="ІМ’Я" name="name" placeholder="Ваше ім’я" required />
            <FormField label="ПРІЗВИЩЕ" name="surname" placeholder="Ваше прізвище" required />
          </div>
          <FormField label="ТЕЛЕФОН" name="phone" placeholder="+380 (__) ___ __ __" type="tel" required />
          <FormField label="E-MAIL" name="email" placeholder="name@company.com" type="email" required />
          <NovaPoshtaFields value={delivery} onChange={setDelivery} />
          <label className="payment-field">
            <span>СПОСІБ ОПЛАТИ</span>
            <div className="payment-select payment-select--static">
              <input type="hidden" name="payment" value="card" />
              <span className="payment-select__trigger">Онлайн-оплата карткою</span>
            </div>
          </label>
          <label>КОМЕНТАР<textarea name="comment" placeholder="Ваш коментар" rows={3} /></label>
          <button className="outline-button submit-button" type="submit">
            {submitState === 'sending' ? 'ОБРОБЛЯЄМО...' : submitState === 'success' ? 'ЗАЯВКУ ОТРИМАНО' : 'ЗАМОВИТИ КНИГУ'}
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
