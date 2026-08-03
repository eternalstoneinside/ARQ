import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { ArqWordmark } from '../brand/ArqWordmark'
import { SpaceSwitcherSheet } from '../SpaceSwitcherSheet'
import { useSpaces } from '../../context/space-context'

export function AppHeader() {
  const { activeSpace } = useSpaces()
  const [switcherOpen, setSwitcherOpen] = useState(false)

  return (
    <header className="app-header">
      <ArqWordmark compact />
      <button
        className={`space-switcher interactive ${switcherOpen ? 'is-open' : ''}`}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={switcherOpen}
        aria-label={`Змінити активний простір. Зараз: ${activeSpace?.name ?? 'не вибрано'}`}
        onClick={() => setSwitcherOpen(true)}
      >
        <span>Спільний простір</span>
        <strong>{activeSpace?.name ?? 'ARQ Balance'}</strong>
        <ChevronDown size={14} strokeWidth={1.55} aria-hidden="true" />
      </button>
      <SpaceSwitcherSheet open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </header>
  )
}
