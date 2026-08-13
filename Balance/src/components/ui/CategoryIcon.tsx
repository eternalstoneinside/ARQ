import {
  BriefcaseBusiness,
  CircleEllipsis,
  Clapperboard,
  Gift,
  Cigarette,
  Cat,
  Wifi,
  HeartPulse,
  House,
  PawPrint,
  ShoppingBag,
  ShoppingBasket,
  Sparkles,
  TramFront,
  TrendingUp,
  Utensils,
  type LucideIcon,
} from 'lucide-react'
import type { TransactionType } from '../../domain/types'

const categoryIcons: Record<string, LucideIcon> = {
  BriefcaseBusiness,
  CircleEllipsis,
  Clapperboard,
  Gift,
  Cigarette,
  Cat,
  Wifi,
  HeartPulse,
  House,
  PawPrint,
  ShoppingBag,
  ShoppingBasket,
  Sparkles,
  TramFront,
  TrendingUp,
  Utensils,
}

export function CategoryIcon({ icon, type, size = 'md' }: { icon?: string; type: TransactionType; size?: 'sm' | 'md' }) {
  const Icon = categoryIcons[icon ?? ''] ?? CircleEllipsis
  return (
    <span
      className={`category-icon category-icon--${size} ${type === 'income' ? 'is-income' : 'is-expense'}`}
      aria-hidden="true"
    >
      <Icon size={size === 'md' ? 17 : 16} strokeWidth={1.65} />
    </span>
  )
}
