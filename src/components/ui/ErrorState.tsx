interface ErrorStateProps {
  title?: string
  detail: string
  status?: number
  onRetry?: () => void
}

export function ErrorState({ title = 'Request failed', detail, status, onRetry }: ErrorStateProps) {
  const isAuthError = status === 401 || status === 403
  const isRateLimitError = status === 429
  const isServiceError = status === 503

  let borderColor = 'border-app-danger/40'
  let bgColor = 'bg-red-950/20'
  let textColor = 'text-red-300'
  let detailColor = 'text-red-200'

  if (isAuthError) {
    borderColor = 'border-amber-500/40'
    bgColor = 'bg-amber-950/20'
    textColor = 'text-amber-300'
    detailColor = 'text-amber-200'
  } else if (isRateLimitError) {
    borderColor = 'border-orange-500/40'
    bgColor = 'bg-orange-950/20'
    textColor = 'text-orange-300'
    detailColor = 'text-orange-200'
  } else if (isServiceError) {
    borderColor = 'border-blue-500/40'
    bgColor = 'bg-blue-950/20'
    textColor = 'text-blue-300'
    detailColor = 'text-blue-200'
  }

  return (
    <div className={`mt-4 rounded-lg border ${borderColor} ${bgColor} p-4`}>
      <p className={`text-sm font-semibold ${textColor}`}>{title}</p>
      <p className={`mt-1 text-sm ${detailColor}`}>{detail}</p>
      {status && (
        <p className={`mt-2 text-xs ${detailColor} opacity-70`}>Status code: {status}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className={`mt-3 text-xs font-semibold ${textColor} underline hover:no-underline`}
        >
          Retry
        </button>
      )}
    </div>
  )
}