import { Spinner } from './Spinner'

interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-app-border bg-app-surface p-4 text-app-muted">
      <Spinner size="sm" />
      <span className="text-sm">{label}</span>
    </div>
  )
}