import { useRateLimits } from './hooks/useRateLimits'
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

export function OpsRateLimitsPage() {
  const { data, loading, error, refetch } = useRateLimits()
  
  return (
    <div>
      <h1 className="font-display text-2xl mb-6 text-app-text">Rate Limits</h1>
      
      {loading && <LoadingState label="Loading rate limits..." />}
      {error && <ErrorState detail={error} onRetry={refetch} />}
      
      {data && (
        <div className="bg-app-surface-2 rounded-lg p-6 shadow-lg shadow-black/20">
          <div className="bg-gradient-to-b from-brand/5 to-transparent rounded-t-lg -mt-6 -mx-6 pt-6 px-6 pb-2" />
          
          {/* Primary metrics card */}
          <div className="bg-app-surface rounded-lg p-4 border border-app-border/50 mb-6">
            <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">Active Keys</div>
            <div className="grid grid-cols-2 gap-6">
              <Metric label="Total Active Keys" value={data.total_active_keys} isPrimary />
              <Metric label="Checked At" value={data.checked_at} isTimestamp />
            </div>
          </div>

          {/* Top Violators */}
          <div className="mb-6">
            <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">Top Violators</div>
            {data.top_violators.length === 0 ? (
              <p className="text-app-muted text-sm">None</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-app-muted">
                    <th className="text-left">Key</th>
                    <th>Count</th>
                    <th>TTL (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_violators.map(v => (
                    <tr key={v.key} className="hover:bg-white/5">
                      <td className="font-mono">{v.key}</td>
                      <td>{v.current_count}</td>
                      <td>{v.ttl_seconds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* By Category */}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">By Category</div>
            {Object.entries(data.by_category).length === 0 ? (
              <p className="text-app-muted text-sm">No categories</p>
            ) : (
              <ul className="list-disc ml-6 text-app-text text-sm">
                {Object.entries(data.by_category).map(([cat, count]) => (
                  <li key={cat}><span className="font-mono text-app-muted">{cat}</span>: {count}</li>
                ))}
              </ul>
            )}
          </div>
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
}: { 
  label: string
  value: string | number | boolean | null | undefined
  isTimestamp?: boolean
  isPrimary?: boolean
}) {
  const displayValue = isTimestamp && typeof value === 'string' 
    ? formatRelativeTime(value) 
    : String(value)
  
  const title = isTimestamp && typeof value === 'string' 
    ? new Date(value).toLocaleString() 
    : undefined
  
  return (
    <div>
      <div className={`text-[11px] uppercase tracking-wider mb-2 ${isPrimary ? 'font-semibold text-app-text' : 'text-app-muted'}`}>
        {label}
      </div>
      <div 
        className={`font-mono ${isPrimary ? 'text-2xl font-display' : 'text-lg'} text-app-text`}
        title={title}
      >
        {displayValue}
      </div>
    </div>
  )
}
