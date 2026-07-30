import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Inbox } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { AppHeader } from '../components/layout/AppHeader'
import { TransactionList } from '../components/transactions/TransactionList'
import { StateView } from '../components/ui/StateView'
import { useTransactions } from '../context/transactions-context'
import { formatMoney, formatMoneyParts } from '../lib/format'

export function HomePage() {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const { transactions } = useTransactions()
  const active = transactions.filter((item) => !item.deletedAt)
  const income = active.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amountMinor, 0)
  const expense = active.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amountMinor, 0)
  const balance = formatMoneyParts(income - expense)

  return (
    <>
      <AppHeader />

      <section className="balance-hero" aria-labelledby="balance-title">
        <div className="balance-label">
          <span id="balance-title">Спільний баланс</span>
          <button
            className="icon-button interactive"
            type="button"
            onClick={() => setBalanceVisible((visible) => !visible)}
            aria-label={balanceVisible ? 'Приховати баланс' : 'Показати баланс'}
          >
            {balanceVisible ? <Eye size={14} strokeWidth={1.6} /> : <EyeOff size={14} strokeWidth={1.6} />}
          </button>
        </div>

        <div className={`balance-value ${balanceVisible ? '' : 'is-hidden'}`} aria-live="polite">
          {balanceVisible ? (
            <>
              <span>{balance.number}</span>
              <small>{balance.currency}</small>
            </>
          ) : <span className="balance-mask">••••••</span>}
        </div>
        <p className="balance-caption">Сума всіх активних доходів і витрат у вашому просторі.</p>
      </section>

      <section className="money-summary" aria-label="Підсумок доходів і витрат">
        <div>
          <span><ArrowDownLeft size={15} strokeWidth={1.7} />Доходи</span>
          <strong className="positive">+{formatMoney(income)}</strong>
        </div>
        <div>
          <span><ArrowUpRight size={15} strokeWidth={1.7} />Витрати</span>
          <strong className="negative">−{formatMoney(expense)}</strong>
        </div>
      </section>

      <section className="activity-section" aria-labelledby="recent-title">
        <header className="section-heading">
          <div>
            <p>Остання активність</p>
            <h2 id="recent-title">Операції</h2>
          </div>
          <Link className="text-link interactive" to="/app/transactions">Переглянути всі</Link>
        </header>

        {active.length ? (
          <TransactionList transactions={active.slice(0, 4)} />
        ) : (
          <StateView icon={Inbox} title="Поки що немає операцій" description="Додайте першу операцію, щоб побачити активність." />
        )}
      </section>
    </>
  )
}
