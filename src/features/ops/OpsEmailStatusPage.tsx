import { useEmailStatus } from './hooks/useEmailStatus'
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h1 className="font-display text-3xl mb-8 tracking-tight text-app-text border-l-2 border-brand pl-4">Email Status</h1>
      
      {loading && <LoadingState label="Loading email status..." />}
      {error && <ErrorState detail={error} onRetry={refetch} />}
      
      {data && (
        <div className="bg-app-surface-2 rounded-2xl p-8 shadow-2xl shadow-black/40 border border-white/[0.05] relative overflow-hidden group">
          {/* Atmospheric Depth */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-brand/10 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            {/* P2: Service Status Heartbeat */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-app-bg/40 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-inner">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-app-muted mb-1 font-bold">Service Component</span>
                  <span className="font-display text-2xl font-black text-app-text tracking-tight uppercase">{data.service}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-app-surface-2/50 px-4 py-2.5 rounded-lg border border-white/5">
                <div className={`w-3 h-3 rounded-full ${data.status.toLowerCase() === 'healthy' ? 'bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-app-danger'}`} />
                <span className="text-[11px] uppercase tracking-[0.1em] font-bold text-app-text">{data.status}</span>
              </div>
            </div>

            {/* P1: Hero KPI Elevation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-200 fill-mode-both">
                <Metric 
                  label="Sent Today" 
                  value={data.sent_today} 
                  isPrimary 
                  className="bg-app-bg/30 p-6 rounded-2xl border border-white/5 hover:border-brand/20 transition-colors shadow-lg"
                />
              </div>
              <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-400 fill-mode-both">
                <Metric 
                  label="Failed Today" 
                  value={data.failed_today} 
                  isPrimary
                  semanticValue={data.failed_today > 0 ? 'danger' : 'success'}
                  className="bg-app-bg/30 p-6 rounded-2xl border border-white/5 hover:border-brand/20 transition-colors shadow-lg"
                />
              </div>
            </div>
            
            {data.note && (
              <div className="bg-app-surface rounded-xl p-4 border border-app-border/40 text-sm text-app-muted italic flex items-start gap-3">
                <span className="text-brand font-bold">Note:</span>
                {data.note}
              </div>
            )}

            {/* P4: Refined Grid & Grouping */}
            <div className="mt-12 flex justify-end">
              <div className="flex items-center gap-2 opacity-40 hover:opacity-80 transition-opacity">
                <span className="text-[10px] uppercase tracking-widest font-bold">Last Check:</span>
                <span className="font-mono text-[10px]">{formatRelativeTime(data.checked_at)}</span>
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
  semanticValue,
  className
}: { 
  label: string
  value: string | number | boolean | null | undefined
  isTimestamp?: boolean
  isPrimary?: boolean
  semanticValue?: 'success' | 'warning' | 'danger'
  className?: string
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
      case 'success': return 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.15)]'
      case 'warning': return 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.15)]'
      case 'danger': return 'text-app-danger drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]'
      default: return 'text-app-text'
    }
  }
  
  return (
    <div className={className}>
      <div className={`text-[10px] uppercase tracking-[0.2em] mb-4 ${isPrimary ? 'font-bold text-app-text/60' : 'text-app-muted'}`}>
        {label}
      </div>
      <div 
        className={`leading-none ${isPrimary ? 'text-6xl font-display font-black tracking-tighter' : 'text-xl font-mono'} ${getSemanticColor()}`}
        title={title}
      >
        {displayValue}
      </div>
    </div>
  )
}
