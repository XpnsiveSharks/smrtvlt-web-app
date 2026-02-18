import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { useBusinessActivity } from './hooks/useBusinessActivity'

export function BusinessActivityPage() {
  const [selectedHours, setSelectedHours] = useState(24)
  const { data, loading, error, refetch } = useBusinessActivity(selectedHours, 50)

  const handleHoursChange = (hours: number) => {
    setSelectedHours(hours)
    void refetch(hours, 50)
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-app-text">Business Activity</h1>
          <p className="mt-1 text-sm text-app-muted">Recent vault and user activity log.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedHours}
            onChange={(e) => handleHoursChange(Number(e.target.value))}
            className="rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm text-app-text focus:border-brand focus:outline-none"
            disabled={loading}
          >
            <option value={1}>Last hour</option>
            <option value={6}>Last 6 hours</option>
            <option value={24}>Last 24 hours</option>
            <option value={72}>Last 3 days</option>
            <option value={168}>Last week</option>
          </select>
          <Button variant="secondary" onClick={() => void refetch()} isLoading={loading}>
            Refresh
          </Button>
        </div>
      </header>

      {loading && <LoadingState label="Loading business activity..." />}

      {!loading && error && (
        <ErrorState
          title="Failed to load business activity"
          detail={error.statusText}
          status={error.status}
          onRetry={() => void refetch()}
        />
      )}

      {!loading && !error && data && (
        <>
          {/* Summary Card */}
          <Card>
            <p className="font-display text-lg text-app-text">Activity Summary</p>
            <p className="text-xs text-app-muted mt-1">Last {data.period_hours} hours</p>
            <div className="mt-4 grid grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
              <div>
                <p className="text-app-muted">Total events</p>
                <p className="mt-1 text-xl font-bold text-app-text">
                  {data.summary.total_events.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-app-muted">Vault unlocks</p>
                <p className="mt-1 text-xl font-bold text-app-text">
                  {data.summary.vault_unlocks.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-app-muted">Failed unlocks</p>
                <p className="mt-1 text-xl font-bold text-red-400">
                  {data.summary.failed_unlocks.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-app-muted">PIN operations</p>
                <p className="mt-1 text-xl font-bold text-app-text">
                  {data.summary.pin_operations.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-app-muted">Member changes</p>
                <p className="mt-1 text-xl font-bold text-app-text">
                  {data.summary.member_changes.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-app-muted">State changes</p>
                <p className="mt-1 text-xl font-bold text-app-text">
                  {data.summary.state_changes.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Activity Entries */}
          <Card>
            <p className="font-display text-lg text-app-text mb-4">Recent Entries</p>
            {data.entries.length === 0 ? (
              <p className="text-sm text-app-muted">No activity in this period.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-app-border">
                      <th className="py-2 text-left text-app-muted font-semibold">ID</th>
                      <th className="py-2 text-left text-app-muted font-semibold">Action</th>
                      <th className="py-2 text-left text-app-muted font-semibold">Method</th>
                      <th className="py-2 text-left text-app-muted font-semibold">Vault ID</th>
                      <th className="py-2 text-left text-app-muted font-semibold">User ID</th>
                      <th className="py-2 text-left text-app-muted font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.entries.map((entry) => (
                      <tr key={entry.id} className="border-b border-app-border/50 hover:bg-white/5">
                        <td className="py-2 font-mono text-xs text-app-text">{entry.id}</td>
                        <td className="py-2 text-app-text">{entry.action}</td>
                        <td className="py-2 text-app-muted">{entry.method}</td>
                        <td className="py-2 font-mono text-xs text-app-text">{entry.vault_id}</td>
                        <td className="py-2 font-mono text-xs text-app-muted">
                          {entry.user_id ?? '-'}
                        </td>
                        <td className="py-2 text-xs text-app-muted">
                          {new Date(entry.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </section>
  )
}
