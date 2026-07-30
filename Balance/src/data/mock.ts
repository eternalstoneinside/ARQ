import type { Category, Person, Transaction } from '../domain/types'

export const people: Person[] = [
  { id: 'p1', name: 'Олена', initials: 'О' },
  { id: 'p2', name: 'Андрій', initials: 'А' },
]

export const categories: Category[] = [
  { id: 'salary', name: 'Зарплата', type: 'income', icon: 'BriefcaseBusiness' },
  { id: 'side', name: 'Підробіток', type: 'income', icon: 'Sparkles' },
  { id: 'gift', name: 'Подарунок', type: 'income', icon: 'Gift' },
  { id: 'investment', name: 'Інвестиції', type: 'income', icon: 'TrendingUp' },
  { id: 'income-other', name: 'Інше', type: 'income', icon: 'CircleEllipsis' },
  { id: 'food', name: 'Продукти', type: 'expense', icon: 'ShoppingBasket' },
  { id: 'home', name: 'Житло', type: 'expense', icon: 'House' },
  { id: 'transport', name: 'Транспорт', type: 'expense', icon: 'TramFront' },
  { id: 'places', name: 'Заклади', type: 'expense', icon: 'Utensils' },
  { id: 'shopping', name: 'Покупки', type: 'expense', icon: 'ShoppingBag' },
  { id: 'fun', name: 'Розваги', type: 'expense', icon: 'Clapperboard' },
  { id: 'health', name: 'Здоров’я', type: 'expense', icon: 'HeartPulse' },
  { id: 'pets', name: 'Тварини', type: 'expense', icon: 'PawPrint' },
  { id: 'expense-other', name: 'Інше', type: 'expense', icon: 'CircleEllipsis' },
]

const now = '2026-07-27T10:00:00Z'
export const initialTransactions: Transaction[] = [
  { id: 't1', coupleSpaceId: 'c1', type: 'income', amountMinor: 620000, currency: 'PLN', categoryId: 'salary', personId: 'p1', transactionDate: '2026-07-25', comment: 'Зарплата за липень', recurrenceId: null, createdBy: 'p1', createdAt: now, updatedAt: now, deletedAt: null, deletedBy: null },
  { id: 't2', coupleSpaceId: 'c1', type: 'income', amountMinor: 410000, currency: 'PLN', categoryId: 'salary', personId: 'p2', transactionDate: '2026-07-24', comment: null, recurrenceId: null, createdBy: 'p2', createdAt: now, updatedAt: now, deletedAt: null, deletedBy: null },
  { id: 't3', coupleSpaceId: 'c1', type: 'expense', amountMinor: 82470, currency: 'PLN', categoryId: 'home', personId: 'p2', transactionDate: '2026-07-26', comment: 'Оренда й комунальні', recurrenceId: null, createdBy: 'p2', createdAt: now, updatedAt: now, deletedAt: null, deletedBy: null },
  { id: 't4', coupleSpaceId: 'c1', type: 'expense', amountMinor: 21340, currency: 'PLN', categoryId: 'food', personId: 'p1', transactionDate: '2026-07-27', comment: 'Продукти на тиждень', recurrenceId: null, createdBy: 'p1', createdAt: now, updatedAt: now, deletedAt: null, deletedBy: null },
  { id: 't5', coupleSpaceId: 'c1', type: 'expense', amountMinor: 4860, currency: 'PLN', categoryId: 'transport', personId: 'p2', transactionDate: '2026-07-26', comment: 'Проїзні', recurrenceId: null, createdBy: 'p2', createdAt: now, updatedAt: now, deletedAt: null, deletedBy: null },
]
