import { useMemo, useState, type ReactNode } from 'react'
import { initialTransactions } from '../data/mock'
import type { Transaction } from '../domain/types'
import { TransactionsContext } from './transactions-context'

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const value = useMemo(() => ({
    transactions,
    addTransaction: (transaction: Transaction) => setTransactions((items) => [transaction, ...items]),
  }), [transactions])
  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}
