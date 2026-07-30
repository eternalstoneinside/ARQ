import { ArrowLeft, MoreHorizontal, Scissors } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { CategoryIcon } from '../components/ui/CategoryIcon'
import { useTransactions } from '../context/transactions-context'
import { categories, people } from '../data/mock'
import { formatDate, formatMoneyParts } from '../lib/format'

export function TransactionDetailsPage() {
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const { transactions } = useTransactions()
  const transaction = transactions.find((item) => item.id === transactionId && !item.deletedAt)

  if (!transaction) return <Navigate to="/app/transactions" replace />

  const category = categories.find((item) => item.id === transaction.categoryId)
  const person = people.find((item) => item.id === transaction.personId)
  const amount = formatMoneyParts(transaction.amountMinor)

  return (
    <article className="detail-page">
      <header className="simple-header">
        <button className="icon-button interactive" type="button" onClick={() => navigate(-1)} aria-label="Назад"><ArrowLeft size={18} /></button>
        <button className="icon-button interactive" type="button" aria-label="Інші дії"><MoreHorizontal size={19} /></button>
      </header>

      <section className="detail-hero">
        <div className="detail-icon"><CategoryIcon icon={category?.icon} type={transaction.type} /></div>
        <h1>{category?.name}</h1>
        <p className={transaction.type === 'income' ? 'positive' : 'negative'}>
          {transaction.type === 'income' ? '+' : '−'}{amount.number} <small>{amount.currency}</small>
        </p>
        <span>{person?.name} · {formatDate(transaction.transactionDate)}, 14:42</span>
      </section>

      <dl className="detail-list">
        <div><dt>Категорія</dt><dd>{category?.name}</dd></div>
        <div><dt>Учасник</dt><dd>{person?.name}</dd></div>
        <div><dt>Оплата</dt><dd>Картка {person?.name}</dd></div>
        <div><dt>Опис</dt><dd>{transaction.comment || 'Без опису'}</dd></div>
      </dl>

      <button
        className="secondary-action interactive"
        type="button"
        onClick={() => alert('Розподіл операції буде доступний після підключення облікового запису.')}
      >
        <Scissors size={15} strokeWidth={1.5} />Розділити операцію
      </button>
    </article>
  )
}
