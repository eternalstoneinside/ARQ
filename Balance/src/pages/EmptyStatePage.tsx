import { Inbox } from 'lucide-react'
import { useOutletContext } from 'react-router'
import type { AppOutletContext } from '../components/layout/outlet-context'

export function EmptyStatePage() {
  const { openTransactionSheet } = useOutletContext<AppOutletContext>()

  return (
    <section className="empty-page">
      <div className="empty-illustration"><Inbox size={37} strokeWidth={1.25} /></div>
      <h1>Поки що немає операцій</h1>
      <p>Додайте першу операцію,<br />щоб побачити активність.</p>
      <button className="primary-action interactive" type="button" onClick={openTransactionSheet}>Додати операцію</button>
    </section>
  )
}
