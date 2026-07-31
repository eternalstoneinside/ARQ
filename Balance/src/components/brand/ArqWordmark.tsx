type ArqWordmarkProps = {
  className?: string
  compact?: boolean
  micro?: boolean
}

export function ArqWordmark({ className = '', compact = false, micro = false }: ArqWordmarkProps) {
  return (
    <div
      className={`arq-wordmark ${compact ? 'arq-wordmark--compact' : ''} ${micro ? 'arq-wordmark--micro' : ''} ${className}`}
      role="img"
      aria-label="ARQ Balance"
    >
      <svg viewBox="0 0 244 72" aria-hidden="true">
        <path d="M8 64 38 8l30 56" />
        <path d="M94 64V8h28c19 0 30 6 30 15s-11 15-30 15H94" />
        <path d="m122 38 32 26" />
        <circle cx="201" cy="36" r="28" />
        <path d="m211 46 26 22" />
      </svg>
      <span>BALANCE</span>
    </div>
  )
}
