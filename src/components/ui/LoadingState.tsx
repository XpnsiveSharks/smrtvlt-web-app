interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-app-border bg-app-surface p-4 text-app-muted">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-app-muted border-t-brand" />
      <span className="text-sm">{label}</span>
    </div>
  )
}