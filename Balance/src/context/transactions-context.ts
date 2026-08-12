import { createContext, useContext } from 'react'
import type { Transaction, TransactionInput } from '../domain/types'

export interface TransactionsContextValue {
  transactions: Transaction[]
  error: string | null
  loading: boolean
  addTransaction: (input: TransactionInput) => Promise<Transaction>
  deleteTransaction: (transactionId: string) => Promise<void>
  refreshTransactions: () => Promise<Transaction[]>
  updateTransaction: (transactionId: string, input: TransactionInput) => Promise<Transaction>
}

export const TransactionsContext = createContext<TransactionsContextValue | null>(null)

export function useTransactions() {
  const context = useContext(TransactionsContext)
  if (!context) throw new Error('useTransactions має використовуватися в TransactionsProvider')
  return context
}
