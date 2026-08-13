import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { SpaceCategory, TransactionType } from '../domain/types'
import { getSupabase } from '../lib/supabase'
import type { Database } from '../types/database'
import { useAuth } from './auth-context'
import { CategoriesContext, type CategoryInput } from './categories-context'
import { useSpaces } from './space-context'

type CategoryRow = Database['public']['Tables']['space_categories']['Row']

function toCategory(row: CategoryRow): SpaceCategory {
  return {
    archivedAt: row.archived_at,
    createdBy: row.created_by,
    icon: row.icon,
    id: row.id,
    isDefault: row.is_default,
    name: row.name,
    sortOrder: row.sort_order,
    spaceId: row.space_id,
    type: row.type as TransactionType,
  }
}

function sortCategories(categories: SpaceCategory[]) {
  return [...categories].sort((first, second) => first.type.localeCompare(second.type)
    || first.sortOrder - second.sortOrder
    || first.name.localeCompare(second.name, 'uk'))
}

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { activeSpace } = useSpaces()
  const [categories, setCategories] = useState<SpaceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!activeSpace || !user) {
      setCategories([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error: queryError } = await getSupabase()
      .from('space_categories')
      .select('*')
      .eq('space_id', activeSpace.id)
      .order('type')
      .order('sort_order')
      .order('created_at')
    if (queryError) {
      setError('Не вдалося завантажити категорії простору.')
      setLoading(false)
      return
    }
    setCategories(sortCategories(data.map(toCategory)))
    setError(null)
    setLoading(false)
  }, [activeSpace, user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (!activeSpace || !user) return

    const client = getSupabase()
    let disposed = false
    let refreshTimer: ReturnType<typeof setTimeout> | null = null
    let channel: ReturnType<typeof client.channel> | null = null

    const scheduleRefresh = () => {
      if (disposed) return
      if (refreshTimer) clearTimeout(refreshTimer)
      refreshTimer = setTimeout(() => {
        refreshTimer = null
        void refresh()
      }, 80)
    }

    const connect = async () => {
      await client.realtime.setAuth()
      if (disposed) return
      channel = client
        .channel(`space:${activeSpace.id}:categories`, { config: { private: true } })
        .on('broadcast', { event: '*' }, scheduleRefresh)
        .subscribe()
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') scheduleRefresh()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    void connect().catch(() => undefined)
    return () => {
      disposed = true
      if (refreshTimer) clearTimeout(refreshTimer)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (channel) void client.removeChannel(channel)
    }
  }, [activeSpace, refresh, user])

  const updateLocal = useCallback((next: SpaceCategory) => setCategories((current) => sortCategories([
    next,
    ...current.filter((category) => category.id !== next.id),
  ])), [])

  const value = useMemo(() => ({
    categories,
    error,
    loading,
    createCategory: async (input: CategoryInput) => {
      if (!activeSpace || !user) throw new Error('Оберіть простір і увійдіть до ARQ.')
      const { data, error: insertError } = await getSupabase()
        .from('space_categories')
        .insert({
          created_by: user.id,
          icon: input.icon,
          name: input.name.trim(),
          space_id: activeSpace.id,
          type: input.type,
        })
        .select('*')
        .single()
      if (insertError) throw new Error(insertError.code === '23505' ? 'Категорія з такою назвою вже існує.' : 'Не вдалося створити категорію.')
      const created = toCategory(data)
      updateLocal(created)
      return created
    },
    updateCategory: async (categoryId: string, input: Pick<CategoryInput, 'icon' | 'name'>) => {
      if (!activeSpace) throw new Error('Оберіть простір.')
      const { data, error: updateError } = await getSupabase()
        .from('space_categories')
        .update({ icon: input.icon, name: input.name.trim() })
        .eq('space_id', activeSpace.id)
        .eq('id', categoryId)
        .select('*')
        .single()
      if (updateError) throw new Error(updateError.code === '23505' ? 'Категорія з такою назвою вже існує.' : 'Не вдалося оновити категорію.')
      const updated = toCategory(data)
      updateLocal(updated)
      return updated
    },
    archiveCategory: async (categoryId: string) => {
      if (!activeSpace) throw new Error('Оберіть простір.')
      const { data, error: updateError } = await getSupabase()
        .from('space_categories')
        .update({ archived_at: new Date().toISOString() })
        .eq('space_id', activeSpace.id)
        .eq('id', categoryId)
        .select('*')
        .single()
      if (updateError) throw new Error('Не вдалося архівувати категорію.')
      updateLocal(toCategory(data))
    },
    restoreCategory: async (categoryId: string) => {
      if (!activeSpace) throw new Error('Оберіть простір.')
      const { data, error: updateError } = await getSupabase()
        .from('space_categories')
        .update({ archived_at: null })
        .eq('space_id', activeSpace.id)
        .eq('id', categoryId)
        .select('*')
        .single()
      if (updateError) throw new Error(updateError.code === '23505' ? 'Активна категорія з такою назвою вже існує.' : 'Не вдалося відновити категорію.')
      updateLocal(toCategory(data))
    },
  }), [activeSpace, categories, error, loading, updateLocal, user])

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}
