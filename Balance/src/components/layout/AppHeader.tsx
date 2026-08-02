import { ChevronDown } from 'lucide-react'
import { ArqWordmark } from '../brand/ArqWordmark'
import { useSpaces } from '../../context/space-context'

export function AppHeader() {
  const { activeSpace } = useSpaces()

  return (
    <header className="app-header">
      <ArqWordmark micro />
      <button
        className="space-switcher interactive"
        type="button"
        aria-label={`Активний простір: ${activeSpace?.name ?? 'не вибрано'}`}
      >
        <span>Спільний простір</span>
        <strong>{activeSpace?.name ?? 'ARQ Balance'}</strong>
        <ChevronDown size={12} strokeWidth={1.6} aria-hidden="true" />
      </button>
    </header>
  )
}
