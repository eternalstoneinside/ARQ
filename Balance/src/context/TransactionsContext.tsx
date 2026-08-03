import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Transaction, TransactionInput, TransactionType } from '../domain/types'
import { getSupabase } from '../lib/supabase'
import type { Database } from '../types/database'
import { useAuth } from './auth-context'
import { useSpaces } from './space-context'
import { TransactionsContext } from './transactions-context'

type TransactionRow = Database['public']['Tables']['transactions']['Row']

function toTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    spaceId: row.space_id,
    type: row.type as TransactionType,
    amountMinor: row.amount_minor,
    currency: 'PLN',
    categoryId: row.category_id,
    personId: row.person_id,
    personName: row.person_name,
    transactionDate: row.transaction_date,
    comment: row.comment,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    deletedBy: row.deleted_by,
  }
}

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { activeSpace } = useSpaces()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestId = useRef(0)

  const refreshTransactions = useCallback(async () => {
    const currentRequest = ++requestId.current
    if (!activeSpace || !user) {
      setTransactions([])
      setLoading(false)
      return []
    }

    setLoading(true)
    setError(null)
    const { data, error: queryError } = await getSupabase()
      .from('transactions')
      .select('*')
      .eq('space_id', activeSpace.id)
      .is('deleted_at', null)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (queryError) {
      if (currentRequest !== requestId.current) return []
      const message = queryError.message || 'Не вдалося завантажити операції.'
      setError(message)
      setLoading(false)
      throw queryError
    }

    const next = data.map(toTransaction)
    if (currentRequest !== requestId.current) return next
    setTransactions(next)
    setLoading(false)
    return next
  }, [activeSpace, user])

  useEffect(() => {
    void refreshTransactions().catch(() => undefined)
  }, [refreshTransactions])

  const value = useMemo(() => ({
    transactions,
    error,
    loading,
    refreshTransactions,
    addTransaction: async (input: TransactionInput) => {
      if (!activeSpace || !user) throw new Error('Оберіть простір і увійдіть до ARQ.')
      setError(null)
      const { data, error: insertError } = await getSupabase()
        .from('transactions')
        .insert({
          amount_minor: input.amountMinor,
          category_id: input.categoryId,
          comment: input.comment,
          created_by: user.id,
          currency: 'PLN',
          person_id: input.personId,
          person_name: 'Учасник ARQ',
          space_id: activeSpace.id,
          transaction_date: input.transactionDate,
          type: input.type,
        })
        .select('*')
        .single()

      if (insertError) {
        setError(insertError.message)
        throw insertError
      }
      const created = toTransaction(data)
      setTransactions((current) => [created, ...current].sort((first, second) =>
        second.transactionDate.localeCompare(first.transactionDate)
        || second.createdAt.localeCompare(first.createdAt)))
      return created
    },
    updateTransaction: async (transactionId: string, input: TransactionInput) => {
      if (!activeSpace) throw new Error('Оберіть простір.')
      setError(null)
      const { data, error: updateError } = await getSupabase()
        .from('transactions')
        .update({
          amount_minor: input.amountMinor,
          category_id: input.categoryId,
          comment: input.comment,
          person_id: input.personId,
          transaction_date: input.transactionDate,
          type: input.type,
        })
        .eq('id', transactionId)
        .eq('space_id', activeSpace.id)
        .is('deleted_at', null)
        .select('*')
        .single()

      if (updateError) {
        setError(updateError.message)
        throw updateError
      }
      const updated = toTransaction(data)
      setTransactions((current) => current
        .map((transaction) => transaction.id === updated.id ? updated : transaction)
        .sort((first, second) => second.transactionDate.localeCompare(first.transactionDate)
          || second.createdAt.localeCompare(first.createdAt)))
      return updated
    },
    deleteTransaction: async (transactionId: string) => {
      if (!activeSpace || !user) throw new Error('Оберіть простір і увійдіть до ARQ.')
      setError(null)
      const transaction = transactions.find((item) => item.id === transactionId && item.spaceId === activeSpace.id)
      if (!transaction) throw new Error('Операцію не знайдено в активному просторі.')
      const { error: deleteError } = await getSupabase().rpc('delete_transaction', { p_transaction_id: transactionId })

      if (deleteError) {
        setError(deleteError.message)
        throw deleteError
      }
      setTransactions((current) => current.filter((transaction) => transaction.id !== transactionId))
    },
  }), [activeSpace, error, loading, refreshTransactions, transactions, user])

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}
