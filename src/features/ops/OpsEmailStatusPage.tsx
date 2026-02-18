import { useEmailStatus } from './hooks/useEmailStatus'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'

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
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  } catch {
    return isoString
  }
}

export function OpsEmailStatusPage() {
  const { data, loading, error, refetch } = useEmailStatus()
  
  return (
    <div>
      <h1 className="font-display text-2xl mb-6 text-app-text">Email Status</h1>
      
      {loading && <LoadingState label="Loading email status..." />}
      {error && <ErrorState detail={error} onRetry={refetch} />}
      
      {data && (
        <div className="bg-app-surface-2 rounded-lg p-6 shadow-lg shadow-black/20">
          <div className="bg-gradient-to-b from-brand/5 to-transparent rounded-t-lg -mt-6 -mx-6 pt-6 px-6 pb-2" />
          
          {/* Primary metrics card */}
          <div className="bg-app-surface rounded-lg p-4 border border-app-border/50 mb-6">
            <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">Service Status</div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-app-muted mb-2">Service</div>
                <div className="font-mono text-lg text-app-text">{data.service}</div>
              </div>
              
              <div>
                <div className="text-[11px] uppercase tracking-wider text-app-muted mb-2">Status</div>
                <div className="mt-1">
                  <StatusBadge status={data.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary metrics */}
          <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">Email Activity</div>
          <div className="grid grid-cols-2 gap-6">
            <Metric label="Sent Today" value={data.sent_today} isPrimary />
            <Metric 
              label="Failed Today" 
              value={data.failed_today} 
              isPrimary
              semanticValue={data.failed_today > 0 ? 'danger' : 'success'}
            />
            <Metric label="Checked At" value={data.checked_at} isTimestamp />
          </div>
          
          {data.note && (
            <div className="mt-6 bg-app-surface rounded-lg p-3 border border-app-border/50 text-sm text-app-muted">
              {data.note}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Metric({ 
  label, 
  value, 
  isTimestamp,
  isPrimary = false,
  semanticValue
}: { 
  label: string
  value: string | number | boolean | null | undefined
  isTimestamp?: boolean
  isPrimary?: boolean
  semanticValue?: 'success' | 'warning' | 'danger'
}) {
  const displayValue = isTimestamp && typeof value === 'string' 
    ? formatRelativeTime(value) 
    : String(value)
  
  const title = isTimestamp && typeof value === 'string' 
    ? new Date(value).toLocaleString() 
    : undefined
  
  const getSemanticColor = () => {
    if (!semanticValue) return 'text-app-text'
    switch (semanticValue) {
      case 'success': return 'text-emerald-400'
      case 'warning': return 'text-amber-400'
      case 'danger': return 'text-app-danger'
      default: return 'text-app-text'
    }
  }
  
  return (
    <div>
      <div className={`text-[11px] uppercase tracking-wider mb-2 ${isPrimary ? 'font-semibold text-app-text' : 'text-app-muted'}`}>
        {label}
      </div>
      <div 
        className={`font-mono ${isPrimary ? 'text-2xl font-display' : 'text-lg'} ${getSemanticColor()}`}
        title={title}
      >
        {displayValue}
      </div>
    </div>
  )
}
