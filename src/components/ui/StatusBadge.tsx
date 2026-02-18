interface StatusBadgeProps {
  status: string | null | undefined
}

const statusStyles: Record<string, string> = {
  ok: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  critical: 'bg-app-danger/20 text-app-danger border-app-danger/30',
  error: 'bg-app-danger/20 text-app-danger border-app-danger/30',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase() ?? 'unknown'
  const styles = statusStyles[normalizedStatus] ?? 'bg-app-surface-2 text-app-muted border-app-border'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold ${styles}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status ?? '-'}
    </span>
  )
}
