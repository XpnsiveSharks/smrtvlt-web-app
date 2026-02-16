// src/screens/Overview.tsx

import { client } from '../api/client'
import { useApi } from '../hooks/useApi'
import {
  KpiCard,
  LoadingSpinner,
  ErrorMessage,
  RefreshBar,
  SectionTitle,
} from '../components/shared'

const VAULT_STATUS_COLOURS: Record<string, string> = {
  UNLOCKED: 'bg-emerald-400',
  LOCKED: 'bg-amber-400',
  OFFLINE: 'bg-slate-500',
}

export function OverviewScreen() {
  const { data, loading, error, isUnauthorized, refetch, lastRefreshedAt } = useApi(
    client.getBusinessOverview,
    { intervalMs: 60_000 },
  )

  if (loading && !data) return <LoadingSpinner />
  if (error && !data) {
    return <ErrorMessage message={error} isUnauthorized={isUnauthorized} onRetry={refetch} />
  }
  if (!data) return null

  const { users, vaults, members } = data

  const roleEntries = Object.entries(members.by_role)
  const statusEntries = Object.entries(vaults.by_status)

  return (
    <div>
      <RefreshBar
        lastRefreshedAt={lastRefreshedAt}
        onRefresh={refetch}
        isLoading={loading}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Overview</h1>
        <p className="mt-1 text-sm text-slate-400">Snapshot of users, vaults, and members.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <KpiCard
          label="Total Users"
          value={users.total}
          subtext={`↑ ${users.new_today} today · ${users.new_this_week} this week`}
        />
        <KpiCard
          label="Total Vaults"
          value={vaults.total}
          subtext={`${vaults.with_pin} with PIN enabled`}
        />
        <KpiCard
          label="Total Authorizations"
          value={members.total_authorizations}
          subtext={
            roleEntries.length > 0
              ? roleEntries.map(([role, count]) => `${count} ${role}`).join(' · ')
              : undefined
          }
        />
      </div>

      {/* Vault status breakdown */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <SectionTitle>Vault Status Breakdown</SectionTitle>
        {statusEntries.length === 0 ? (
          <p className="text-sm text-slate-500">No vault data yet.</p>
        ) : (
          <div className="space-y-3">
            {/* Stacked bar */}
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/5">
              {statusEntries.map(([status, count]) => {
                const pct = vaults.total > 0 ? (count / vaults.total) * 100 : 0
                return (
                  <div
                    key={status}
                    style={{ width: `${pct}%` }}
                    className={`${VAULT_STATUS_COLOURS[status] ?? 'bg-slate-400'} transition-all`}
                  />
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4">
              {statusEntries.map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${VAULT_STATUS_COLOURS[status] ?? 'bg-slate-400'}`}
                  />
                  <span className="text-sm text-slate-300">
                    {status}
                    <span className="ml-1.5 text-slate-500">{count.toLocaleString()}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
