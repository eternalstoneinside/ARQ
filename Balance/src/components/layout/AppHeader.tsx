import { ChevronDown } from 'lucide-react'
import { ArqWordmark } from '../brand/ArqWordmark'

export function AppHeader() {
  return (
    <header className="app-header">
      <ArqWordmark micro />
      <button
        className="space-switcher interactive"
        type="button"
        onClick={() => alert('Перемикання просторів буде доступне після підключення облікового запису.')}
      >
        <span>Спільний простір</span>
        <strong>Дім Олени й Андрія</strong>
        <ChevronDown size={12} strokeWidth={1.6} aria-hidden="true" />
      </button>
    </header>
  )
}
