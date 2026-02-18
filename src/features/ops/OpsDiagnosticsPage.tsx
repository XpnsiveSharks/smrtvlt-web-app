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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {/* P1: Background Ambient Glow */}
      <div className="absolute -top-24 left-1/4 right-1/4 h-64 bg-brand/5 blur-[120px] pointer-events-none" />
      
      <h1 className="font-display text-3xl mb-8 tracking-tighter text-app-text border-l-2 border-brand pl-4 drop-shadow-[0_0_12px_rgba(var(--color-brand),0.25)]">Diagnostics</h1>
      
      {/* P3: Refined Technical Tabs */}
      <div className="mb-8 flex p-1.5 bg-black/40 backdrop-blur-md rounded-xl w-fit border border-white/5 shadow-inner">
        {tabs.map(t => {
          const Icon = t.icon
          const isActive = tab === t.key
          return (
            <button
              key={t.key}
              className={`px-6 py-2.5 rounded-lg transition-all duration-300 inline-flex items-center gap-3 relative overflow-hidden group/tab ${
                isActive 
                  ? 'bg-brand/10 text-brand border border-brand/20 shadow-[0_0_20px_rgba(var(--color-brand),0.05)]' 
                  : 'text-app-muted hover:text-app-text hover:bg-white/5 border border-transparent'
              }`}
              onClick={() => setTab(t.key)}
              type="button"
            >
              <Icon size={16} className={`transition-transform duration-300 ${isActive ? 'text-brand scale-110' : 'opacity-40 group-hover/tab:scale-110'}`} />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">{t.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-brand shadow-[0_0_10px_rgba(var(--color-brand),0.8)] rounded-full animate-pulse" />
              )}
            </button>
          )
        })}
      </div>

      <div className="relative group/main-card">
        {/* P1: Main Observation Container with Depth */}
        <div className="bg-app-surface-2 rounded-2xl p-8 shadow-[inset_0_2px_20px_rgba(0,0,0,0.4),0_20px_50px_rgba(0,0,0,0.4)] border border-white/[0.05] border-t-white/10 overflow-hidden min-h-[600px] transition-all duration-500 relative">
          {/* Subtle Scanline/Grid effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(191,255,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(191,255,0,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />
          
          <div key={tab} className="animate-in fade-in zoom-in-95 slide-in-from-right-8 duration-500 relative z-10">
            {tab === 'redis' && <RedisDiagnostics />}
            {tab === 'websockets' && <WebSocketDiagnostics />}
            {tab === 'database' && <DatabaseDiagnostics />}
          </div>
        </div>
      </div>
    </div>
  )
}

function RedisDiagnostics() {
  const { data, loading, error, refetch } = useRedisDiagnostics()
  if (loading) return <div className="py-20"><LoadingState label="Polling technical metrics..." /></div>
  if (error) return <ErrorState detail={error} onRetry={refetch} />
  if (!data) return <p className="text-app-muted text-sm italic opacity-40">No data stream available.</p>
  return (
    <div className="space-y-12">
      {/* Primary metrics card */}
      <div className="rounded-2xl bg-black/30 p-8 border border-white/5 relative overflow-hidden group/subcard shadow-inner">
        {/* P4: Ghosting Asset */}
        <div className="absolute -top-8 -right-8 p-4 opacity-[0.05] pointer-events-none transition-transform duration-1000 group-hover/subcard:scale-110 group-hover/subcard:rotate-6">
          <Database size={180} className="text-brand blur-[1px]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-app-muted opacity-40 mb-4">Node Health Integrity</div>
            <div className="flex items-center gap-4">
              <div className="scale-110 origin-left">
                <StatusBadge status={data.status} />
              </div>
              {data.status === 'healthy' && (
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-app-muted opacity-40 mb-4">Connection Bridge</div>
            <div className="">
              <span className={`inline-flex items-center gap-2.5 rounded-lg border px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md transition-all ${
                data.connected 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                  : 'bg-app-danger/10 text-app-danger border-app-danger/20'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${data.connected ? 'bg-emerald-500 animate-pulse' : 'bg-app-danger'}`} />
                {data.connected ? 'Active Stream' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        {/* P5: Radar Header Styling */}
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand mb-6 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 bg-brand animate-pulse rounded-full" />
            <span className="opacity-40">[</span>
          </div>
          Resource Allocation
          <span className="opacity-40">]</span>
          <div className="flex-1 h-px bg-white/5 ml-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric label="Total Keys" value={data.total_keys} isPrimary delay="100ms" />
          <Metric label="Memory footprint" value={data.memory_used_mb} unit="MB" delay="150ms" />
          <Metric label="System uptime" value={data.uptime_seconds} unit="sec" delay="200ms" />
          <Metric label="Last telemetry" value={data.checked_at} isTimestamp delay="250ms" />
        </div>
      </div>
    </div>
  )
}

function WebSocketDiagnostics() {
  const { data, loading, error, refetch } = useWebSocketDiagnostics()
  if (loading) return <div className="py-20"><LoadingState label="Analyzing connection bridge..." /></div>
  if (error) return <ErrorState detail={error} onRetry={refetch} />
  if (!data) return <p className="text-app-muted text-sm italic opacity-40">No socket data available.</p>
  return (
    <div className="space-y-12">
      {/* Primary metrics card */}
      <div className="rounded-2xl bg-black/30 p-8 border border-white/5 relative overflow-hidden group/subcard shadow-inner">
        {/* P4: Ghosting Asset */}
        <div className="absolute -top-12 -right-12 p-4 opacity-[0.06] pointer-events-none transition-transform duration-[60s] linear animate-spin-slow">
          <Network size={220} className="text-brand blur-[1px]" />
        </div>
        
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand mb-8 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 bg-brand animate-pulse rounded-full" />
            <span className="opacity-40">[</span>
          </div>
          Active Relay Status
          <span className="opacity-40">]</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <Metric label="Total Active Users" value={data.total_users} isPrimary />
          <Metric label="Network Relays" value={data.total_user_connections} isPrimary />
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand mb-6 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 bg-brand animate-pulse rounded-full" />
            <span className="opacity-40">[</span>
          </div>
          Vault Mesh Network
          <span className="opacity-40">]</span>
          <div className="flex-1 h-px bg-white/5 ml-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric label="Total Nodes" value={data.total_vaults} delay="100ms" />
          <Metric label="Data Subscriptions" value={data.subscriptions} delay="150ms" />
          <Metric label="Live Vaults" value={data.online_vaults.length} isPrimary delay="200ms" />
          <Metric label="Last telemetry" value={data.checked_at} isTimestamp delay="250ms" />
        </div>
      </div>

      {data.online_vaults.length > 0 && (
        <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in duration-1000">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-app-muted opacity-40 mb-5">
            Decentralized Vault Nodes ({data.online_vaults.length})
          </p>
          <div className="flex flex-wrap gap-2.5">
            {data.online_vaults.map(vaultId => (
              <span
                key={vaultId}
                className="inline-flex items-center rounded-lg border border-white/5 bg-black/40 px-3.5 py-2 text-[10px] font-mono font-bold text-brand shadow-xl hover:border-brand/30 transition-colors group/node"
              >
                <span className="h-1 w-1 rounded-full bg-brand mr-2.5 animate-pulse group-hover/node:shadow-[0_0_8px_rgba(var(--color-brand),0.8)]" />
                NODE-{vaultId.slice(0, 8)}
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
  if (loading) return <div className="py-20"><LoadingState label="Auditing persistence layer..." /></div>
  if (error) return <ErrorState detail={error} onRetry={refetch} />
  if (!data) return <p className="text-app-muted text-sm italic opacity-40">No database diagnostics available.</p>
  return (
    <div className="space-y-12">
      {/* Primary metrics card */}
      <div className="rounded-2xl bg-black/30 p-8 border border-white/5 relative overflow-hidden group/subcard shadow-inner">
        {/* P4: Ghosting Asset */}
        <div className="absolute -top-10 -right-10 p-4 opacity-[0.05] pointer-events-none transition-transform duration-1000 group-hover/subcard:translate-y-2">
          <Activity size={200} className="text-brand blur-[1px]" />
        </div>
        
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand mb-8 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 bg-brand animate-pulse rounded-full" />
            <span className="opacity-40">[</span>
          </div>
          Persistence Integrity
          <span className="opacity-40">]</span>
        </div>
        
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-app-muted opacity-40 mb-4">Core Health Status</div>
          <div className="flex items-center gap-4">
            <div className="scale-110 origin-left">
              <StatusBadge status={data.status} />
            </div>
            {data.status === 'healthy' && (
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand mb-6 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 bg-brand animate-pulse rounded-full" />
            <span className="opacity-40">[</span>
          </div>
          SQL Connection Pool
          <span className="opacity-40">]</span>
          <div className="flex-1 h-px bg-white/5 ml-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric label="Pool Size" value={data.pool_size} isPrimary delay="100ms" />
          <Metric label="Checked Out" value={data.checked_out} isPrimary delay="150ms" />
          <Metric 
            label="Node Overflow" 
            value={data.overflow} 
            semanticValue={data.overflow <= 0 ? 'success' : data.overflow <= 5 ? 'warning' : 'danger'}
            delay="200ms"
          />
          <Metric label="Last telemetry" value={data.checked_at} isTimestamp delay="250ms" />
        </div>
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
  semanticValue,
  className,
  delay = '0ms'
}: { 
  label: string
  value: string | number | boolean | null | undefined
  unit?: string
  isTimestamp?: boolean
  isPrimary?: boolean
  semanticValue?: 'success' | 'warning' | 'danger'
  className?: string
  delay?: string
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
    <div 
      className={`group relative overflow-hidden rounded-xl border border-white/[0.05] border-t-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent p-5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2 ${className ?? ''}`}
      style={{ animationDelay: delay, animationFillMode: 'both' }}
    >
      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-app-muted opacity-40 mb-3 group-hover:text-app-muted group-hover:opacity-60 transition-all">
        {label}
      </div>
      <div className="flex items-baseline gap-2.5">
        {/* P2: High Signal Metric Typo */}
        <div 
          className={`tracking-tighter ${isPrimary ? 'text-4xl font-display font-black text-app-text drop-shadow-[0_0_12px_rgba(var(--color-brand),0.2)]' : 'text-xl font-mono font-medium text-app-text/90'} ${getSemanticColor()}`}
          title={title}
        >
          {displayValue}
        </div>
        {unit && (
          <span className="text-[10px] font-black uppercase tracking-widest text-app-muted opacity-30">{unit}</span>
        )}
      </div>
      
      {/* Subtle indicator for primary metrics */}
      {isPrimary && (
        <div className="absolute top-3 right-3 h-1 w-1 rounded-full bg-brand/40 group-hover:bg-brand group-hover:shadow-[0_0_8px_rgba(var(--color-brand),1)] transition-all animate-pulse" />
      )}
    </div>
  )
}
