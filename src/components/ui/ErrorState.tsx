interface ErrorStateProps {
  title?: string
  detail: string
}

export function ErrorState({ title = 'Request failed', detail }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-app-danger/40 bg-red-950/20 p-4">
      <p className="text-sm font-semibold text-red-300">{title}</p>
      <p className="mt-1 text-sm text-red-200">{detail}</p>
    </div>
  )
}