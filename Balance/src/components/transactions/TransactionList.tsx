import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router'
import { useCategories } from '../../context/categories-context'
import type { Transaction } from '../../domain/types'
import { formatDate } from '../../lib/format'
import { Amount } from '../ui/Amount'
import { CategoryIcon } from '../ui/CategoryIcon'
import { cardVariants, listVariants, reducedCardVariants } from '../../motion/motionTokens'

export function TransactionList({
  transactions,
  linkToDetails = true,
}: {
  transactions: Transaction[]
  linkToDetails?: boolean
}) {
  const reduceMotion = useReducedMotion()
  const { categories } = useCategories()
  const rowMotion = reduceMotion ? reducedCardVariants : cardVariants

  return (
    <motion.ul className="transaction-list" aria-label="Операції" variants={listVariants} initial="hidden" animate="visible">
      {transactions.map((transaction) => {
        const category = categories.find((item) => item.id === transaction.categoryId)
        const content = (
          <>
            <CategoryIcon icon={category?.icon} type={transaction.type} size="sm" />
            <span className="transaction-copy">
              <strong>{category?.name ?? 'Операція'}</strong>
              <small>{transaction.personName} · {formatDate(transaction.transactionDate)}</small>
            </span>
            <Amount minor={transaction.amountMinor} type={transaction.type} />
          </>
        )

        return (
          <motion.li key={transaction.id} variants={rowMotion}>
            {linkToDetails ? (
              <Link className="transaction-row interactive" to={`/app/transactions/${transaction.id}`}>{content}</Link>
            ) : (
              <div className="transaction-row">{content}</div>
            )}
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
