import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getSupabase } from '../lib/supabase'
import { useAuth } from './auth-context'
import { SpaceContext, type Space } from './space-context'

export function SpaceProvider({ children }: { children: ReactNode }) {
  const { configured, user } = useAuth()
  const [spaces, setSpaces] = useState<Space[]>([])
  const [latestInviteCode, setLatestInviteCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(Boolean(user))

  const refreshSpaces = useCallback(async () => {
    if (!configured || !user) {
      setSpaces([])
      setLoading(false)
      return []
    }

    setLoading(true)
    const client = getSupabase()
    const { data: memberships, error: membershipError } = await client
      .from('space_members')
      .select('space_id, role')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: true })

    if (membershipError) {
      setLoading(false)
      throw membershipError
    }

    if (!memberships.length) {
      setSpaces([])
      setLoading(false)
      return []
    }

    const { data: rows, error: spacesError } = await client
      .from('spaces')
      .select('id, name, created_by')
      .in('id', memberships.map((item) => item.space_id))

    if (spacesError) {
      setLoading(false)
      throw spacesError
    }

    const membershipBySpace = new Map(memberships.map((item) => [item.space_id, item.role]))
    const nextSpaces = rows.map((space): Space => ({
      id: space.id,
      name: space.name,
      createdBy: space.created_by,
      role: membershipBySpace.get(space.id) === 'owner' ? 'owner' : 'member',
    }))
    setSpaces(nextSpaces)
    setLoading(false)
    return nextSpaces
  }, [configured, user])

  useEffect(() => {
    void refreshSpaces().catch(() => setLoading(false))
  }, [refreshSpaces])

  const value = useMemo(() => ({
    activeSpace: spaces[0] ?? null,
    latestInviteCode,
    loading,
    spaces,
    refreshSpaces,
    createSpace: async (name: string) => {
      const { data, error } = await getSupabase().rpc('create_space_with_invite', { p_name: name })
      if (error) throw error
      const created = data?.[0]
      if (!created) throw new Error('Не вдалося створити простір.')
      setLatestInviteCode(created.invite_code)
      const next: Space = { id: created.space_id, name: created.space_name, createdBy: user!.id, role: 'owner' }
      setSpaces((current) => [next, ...current.filter((space) => space.id !== next.id)])
      return next
    },
    createInvite: async () => {
      const activeSpace = spaces[0]
      if (!activeSpace) throw new Error('Спочатку створіть простір.')
      const { data, error } = await getSupabase().rpc('create_space_invite', { p_space_id: activeSpace.id })
      if (error) throw error
      setLatestInviteCode(data)
      return data
    },
    joinSpace: async (code: string) => {
      const { data: spaceId, error } = await getSupabase().rpc('join_space_by_code', { p_code: code })
      if (error) throw error
      const nextSpaces = await refreshSpaces()
      const joined = nextSpaces.find((space) => space.id === spaceId)
      if (!joined) throw new Error('Простір приєднано, але його не вдалося завантажити.')
      return joined
    },
  }), [latestInviteCode, loading, refreshSpaces, spaces, user])

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
}
