export function ProductLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex flex-col items-start" aria-label="ARQ Balance">
      <span className={`font-display font-semibold leading-none tracking-[.22em] text-ink ${compact ? 'text-[11px]' : 'text-[13px]'}`}>ARQ</span>
      <span className={`font-display font-medium leading-none tracking-[-.02em] text-ink-muted ${compact ? 'mt-1.5 text-[10px]' : 'mt-2 text-[13px]'}`}>Balance</span>
    </span>
  )
}

export function PageHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header>
      <div className="flex items-center justify-between">
        <p className="font-display text-[11px] font-medium tracking-[-.01em] text-ink-muted">Balance</p>
        <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-ink-muted">{eyebrow}</p>
      </div>
      <h1 className="mt-12 max-w-sm font-display text-[38px] font-semibold leading-[1.02] tracking-[-.052em]">{title}</h1>
    </header>
  )
}
