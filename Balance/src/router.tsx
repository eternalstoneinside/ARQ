import { createBrowserRouter, Navigate } from 'react-router'
import { RequireAuth, RequireSpace } from './components/auth/RouteGuards'
import { AppShell } from './components/layout/AppShell'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { CreateSpacePage } from './pages/CreateSpacePage'
import { EmptyStatePage } from './pages/EmptyStatePage'
import { HomePage } from './pages/HomePage'
import { InvitePersonPage } from './pages/InvitePersonPage'
import { JoinSpacePage } from './pages/JoinSpacePage'
import { LaunchPage } from './pages/LaunchPage'
import { MembersPage } from './pages/MembersPage'
import { OnboardingDecisionPage } from './pages/OnboardingDecisionPage'
import { SettingsPage } from './pages/SettingsPage'
import { SpacesPage } from './pages/SpacesPage'
import { TransactionDetailsPage } from './pages/TransactionDetailsPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { WelcomePage } from './pages/WelcomePage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'

const basename = import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, '')

export const router = createBrowserRouter([
  { path: '/', element: <LaunchPage /> },
  { path: '/welcome', element: <WelcomePage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },
  {
    element: <RequireAuth />,
    children: [
      { path: '/onboarding', element: <OnboardingDecisionPage /> },
      { path: '/onboarding/create', element: <CreateSpacePage /> },
      { path: '/onboarding/invite', element: <InvitePersonPage /> },
      { path: '/onboarding/join', element: <JoinSpacePage /> },
      {
        element: <RequireSpace />,
        children: [{
          path: '/app',
          element: <AppShell />,
          children: [
            { index: true, element: <HomePage /> },
            { path: 'analytics', element: <AnalyticsPage /> },
            { path: 'transactions', element: <TransactionsPage /> },
            { path: 'transactions/:transactionId', element: <TransactionDetailsPage /> },
            { path: 'members', element: <MembersPage /> },
            { path: 'settings', element: <SettingsPage /> },
            { path: 'settings/spaces', element: <SpacesPage /> },
            { path: 'empty', element: <EmptyStatePage /> },
            { path: '*', element: <Navigate to="/app" replace /> },
          ],
        }],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
], { basename })
