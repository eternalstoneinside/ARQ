import { ArqWordmark } from '../brand/ArqWordmark'
import { useSpaces } from '../../context/space-context'

export function AppHeader() {
  const { activeSpace } = useSpaces()

  return (
    <header className="app-header">
      <ArqWordmark compact />
      <div className="space-switcher" aria-label={`Активний простір: ${activeSpace?.name ?? 'не вибрано'}`}>
        <span>Спільний простір</span>
        <strong>{activeSpace?.name ?? 'ARQ Balance'}</strong>
      </div>
    </header>
  )
}
