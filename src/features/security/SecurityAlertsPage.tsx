import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { useSecurityAlerts } from './hooks/useSecurityAlerts'

const severityColors = {
  low: 'text-blue-400',
  medium: 'text-amber-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
}

const statusColors = {
  ok: 'text-emerald-400',
  warning: 'text-amber-400',
  critical: 'text-red-400',
}

export function SecurityAlertsPage() {
  const { data, loading, error, refetch } = useSecurityAlerts()

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-app-text">Security Alerts</h1>
          <p className="mt-1 text-sm text-app-muted">
            Monitor suspicious activity and security events.
          </p>
        </div>
        <Button variant="secondary" onClick={() => void refetch()} isLoading={loading}>
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
        <>
          {/* Status Overview */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg text-app-text">Overall Status</p>
                <p className={`mt-2 text-3xl font-bold ${statusColors[data.status]}`}>
                  {data.status.toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-app-muted">Active alerts</p>
                <p className="mt-1 text-2xl font-bold text-app-text">
                  {data.active_alerts.length}
                </p>
              </div>
            </div>
          </Card>

          {/* Last 24h Metrics */}
          <Card>
            <p className="font-display text-lg text-app-text">Last 24 Hours</p>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-app-muted">Failed unlocks (1h)</p>
                <p className="mt-1 text-2xl font-bold text-app-text">
                  {data.last_24h.failed_unlocks_1h.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-app-muted">Failed unlocks (24h)</p>
                <p className="mt-1 text-2xl font-bold text-app-text">
                  {data.last_24h.failed_unlocks_24h.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-app-muted">PIN lockouts (24h)</p>
                <p className="mt-1 text-2xl font-bold text-app-text">
                  {data.last_24h.pin_lockouts_24h.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Active Alerts */}
          <Card>
            <p className="font-display text-lg text-app-text mb-4">Active Alerts</p>
            {data.active_alerts.length === 0 ? (
              <p className="text-sm text-app-muted">No active alerts. All systems are operating normally.</p>
            ) : (
              <div className="space-y-3">
                {data.active_alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-app-border bg-app-surface p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase ${severityColors[alert.severity]}`}>
                            {alert.severity}
                          </span>
                          <span className="text-sm font-semibold text-app-text">{alert.type}</span>
                        </div>
                        <p className="mt-2 text-sm text-app-muted">{alert.message}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-app-muted">
                      <span>
                        Count: <span className="font-mono text-app-text">{alert.count}</span>
                      </span>
                      <span>
                        Threshold: <span className="font-mono text-app-text">{alert.threshold}</span>
                      </span>
                      <span>
                        Window: <span className="text-app-text">{alert.window}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </section>
  )
}
