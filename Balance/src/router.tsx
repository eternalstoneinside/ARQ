import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { RequireAuth, RequireSpace } from './components/auth/RouteGuards'
import { RouteStatus } from './components/auth/RouteStatus'
import { AppShell } from './components/layout/AppShell'
import { LoadingState } from './components/ui/StateView'
import { LaunchPage } from './pages/LaunchPage'
import { WelcomePage } from './pages/WelcomePage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'

const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })))
const CreateSpacePage = lazy(() => import('./pages/CreateSpacePage').then((module) => ({ default: module.CreateSpacePage })))
const EmptyStatePage = lazy(() => import('./pages/EmptyStatePage').then((module) => ({ default: module.EmptyStatePage })))
const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })))
const InvitePersonPage = lazy(() => import('./pages/InvitePersonPage').then((module) => ({ default: module.InvitePersonPage })))
const JoinSpacePage = lazy(() => import('./pages/JoinSpacePage').then((module) => ({ default: module.JoinSpacePage })))
const MembersPage = lazy(() => import('./pages/MembersPage').then((module) => ({ default: module.MembersPage })))
const OnboardingDecisionPage = lazy(() => import('./pages/OnboardingDecisionPage').then((module) => ({ default: module.OnboardingDecisionPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })))
const SpacesPage = lazy(() => import('./pages/SpacesPage').then((module) => ({ default: module.SpacesPage })))
const TransactionDetailsPage = lazy(() => import('./pages/TransactionDetailsPage').then((module) => ({ default: module.TransactionDetailsPage })))
const TransactionsPage = lazy(() => import('./pages/TransactionsPage').then((module) => ({ default: module.TransactionsPage })))

function lazyEntryPage(Page: LazyExoticComponent<ComponentType>) {
  return (
    <Suspense fallback={<RouteStatus message="Відкриваємо ARQ…" />}>
      <Page />
    </Suspense>
  )
}

function lazyProductPage(Page: LazyExoticComponent<ComponentType>) {
  return (
    <Suspense fallback={<LoadingState />}>
      <Page />
    </Suspense>
  )
}

const basename = import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, '')

export const router = createBrowserRouter([
  { path: '/', element: <LaunchPage /> },
  { path: '/welcome', element: <WelcomePage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },
  {
    element: <RequireAuth />,
    children: [
      { path: '/onboarding', element: lazyEntryPage(OnboardingDecisionPage) },
      { path: '/onboarding/create', element: lazyEntryPage(CreateSpacePage) },
      { path: '/onboarding/invite', element: lazyEntryPage(InvitePersonPage) },
      { path: '/onboarding/join', element: lazyEntryPage(JoinSpacePage) },
      {
        element: <RequireSpace />,
        children: [{
          path: '/app',
          element: <AppShell />,
          children: [
            { index: true, element: lazyProductPage(HomePage) },
            { path: 'analytics', element: lazyProductPage(AnalyticsPage) },
            { path: 'transactions', element: lazyProductPage(TransactionsPage) },
            { path: 'transactions/:transactionId', element: lazyProductPage(TransactionDetailsPage) },
            { path: 'members', element: lazyProductPage(MembersPage) },
            { path: 'settings', element: lazyProductPage(SettingsPage) },
            { path: 'settings/spaces', element: lazyProductPage(SpacesPage) },
            { path: 'empty', element: lazyProductPage(EmptyStatePage) },
            { path: '*', element: <Navigate to="/app" replace /> },
          ],
        }],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
], { basename })
