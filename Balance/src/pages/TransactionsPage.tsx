import { AlertCircle, Inbox, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AppHeader } from '../components/layout/AppHeader'
import { TransactionList } from '../components/transactions/TransactionList'
import { StateView } from '../components/ui/StateView'
import { useTransactions } from '../context/transactions-context'
import { categories } from '../data/mock'
import type { Transaction } from '../domain/types'
import { filterTransactions, type TransactionFilter } from '../lib/transactions'

const groupDateFormatter = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })

function localDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function groupLabel(date: string) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (date === localDateKey(today)) return 'Сьогодні'
  if (date === localDateKey(yesterday)) return 'Учора'
  return groupDateFormatter.format(new Date(`${date}T12:00:00`))
}

export function TransactionsPage() {
  const [filter, setFilter] = useState<TransactionFilter>('all')
  const [query, setQuery] = useState('')
  const { transactions, loading, error, refreshTransactions } = useTransactions()

  const filtered = useMemo(
    () => filterTransactions(transactions, filter, query, categories),
    [filter, query, transactions],
  )

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
            onClick={() => setFilter(value as TransactionFilter)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="transaction-page-loading" role="status" aria-label="Завантаження операцій">
          <span /><span /><span /><span />
        </div>
      ) : error ? (
        <div className="transaction-page-state">
          <StateView
            icon={AlertCircle}
            title="Операції недоступні"
            description={error}
            actionLabel="Спробувати ще раз"
            onAction={() => void refreshTransactions().catch(() => undefined)}
          />
        </div>
      ) : filtered.length ? (
        <div className="transaction-groups">
          {Object.entries(groups).map(([label, items]) => (
            <section key={label}>
              <h1>{label}</h1>
              <TransactionList transactions={items} />
            </section>
          ))}
        </div>
      ) : (
        <div className="transaction-page-state">
          <StateView
            icon={Inbox}
            title={transactions.length ? 'Нічого не знайдено' : 'Поки що немає операцій'}
            description={transactions.length ? 'Спробуйте змінити запит або фільтр.' : 'Додайте першу операцію — вона з’явиться тут.'}
          />
        </div>
      )}
    </>
  )
}
