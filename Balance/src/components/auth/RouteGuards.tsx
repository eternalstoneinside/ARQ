import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../context/auth-context'
import { useSpaces } from '../../context/space-context'
import { RouteStatus } from './RouteStatus'

export function RequireAuth() {
  const { loading, user } = useAuth()
  const location = useLocation()

  if (loading) return <RouteStatus />
  if (!user) return <Navigate to="/welcome" replace state={{ from: location.pathname }} />
  return <Outlet />
}

export function RequireSpace() {
  const { activeSpace, loading } = useSpaces()
  if (loading) return <RouteStatus />
  if (!activeSpace) return <Navigate to="/onboarding" replace />
  return <Outlet />
}
