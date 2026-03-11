import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { RefreshCw, TrendingUp } from 'lucide-react'
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
    <section className="relative space-y-6 overflow-hidden rounded-xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/5 via-transparent to-transparent pb-8">
      <header className="flex flex-wrap items-center justify-between gap-3 p-1">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-app-text">Business Trends</h1>
          <p className="mt-2 text-sm tracking-wide text-app-muted">
            User signups and vault provisioning trends over time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedDays}
            onChange={(e) => handleDaysChange(Number(e.target.value))}
            className="rounded-md border border-app-border bg-app-surface px-4 py-2.5 text-sm text-app-text focus:border-brand focus:outline-none"
            disabled={loading}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <Button 
            variant="primary" 
            onClick={() => void refetch()} 
            isLoading={loading}
            className="px-5 py-2.5"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
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
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both border-t-2 border-brand/30 bg-app-surface-2 shadow-lg shadow-black/20 transition-all hover:shadow-xl hover:shadow-brand/5 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.05)]">
            <div className="-mx-6 -mt-6 rounded-t-lg bg-gradient-to-b from-brand/5 to-transparent px-6 pb-2 pt-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-brand">User Signups</h2>
            </div>
            
            <div className="mt-4 space-y-6">
              {/* Primary metrics */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.15em] text-app-muted">Total</p>
                    {data.user_signups.change_pct !== null && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        data.user_signups.change_pct >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {data.user_signups.change_pct >= 0 ? '+' : ''}{data.user_signups.change_pct.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-4xl font-semibold text-app-text">
                    {data.user_signups.total.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.15em] text-app-muted">Average per day</p>
                  <p className="font-mono text-4xl font-semibold text-app-text">
                    {data.user_signups.average_per_day.toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Secondary metrics */}
              <div className="grid grid-cols-2 gap-4 border-t border-app-border pt-4">
                <div>
                  <p className="mb-2 text-xs tracking-wider text-app-muted">Peak date</p>
                  <p className="font-mono text-base text-app-muted">
                    {data.user_signups.peak_date ?? 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs tracking-wider text-app-muted">Peak count</p>
                  <p className="font-mono text-base text-app-muted">
                    {data.user_signups.peak_count}
                  </p>
                </div>
              </div>

              {/* Chart or empty state */}
              <div className="mt-6 rounded-lg bg-app-surface p-4">
                {data.user_signups.total === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center opacity-70">
                    <TrendingUp className="mb-3 h-8 w-8 text-app-muted opacity-50" />
                    <p className="text-sm italic text-app-muted">No activity recorded</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={data.user_signups.daily}>
                      <defs>
                        <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgb(var(--color-brand))" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="rgb(var(--color-brand))" stopOpacity={0}/>
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: 'rgb(var(--color-app-muted))', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                        minTickGap={40}
                        tickFormatter={(str) => {
                          const date = new Date(str)
                          return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                        }}
                      />
                      <YAxis 
                        tick={{ fill: 'rgb(var(--color-app-muted))', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        width={25}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgb(var(--color-app-surface))',
                          border: '1px solid rgb(var(--color-app-border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: 'rgb(var(--color-app-text))',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="rgb(var(--color-brand))" 
                        strokeWidth={2}
                        fill="url(#colorSignups)"
                        style={{ filter: 'url(#glow)' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </Card>

          {/* Vault Provisioning */}
          <Card className="animate-in fade-in slide-in-from-bottom-4 delay-100 duration-700 fill-mode-both border-t-2 border-brand/30 bg-app-surface-2 shadow-lg shadow-black/20 transition-all hover:shadow-xl hover:shadow-brand/5 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.05)]">
            <div className="-mx-6 -mt-6 rounded-t-lg bg-gradient-to-b from-brand/5 to-transparent px-6 pb-2 pt-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-brand">Vault Provisioning</h2>
            </div>
            
            <div className="mt-4 space-y-6">
              {/* Primary metrics */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.15em] text-app-muted">Total</p>
                    {data.vault_provisioning.change_pct !== null && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        data.vault_provisioning.change_pct >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {data.vault_provisioning.change_pct >= 0 ? '+' : ''}{data.vault_provisioning.change_pct.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-4xl font-semibold text-app-text">
                    {data.vault_provisioning.total.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.15em] text-app-muted">Average per day</p>
                  <p className="font-mono text-4xl font-semibold text-app-text">
                    {data.vault_provisioning.average_per_day.toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Secondary metrics */}
              <div className="grid grid-cols-2 gap-4 border-t border-app-border pt-4">
                <div>
                  <p className="mb-2 text-xs tracking-wider text-app-muted">Peak date</p>
                  <p className="font-mono text-base text-app-muted">
                    {data.vault_provisioning.peak_date ?? 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs tracking-wider text-app-muted">Peak count</p>
                  <p className="font-mono text-base text-app-muted">
                    {data.vault_provisioning.peak_count}
                  </p>
                </div>
              </div>

              {/* Chart or empty state */}
              <div className="mt-6 rounded-lg bg-app-surface p-4">
                {data.vault_provisioning.total === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center opacity-70">
                    <TrendingUp className="mb-3 h-8 w-8 text-app-muted opacity-50" />
                    <p className="text-sm italic text-app-muted">No activity recorded</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={data.vault_provisioning.daily}>
                      <defs>
                        <linearGradient id="colorVaults" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgb(var(--color-brand))" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="rgb(var(--color-brand))" stopOpacity={0}/>
                        </linearGradient>
                        <filter id="glowVaults" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: 'rgb(var(--color-app-muted))', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                        minTickGap={40}
                        tickFormatter={(str) => {
                          const date = new Date(str)
                          return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                        }}
                      />
                      <YAxis 
                        tick={{ fill: 'rgb(var(--color-app-muted))', fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        width={25}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgb(var(--color-app-surface))',
                          border: '1px solid rgb(var(--color-app-border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: 'rgb(var(--color-app-text))',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="rgb(var(--color-brand))" 
                        strokeWidth={2}
                        fill="url(#colorVaults)"
                        style={{ filter: 'url(#glowVaults)' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </section>
  )
}
