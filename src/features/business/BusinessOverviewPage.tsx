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
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-app-text">Business Overview</h1>
          <p className="mt-1 text-sm text-app-muted">
            Snapshot of users, vaults, and member authorizations.
          </p>
        </div>
        <Button variant="secondary" onClick={() => void refetch()} isLoading={loading}>
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
          <Card>
            <p className="font-display text-lg text-app-text">Users</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Total</span>
                <span className="font-semibold text-app-text">
                  {displayValue(data.users.total)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">New today</span>
                <span className="font-semibold text-app-text">
                  {displayValue(data.users.new_today)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">New this week</span>
                <span className="font-semibold text-app-text">
                  {displayValue(data.users.new_this_week)}
                </span>
              </p>
            </div>
          </Card>

          {/* Vaults Card */}
          <Card>
            <p className="font-display text-lg text-app-text">Vaults</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Total</span>
                <span className="font-semibold text-app-text">
                  {displayValue(data.vaults.total)}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-app-muted">With PIN</span>
                <span className="font-semibold text-app-text">
                  {displayValue(data.vaults.with_pin)}
                </span>
              </p>
              {Object.entries(data.vaults.by_status).length > 0 && (
                <div className="mt-3 pt-3 border-t border-app-border">
                  <p className="text-xs font-semibold uppercase text-app-muted mb-2">By Status</p>
                  {Object.entries(data.vaults.by_status).map(([status, count]) => (
                    <p key={status} className="flex items-center justify-between">
                      <span className="text-app-muted">{status}</span>
                      <span className="font-mono text-sm text-app-text">{count}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Members Card */}
          <Card>
            <p className="font-display text-lg text-app-text">Member Authorizations</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-app-muted">Total</span>
                <span className="font-semibold text-app-text">
                  {displayValue(data.members.total_authorizations)}
                </span>
              </p>
              {Object.entries(data.members.by_role).length > 0 && (
                <div className="mt-3 pt-3 border-t border-app-border">
                  <p className="text-xs font-semibold uppercase text-app-muted mb-2">By Role</p>
                  {Object.entries(data.members.by_role).map(([role, count]) => (
                    <p key={role} className="flex items-center justify-between">
                      <span className="text-app-muted">{role}</span>
                      <span className="font-mono text-sm text-app-text">{count}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </section>
  )
}
