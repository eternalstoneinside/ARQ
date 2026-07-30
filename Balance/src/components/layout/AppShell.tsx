import { ChartNoAxesColumn, Home, Plus, Settings, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { TransactionsProvider } from '../../context/TransactionsContext'
import { AddTransactionSheet } from '../transactions/AddTransactionSheet'

const nav = [
  { to: '/app', label: 'Головна', icon: Home },
  { to: '/app/analytics', label: 'Аналітика', icon: ChartNoAxesColumn },
  { to: '/app/members', label: 'Учасники', icon: UsersRound },
  { to: '/app/settings', label: 'Налаштування', icon: Settings },
]

export function AppShell() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const location = useLocation()
  const fullScreen = /^\/app\/transactions\/[^/]+$/.test(location.pathname)
    || location.pathname === '/app/members'
    || location.pathname === '/app/settings'
  const showFab = location.pathname === '/app' || location.pathname === '/app/transactions'

  return (
    <TransactionsProvider>
      <div className="app-frame">
        <main className={`app-main ${fullScreen ? 'app-main--full' : ''}`}>
          <Outlet context={{ openTransactionSheet: () => setSheetOpen(true) }} />
        </main>
        {!fullScreen && <div className="bottom-bar">
          <nav className="bottom-nav" aria-label="Основна навігація">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/app'}
                className={({ isActive }) => `bottom-nav__item interactive ${isActive ? 'is-active' : ''}`}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={17} strokeWidth={isActive ? 2 : 1.55} aria-hidden="true" />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>}
        {showFab && <button className="arq-fab interactive" aria-label="Додати операцію" onClick={() => setSheetOpen(true)}>
          <Plus size={21} strokeWidth={1.65} aria-hidden="true" />
        </button>}
      </div>
      <AddTransactionSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </TransactionsProvider>
  )
}
