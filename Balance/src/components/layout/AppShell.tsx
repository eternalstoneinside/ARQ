import { ChartNoAxesColumn, Home, Plus, Settings } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { TransactionsProvider } from '../../context/TransactionsContext'
import { PrivacyProvider } from '../../context/PrivacyContext'
import {
  buttonVariants,
  reducedButtonVariants,
  reducedRouteVariants,
  routeVariants,
} from '../../motion/motionTokens'

const loadAddTransactionSheet = () => import('../transactions/AddTransactionSheet')
const AddTransactionSheet = lazy(() => loadAddTransactionSheet()
  .then((module) => ({ default: module.AddTransactionSheet })))

const nav = [
  { to: '/app', label: 'Головна', icon: Home, preload: () => import('../../pages/HomePage') },
  { to: '/app/analytics', label: 'Аналітика', icon: ChartNoAxesColumn, preload: () => import('../../pages/AnalyticsPage') },
  { to: '/app/settings', label: 'Налаштування', icon: Settings, preload: () => import('../../pages/SettingsPage') },
]

export function AppShell() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const fullScreen = /^\/app\/transactions\/[^/]+$/.test(location.pathname)
    || location.pathname === '/app/members'
    || location.pathname.startsWith('/app/settings')
  const showFab = location.pathname === '/app' || location.pathname === '/app/transactions'
  const isHome = location.pathname === '/app'
  const openTransactionSheet = () => {
    void loadAddTransactionSheet()
    setSheetOpen(true)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  useEffect(() => {
    const warmup = window.setTimeout(() => {
      void loadAddTransactionSheet()
      nav.forEach(({ preload }) => void preload())
    }, 450)
    return () => window.clearTimeout(warmup)
  }, [])

  return (
    <PrivacyProvider>
      <TransactionsProvider>
        <div className={`app-frame ${isHome ? 'app-frame--home' : ''}`}>
          <main className={`app-main ${fullScreen ? 'app-main--full' : ''}`}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                className="route-layer"
                key={location.pathname}
                variants={reduceMotion ? reducedRouteVariants : routeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Outlet context={{ openTransactionSheet }} />
              </motion.div>
            </AnimatePresence>
          </main>
          {!fullScreen && <div className="bottom-bar">
            <nav className="bottom-nav" aria-label="Основна навігація">
              {nav.map(({ to, label, icon: Icon, preload }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/app'}
                  className={({ isActive }) => `bottom-nav__item interactive ${isActive ? 'is-active' : ''}`}
                  onFocus={() => void preload()}
                  onPointerEnter={() => void preload()}
                  onTouchStart={() => void preload()}
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
          {showFab && <motion.button
            className="arq-fab interactive"
            aria-label="Додати операцію"
            variants={reduceMotion ? reducedButtonVariants : buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onFocus={() => void loadAddTransactionSheet()}
            onPointerEnter={() => void loadAddTransactionSheet()}
            onTouchStart={() => void loadAddTransactionSheet()}
            onClick={openTransactionSheet}
          >
            <Plus size={21} strokeWidth={1.65} aria-hidden="true" />
          </motion.button>}
        </div>
        {sheetOpen && (
          <Suspense fallback={(
            <div className="sheet-backdrop" role="status" aria-label="Відкриваємо форму операції">
              <section className="transaction-sheet transaction-sheet--loading"><span /><span /><span /></section>
            </div>
          )}>
            <AddTransactionSheet open onClose={() => setSheetOpen(false)} />
          </Suspense>
        )}
      </TransactionsProvider>
    </PrivacyProvider>
  )
}
