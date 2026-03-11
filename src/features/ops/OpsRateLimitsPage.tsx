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
  
  const maxCategoryCount = data ? Object.values(data.by_category).reduce((max, val) => Math.max(max, val), 0) : 1

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h1 className="font-display text-3xl mb-8 tracking-tight text-app-text border-l-2 border-brand pl-4">Rate Limits</h1>
      
      {loading && <LoadingState label="Loading rate limits..." />}
      {error && <ErrorState detail={error} onRetry={refetch} />}
      
      {data && (
        <div className="bg-app-surface-2 rounded-2xl p-8 shadow-2xl shadow-black/40 border border-app-border/30 relative overflow-hidden group">
          {/* Atmospheric Depth */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-brand/15 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            {/* Primary metrics card */}
            <div className="bg-app-surface/40 backdrop-blur-md rounded-2xl p-6 border border-app-border/30 mb-8 shadow-inner group-hover:border-brand/20 transition-colors duration-500">
              <div className="text-[10px] uppercase tracking-[0.2em] text-brand mb-4 font-bold opacity-80">Active Keys</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Metric label="Total Active Keys" value={data.total_active_keys} isPrimary />
                <div className="flex flex-col justify-end">
                  <Metric label="Checked At" value={data.checked_at} isTimestamp />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Top Violators */}
              <div className="animate-in fade-in slide-in-from-left-4 duration-700 delay-200 fill-mode-both">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand/80 whitespace-nowrap">Top Violators</div>
                  <div className="flex-1 h-px bg-app-border/30" />
                </div>
                {data.top_violators.length === 0 ? (
                  <div className="flex items-center gap-3 bg-app-bg/20 p-4 rounded-xl border border-app-border/30 text-app-muted italic text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    All systems nominal
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-app-border/20 bg-app-bg/10">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-widest text-app-muted bg-app-surface/20">
                          <th className="text-left py-3 px-4 font-semibold">Key</th>
                          <th className="text-center py-3 px-4 font-semibold">Count</th>
                          <th className="text-right py-3 px-4 font-semibold">TTL (s)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-app-border/30">
                        {data.top_violators.map(v => (
                          <tr key={v.key} className="hover:bg-app-surface-2/50 transition-colors group/row">
                            <td className="py-3 px-4 font-mono text-[11px] text-app-muted group-hover/row:text-app-text transition-colors">{v.key}</td>
                            <td className="py-3 px-4 text-center font-display font-bold text-app-text">{v.current_count}</td>
                            <td className="py-3 px-4 text-right font-mono text-[11px] text-app-muted">{v.ttl_seconds}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* By Category */}
              <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-400 fill-mode-both">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand/80 whitespace-nowrap">By Category</div>
                  <div className="flex-1 h-px bg-app-border/30" />
                </div>
                {Object.entries(data.by_category).length === 0 ? (
                  <p className="text-app-muted text-sm italic opacity-50">No categories recorded</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(data.by_category).map(([cat, count]) => (
                      <div key={cat} className="space-y-2">
                        <div className="flex justify-between items-end px-1">
                          <span className="font-mono text-[11px] text-app-muted uppercase tracking-wider">{cat}</span>
                          <span className="font-display font-black text-lg text-app-text">{count}</span>
                        </div>
                        <div className="h-1.5 bg-app-surface/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand shadow-[0_0_8px_rgba(var(--color-brand),0.5)] transition-all duration-1000 ease-out"
                            style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
      <div className={`text-[10px] uppercase tracking-[0.15em] mb-3 ${isPrimary ? 'font-bold text-app-text/60' : 'text-app-muted'}`}>
        {label}
      </div>
      <div 
        className={`leading-none ${isPrimary ? 'text-6xl font-display font-black tracking-tighter text-app-text drop-shadow-[0_0_15px_rgba(var(--color-brand),0.15)]' : 'text-xl font-mono text-app-text/70'}`}
        title={title}
      >
        {displayValue}
      </div>
    </div>
  )
}
