// src/screens/Overview.tsx

import { client } from '../api/client'
import { useApi } from '../hooks/useApi'
import {
  LoadingSpinner,
  ErrorMessage,
  RefreshBar,
  SectionTitle,
} from '../components/shared'

interface MetricRowProps {
  label: string
  value: string | number
  valueClassName?: string
}

function MetricRow({ label, value, valueClassName }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm font-mono font-medium text-slate-50 ${valueClassName ?? ''}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  )
}

export function OverviewScreen() {
  const { data, loading, error, isUnauthorized, refetch, lastRefreshedAt } = useApi(
    client.getOpsSummary,
    { intervalMs: 60_000 },
  )

  if (loading && !data) return <LoadingSpinner />
  if (error && !data) {
    return <ErrorMessage message={error} isUnauthorized={isUnauthorized} onRetry={refetch} />
  }
  if (!data) return null

  const { business, security, activity } = data

  return (
    <div>
      <RefreshBar
        lastRefreshedAt={lastRefreshedAt}
        onRefresh={refetch}
        isLoading={loading}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Ops Summary</h1>
        <p className="mt-1 text-sm text-slate-400">
          Operational snapshot across business, security, and activity.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Business Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <SectionTitle>Business</SectionTitle>
          <div className="space-y-1">
            <MetricRow label="Users total" value={business.users.total} />
            <MetricRow label="New today" value={business.users.new_today} />
            <MetricRow label="New this week" value={business.users.new_this_week} />
            <MetricRow label="Vaults total" value={business.vaults.total} />
            <MetricRow label="Vaults with pin" value={business.vaults.with_pin} />
          </div>
        </div>

        {/* Security Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <SectionTitle>Security</SectionTitle>
          <div className="space-y-1">
            <MetricRow label="Status" value={security.status} valueClassName={security.status === 'ok' ? 'text-emerald-400' : security.status === 'warning' ? 'text-amber-400' : 'text-red-400'} />
            <MetricRow label="Alert count" value={security.alert_count} />
            <MetricRow label="Failed unlocks (1h)" value={security.failed_unlocks_1h} />
            <MetricRow label="Failed unlocks (24h)" value={security.failed_unlocks_24h} />
            <MetricRow label="Pin lockouts (24h)" value={security.pin_lockouts_24h} />
          </div>
        </div>

        {/* Activity Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <SectionTitle>Activity</SectionTitle>
          <div className="space-y-1">
            <MetricRow label="Period hours" value={activity.period_hours} />
            <MetricRow label="Total events" value={activity.total_events} />
            <MetricRow label="Vault unlocks" value={activity.vault_unlocks} />
            <MetricRow label="Failed unlocks" value={activity.failed_unlocks} />
            <MetricRow label="Pin operations" value={activity.pin_operations} />
            <MetricRow label="Member changes" value={activity.member_changes} />
            <MetricRow label="State changes" value={activity.state_changes} />
          </div>
        </div>
      </div>
    </div>
  )
}
