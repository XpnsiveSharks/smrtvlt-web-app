import { useState } from 'react'
import { useRedisDiagnostics, useWebSocketDiagnostics, useDatabaseDiagnostics } from './hooks/useDiagnostics'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { Activity, Database, Network } from 'lucide-react'

const tabs = [
  { key: 'redis', label: 'Redis', icon: Database },
  { key: 'websockets', label: 'WebSockets', icon: Network },
  { key: 'database', label: 'Database', icon: Activity },
]

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

export function OpsDiagnosticsPage() {
  const [tab, setTab] = useState('redis')

  return (
    <div>
      <h1 className="font-display text-2xl mb-6 text-app-text">Diagnostics</h1>
      <div className="mb-4 flex gap-2">
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors inline-flex items-center gap-2 ${tab === t.key ? 'border-brand text-brand' : 'border-transparent text-app-muted hover:text-app-text'}`}
              onClick={() => setTab(t.key)}
              type="button"
            >
              <Icon size={16} />
              {t.label}
            </button>
          )
        })}
      </div>
      <div className="bg-app-surface-2 rounded-lg p-6 shadow-lg shadow-black/20">
        <div className="bg-gradient-to-b from-brand/5 to-transparent rounded-t-lg -mt-6 -mx-6 pt-6 px-6 pb-2" />
        {tab === 'redis' && <RedisDiagnostics />}
        {tab === 'websockets' && <WebSocketDiagnostics />}
        {tab === 'database' && <DatabaseDiagnostics />}
      </div>
    </div>
  )
}

function RedisDiagnostics() {
  const { data, loading, error, refetch } = useRedisDiagnostics()
  if (loading) return <LoadingState label="Loading Redis diagnostics..." />
  if (error) return <ErrorState detail={error} onRetry={refetch} />
  if (!data) return <p className="text-app-muted text-sm">No data.</p>
  return (
    <div>
      {/* Primary metrics card */}
      <div className="bg-app-surface rounded-lg p-4 border border-app-border/50 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-app-muted mb-2">Status</div>
            <div className="mt-1">
              <StatusBadge status={data.status} />
            </div>
          </div>
          
          <div>
            <div className="text-[11px] uppercase tracking-wider text-app-muted mb-2">Connected</div>
            <div className="mt-1">
              <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                data.connected 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-app-danger/20 text-app-danger border-app-danger/30'
              }`}>
                <span className="h-2 w-2 rounded-full bg-current" />
                {data.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">Resource Metrics</div>
      <div className="grid grid-cols-2 gap-6">
        <Metric label="Total Keys" value={data.total_keys} isPrimary />
        <Metric label="Memory Used" value={data.memory_used_mb} unit="MB" />
        <Metric label="Uptime" value={data.uptime_seconds} unit="sec" />
        <Metric label="Checked At" value={data.checked_at} isTimestamp />
      </div>
    </div>
  )
}

function WebSocketDiagnostics() {
  const { data, loading, error, refetch } = useWebSocketDiagnostics()
  if (loading) return <LoadingState label="Loading WebSocket diagnostics..." />
  if (error) return <ErrorState detail={error} onRetry={refetch} />
  if (!data) return <p className="text-app-muted text-sm">No data.</p>
  return (
    <div>
      {/* Primary metrics card */}
      <div className="bg-app-surface rounded-lg p-4 border border-app-border/50 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">Active Connections</div>
        <div className="grid grid-cols-2 gap-6">
          <Metric label="Total Users" value={data.total_users} isPrimary />
          <Metric label="User Connections" value={data.total_user_connections} isPrimary />
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">Vault Metrics</div>
      <div className="grid grid-cols-2 gap-6">
        <Metric label="Total Vaults" value={data.total_vaults} />
        <Metric label="Subscriptions" value={data.subscriptions} />
        <Metric label="Online Vaults" value={data.online_vaults.length} isPrimary />
        <Metric label="Checked At" value={data.checked_at} isTimestamp />
      </div>
      {data.online_vaults.length > 0 && (
        <div className="mt-6 pt-6 border-t border-app-border">
          <p className="text-xs font-semibold text-app-text mb-3">
            Online Vaults ({data.online_vaults.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {data.online_vaults.map(vaultId => (
              <span
                key={vaultId}
                className="inline-flex items-center rounded-md border border-app-border bg-app-surface px-2.5 py-1 text-xs font-mono text-app-text"
              >
                {vaultId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DatabaseDiagnostics() {
  const { data, loading, error, refetch } = useDatabaseDiagnostics()
  if (loading) return <LoadingState label="Loading database diagnostics..." />
  if (error) return <ErrorState detail={error} onRetry={refetch} />
  if (!data) return <p className="text-app-muted text-sm">No data.</p>
  return (
    <div>
      {/* Primary metrics card */}
      <div className="bg-app-surface rounded-lg p-4 border border-app-border/50 mb-6">
        <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">Health Status</div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-app-muted mb-2">Status</div>
          <div className="mt-1">
            <StatusBadge status={data.status} />
          </div>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">Connection Pool</div>
      <div className="grid grid-cols-2 gap-6">
        <Metric label="Pool Size" value={data.pool_size} isPrimary />
        <Metric label="Checked Out" value={data.checked_out} isPrimary />
        <Metric 
          label="Overflow" 
          value={data.overflow} 
          semanticValue={data.overflow <= 0 ? 'success' : data.overflow <= 5 ? 'warning' : 'danger'}
        />
        <Metric label="Checked At" value={data.checked_at} isTimestamp />
      </div>
    </div>
  )
}

function Metric({ 
  label, 
  value, 
  unit,
  isTimestamp,
  isPrimary = false,
  semanticValue
}: { 
  label: string
  value: string | number | boolean | null | undefined
  unit?: string
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
  
  const getSemanticHint = () => {
    if (!semanticValue || typeof value !== 'number') return null
    if (semanticValue === 'success' && value <= 0) return 'No overflow'
    return null
  }
  
  return (
    <div>
      <div className={`text-[11px] uppercase tracking-wider mb-2 ${isPrimary ? 'font-semibold text-app-text' : 'text-app-muted'}`}>
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <div 
          className={`font-mono ${isPrimary ? 'text-2xl font-display' : 'text-lg'} ${getSemanticColor()}`}
          title={title}
        >
          {displayValue}
        </div>
        {unit && (
          <span className="text-xs text-app-muted font-normal">{unit}</span>
        )}
      </div>
      {getSemanticHint() && (
        <div className="text-[10px] text-app-muted mt-0.5">{getSemanticHint()}</div>
      )}
    </div>
  )
}
