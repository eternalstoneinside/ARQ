import { describe, expect, it } from 'vitest'
import { categories } from '../src/data/mock'
import type { Transaction } from '../src/domain/types'
import {
  canManageTransaction,
  filterTransactions,
  getActiveTransactions,
  summarizeTransactions,
} from '../src/lib/transactions'

const transactions: Transaction[] = [
  {
    id: 'salary',
    spaceId: 'home',
    type: 'income',
    amountMinor: 412500,
    currency: 'PLN',
    categoryId: 'salary',
    personId: 'dmytro',
    personName: 'Дмитрий Орленко',
    transactionDate: '2026-08-12',
    comment: 'Серпень',
    createdBy: 'dmytro',
    createdAt: '2026-08-12T08:00:00Z',
    updatedAt: '2026-08-12T08:00:00Z',
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 'food',
    spaceId: 'home',
    type: 'expense',
    amountMinor: 51400,
    currency: 'PLN',
    categoryId: 'food',
    personId: 'partner',
    personName: 'Олена',
    transactionDate: '2026-08-11',
    comment: 'Продукти на тиждень',
    createdBy: 'partner',
    createdAt: '2026-08-11T18:00:00Z',
    updatedAt: '2026-08-11T18:00:00Z',
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 'deleted',
    spaceId: 'home',
    type: 'expense',
    amountMinor: 99900,
    currency: 'PLN',
    categoryId: 'shopping',
    personId: 'dmytro',
    personName: 'Дмитрий Орленко',
    transactionDate: '2026-08-10',
    comment: null,
    createdBy: 'dmytro',
    createdAt: '2026-08-10T12:00:00Z',
    updatedAt: '2026-08-10T13:00:00Z',
    deletedAt: '2026-08-10T13:00:00Z',
    deletedBy: 'dmytro',
  },
]

describe('transaction source of truth', () => {
  it('excludes soft-deleted rows from active state and balance', () => {
    expect(getActiveTransactions(transactions).map(({ id }) => id)).toEqual(['salary', 'food'])
    expect(summarizeTransactions(transactions)).toEqual({ income: 412500, expense: 51400 })
  })

  it('filters by type and searches category, person, comment, and amount', () => {
    expect(filterTransactions(transactions, 'expense', '', categories).map(({ id }) => id)).toEqual(['food'])
    expect(filterTransactions(transactions, 'all', 'Олена', categories).map(({ id }) => id)).toEqual(['food'])
    expect(filterTransactions(transactions, 'all', 'продукти', categories).map(({ id }) => id)).toEqual(['food'])
    expect(filterTransactions(transactions, 'all', '514', categories).map(({ id }) => id)).toEqual(['food'])
  })

  it('allows authors and space owners to manage an operation', () => {
    expect(canManageTransaction(transactions[1], 'partner', 'member')).toBe(true)
    expect(canManageTransaction(transactions[1], 'dmytro', 'owner')).toBe(true)
    expect(canManageTransaction(transactions[1], 'dmytro', 'member')).toBe(false)
    expect(canManageTransaction(transactions[1], undefined, 'owner')).toBe(false)
  })
})
