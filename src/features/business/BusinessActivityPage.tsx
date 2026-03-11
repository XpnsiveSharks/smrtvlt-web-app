import { useState, useEffect, type ReactNode } from 'react'
import { 
  Activity, 
  Lock, 
  ShieldAlert, 
  Key, 
  RefreshCcw, 
  History,
  ChevronDown,
  Clock
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { useBusinessActivity } from './hooks/useBusinessActivity'

const PAGE_SIZE = 20

interface KPITileProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: string
  variant?: 'default' | 'danger' | 'brand'
  delay?: string
}

function KPITile({ label, value, icon, variant = 'default', delay = '0ms' }: KPITileProps) {
  const variantStyles = {
    default: 'text-app-text border-app-border/30 bg-app-surface-2/50',
    danger: 'text-red-400 border-red-500/20 bg-red-500/5',
    brand: 'text-brand border-brand/20 bg-brand/5',
  }

  const iconStyles = {
    default: 'bg-app-surface/30 text-app-muted',
    danger: 'bg-red-500/10 text-red-400',
    brand: 'bg-brand/10 text-brand',
  }

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-black/40 animate-in fade-in slide-in-from-bottom-2 ${variantStyles[variant]}`}
      style={{ animationDelay: delay, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold leading-none tracking-tight">
            {value}
          </p>
        </div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconStyles[variant]}`}>
          {icon}
        </div>
      </div>
      <div className="absolute -bottom-2 -right-2 opacity-[0.03]">
        {icon}
      </div>
    </div>
  )
}

export function BusinessActivityPage() {
  const [selectedHours, setSelectedHours] = useState(24)
  const [page, setPage] = useState(1)
  const { data, loading, error, refetch } = useBusinessActivity(selectedHours, 50)

  useEffect(() => { setPage(1) }, [data])

  const totalPages = data ? Math.max(1, Math.ceil(data.entries.length / PAGE_SIZE)) : 1
  const pagedEntries = data?.entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? []

  const handleHoursChange = (hours: number) => {
    setSelectedHours(hours)
    void refetch(hours, 50)
  }

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-app-text border-l-2 border-brand pl-4">Business Activity</h1>
          <p className="mt-1 text-sm text-app-muted ml-4 opacity-80">Recent vault and user activity log.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <select
              value={selectedHours}
              onChange={(e) => handleHoursChange(Number(e.target.value))}
              className="appearance-none rounded-xl border border-app-border/50 bg-app-surface-2 pl-10 pr-10 py-2.5 text-sm text-app-text transition-all focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
              disabled={loading}
            >
              <option value={1}>Last hour</option>
              <option value={6}>Last 6 hours</option>
              <option value={24}>Last 24 hours</option>
              <option value={72}>Last 3 days</option>
              <option value={168}>Last week</option>
            </select>
            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none group-focus-within:rotate-180 transition-transform" />
          </div>
          <Button variant="secondary" onClick={() => void refetch()} isLoading={loading} className="border-app-border/30 hover:bg-app-surface/50">
            <RefreshCcw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      {loading && <LoadingState label="Synchronizing activity data..." />}

      {!loading && error && (
        <ErrorState
          title="Failed to load business activity"
          detail={error.statusText}
          status={error.status}
          onRetry={() => void refetch()}
        />
      )}

      {!loading && !error && data && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <KPITile 
              label="Total events" 
              value={data.summary.total_events.toLocaleString()} 
              icon={<Activity size={18} />}
              delay="0ms"
            />
            <KPITile 
              label="Vault unlocks" 
              value={data.summary.vault_unlocks.toLocaleString()} 
              icon={<Lock size={18} />}
              delay="50ms"
            />
            <KPITile 
              label="Failed unlocks" 
              value={data.summary.failed_unlocks.toLocaleString()} 
              icon={<ShieldAlert size={18} />}
              variant={data.summary.failed_unlocks > 0 ? 'danger' : 'default'}
              delay="100ms"
            />
            <KPITile 
              label="PIN operations" 
              value={data.summary.pin_operations.toLocaleString()} 
              icon={<Key size={18} />}
              delay="150ms"
            />
            <KPITile 
              label="State changes" 
              value={data.summary.state_changes.toLocaleString()} 
              icon={<RefreshCcw size={18} />}
              delay="200ms"
            />
          </div>

          {/* Activity Entries */}
          <div className="relative group/card">
            <div className="absolute -top-[1px] left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-brand/40 to-transparent z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
            
            <Card className="p-0 overflow-hidden border-app-border/30 shadow-2xl shadow-black/60">
              <div className="bg-app-surface/20 border-b border-app-border/20 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg text-app-text">Recent Entries</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted opacity-60">Last {data.period_hours} hours</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-app-surface/30 flex items-center justify-center border border-app-border/30">
                  <History size={16} className="text-app-muted" />
                </div>
              </div>

              {data.entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-app-bg/20">
                  <div className="w-16 h-16 rounded-full bg-app-surface/20 border border-app-border/30 flex items-center justify-center mb-6">
                    <History size={32} className="text-app-muted opacity-20" />
                  </div>
                  <div className="text-app-text font-semibold text-lg">No activity recorded</div>
                  <p className="text-sm text-app-muted/70 max-w-xs mx-auto mt-2">
                    We haven't detected any events in the selected time range. Try increasing the period.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-app-surface/20">
                        <th className="px-6 py-4 text-left font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">ID</th>
                        <th className="px-6 py-4 text-left font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">Action</th>
                        <th className="px-6 py-4 text-left font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60 text-center">Method</th>
                        <th className="px-6 py-4 text-left font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">Vault ID</th>
                        <th className="px-6 py-4 text-left font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60 text-right">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-app-border/30">
                      {pagedEntries.map((entry) => (
                        <tr key={entry.id} className="group hover:bg-app-surface-2/30 transition-colors duration-200">
                          <td className="px-6 py-4 font-mono text-[10px] text-app-muted/50 group-hover:text-app-muted transition-colors">#{entry.id}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-2 font-semibold text-app-text group-hover:text-brand transition-colors">
                              <span className={`h-1.5 w-1.5 rounded-full ${entry.action.includes('fail') ? 'bg-red-400' : 'bg-brand'}`} />
                              {entry.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block rounded border border-app-border/30 bg-app-surface/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-app-muted/80">
                              {entry.method}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-mono text-xs text-app-text">V-{entry.vault_id}</span>
                              <span className="text-[10px] text-app-muted opacity-50 font-mono">U-{entry.user_id ?? 'ANON'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-xs text-app-muted whitespace-nowrap">
                            {new Date(entry.created_at).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-app-border/20 px-6 py-4 bg-app-surface/20">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted opacity-60">
                        Page {page} of {totalPages} · {data.entries.length} entries
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="rounded-lg border border-app-border/30 bg-app-surface-2 px-3 py-1.5 text-xs font-bold text-app-muted transition-all hover:bg-app-surface/50 hover:text-app-text disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Prev
                        </button>
                        <button
                          type="button"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="rounded-lg border border-app-border/30 bg-app-surface-2 px-3 py-1.5 text-xs font-bold text-app-muted transition-all hover:bg-app-surface/50 hover:text-app-text disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </section>
  )
}
