import { formatMoney } from '../../lib/format'
import type { TransactionType } from '../../domain/types'
import { useFinancialPrivacy } from '../../context/privacy-context'

export function Amount({ minor, type, signed = true }: { minor: number; type: TransactionType; signed?: boolean }) {
  const { moneyVisible } = useFinancialPrivacy()

  return (
    <span
      className={`amount ${type === 'income' ? 'positive' : 'negative'} ${moneyVisible ? '' : 'money-mask'}`}
      aria-label={moneyVisible ? undefined : 'Суму приховано'}
    >
      {moneyVisible ? `${signed ? (type === 'income' ? '+' : '−') : ''}${formatMoney(minor)}` : '••••'}
    </span>
  )
}
