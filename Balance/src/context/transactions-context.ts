import { createContext, useContext } from 'react'
import type { Transaction } from '../domain/types'

export interface TransactionsContextValue {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
}

export const TransactionsContext = createContext<TransactionsContextValue | null>(null)

export function useTransactions() {
  const context = useContext(TransactionsContext)
  if (!context) throw new Error('useTransactions має використовуватися в TransactionsProvider')
  return context
}
