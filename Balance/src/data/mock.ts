import type { Category } from '../domain/types'

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
