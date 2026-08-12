import { ArqWordmark } from '../brand/ArqWordmark'

export function RouteStatus({ message = 'Завантаження…' }: { message?: string }) {
  return (
    <main className="entry-screen route-status" role="status" aria-live="polite">
      <ArqWordmark />
      <p>{message}</p>
    </main>
  )
}
