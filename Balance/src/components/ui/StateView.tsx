import type { LucideIcon } from 'lucide-react'

interface StateViewProps {
  actionLabel?: string
  description: string
  icon: LucideIcon
  onAction?: () => void
  title: string
}

export function StateView({ actionLabel, description, icon: Icon, onAction, title }: StateViewProps) {
  return (
    <div className="grid min-h-56 place-items-center rounded-[1.75rem] border border-border-subtle bg-surface-raised p-9 text-center surface-elevation">
      <div>
        <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent"><Icon size={21} aria-hidden="true" /></span>
        <h2 className="text-[17px] font-semibold tracking-[-.01em]">{title}</h2>
        <p className="mx-auto mt-1.5 max-w-64 text-sm leading-6 text-ink-muted">{description}</p>
        {actionLabel && onAction && (
          <button
            className="interactive mt-5 min-h-10 rounded-xl border border-border-subtle bg-surface px-4 text-[13px] font-medium text-ink transition-colors hover:bg-surface-muted"
            type="button"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="space-y-5" role="status" aria-label="Завантаження">
      <div className="skeleton-shimmer relative h-48 overflow-hidden rounded-[2rem] bg-surface-muted" />
      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton-shimmer relative h-24 overflow-hidden rounded-3xl bg-surface-muted" />
        <div className="skeleton-shimmer relative h-24 overflow-hidden rounded-3xl bg-surface-muted" />
      </div>
      <div className="skeleton-shimmer relative h-16 overflow-hidden rounded-2xl bg-surface-muted" />
    </div>
  )
}
