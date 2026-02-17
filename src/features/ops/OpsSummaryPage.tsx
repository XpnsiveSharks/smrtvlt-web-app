import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
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
    <section className="space-y-6">
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
          <ErrorState title="Failed to load ops summary" detail={error} />
          <Button variant="secondary" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 xl:grid-cols-3">
          <Card>
            <p className="font-display text-lg text-app-text">Business</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Users total</span>
                <span className="font-semibold text-app-text">{displayValue(businessUsers?.total)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">New today</span>
                <span className="font-semibold text-app-text">{displayValue(businessUsers?.new_today)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">New this week</span>
                <span className="font-semibold text-app-text">{displayValue(businessUsers?.new_this_week)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Vaults total</span>
                <span className="font-semibold text-app-text">{displayValue(businessVaults?.total)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Vaults with pin</span>
                <span className="font-semibold text-app-text">{displayValue(businessVaults?.with_pin)}</span>
              </p>
            </div>
          </Card>

          <Card>
            <p className="font-display text-lg text-app-text">Security</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Status</span>
                <span className="font-semibold text-brand">{displayValue(security?.status ?? data?.overall_status)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Alert count</span>
                <span className="font-semibold text-app-text">{displayValue(security?.alert_count)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Failed unlocks (1h)</span>
                <span className="font-semibold text-app-text">{displayValue(security?.failed_unlocks_1h)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Failed unlocks (24h)</span>
                <span className="font-semibold text-app-text">{displayValue(security?.failed_unlocks_24h)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Pin lockouts (24h)</span>
                <span className="font-semibold text-app-text">{displayValue(security?.pin_lockouts_24h)}</span>
              </p>
            </div>
          </Card>

          <Card>
            <p className="font-display text-lg text-app-text">Activity</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Period hours</span>
                <span className="font-semibold text-app-text">{displayValue(activity?.period_hours)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Total events</span>
                <span className="font-semibold text-app-text">{displayValue(activity?.total_events)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Vault unlocks</span>
                <span className="font-semibold text-app-text">{displayValue(activity?.vault_unlocks)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Failed unlocks</span>
                <span className="font-semibold text-app-text">{displayValue(activity?.failed_unlocks)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Pin operations</span>
                <span className="font-semibold text-app-text">{displayValue(activity?.pin_operations)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Member changes</span>
                <span className="font-semibold text-app-text">{displayValue(activity?.member_changes)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">State changes</span>
                <span className="font-semibold text-app-text">{displayValue(activity?.state_changes)}</span>
              </p>
            </div>
          </Card>
        </div>
      )}
    </section>
  )
}
