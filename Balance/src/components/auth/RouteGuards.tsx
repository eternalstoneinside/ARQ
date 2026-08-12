import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../context/auth-context'
import { useSpaces } from '../../context/space-context'
import { decideAuthAccess, decideSpaceAccess } from '../../lib/access'
import { RouteStatus } from './RouteStatus'

export function RequireAuth() {
  const { loading, user } = useAuth()
  const location = useLocation()

  const decision = decideAuthAccess(loading, Boolean(user))
  if (decision === 'loading') return <RouteStatus />
  if (decision === 'redirect') return <Navigate to="/welcome" replace state={{ from: location.pathname }} />
  return <Outlet />
}

export function RequireSpace() {
  const { activeSpace, loading } = useSpaces()
  const decision = decideSpaceAccess(loading, Boolean(activeSpace))
  if (decision === 'loading') return <RouteStatus />
  if (decision === 'redirect') return <Navigate to="/onboarding" replace />
  return <Outlet />
}
