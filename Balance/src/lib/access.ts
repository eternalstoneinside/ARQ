export type AccessDecision = 'allow' | 'loading' | 'redirect'

export function decideAuthAccess(loading: boolean, hasUser: boolean): AccessDecision {
  if (loading) return 'loading'
  return hasUser ? 'allow' : 'redirect'
}

export function decideSpaceAccess(loading: boolean, hasActiveSpace: boolean): AccessDecision {
  if (loading) return 'loading'
  return hasActiveSpace ? 'allow' : 'redirect'
}
