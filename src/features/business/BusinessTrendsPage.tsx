import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { useBusinessTrends } from './hooks/useBusinessTrends'

export function BusinessTrendsPage() {
  const [selectedDays, setSelectedDays] = useState(30)
  const { data, loading, error, refetch } = useBusinessTrends(selectedDays)

  const handleDaysChange = (days: number) => {
    setSelectedDays(days)
    void refetch(days)
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-app-text">Business Trends</h1>
          <p className="mt-1 text-sm text-app-muted">
            User signups and vault provisioning trends over time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedDays}
            onChange={(e) => handleDaysChange(Number(e.target.value))}
            className="rounded-lg border border-app-border bg-app-surface px-3 py-2 text-sm text-app-text focus:border-brand focus:outline-none"
            disabled={loading}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <Button variant="secondary" onClick={() => void refetch()} isLoading={loading}>
            Refresh
          </Button>
        </div>
      </header>

      {loading && <LoadingState label="Loading business trends..." />}

      {!loading && error && (
        <ErrorState
          title="Failed to load business trends"
          detail={error.statusText}
          status={error.status}
          onRetry={() => void refetch()}
        />
      )}

      {!loading && !error && data && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Signups */}
          <Card>
            <p className="font-display text-lg text-app-text">User Signups</p>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-app-muted">Total</p>
                  <p className="mt-1 text-2xl font-bold text-app-text">
                    {data.user_signups.total.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-app-muted">Average per day</p>
                  <p className="mt-1 text-2xl font-bold text-app-text">
                    {data.user_signups.average_per_day.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-app-border text-sm">
                <div>
                  <p className="text-app-muted">Peak date</p>
                  <p className="mt-1 text-sm font-semibold text-app-text">
                    {data.user_signups.peak_date ?? 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-app-muted">Peak count</p>
                  <p className="mt-1 text-sm font-semibold text-app-text">
                    {data.user_signups.peak_count}
                  </p>
                </div>
              </div>
              {data.user_signups.change_pct !== null && (
                <p className="text-xs text-app-muted">
                  Change: <span className={data.user_signups.change_pct >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {data.user_signups.change_pct >= 0 ? '+' : ''}{data.user_signups.change_pct.toFixed(1)}%
                  </span>
                </p>
              )}
              <div className="mt-4 max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-app-surface">
                    <tr className="border-b border-app-border">
                      <th className="py-2 text-left text-app-muted font-semibold">Date</th>
                      <th className="py-2 text-right text-app-muted font-semibold">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.user_signups.daily.map((entry) => (
                      <tr key={entry.date} className="border-b border-app-border/50">
                        <td className="py-1.5 text-app-text">{entry.date}</td>
                        <td className="py-1.5 text-right font-mono text-app-text">{entry.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Vault Provisioning */}
          <Card>
            <p className="font-display text-lg text-app-text">Vault Provisioning</p>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-app-muted">Total</p>
                  <p className="mt-1 text-2xl font-bold text-app-text">
                    {data.vault_provisioning.total.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-app-muted">Average per day</p>
                  <p className="mt-1 text-2xl font-bold text-app-text">
                    {data.vault_provisioning.average_per_day.toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-app-border text-sm">
                <div>
                  <p className="text-app-muted">Peak date</p>
                  <p className="mt-1 text-sm font-semibold text-app-text">
                    {data.vault_provisioning.peak_date ?? 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-app-muted">Peak count</p>
                  <p className="mt-1 text-sm font-semibold text-app-text">
                    {data.vault_provisioning.peak_count}
                  </p>
                </div>
              </div>
              {data.vault_provisioning.change_pct !== null && (
                <p className="text-xs text-app-muted">
                  Change: <span className={data.vault_provisioning.change_pct >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {data.vault_provisioning.change_pct >= 0 ? '+' : ''}{data.vault_provisioning.change_pct.toFixed(1)}%
                  </span>
                </p>
              )}
              <div className="mt-4 max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-app-surface">
                    <tr className="border-b border-app-border">
                      <th className="py-2 text-left text-app-muted font-semibold">Date</th>
                      <th className="py-2 text-right text-app-muted font-semibold">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.vault_provisioning.daily.map((entry) => (
                      <tr key={entry.date} className="border-b border-app-border/50">
                        <td className="py-1.5 text-app-text">{entry.date}</td>
                        <td className="py-1.5 text-right font-mono text-app-text">{entry.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}
    </section>
  )
}
