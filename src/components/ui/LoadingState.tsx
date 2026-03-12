import { createPortal } from 'react-dom'
import { Spinner } from './Spinner'

interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading...' }: LoadingStateProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-app-bg/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-app-border/30 bg-app-surface px-10 py-8 shadow-2xl">
        <Spinner size="md" />
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-app-muted opacity-60">{label}</span>
      </div>
    </div>,
    document.body
  )
}
