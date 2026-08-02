import { createContext, useContext } from 'react'

export type Space = { id: string; name: string; createdBy: string; role: 'owner' | 'member' }

export interface SpaceContextValue {
  activeSpace: Space | null
  latestInviteCode: string | null
  loading: boolean
  spaces: Space[]
  createSpace: (name: string) => Promise<Space>
  createInvite: () => Promise<string>
  joinSpace: (code: string) => Promise<Space>
  refreshSpaces: () => Promise<Space[]>
}

export const SpaceContext = createContext<SpaceContextValue | null>(null)

export function useSpaces() {
  const context = useContext(SpaceContext)
  if (!context) throw new Error('useSpaces має використовуватися в SpaceProvider')
  return context
}
