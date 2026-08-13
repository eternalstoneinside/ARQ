export type TransactionType = 'income' | 'expense'
export type Currency = 'PLN'
export type RecurrenceFrequency = 'weekly' | 'monthly' | 'yearly'

export interface Person {
  id: string
  name: string
  initials: string
}

export interface Category {
  id: string
  name: string
  type: TransactionType
  icon: string
}

export interface SpaceCategory extends Category {
  archivedAt: string | null
  createdBy: string
  isDefault: boolean
  sortOrder: number
  spaceId: string
}

export interface Transaction {
  id: string
  spaceId: string
  type: TransactionType
  amountMinor: number
  currency: Currency
  categoryId: string
  personId: string
  personName: string
  transactionDate: string
  comment: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
}

export interface TransactionInput {
  type: TransactionType
  amountMinor: number
  categoryId: string
  personId: string
  transactionDate: string
  comment: string | null
}

export interface Recurrence {
  id: string
  coupleSpaceId: string
  templateTransactionId: string
  frequency: RecurrenceFrequency
  nextRunAt: string
  active: boolean
}
