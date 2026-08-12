import type { Category, Transaction, TransactionType } from '../domain/types'

export type TransactionFilter = 'all' | TransactionType

export function getActiveTransactions(transactions: Transaction[]) {
  return transactions.filter((transaction) => !transaction.deletedAt)
}

export function summarizeTransactions(transactions: Transaction[]) {
  return getActiveTransactions(transactions).reduce(
    (summary, transaction) => {
      summary[transaction.type] += transaction.amountMinor
      return summary
    },
    { income: 0, expense: 0 },
  )
}

export function filterTransactions(
  transactions: Transaction[],
  filter: TransactionFilter,
  query: string,
  categories: Category[],
) {
  const normalizedQuery = query.toLocaleLowerCase('uk').trim()

  return getActiveTransactions(transactions)
    .filter((transaction) => filter === 'all' || transaction.type === filter)
    .filter((transaction) => {
      if (!normalizedQuery) return true
      const category = categories.find((item) => item.id === transaction.categoryId)
      const amount = String(transaction.amountMinor / 100).replace('.', ',')
      return `${category?.name ?? ''} ${transaction.personName} ${transaction.comment ?? ''} ${amount}`
        .toLocaleLowerCase('uk')
        .includes(normalizedQuery)
    })
    .sort((first, second) => second.transactionDate.localeCompare(first.transactionDate)
      || second.createdAt.localeCompare(first.createdAt))
}

export function canManageTransaction(
  transaction: Transaction,
  userId: string | undefined,
  role: 'owner' | 'member' | undefined,
) {
  return Boolean(userId && (transaction.createdBy === userId || role === 'owner'))
}
