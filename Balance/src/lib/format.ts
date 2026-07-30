import type { Currency } from '../domain/types'

const moneyFormatter = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'long',
})

export function formatMoney(amountMinor: number, currency: Currency = 'PLN'): string {
  if (currency !== 'PLN') throw new Error(`Непідтримувана валюта: ${currency}`)
  return moneyFormatter.format(amountMinor / 100)
}

export function formatMoneyParts(amountMinor: number, currency: Currency = 'PLN'): { number: string; currency: string } {
  if (currency !== 'PLN') throw new Error(`Непідтримувана валюта: ${currency}`)
  const parts = moneyFormatter.formatToParts(amountMinor / 100)
  return {
    number: parts.filter((part) => part.type !== 'currency' && part.type !== 'literal').map((part) => part.value).join(''),
    currency: 'PLN',
  }
}

export function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T12:00:00`))
}

export function parseAmountToMinor(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, '').replace(',', '.')
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return null
  const [whole, fraction = ''] = normalized.split('.')
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
}
