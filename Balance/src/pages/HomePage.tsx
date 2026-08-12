import { AlertCircle, ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Inbox } from 'lucide-react'
import { Link } from 'react-router'
import { AppHeader } from '../components/layout/AppHeader'
import { CountUpBalance } from '../components/motion/CountUpBalance'
import { TransactionList } from '../components/transactions/TransactionList'
import { StateView } from '../components/ui/StateView'
import { useTransactions } from '../context/transactions-context'
import { useFinancialPrivacy } from '../context/privacy-context'
import { formatMoney } from '../lib/format'
import { getActiveTransactions, summarizeTransactions } from '../lib/transactions'

export function HomePage() {
  const { moneyVisible, toggleMoneyVisibility } = useFinancialPrivacy()
  const { transactions, loading, error, refreshTransactions } = useTransactions()
  const active = getActiveTransactions(transactions)
  const { income, expense } = summarizeTransactions(transactions)

  return (
    <div className="home-entry">
      <AppHeader />

      <section className="balance-hero" aria-labelledby="balance-title">
        <div className="balance-label">
          <span id="balance-title">Спільний баланс</span>
          <button
            className="icon-button interactive"
            type="button"
            onClick={toggleMoneyVisibility}
            aria-label={moneyVisible ? 'Приховати всі суми' : 'Показати всі суми'}
          >
            {moneyVisible ? <Eye size={14} strokeWidth={1.6} /> : <EyeOff size={14} strokeWidth={1.6} />}
          </button>
        </div>

        <div className={`balance-value ${moneyVisible ? '' : 'is-hidden'}`} aria-live="polite">
          {moneyVisible ? (
            <CountUpBalance minor={income - expense} />
          ) : <span className="balance-mask" aria-label="Суму приховано">••••••</span>}
        </div>
        <p className="balance-caption">Усі активні доходи й витрати<br />у вашому просторі.</p>
      </section>

      <section className="money-summary" aria-label="Підсумок доходів і витрат">
        <div>
          <span><ArrowDownLeft size={16} strokeWidth={1.45} />Доходи</span>
          <strong className={`positive ${moneyVisible ? '' : 'money-mask'}`}>{moneyVisible ? `+${formatMoney(income)}` : '••••'}</strong>
        </div>
        <div>
          <span><ArrowUpRight size={16} strokeWidth={1.45} />Витрати</span>
          <strong className={`negative ${moneyVisible ? '' : 'money-mask'}`}>{moneyVisible ? `−${formatMoney(expense)}` : '••••'}</strong>
        </div>
      </section>

      <section className="activity-section" aria-labelledby="recent-title">
        <header className="section-heading">
          <div>
            <p>Остання активність</p>
            <h2 id="recent-title">Нещодавно</h2>
          </div>
          <Link className="text-link interactive" to="/app/transactions">Переглянути всі</Link>
        </header>

        {loading ? (
          <div className="activity-loading" role="status" aria-label="Завантаження операцій">
            <span /><span /><span />
          </div>
        ) : error ? (
          <StateView
            icon={AlertCircle}
            title="Не вдалося завантажити операції"
            description={error}
            actionLabel="Спробувати ще раз"
            onAction={() => void refreshTransactions().catch(() => undefined)}
          />
        ) : active.length ? (
          <TransactionList transactions={active.slice(0, 4)} />
        ) : (
          <StateView icon={Inbox} title="Поки що немає операцій" description="Додайте першу операцію, щоб побачити активність." />
        )}
      </section>
    </div>
  )
}
