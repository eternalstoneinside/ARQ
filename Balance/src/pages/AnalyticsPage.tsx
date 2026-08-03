import { AlertCircle, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AppHeader } from '../components/layout/AppHeader'
import { CategoryIcon } from '../components/ui/CategoryIcon'
import { StateView } from '../components/ui/StateView'
import { useTransactions } from '../context/transactions-context'
import { categories } from '../data/mock'
import type { TransactionType } from '../domain/types'
import { formatMoney, formatMoneyParts } from '../lib/format'

type AnalyticsTab = 'Огляд' | 'Доходи' | 'Витрати' | 'Баланс'

const monthFormatter = new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric' })

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function dateFromMonth(key: string) {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month - 1, 1, 12)
}

function shiftMonth(key: string, amount: number) {
  const date = dateFromMonth(key)
  date.setMonth(date.getMonth() + amount)
  return monthKey(date)
}

function monthLabel(key: string) {
  const value = monthFormatter.format(dateFromMonth(key))
  return value.slice(0, 1).toLocaleUpperCase('uk-UA') + value.slice(1)
}

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('Огляд')
  const [period, setPeriod] = useState(() => monthKey(new Date()))
  const { transactions, loading, error } = useTransactions()

  const monthOptions = useMemo(() => {
    const values = new Set<string>([period, monthKey(new Date())])
    transactions.forEach((transaction) => values.add(transaction.transactionDate.slice(0, 7)))
    for (let offset = 1; offset <= 5; offset += 1) values.add(shiftMonth(monthKey(new Date()), -offset))
    return [...values].sort().reverse()
  }, [period, transactions])

  const current = transactions.filter((transaction) => transaction.transactionDate.startsWith(period))
  const previous = transactions.filter((transaction) => transaction.transactionDate.startsWith(shiftMonth(period, -1)))
  const income = current.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amountMinor, 0)
  const expense = current.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amountMinor, 0)
  const previousIncome = previous.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amountMinor, 0)
  const previousExpense = previous.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amountMinor, 0)

  const metric = activeTab === 'Доходи' ? income : activeTab === 'Витрати' ? expense : income - expense
  const previousMetric = activeTab === 'Доходи' ? previousIncome : activeTab === 'Витрати' ? previousExpense : previousIncome - previousExpense
  const metricParts = formatMoneyParts(Math.abs(metric))
  const metricTitle = activeTab === 'Доходи' ? 'Доходи' : activeTab === 'Витрати' ? 'Витрати' : 'Баланс місяця'
  const metricSign = activeTab === 'Доходи' ? '+' : activeTab === 'Витрати' ? '−' : metric > 0 ? '+' : metric < 0 ? '−' : ''
  const metricClass = activeTab === 'Доходи' || (activeTab !== 'Витрати' && metric > 0)
    ? 'positive'
    : activeTab === 'Витрати' || metric < 0 ? 'negative' : ''

  const comparison = (() => {
    if (current.length === 0) return 'Немає операцій за цей період'
    if (previousMetric === 0) return 'Перший період із даними для порівняння'
    const difference = metric - previousMetric
    const percentage = Math.round(Math.abs(difference) / Math.abs(previousMetric) * 100)
    if (difference === 0) return 'Без змін проти попереднього місяця'
    return `На ${percentage}% ${difference > 0 ? 'більше' : 'менше'}, ніж минулого місяця`
  })()

  const chartValues = useMemo(() => {
    const date = dateFromMonth(period)
    const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const bucketCount = Math.min(days, 18)
    const raw = Array.from({ length: bucketCount }, (_, index) => {
      const startDay = Math.floor(index * days / bucketCount) + 1
      const endDay = Math.floor((index + 1) * days / bucketCount)
      const items = current.filter((transaction) => {
        const day = Number(transaction.transactionDate.slice(8, 10))
        return day >= startDay && day <= endDay
      })
      return {
        income: items.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amountMinor, 0),
        expense: items.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amountMinor, 0),
      }
    })
    const maximum = Math.max(1, ...raw.flatMap((item) => [item.income, item.expense]))
    return raw.map((item) => ({
      income: activeTab === 'Витрати' ? 0 : item.income ? Math.max(4, item.income / maximum * 100) : 0,
      expense: activeTab === 'Доходи' ? 0 : item.expense ? Math.max(4, item.expense / maximum * 100) : 0,
    }))
  }, [activeTab, current, period])

  const breakdownType: TransactionType = activeTab === 'Доходи' ? 'income' : 'expense'
  const breakdownItems = current.filter((item) => item.type === breakdownType)
  const breakdownTotal = breakdownItems.reduce((sum, item) => sum + item.amountMinor, 0)
  const grouped = categories
    .filter((item) => item.type === breakdownType)
    .map((category) => ({
      ...category,
      amount: breakdownItems.filter((item) => item.categoryId === category.id).reduce((sum, item) => sum + item.amountMinor, 0),
    }))
    .filter((item) => item.amount > 0)
    .sort((first, second) => second.amount - first.amount)

  return (
    <>
      <AppHeader />

      <div className="analytics-tabs" role="tablist" aria-label="Розділи аналітики">
        {(['Огляд', 'Доходи', 'Витрати', 'Баланс'] as AnalyticsTab[]).map((tab) => (
          <button
            className={activeTab === tab ? 'is-active' : ''}
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="analytics-period">
        <label>
          <span>Період</span>
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            {monthOptions.map((option) => <option value={option} key={option}>{monthLabel(option)}</option>)}
          </select>
        </label>
        <div>
          <button className="icon-button interactive" type="button" aria-label="Попередній місяць" onClick={() => setPeriod((currentPeriod) => shiftMonth(currentPeriod, -1))}><ChevronLeft size={15} /></button>
          <button className="icon-button interactive" type="button" aria-label="Наступний місяць" onClick={() => setPeriod((currentPeriod) => shiftMonth(currentPeriod, 1))}><ChevronRight size={15} /></button>
        </div>
      </section>

      {loading ? (
        <div className="analytics-loading" role="status" aria-label="Завантаження аналітики"><span /><span /><span /></div>
      ) : error ? (
        <div className="analytics-state"><StateView icon={AlertCircle} title="Аналітика недоступна" description="Не вдалося отримати операції цього простору." /></div>
      ) : (
        <>
          <section className="analytics-overview" aria-labelledby="analytics-total">
            <p>{metricTitle}</p>
            <h1 id="analytics-total" className={metricClass}>
              {metricSign}{metricParts.number}<small>{metricParts.currency}</small>
            </h1>
            <span>{comparison}</span>

            <div className="bar-chart" aria-label={`Рух коштів за ${monthLabel(period)}`}>
              <div className="chart-grid" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="chart-bars" aria-hidden="true">
                {chartValues.map((value, index) => (
                  <span className="chart-group" key={index}>
                    <i style={{ height: `${value.income}%` }} />
                    <b style={{ height: `${value.expense}%` }} />
                  </span>
                ))}
              </div>
              <div className="chart-axis"><span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>31</span></div>
            </div>
          </section>

          <section className="category-breakdown">
            <header className="section-heading section-heading--small">
              <h2>{breakdownType === 'income' ? 'Джерела доходу' : 'Категорії витрат'}</h2>
              <span>{grouped.length}</span>
            </header>
            {grouped.length ? (
              <ul>
                {grouped.map((item) => {
                  const percentage = breakdownTotal ? Math.round(item.amount / breakdownTotal * 100) : 0
                  return (
                    <li key={item.id}>
                      <CategoryIcon icon={item.icon} type={breakdownType} size="sm" />
                      <span className="category-name">{item.name}</span>
                      <span className="category-share">
                        <small>{percentage}%</small>
                        <i><b style={{ width: `${percentage}%` }} /></i>
                      </span>
                      <strong>{formatMoney(item.amount)}</strong>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="analytics-empty"><Inbox size={18} strokeWidth={1.45} /><span>У цьому періоді ще немає даних.</span></div>
            )}
          </section>
        </>
      )}
    </>
  )
}
