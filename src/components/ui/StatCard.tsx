import type { ReactNode } from 'react'

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (seconds < 0) return 'just now'
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  } catch {
    return isoString
  }
}

interface StatCardProps {
  label: string
  value: string | number | null | undefined
  unit?: string
  icon?: ReactNode
  variant?: 'default' | 'danger' | 'brand' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  isTimestamp?: boolean
  delay?: string
  className?: string
}

const variantCard: Record<string, string> = {
  default: 'border-app-border/30 bg-gradient-to-b from-app-surface/20 to-transparent hover:border-app-border/50 hover:bg-app-surface-2/50',
  danger: 'border-red-500/20 bg-red-500/5 hover:border-red-500/30',
  brand: 'border-brand/20 bg-brand/5 hover:border-brand/30',
  warning: 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/30',
}

const variantValue: Record<string, string> = {
  default: 'text-app-text',
  danger: 'text-red-400',
  brand: 'text-brand',
  warning: 'text-amber-400',
}

const variantIcon: Record<string, string> = {
  default: 'bg-app-surface/30 text-app-muted',
  danger: 'bg-red-500/10 text-red-400',
  brand: 'bg-brand/10 text-brand',
  warning: 'bg-amber-500/10 text-amber-400',
}

const sizeValue: Record<string, string> = {
  sm: 'text-xl font-mono font-medium',
  md: 'text-2xl font-display font-bold tracking-tight',
  lg: 'text-4xl font-display font-black tracking-tighter drop-shadow-[0_0_12px_rgba(var(--color-brand),0.15)]',
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  variant = 'default',
  size = 'md',
  isTimestamp = false,
  delay = '0ms',
  className,
}: StatCardProps) {
  const displayValue =
    isTimestamp && typeof value === 'string'
      ? formatRelativeTime(value)
      : value === null || value === undefined
        ? '-'
        : String(value)

  const title =
    isTimestamp && typeof value === 'string'
      ? new Date(value).toLocaleString()
      : undefined

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border p-5 shadow-[0_2px_12px_rgba(var(--shadow-color),0.12)] transition-all duration-300 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2 ${variantCard[variant]} ${className ?? ''}`}
      style={{ animationDelay: delay, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted opacity-60 mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-2" title={title}>
            <span className={`leading-none ${sizeValue[size]} ${variantValue[variant]}`}>
              {displayValue}
            </span>
            {unit && (
              <span className="text-[10px] font-black uppercase tracking-widest text-app-muted opacity-40">
                {unit}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${variantIcon[variant]}`}>
            {icon}
          </div>
        )}
      </div>
      {icon && size === 'lg' && (
        <div className="absolute -bottom-2 -right-2 opacity-[0.03] pointer-events-none scale-[3]">
          {icon}
        </div>
      )}
    </div>
  )
}
