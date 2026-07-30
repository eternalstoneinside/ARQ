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

export interface Transaction {
  id: string
  coupleSpaceId: string
  type: TransactionType
  amountMinor: number
  currency: Currency
  categoryId: string
  personId: string
  transactionDate: string
  comment: string | null
  recurrenceId: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
}

export interface Recurrence {
  id: string
  coupleSpaceId: string
  templateTransactionId: string
  frequency: RecurrenceFrequency
  nextRunAt: string
  active: boolean
}
