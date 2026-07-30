import { Link } from 'react-router'
import { categories, people } from '../../data/mock'
import type { Transaction } from '../../domain/types'
import { formatDate } from '../../lib/format'
import { Amount } from '../ui/Amount'
import { CategoryIcon } from '../ui/CategoryIcon'

export function TransactionList({
  transactions,
  linkToDetails = true,
}: {
  transactions: Transaction[]
  linkToDetails?: boolean
}) {
  return (
    <ul className="transaction-list" aria-label="Операції">
      {transactions.map((transaction) => {
        const category = categories.find((item) => item.id === transaction.categoryId)
        const person = people.find((item) => item.id === transaction.personId)
        const content = (
          <>
            <CategoryIcon icon={category?.icon} type={transaction.type} size="sm" />
            <span className="transaction-copy">
              <strong>{category?.name}</strong>
              <small>{person?.name} · {formatDate(transaction.transactionDate)}</small>
            </span>
            <Amount minor={transaction.amountMinor} type={transaction.type} />
          </>
        )

        return (
          <li key={transaction.id}>
            {linkToDetails ? (
              <Link className="transaction-row interactive" to={`/app/transactions/${transaction.id}`}>{content}</Link>
            ) : (
              <div className="transaction-row">{content}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
