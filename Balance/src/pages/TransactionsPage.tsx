import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AppHeader } from '../components/layout/AppHeader'
import { TransactionList } from '../components/transactions/TransactionList'
import { useTransactions } from '../context/transactions-context'
import { categories } from '../data/mock'
import type { Transaction, TransactionType } from '../domain/types'

type Filter = 'all' | TransactionType

function groupLabel(date: string) {
  if (date === '2026-07-27') return 'Сьогодні'
  if (date === '2026-07-26') return 'Учора'
  return 'Раніше'
}

export function TransactionsPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const { transactions } = useTransactions()

  const filtered = useMemo(() => transactions
    .filter((item) => !item.deletedAt)
    .filter((item) => filter === 'all' || item.type === filter)
    .filter((item) => {
      const category = categories.find((categoryItem) => categoryItem.id === item.categoryId)
      return `${category?.name ?? ''} ${item.comment ?? ''}`.toLocaleLowerCase('uk').includes(query.toLocaleLowerCase('uk').trim())
    })
    .sort((a, b) => b.transactionDate.localeCompare(a.transactionDate)), [filter, query, transactions])

  const groups = filtered.reduce<Record<string, Transaction[]>>((result, transaction) => {
    const label = groupLabel(transaction.transactionDate)
    result[label] = [...(result[label] ?? []), transaction]
    return result
  }, {})

  return (
    <>
      <AppHeader />

      <label className="search-field">
        <Search size={15} strokeWidth={1.5} aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Пошук операцій" />
      </label>

      <div className="filter-chips" aria-label="Фільтр операцій">
        {[
          ['all', 'Усі'],
          ['income', 'Доходи'],
          ['expense', 'Витрати'],
        ].map(([value, label]) => (
          <button
            className={filter === value ? 'is-active' : ''}
            key={value}
            type="button"
            onClick={() => setFilter(value as Filter)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="transaction-groups">
          {Object.entries(groups).map(([label, items]) => (
            <section key={label}>
              <h1>{label}</h1>
              <TransactionList transactions={items} />
            </section>
          ))}
        </div>
      ) : (
        <div className="inline-empty">
          <span aria-hidden="true">⌁</span>
          <h1>Нічого не знайдено</h1>
          <p>Спробуйте змінити запит або фільтр.</p>
        </div>
      )}
    </>
  )
}
