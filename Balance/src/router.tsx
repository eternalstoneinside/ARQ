import { createBrowserRouter, Navigate } from 'react-router'
import { AppShell } from './components/layout/AppShell'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { EmptyStatePage } from './pages/EmptyStatePage'
import { HomePage } from './pages/HomePage'
import { LaunchPage } from './pages/LaunchPage'
import { MembersPage } from './pages/MembersPage'
import { SettingsPage } from './pages/SettingsPage'
import { TransactionDetailsPage } from './pages/TransactionDetailsPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { WelcomePage } from './pages/WelcomePage'

const basename = import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, '')

export const router = createBrowserRouter([
  { path: '/', element: <LaunchPage /> },
  { path: '/welcome', element: <WelcomePage /> },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'transactions/:transactionId', element: <TransactionDetailsPage /> },
      { path: 'members', element: <MembersPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'empty', element: <EmptyStatePage /> },
      { path: '*', element: <Navigate to="/app" replace /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
], { basename })
