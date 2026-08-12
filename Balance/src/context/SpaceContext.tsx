import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getSupabase } from '../lib/supabase'
import { useAuth } from './auth-context'
import { SpaceContext, type Space } from './space-context'

export function SpaceProvider({ children }: { children: ReactNode }) {
  const { configured, user } = useAuth()
  const [spaces, setSpaces] = useState<Space[]>([])
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null)
  const [latestInvite, setLatestInvite] = useState<{ code: string; spaceId: string } | null>(null)
  const [loading, setLoading] = useState(Boolean(user))

  const persistActiveSpace = useCallback(async (spaceId: string | null) => {
    if (!configured || !user) throw new Error('Увійдіть, щоб обрати простір.')
    const { error } = await getSupabase()
      .from('profiles')
      .update({ active_space_id: spaceId })
      .eq('id', user.id)
    if (error) throw error
  }, [configured, user])

  const refreshSpaces = useCallback(async () => {
    if (!configured || !user) {
      setSpaces([])
      setActiveSpaceId(null)
      setLoading(false)
      return []
    }

    setLoading(true)
    const client = getSupabase()
    const [membershipResult, profileResult] = await Promise.all([
      client
        .from('space_members')
        .select('space_id, role')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false }),
      client
        .from('profiles')
        .select('active_space_id')
        .eq('id', user.id)
        .single(),
    ])
    const { data: memberships, error: membershipError } = membershipResult
    const { data: profile, error: profileError } = profileResult

    if (membershipError || profileError) {
      setLoading(false)
      throw membershipError ?? profileError
    }

    if (!memberships.length) {
      setSpaces([])
      setActiveSpaceId(null)
      if (profile.active_space_id !== null) {
        await persistActiveSpace(null)
      }
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

    const rowById = new Map(rows.map((space) => [space.id, space]))
    const nextSpaces = memberships.flatMap((membership): Space[] => {
      const space = rowById.get(membership.space_id)
      if (!space) return []
      return [{
        id: space.id,
        name: space.name,
        createdBy: space.created_by,
        role: membership.role === 'owner' ? 'owner' : 'member',
      }]
    })
    const preferredSpaceId = profile.active_space_id
    const nextActiveSpaceId = nextSpaces.some((space) => space.id === preferredSpaceId)
      ? preferredSpaceId
      : nextSpaces[0]?.id ?? null
    setSpaces(nextSpaces)
    setActiveSpaceId(nextActiveSpaceId)
    if (nextActiveSpaceId !== preferredSpaceId) {
      await persistActiveSpace(nextActiveSpaceId)
    }
    setLoading(false)
    return nextSpaces
  }, [configured, persistActiveSpace, user])

  useEffect(() => {
    void refreshSpaces().catch(() => setLoading(false))
  }, [refreshSpaces])

  const activeSpace = spaces.find((space) => space.id === activeSpaceId) ?? spaces[0] ?? null
  const latestInviteCode = latestInvite && activeSpace && latestInvite.spaceId === activeSpace.id
    ? latestInvite.code
    : null

  const value = useMemo(() => ({
    activeSpace,
    latestInviteCode,
    loading,
    spaces,
    refreshSpaces,
    createSpace: async (name: string) => {
      const { data, error } = await getSupabase().rpc('create_space_with_invite', { p_name: name })
      if (error) throw error
      const created = data?.[0]
      if (!created) throw new Error('Не вдалося створити простір.')
      const next: Space = { id: created.space_id, name: created.space_name, createdBy: user!.id, role: 'owner' }
      setLatestInvite({ code: created.invite_code, spaceId: next.id })
      setSpaces((current) => [next, ...current.filter((space) => space.id !== next.id)])
      setActiveSpaceId(next.id)
      void persistActiveSpace(next.id).catch(() => undefined)
      return next
    },
    createInvite: async () => {
      if (!activeSpace) throw new Error('Спочатку створіть простір.')
      const { data, error } = await getSupabase().rpc('create_space_invite', { p_space_id: activeSpace.id })
      if (error) throw error
      setLatestInvite({ code: data, spaceId: activeSpace.id })
      return data
    },
    revokeInvite: async () => {
      if (!activeSpace) throw new Error('Спочатку оберіть простір.')
      const { error } = await getSupabase().rpc('revoke_space_invites', { p_space_id: activeSpace.id })
      if (error) throw error
      setLatestInvite((current) => current?.spaceId === activeSpace.id ? null : current)
    },
    renameSpace: async (spaceId: string, name: string) => {
      const normalizedName = name.trim()
      if (!normalizedName || normalizedName.length > 80) {
        throw new Error('Назва має містити від 1 до 80 символів.')
      }

      const currentSpace = spaces.find((space) => space.id === spaceId)
      if (!currentSpace || currentSpace.role !== 'owner') {
        throw new Error('Лише власник може змінити назву простору.')
      }

      const { data, error } = await getSupabase()
        .from('spaces')
        .update({ name: normalizedName })
        .eq('id', spaceId)
        .select('id, name, created_by')
        .single()

      if (error) throw error
      const renamed: Space = { ...currentSpace, name: data.name, createdBy: data.created_by }
      setSpaces((current) => current.map((space) => space.id === spaceId ? renamed : space))
      return renamed
    },
    deleteSpace: async (spaceId: string) => {
      const currentSpace = spaces.find((space) => space.id === spaceId)
      if (!currentSpace || currentSpace.role !== 'owner') {
        throw new Error('Лише власник може видалити простір.')
      }

      const { data, error } = await getSupabase()
        .from('spaces')
        .delete()
        .eq('id', spaceId)
        .select('id')
        .single()

      if (error) throw error
      if (!data) throw new Error('Простір не знайдено або його вже видалено.')

      const nextSpaces = spaces.filter((space) => space.id !== spaceId)
      const deletingActiveSpace = activeSpace?.id === spaceId
      const nextActiveSpaceId = deletingActiveSpace ? nextSpaces[0]?.id ?? null : activeSpace?.id ?? null
      setSpaces(nextSpaces)
      setActiveSpaceId(nextActiveSpaceId)
      setLatestInvite((current) => current?.spaceId === spaceId ? null : current)
      if (deletingActiveSpace) {
        void persistActiveSpace(nextActiveSpaceId).catch(() => undefined)
      }
      return nextSpaces
    },
    joinSpace: async (code: string) => {
      const { data: spaceId, error } = await getSupabase().rpc('join_space_by_code', { p_code: code })
      if (error) throw error
      const nextSpaces = await refreshSpaces()
      const joined = nextSpaces.find((space) => space.id === spaceId)
      if (!joined) throw new Error('Простір приєднано, але його не вдалося завантажити.')
      setActiveSpaceId(joined.id)
      void persistActiveSpace(joined.id).catch(() => undefined)
      return joined
    },
    setActiveSpace: async (spaceId: string) => {
      const selected = spaces.find((space) => space.id === spaceId)
      if (!selected) throw new Error('Цей простір недоступний для вашого акаунта.')
      if (selected.id === activeSpace?.id) return selected
      await persistActiveSpace(selected.id)
      setActiveSpaceId(selected.id)
      return selected
    },
  }), [activeSpace, latestInviteCode, loading, persistActiveSpace, refreshSpaces, spaces, user])

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
}
