import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { useBusinessOverview } from './hooks/useBusinessOverview'

function displayValue(value: number | string | null | undefined): string {
  if (value === null || value === undefined) {
    return '-'
  }
  if (typeof value === 'string' && value.trim().length === 0) {
    return '-'
  }
  return String(value)
}

export function BusinessOverviewPage() {
  const { data, loading, error, refetch } = useBusinessOverview()

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-app-text border-l-2 border-brand pl-4">Business Overview</h1>
          <p className="mt-1 text-sm text-app-muted opacity-80 ml-4">
            Snapshot of users, vaults, and member authorizations.
          </p>
        </div>
        <Button variant="secondary" onClick={() => void refetch()} isLoading={loading} className="border-white/5 hover:bg-white/5">
          Refresh
        </Button>
      </header>

      {loading && <LoadingState label="Loading business overview..." />}

      {!loading && error && (
        <ErrorState
          title="Failed to load business overview"
          detail={error.statusText}
          status={error.status}
          onRetry={() => void refetch()}
        />
      )}

      {!loading && !error && data && (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Users Card */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
            <Card className="relative overflow-hidden group hover:border-brand/30 transition-colors duration-500">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand/40 via-brand to-brand/40 opacity-50" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand mb-4">Users</p>
              
              <HeroMetric label="Total Platform Users" value={data.users.total} />
              
              <div className="mt-8 space-y-3 pt-6 border-t border-white/5">
                <MetricRow label="New today" value={data.users.new_today} />
                <MetricRow label="New this week" value={data.users.new_this_week} />
              </div>
            </Card>
          </div>

          {/* Vaults Card */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
            <Card className="relative overflow-hidden group hover:border-brand/30 transition-colors duration-500">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand/40 via-brand to-brand/40 opacity-50" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand mb-4">Vaults</p>
              
              <HeroMetric label="Total Secure Vaults" value={data.vaults.total} />
              
              <div className="mt-8 space-y-3 pt-6 border-t border-white/5">
                <MetricRow label="With PIN Enabled" value={data.vaults.with_pin} />
                
                {Object.entries(data.vaults.by_status).length > 0 && (
                  <div className="mt-4 pt-2 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-app-muted opacity-50">By Status</p>
                    {Object.entries(data.vaults.by_status).map(([status, count]) => (
                      <SparkRow key={status} label={status} value={count} total={data.vaults.total} />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Members Card */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            <Card className="relative overflow-hidden group hover:border-brand/30 transition-colors duration-500">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand/40 via-brand to-brand/40 opacity-50" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand mb-4">Members</p>
              
              <HeroMetric label="Total Authorizations" value={data.members.total_authorizations} />
              
              <div className="mt-8 space-y-3 pt-6 border-t border-white/5">
                {Object.entries(data.members.by_role).length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-app-muted opacity-50">By Role Distribution</p>
                    {Object.entries(data.members.by_role).map(([role, count]) => (
                      <SparkRow key={role} label={role} value={count} total={data.members.total_authorizations} />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </section>
  )
}

function HeroMetric({ label, value }: { label: string; value: number | string | null | undefined }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] text-app-muted font-medium">{label}</p>
      <p className="font-display font-black text-6xl text-app-text tracking-tighter drop-shadow-[0_0_15px_rgba(var(--color-brand),0.1)]">
        {displayValue(value)}
      </p>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: number | string | null | undefined }) {
  return (
    <p className="flex items-center justify-between text-sm group/row">
      <span className="text-app-muted group-hover/row:text-app-text transition-colors">{label}</span>
      <span className="font-bold text-app-text tabular-nums">{displayValue(value)}</span>
    </p>
  )
}

function SparkRow({ label, value, total }: { label: string; value: number; total: number }) {
  const percentage = total > 0 ? (value / total) * 100 : 0
  return (
    <div className="space-y-1.5 group/spark">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-app-muted uppercase tracking-wider group-hover/spark:text-app-text transition-colors">{label}</span>
        <span className="font-bold text-app-text">{value}</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-brand/60 shadow-[0_0_8px_rgba(var(--color-brand),0.4)] transition-all duration-1000 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
