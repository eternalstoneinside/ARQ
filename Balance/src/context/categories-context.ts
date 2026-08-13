import { createContext, useContext } from 'react'
import type { SpaceCategory, TransactionType } from '../domain/types'

export interface CategoryInput {
  icon: string
  name: string
  type: TransactionType
}

export interface CategoriesContextValue {
  categories: SpaceCategory[]
  error: string | null
  loading: boolean
  archiveCategory: (categoryId: string) => Promise<void>
  createCategory: (input: CategoryInput) => Promise<SpaceCategory>
  restoreCategory: (categoryId: string) => Promise<void>
  updateCategory: (categoryId: string, input: Pick<CategoryInput, 'icon' | 'name'>) => Promise<SpaceCategory>
}

export const CategoriesContext = createContext<CategoriesContextValue | null>(null)

export function useCategories() {
  const context = useContext(CategoriesContext)
  if (!context) throw new Error('useCategories має використовуватися в CategoriesProvider')
  return context
}
