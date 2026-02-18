import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useOpsSummary } from './hooks/useOpsSummary'

function displayValue(value: number | string | null | undefined): string {
  if (value === null || value === undefined) {
    return '-'
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return '-'
  }

  return String(value)
}

export function OpsSummaryPage() {
  const { data, loading, error, refetch } = useOpsSummary()

  const businessUsers = data?.business?.users
  const businessVaults = data?.business?.vaults
  const security = data?.security
  const activity = data?.activity

  return (
    <section className="space-y-4 sm:space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-app-text">Ops Summary</h1>
          <p className="mt-1 text-sm text-app-muted">Operational snapshot across business, security, and activity.</p>
        </div>
        <Button variant="secondary" onClick={() => void refetch()} isLoading={loading}>
          Refresh
        </Button>
      </header>

      {loading && <LoadingState label="Loading ops summary..." />}

      {!loading && error && (
        <div className="space-y-3">
          <ErrorState 
            title="Failed to load ops summary" 
            detail={error.statusText}
            status={error.status}
            onRetry={() => void refetch()}
          />
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          <Card className="p-4 sm:p-6 transition-all duration-300 sm:hover:shadow-xl active:scale-[0.99]">
            <p className="font-display text-lg text-app-text">Business</p>
            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              {/* Primary KPI */}
              <div className="rounded-lg border border-brand/20 bg-brand/5 p-3 sm:p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-app-muted">Users total</p>
                <p className="mt-2 font-display text-3xl sm:text-4xl font-bold text-app-text">{displayValue(businessUsers?.total)}</p>
              </div>

              {/* Secondary metrics */}
              <div className="space-y-1.5 sm:space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-app-muted">New today</span>
                  <span className="font-semibold text-app-text">{displayValue(businessUsers?.new_today)}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-app-muted">New this week</span>
                  <span className="font-semibold text-app-text">{displayValue(businessUsers?.new_this_week)}</span>
                </p>
              </div>

              <div className="border-t border-app-border/40" />

              {/* Vault metrics */}
              <div className="space-y-1.5 sm:space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-app-muted">Vaults total</span>
                  <span className="text-lg font-semibold text-app-text">{displayValue(businessVaults?.total)}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-app-muted">Vaults with pin</span>
                  <span className="font-semibold text-app-text">{displayValue(businessVaults?.with_pin)}</span>
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 transition-all duration-300 sm:hover:shadow-xl active:scale-[0.99]">
            <p className="font-display text-lg text-app-text">Security</p>
            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              {/* Status badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-app-muted">Status</span>
                <StatusBadge status={security?.status ?? data?.overall_status} />
              </div>

              {/* Alert count - prominent */}
              <div className="rounded-lg border border-app-border/40 bg-app-surface-2/50 p-3 sm:p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-app-muted">Alert count</p>
                <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-app-text">{displayValue(security?.alert_count)}</p>
              </div>

              <div className="border-t border-app-border/40" />

              {/* Failed unlock metrics */}
              <div className="space-y-1.5 sm:space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-app-muted">Failed unlocks (1h)</span>
                  <span className="font-semibold text-app-text">{displayValue(security?.failed_unlocks_1h)}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-app-muted">Failed unlocks (24h)</span>
                  <span className="font-semibold text-app-text">{displayValue(security?.failed_unlocks_24h)}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-app-muted">Pin lockouts (24h)</span>
                  <span className="font-semibold text-app-text">{displayValue(security?.pin_lockouts_24h)}</span>
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 transition-all duration-300 sm:hover:shadow-xl active:scale-[0.99]">
            <p className="font-display text-lg text-app-text">Activity</p>
            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              {/* Context metric */}
              <div className="flex items-center justify-between rounded-lg border border-app-border/40 bg-app-surface-2/30 p-2.5 sm:p-3">
                <span className="text-xs font-medium uppercase tracking-wide text-app-muted">Period hours</span>
                <span className="text-lg font-semibold text-brand">{displayValue(activity?.period_hours)}</span>
              </div>

              {/* Primary KPI */}
              <div className="rounded-lg border border-app-border/40 bg-app-surface-2/50 p-3 sm:p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-app-muted">Total events</p>
                <p className="mt-2 font-display text-3xl sm:text-4xl font-bold text-app-text">{displayValue(activity?.total_events)}</p>
              </div>

              <div className="border-t border-app-border/40" />

              {/* Secondary metrics */}
              <div className="space-y-1.5 sm:space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-app-muted">Vault unlocks</span>
                  <span className="font-semibold text-app-text">{displayValue(activity?.vault_unlocks)}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-app-muted">Failed unlocks</span>
                  <span className="font-semibold text-app-text">{displayValue(activity?.failed_unlocks)}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-app-muted">Pin operations</span>
                  <span className="font-semibold text-app-text">{displayValue(activity?.pin_operations)}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-app-muted">Member changes</span>
                  <span className="font-semibold text-app-text">{displayValue(activity?.member_changes)}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-app-muted">State changes</span>
                  <span className="font-semibold text-app-text">{displayValue(activity?.state_changes)}</span>
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </section>
  )
}
