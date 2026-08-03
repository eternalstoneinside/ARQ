import { AlertCircle, ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Inbox } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router'
import { AppHeader } from '../components/layout/AppHeader'
import { CountUpBalance } from '../components/motion/CountUpBalance'
import { TransactionList } from '../components/transactions/TransactionList'
import { StateView } from '../components/ui/StateView'
import { useTransactions } from '../context/transactions-context'
import { formatMoney } from '../lib/format'
import { productEntryVariants, reducedProductEntryVariants } from '../motion/motionTokens'

export function HomePage() {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const reduceMotion = useReducedMotion()
  const { transactions, loading, error } = useTransactions()
  const active = transactions.filter((item) => !item.deletedAt)
  const income = active.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amountMinor, 0)
  const expense = active.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amountMinor, 0)

  return (
    <motion.div
      className="home-entry"
      variants={reduceMotion ? reducedProductEntryVariants : productEntryVariants}
      initial="hidden"
      animate="visible"
    >
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
            <CountUpBalance minor={income - expense} />
          ) : <span className="balance-mask">••••••</span>}
        </div>
        <p className="balance-caption">Усі активні доходи й витрати<br />у вашому просторі.</p>
      </section>

      <section className="money-summary" aria-label="Підсумок доходів і витрат">
        <div>
          <span><ArrowDownLeft size={16} strokeWidth={1.45} />Доходи</span>
          <strong className="positive">+{formatMoney(income)}</strong>
        </div>
        <div>
          <span><ArrowUpRight size={16} strokeWidth={1.45} />Витрати</span>
          <strong className="negative">−{formatMoney(expense)}</strong>
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
          <StateView icon={AlertCircle} title="Не вдалося завантажити операції" description="Перевірте з’єднання й спробуйте ще раз." />
        ) : active.length ? (
          <TransactionList transactions={active.slice(0, 4)} />
        ) : (
          <StateView icon={Inbox} title="Поки що немає операцій" description="Додайте першу операцію, щоб побачити активність." />
        )}
      </section>
    </motion.div>
  )
}
