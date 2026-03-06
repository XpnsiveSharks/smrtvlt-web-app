import { Users, ShieldCheck, Activity, TrendingUp, RefreshCcw } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useOpsSummary } from './hooks/useOpsSummary'
import { useBusinessOverview } from '../business/hooks/useBusinessOverview'

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
  const { data: bizData, loading: bizLoading, error: bizError, refetch: bizRefetch } = useBusinessOverview()

  const businessUsers = data?.business?.users
  const businessVaults = data?.business?.vaults
  const security = data?.security
  const activity = data?.activity

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-app-text border-l-2 border-brand pl-4">Summary</h1>
          <p className="mt-1 text-sm text-app-muted ml-4 opacity-80">Operational and business snapshot.</p>
        </div>
        <Button variant="secondary" onClick={() => void refetch()} isLoading={loading} className="border-white/5 hover:bg-white/5">
          <RefreshCcw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </header>

      {loading && <div className="py-12"><LoadingState label="Aggregating operational intelligence..." /></div>}

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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* Business Section */}
          <Card className="p-0 overflow-hidden border-white/[0.05] shadow-2xl shadow-black/60 group/card animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[100ms] fill-mode-both">
            <div className="bg-white/[0.02] border-b border-white/[0.03] px-6 py-4 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
              <div>
                <h2 className="font-display text-lg text-app-text">Business</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted opacity-60">User & Vault Growth</p>
              </div>
              <Users size={20} className="text-app-muted opacity-40 group-hover/card:text-brand transition-colors" />
            </div>

            <div className="p-6 space-y-6">
              {/* Primary KPI */}
              <div className="relative overflow-hidden rounded-xl border border-brand/20 border-t-brand/30 bg-gradient-to-b from-brand/5 to-transparent p-5 shadow-lg">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted opacity-60">Users total</p>
                <p className="mt-2 font-display text-4xl font-bold text-app-text tracking-tighter drop-shadow-[0_0_8px_rgba(var(--color-brand),0.05)]">
                  {displayValue(businessUsers?.total)}
                </p>
                <div className="absolute -bottom-2 -right-2 text-brand opacity-[0.03]">
                  <Users size={80} />
                </div>
              </div>

              {/* Secondary metrics in a well */}
              <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-3">
                <p className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-app-muted opacity-60 flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" />
                    New today
                  </span>
                  <span className="font-mono text-sm text-app-text">{displayValue(businessUsers?.new_today)}</span>
                </p>
                <p className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-app-muted opacity-60 flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-emerald-600" />
                    New this week
                  </span>
                  <span className="font-mono text-sm text-app-text">{displayValue(businessUsers?.new_this_week)}</span>
                </p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              {/* Vault metrics */}
              <div className="space-y-3 px-1">
                <p className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-app-muted opacity-60">Vaults total</span>
                  <span className="font-mono text-lg font-bold text-brand">{displayValue(businessVaults?.total)}</span>
                </p>
                <p className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-app-muted opacity-60">Vaults with pin</span>
                  <span className="font-mono text-sm text-app-text/80">{displayValue(businessVaults?.with_pin)}</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card className="p-0 overflow-hidden border-white/[0.05] shadow-2xl shadow-black/60 group/card animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[200ms] fill-mode-both">
            <div className="bg-white/[0.02] border-b border-white/[0.03] px-6 py-4 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-app-danger" />
              <div>
                <h2 className="font-display text-lg text-app-text">Security</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted opacity-60">Health & Risk Alerts</p>
              </div>
              <ShieldCheck size={20} className="text-app-muted opacity-40 group-hover/card:text-app-danger transition-colors" />
            </div>

            <div className="p-6 space-y-6">
              {/* Status Section */}
              <div className="flex items-center justify-between bg-black/20 rounded-xl p-4 border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted opacity-60">Status</span>
                <div className="flex items-center gap-3">
                  <StatusBadge status={security?.status ?? data?.overall_status} />
                  {(security?.status === 'ok' || data?.overall_status === 'ok') && (
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Alert Count KPI */}
              <div className={`relative overflow-hidden rounded-xl border border-t-white/10 p-5 shadow-lg transition-all ${
                Number(security?.alert_count ?? 0) > 0 
                  ? 'bg-red-500/5 border-red-500/20' 
                  : 'bg-gradient-to-b from-white/[0.02] to-transparent border-white/[0.05]'
              }`}>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted opacity-60">Alert count</p>
                <p className={`mt-2 font-display text-4xl font-bold tracking-tighter ${
                  Number(security?.alert_count ?? 0) > 0 ? 'text-app-danger' : 'text-app-text'
                }`}>
                  {displayValue(security?.alert_count)}
                </p>
                <div className="absolute -bottom-2 -right-2 text-app-danger opacity-[0.03]">
                  <ShieldCheck size={80} />
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              {/* Failed unlock metrics well */}
              <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-3">
                <p className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-app-muted opacity-60">Failed unlocks (1h)</span>
                  <span className="font-mono text-sm text-app-text">{displayValue(security?.failed_unlocks_1h)}</span>
                </p>
                <p className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-app-muted opacity-60">Failed unlocks (24h)</span>
                  <span className="font-mono text-sm text-app-text">{displayValue(security?.failed_unlocks_24h)}</span>
                </p>
                <p className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="text-app-muted opacity-60">Pin lockouts (24h)</span>
                  <span className="font-mono text-sm text-app-danger">{displayValue(security?.pin_lockouts_24h)}</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Activity Section */}
          <Card className="p-0 overflow-hidden border-white/[0.05] shadow-2xl shadow-black/60 group/card animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[300ms] fill-mode-both">
            <div className="bg-white/[0.02] border-b border-white/[0.03] px-6 py-4 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand/60" />
              <div>
                <h2 className="font-display text-lg text-app-text">Activity</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted opacity-60">System Event Velocity</p>
              </div>
              <Activity size={20} className="text-app-muted opacity-40 group-hover/card:text-brand transition-colors" />
            </div>

            <div className="p-6 space-y-6">
              {/* Context metric */}
              <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted opacity-60">Monitoring Period</span>
                <span className="font-mono text-xs font-bold text-brand flex items-center gap-1.5">
                  <TrendingUp size={12} />
                  {displayValue(activity?.period_hours)} HOURS
                </span>
              </div>

              {/* Total Events KPI */}
              <div className="relative overflow-hidden rounded-xl border border-white/[0.05] border-t-white/10 bg-gradient-to-b from-white/[0.02] to-transparent p-5 shadow-lg">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted opacity-60">Total events</p>
                <p className="mt-2 font-display text-4xl font-bold text-app-text tracking-tighter">
                  {displayValue(activity?.total_events)}
                </p>
                <div className="absolute -bottom-2 -right-2 text-app-text opacity-[0.03]">
                  <Activity size={80} />
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              {/* Secondary metrics list */}
              <div className="space-y-3 px-1">
                {[
                  { label: 'Vault unlocks', value: activity?.vault_unlocks },
                  { label: 'Failed unlocks', value: activity?.failed_unlocks, danger: true },
                  { label: 'Pin operations', value: activity?.pin_operations },
                  { label: 'Member changes', value: activity?.member_changes },
                  { label: 'State changes', value: activity?.state_changes },
                ].map((item, idx) => (
                  <p key={idx} className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="text-app-muted opacity-60">{item.label}</span>
                    <span className={`font-mono text-sm ${item.danger && Number(item.value ?? 0) > 0 ? 'text-app-danger' : 'text-app-text/80'}`}>
                      {displayValue(item.value)}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl tracking-tight text-app-text border-l-2 border-brand pl-4 mt-4">Business Detail</h2>
          <p className="text-sm text-app-muted ml-4 opacity-80">Users, vaults, and member authorizations.</p>
        </div>

        {bizLoading && <LoadingState label="Loading business detail..." />}

        {!bizLoading && bizError && (
          <ErrorState
            title="Failed to load business detail"
            detail={bizError.statusText}
            status={bizError.status}
            onRetry={() => void bizRefetch()}
          />
        )}

        {!bizLoading && !bizError && bizData && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Users Card */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
              <Card className="relative overflow-hidden group hover:border-brand/30 transition-colors duration-500">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand/40 via-brand to-brand/40 opacity-50" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand mb-4">Users</p>
                
                <HeroMetric label="Total Platform Users" value={bizData.users.total} />
                
                <div className="mt-8 space-y-3 pt-6 border-t border-white/5">
                  <MetricRow label="New today" value={bizData.users.new_today} />
                  <MetricRow label="New this week" value={bizData.users.new_this_week} />
                </div>
              </Card>
            </div>

            {/* Vaults Card */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
              <Card className="relative overflow-hidden group hover:border-brand/30 transition-colors duration-500">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand/40 via-brand to-brand/40 opacity-50" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand mb-4">Vaults</p>
                
                <HeroMetric label="Total Secure Vaults" value={bizData.vaults.total} />
                
                <div className="mt-8 space-y-3 pt-6 border-t border-white/5">
                  <MetricRow label="With PIN Enabled" value={bizData.vaults.with_pin} />
                  
                  {Object.entries(bizData.vaults.by_status).length > 0 && (
                    <div className="mt-4 pt-2 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-app-muted opacity-50">By Status</p>
                      {Object.entries(bizData.vaults.by_status).map(([status, count]) => (
                        <SparkRow key={status} label={status} value={count} total={bizData.vaults.total} />
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
                
                <HeroMetric label="Total Authorizations" value={bizData.members.total_authorizations} />
                
                <div className="mt-8 space-y-3 pt-6 border-t border-white/5">
                  {Object.entries(bizData.members.by_role).length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-app-muted opacity-50">By Role Distribution</p>
                      {Object.entries(bizData.members.by_role).map(([role, count]) => (
                        <SparkRow key={role} label={role} value={count} total={bizData.members.total_authorizations} />
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </section>
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
