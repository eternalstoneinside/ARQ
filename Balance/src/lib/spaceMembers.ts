import { getSupabase } from './supabase'

export interface SpaceMember {
  avatarUrl: string | null
  displayName: string
  joinedAt: string
  role: 'owner' | 'member'
  userId: string
}

export interface SpaceInviteStatus {
  active: boolean
  createdAt: string
  expiresAt: string
  id: string
  maxUses: number
  revokedAt: string | null
  usedCount: number
}

export async function fetchSpaceMembers(spaceId: string): Promise<SpaceMember[]> {
  const client = getSupabase()
  const { data: memberships, error: membershipError } = await client
    .from('space_members')
    .select('user_id, role, joined_at')
    .eq('space_id', spaceId)
    .order('joined_at', { ascending: true })

  if (membershipError) throw membershipError
  if (memberships.length === 0) return []

  const { data: profiles, error: profilesError } = await client
    .from('profiles')
    .select('id, display_name, avatar_url')
    .in('id', memberships.map((membership) => membership.user_id))

  if (profilesError) throw profilesError
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]))

  return memberships
    .map((membership): SpaceMember => {
      const profile = profileById.get(membership.user_id)
      return {
        avatarUrl: profile?.avatar_url ?? null,
        displayName: profile?.display_name.trim() || 'Учасник ARQ',
        joinedAt: membership.joined_at,
        role: membership.role === 'owner' ? 'owner' : 'member',
        userId: membership.user_id,
      }
    })
    .sort((first, second) => {
      if (first.role !== second.role) return first.role === 'owner' ? -1 : 1
      return first.joinedAt.localeCompare(second.joinedAt)
    })
}

export async function fetchLatestInvite(spaceId: string): Promise<SpaceInviteStatus | null> {
  const { data, error } = await getSupabase()
    .from('space_invites')
    .select('id, created_at, expires_at, max_uses, used_count, revoked_at')
    .eq('space_id', spaceId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return {
    active: data.revoked_at === null
      && new Date(data.expires_at).getTime() > Date.now()
      && data.used_count < data.max_uses,
    createdAt: data.created_at,
    expiresAt: data.expires_at,
    id: data.id,
    maxUses: data.max_uses,
    revokedAt: data.revoked_at,
    usedCount: data.used_count,
  }
}
