import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { RefreshCcw } from 'lucide-react'
import { useSecurityAlerts } from './hooks/useSecurityAlerts'
import type { SecurityAlert } from '../../api/internal/security'

const severityColors: Record<string, string> = {
  low: 'text-blue-400',
  medium: 'text-amber-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
}

const statusColors: Record<string, string> = {
  ok: 'text-emerald-400',
  warning: 'text-amber-400',
  critical: 'text-red-400',
}

export function SecurityAlertsPage() {
  const { data, loading, error, refetch } = useSecurityAlerts()

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-app-text border-l-2 border-brand pl-4">Security Alerts</h1>
          <p className="mt-1 text-sm text-app-muted opacity-80 ml-4">
            Monitor suspicious activity and security events.
          </p>
        </div>
        <Button variant="secondary" onClick={() => void refetch()} isLoading={loading} className="border-app-border/30 hover:bg-app-surface/50 gap-2 group">
          <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          Refresh
        </Button>
      </header>

      {loading && <LoadingState label="Loading security alerts..." />}

      {!loading && error && (
        <ErrorState
          title="Failed to load security alerts"
          detail={error.statusText}
          status={error.status}
          onRetry={() => void refetch()}
        />
      )}

      {!loading && !error && data && (
        <div className="space-y-6 relative">
          
          {/* Status Overview */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
            <Card className="relative overflow-hidden group border border-app-border/30 transition-colors duration-500 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 items-center">
                <div className="md:border-r md:border-app-border/30 pr-8">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-app-muted opacity-60 mb-2">Overall System Status</p>
                  <p className={`font-display text-7xl md:text-8xl font-black tracking-tighter drop-shadow-[0_0_25px_rgba(16,185,129,0.1)] ${statusColors[data.status]}`}>
                    {data.status.toUpperCase()}
                  </p>
                </div>
                <div className="md:pl-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-app-muted opacity-60 mb-2">Active Alerts</p>
                  <p className="font-display text-5xl md:text-6xl font-black text-app-text tracking-tighter">
                    {data.active_alerts.length}
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                <div className="w-64 h-64 rounded-full border-[16px] border-current -mr-20 -mt-20" />
              </div>
            </Card>
          </div>

          {/* Last 24h Metrics */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
            <Card className="border border-app-border/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-4 bg-brand rounded-full" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand font-black">Temporal Activity Matrix</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricTile 
                  label="Failed unlocks (1h)" 
                  value={data.last_24h.failed_unlocks_1h} 
                  accentColor="border-brand/40"
                />
                <MetricTile 
                  label="Failed unlocks (24h)" 
                  value={data.last_24h.failed_unlocks_24h} 
                  accentColor="border-brand/40"
                />
                <MetricTile 
                  label="PIN lockouts (24h)" 
                  value={data.last_24h.pin_lockouts_24h} 
                  accentColor="border-app-danger/40"
                />
              </div>
            </Card>
          </div>

          {/* Active Alerts */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            <Card className="min-h-[200px] border border-app-border/30 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-4 bg-brand rounded-full" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-brand font-black">Live Threat Stream</p>
                </div>
                {data.active_alerts.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-app-danger/10 border border-app-danger/20 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-app-danger animate-pulse" />
                    <span className="text-[9px] font-black text-app-danger uppercase tracking-widest">Attention Required</span>
                  </div>
                )}
              </div>
              
              {data.active_alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-app-bg/20 rounded-xl border border-dashed border-app-border/30">
                  <div className="w-16 h-16 rounded-full border border-dashed border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                  <p className="text-base font-bold text-app-text uppercase tracking-tight">Zero Threats Detected</p>
                  <p className="text-[10px] text-app-muted mt-2 tracking-widest uppercase opacity-40 font-bold">Node Monitoring Stable</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.active_alerts.map((alert: SecurityAlert, index: number) => (
                    <div
                      key={index}
                      className="group relative rounded-xl border border-app-border/30 bg-app-bg/30 p-5 hover:border-brand/20 transition-all hover:bg-app-bg/50 shadow-inner"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border border-current/30 bg-current/5 ${severityColors[alert.severity]}`}>
                              {alert.severity}
                            </span>
                            <span className="text-xs font-black text-app-text tracking-[0.1em] uppercase">{alert.type}</span>
                          </div>
                          <p className="text-sm text-app-muted/90 leading-relaxed font-medium">{alert.message}</p>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2 text-[10px] font-bold uppercase tracking-[0.15em] text-app-muted opacity-50">
                        <span className="flex items-center gap-2 group-hover:text-app-text transition-colors">
                          Count <span className="font-mono text-app-text bg-app-surface/30 px-2 py-0.5 rounded leading-none border border-app-border/30">{alert.count}</span>
                        </span>
                        <span className="flex items-center gap-2 group-hover:text-app-text transition-colors">
                          Threshold <span className="font-mono text-app-text bg-app-surface/30 px-2 py-0.5 rounded leading-none border border-app-border/30">{alert.threshold}</span>
                        </span>
                        <span className="flex items-center gap-2 group-hover:text-app-text transition-colors">
                          Window <span className="text-app-text bg-app-surface/30 px-2 py-0.5 rounded leading-none border border-app-border/30 italic">{alert.window}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </section>
  )
}

function MetricTile({ label, value, accentColor }: { label: string; value: number; accentColor: string }) {
  return (
    <div className={`bg-app-surface rounded-lg p-5 border border-app-border/30 border-l-2 ${accentColor} shadow-sm group hover:border-app-border/50 transition-all relative overflow-hidden`}>
      <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
         <div className="w-16 h-16 rounded-full border-4 border-current -mr-6 -mt-6" />
      </div>
      <p className="text-[10px] uppercase tracking-wider font-bold text-app-muted mb-3 relative z-10">{label}</p>
      <p className="font-display text-4xl font-black text-app-text tabular-nums tracking-tighter relative z-10">
        {value.toLocaleString()}
      </p>
    </div>
  )
}
