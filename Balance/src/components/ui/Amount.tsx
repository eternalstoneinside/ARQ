import { formatMoney } from '../../lib/format'
import type { TransactionType } from '../../domain/types'

export function Amount({ minor, type, signed = true }: { minor: number; type: TransactionType; signed?: boolean }) {
  return (
    <span className={`amount ${type === 'income' ? 'positive' : 'negative'}`}>
      {signed ? (type === 'income' ? '+' : '−') : ''}{formatMoney(minor)}
    </span>
  )
}
