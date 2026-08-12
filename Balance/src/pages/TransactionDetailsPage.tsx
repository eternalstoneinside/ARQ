import { ArrowLeft, MoreHorizontal, PencilLine } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { AddTransactionSheet } from '../components/transactions/AddTransactionSheet'
import { TransactionActionsSheet } from '../components/transactions/TransactionActionsSheet'
import { CategoryIcon } from '../components/ui/CategoryIcon'
import { useAuth } from '../context/auth-context'
import { useSpaces } from '../context/space-context'
import { useTransactions } from '../context/transactions-context'
import { useFinancialPrivacy } from '../context/privacy-context'
import { categories } from '../data/mock'
import { formatDate, formatMoneyParts } from '../lib/format'
import { canManageTransaction } from '../lib/transactions'

const timeFormatter = new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' })

export function TransactionDetailsPage() {
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const { user } = useAuth()
  const { activeSpace } = useSpaces()
  const { transactions, loading } = useTransactions()
  const { moneyVisible } = useFinancialPrivacy()
  const [actionsOpen, setActionsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const transaction = transactions.find((item) => item.id === transactionId && !item.deletedAt)

  if (loading) {
    return (
      <article className="detail-page detail-page--loading" role="status" aria-label="Завантаження операції">
        <span /><span /><span />
      </article>
    )
  }
  if (!transaction) return <Navigate to="/app/transactions" replace />

  const category = categories.find((item) => item.id === transaction.categoryId)
  const amount = formatMoneyParts(transaction.amountMinor)
  const canManage = canManageTransaction(transaction, user?.id, activeSpace?.role)

  return (
    <article className="detail-page">
      <header className="simple-header">
        <button className="icon-button interactive" type="button" onClick={() => navigate(-1)} aria-label="Назад"><ArrowLeft size={18} /></button>
        {canManage ? (
          <button className="icon-button interactive" type="button" aria-label="Керувати операцією" onClick={() => setActionsOpen(true)}><MoreHorizontal size={19} /></button>
        ) : <span />}
      </header>

      <section className="detail-hero">
        <div className="detail-icon"><CategoryIcon icon={category?.icon} type={transaction.type} /></div>
        <h1>{category?.name ?? 'Операція'}</h1>
        <p className={`${transaction.type === 'income' ? 'positive' : 'negative'} ${moneyVisible ? '' : 'money-mask'}`}>
          {moneyVisible ? <>{transaction.type === 'income' ? '+' : '−'}{amount.number} <small>{amount.currency}</small></> : '••••••'}
        </p>
        <span>{transaction.personName} · {formatDate(transaction.transactionDate)}</span>
      </section>

      <dl className="detail-list">
        <div><dt>Категорія</dt><dd>{category?.name ?? 'Інше'}</dd></div>
        <div><dt>Учасник</dt><dd>{transaction.personName}</dd></div>
        <div><dt>Дата</dt><dd>{formatDate(transaction.transactionDate)}</dd></div>
        <div><dt>Опис</dt><dd>{transaction.comment || 'Без опису'}</dd></div>
        <div><dt>Додано</dt><dd>{formatDate(transaction.createdAt.slice(0, 10))}, {timeFormatter.format(new Date(transaction.createdAt))}</dd></div>
      </dl>

      {canManage && (
        <button className="secondary-action interactive" type="button" onClick={() => setEditOpen(true)}>
          <PencilLine size={15} strokeWidth={1.5} />Редагувати операцію
        </button>
      )}

      <TransactionActionsSheet
        open={actionsOpen}
        transaction={transaction}
        onClose={() => setActionsOpen(false)}
        onEdit={() => {
          setActionsOpen(false)
          setEditOpen(true)
        }}
        onDeleted={() => navigate('/app/transactions', { replace: true })}
      />
      <AddTransactionSheet open={editOpen} transaction={transaction} onClose={() => setEditOpen(false)} />
    </article>
  )
}
