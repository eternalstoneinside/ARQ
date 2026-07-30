import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

export function Button({ className = '', variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const variants: Record<Variant, string> = {
    primary: 'bg-accent-strong text-white shadow-[0_8px_24px_rgb(38_51_49_/_16%)] hover:bg-accent active:shadow-none',
    secondary: 'border border-border-subtle bg-surface-raised text-ink hover:border-border hover:bg-surface-muted',
    ghost: 'text-ink-muted hover:bg-surface-muted hover:text-ink',
  }
  return <button className={`interactive min-h-13 rounded-[1rem] px-5 text-[14px] font-semibold tracking-[-.01em] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props} />
}
