import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Transaction, TransactionInput, TransactionType } from '../domain/types'
import { transactionErrorMessage } from '../lib/errors'
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

function sortTransactions(items: Transaction[]) {
  return [...items].sort((first, second) =>
    second.transactionDate.localeCompare(first.transactionDate)
    || second.createdAt.localeCompare(first.createdAt))
}

function upsertTransaction(items: Transaction[], next: Transaction) {
  return sortTransactions([
    next,
    ...items.filter((transaction) => transaction.id !== next.id),
  ])
}

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { activeSpace } = useSpaces()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestId = useRef(0)
  const mutationLocks = useRef(new Set<string>())

  const fetchTransactions = useCallback(async (showLoading: boolean, surfaceError: boolean) => {
    const currentRequest = ++requestId.current
    if (!activeSpace || !user) {
      setTransactions([])
      setLoading(false)
      return []
    }

    if (showLoading) setLoading(true)
    if (surfaceError) setError(null)
    const { data, error: queryError } = await getSupabase()
      .from('transactions')
      .select('*')
      .eq('space_id', activeSpace.id)
      .is('deleted_at', null)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (queryError) {
      if (currentRequest !== requestId.current) return []
      if (surfaceError) {
        setError(transactionErrorMessage(queryError, 'Не вдалося завантажити операції.'))
      }
      if (showLoading) setLoading(false)
      throw queryError
    }

    const next = data.map(toTransaction)
    if (currentRequest !== requestId.current) return next
    setTransactions(sortTransactions(next))
    setError(null)
    if (showLoading) setLoading(false)
    return next
  }, [activeSpace, user])

  const refreshTransactions = useCallback(
    () => fetchTransactions(true, true),
    [fetchTransactions],
  )

  const refreshInBackground = useCallback(
    () => fetchTransactions(false, false),
    [fetchTransactions],
  )

  useEffect(() => {
    void refreshTransactions().catch(() => undefined)
  }, [refreshTransactions])

  useEffect(() => {
    if (!activeSpace || !user) return

    const client = getSupabase()
    let disposed = false
    let refreshTimer: ReturnType<typeof setTimeout> | null = null
    let channel: ReturnType<typeof client.channel> | null = null

    const scheduleRefresh = () => {
      if (disposed) return
      if (refreshTimer) clearTimeout(refreshTimer)
      refreshTimer = setTimeout(() => {
        refreshTimer = null
        void refreshInBackground().catch(() => undefined)
      }, 80)
    }

    const connect = async () => {
      await client.realtime.setAuth()
      if (disposed) return

      channel = client
        .channel(`space:${activeSpace.id}:transactions`, {
          config: { private: true },
        })
        .on('broadcast', { event: '*' }, scheduleRefresh)
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') scheduleRefresh()
        })
    }

    const handleOnline = () => scheduleRefresh()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') scheduleRefresh()
    }

    window.addEventListener('online', handleOnline)
    document.addEventListener('visibilitychange', handleVisibility)
    void connect().catch(() => undefined)

    return () => {
      disposed = true
      if (refreshTimer) clearTimeout(refreshTimer)
      window.removeEventListener('online', handleOnline)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (channel) void client.removeChannel(channel)
    }
  }, [activeSpace, refreshInBackground, user])

  const withMutationLock = useCallback(async <Result,>(key: string, mutation: () => Promise<Result>) => {
    if (mutationLocks.current.has(key)) {
      throw new Error('Ця операція вже виконується.')
    }
    mutationLocks.current.add(key)
    try {
      return await mutation()
    } finally {
      mutationLocks.current.delete(key)
    }
  }, [])

  const value = useMemo(() => ({
    transactions,
    error,
    loading,
    refreshTransactions,
    addTransaction: (input: TransactionInput) => withMutationLock('create', async () => {
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
        const message = transactionErrorMessage(insertError, 'Не вдалося додати операцію.')
        throw new Error(message)
      }
      const created = toTransaction(data)
      setTransactions((current) => upsertTransaction(current, created))
      return created
    }),
    updateTransaction: (transactionId: string, input: TransactionInput) => withMutationLock(`update:${transactionId}`, async () => {
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
        const message = transactionErrorMessage(updateError, 'Не вдалося зберегти зміни.')
        throw new Error(message)
      }
      const updated = toTransaction(data)
      setTransactions((current) => upsertTransaction(current, updated))
      return updated
    }),
    deleteTransaction: (transactionId: string) => withMutationLock(`delete:${transactionId}`, async () => {
      if (!activeSpace || !user) throw new Error('Оберіть простір і увійдіть до ARQ.')
      setError(null)
      const transaction = transactions.find((item) => item.id === transactionId && item.spaceId === activeSpace.id)
      if (!transaction) throw new Error('Операцію не знайдено в активному просторі.')
      const { error: deleteError } = await getSupabase().rpc('delete_transaction', { p_transaction_id: transactionId })

      if (deleteError) {
        const message = transactionErrorMessage(deleteError, 'Не вдалося видалити операцію.')
        throw new Error(message)
      }
      setTransactions((current) => current.filter((transaction) => transaction.id !== transactionId))
    }),
  }), [activeSpace, error, loading, refreshTransactions, transactions, user, withMutationLock])

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}
