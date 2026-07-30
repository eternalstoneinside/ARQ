import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { AppHeader } from '../components/layout/AppHeader'
import { CategoryIcon } from '../components/ui/CategoryIcon'
import { useTransactions } from '../context/transactions-context'
import { categories } from '../data/mock'
import { formatMoney, formatMoneyParts } from '../lib/format'

const chartValues = [
  [18, 9], [42, 17], [25, 12], [58, 31], [36, 16], [67, 38],
  [29, 15], [51, 26], [74, 43], [35, 20], [62, 33], [48, 24],
  [82, 46], [41, 22], [69, 38], [54, 30], [76, 44], [46, 27],
]

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('Огляд')
  const { transactions } = useTransactions()
  const active = transactions.filter((item) => !item.deletedAt)
  const expenses = active.filter((item) => item.type === 'expense')
  const expense = expenses.reduce((sum, item) => sum + item.amountMinor, 0)
  const expenseParts = formatMoneyParts(expense)
  const grouped = categories
    .filter((item) => item.type === 'expense')
    .map((category) => ({
      ...category,
      amount: expenses.filter((item) => item.categoryId === category.id).reduce((sum, item) => sum + item.amountMinor, 0),
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  return (
    <>
      <AppHeader />

      <div className="analytics-tabs" role="tablist" aria-label="Розділи аналітики">
        {['Огляд', 'Доходи', 'Витрати', 'Баланс'].map((tab) => (
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
          <select defaultValue="2026-07">
            <option value="2026-07">Липень 2026</option>
          </select>
        </label>
        <div>
          <button className="icon-button interactive" type="button" aria-label="Попередній місяць"><ChevronLeft size={15} /></button>
          <button className="icon-button interactive" type="button" aria-label="Наступний місяць"><ChevronRight size={15} /></button>
        </div>
      </section>

      <section className="analytics-overview" aria-labelledby="expense-total">
        <p>Витрати</p>
        <h1 id="expense-total">
          {expenseParts.number}<small>{expenseParts.currency}</small>
        </h1>
        <span>На 12% менше, ніж у червні</span>

        <div className="bar-chart" aria-label="Графік витрат за липень">
          <div className="chart-grid" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="chart-bars" aria-hidden="true">
            {chartValues.map(([planned, actual], index) => (
              <span className="chart-group" key={index}>
                <i style={{ height: `${planned}%` }} />
                <b style={{ height: `${actual}%` }} />
              </span>
            ))}
          </div>
          <div className="chart-axis"><span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>31</span></div>
        </div>
      </section>

      <section className="category-breakdown">
        <header className="section-heading section-heading--small">
          <h2>Категорії</h2>
          <span>Переглянути всі</span>
        </header>
        <ul>
          {grouped.map((item) => {
            const percentage = expense ? Math.round(item.amount / expense * 100) : 0
            return (
              <li key={item.id}>
                <CategoryIcon icon={item.icon} type="expense" size="sm" />
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
      </section>
    </>
  )
}
