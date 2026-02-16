// src/screens/Trends.tsx

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { client, type TrendSeries } from '../api/client'
import { useApi } from '../hooks/useApi'
import {
  KpiCard,
  LoadingSpinner,
  ErrorMessage,
  RefreshBar,
  SectionTitle,
  ChangePct,
} from '../components/shared'

type Window = 7 | 30 | 90
const WINDOWS: Window[] = [7, 30, 90]

// ---------------------------------------------------------------------------
// Tooltip for recharts
// ---------------------------------------------------------------------------

interface TooltipPayload {
  value: number
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400">{label}</p>
      <p className="font-semibold text-slate-100">{payload[0].value.toLocaleString()}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Single series block: KPI chips + line chart
// ---------------------------------------------------------------------------

interface SeriesBlockProps {
  title: string
  series: TrendSeries
  colour: string
}

function SeriesBlock({ title, series, colour }: SeriesBlockProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <SectionTitle>{title}</SectionTitle>

      {/* KPI chips */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <KpiCard label="Total" value={series.total} />
        <KpiCard label="Avg / day" value={series.average_per_day} />
        <KpiCard
          label="Peak"
          value={series.peak_count}
          subtext={series.peak_date ?? '—'}
        />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
            Trend
          </p>
          <ChangePct value={series.change_pct} />
        </div>
      </div>

      {/* Line chart */}
      {series.daily.every(d => d.count === 0) ? (
        <p className="py-8 text-center text-sm text-slate-500">No data for this period.</p>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={series.daily} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: string) => v.slice(5)} // MM-DD
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke={colour}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: colour }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Trends screen
// ---------------------------------------------------------------------------

export function TrendsScreen() {
  const [days, setDays] = useState<Window>(30)

  const { data, loading, error, isUnauthorized, refetch, lastRefreshedAt } = useApi(
    () => client.getBusinessTrends(days),
    // No auto-refresh — trends don't change second to second
  )

  // Re-fetch when window changes
  // useApi re-runs when fetchFn identity changes — we pass an inline arrow
  // so the window value is captured. We need to trigger a refetch on change.
  // Simplest: key the component on `days` via parent — but since we own state
  // here we use a manual refetch triggered by the window buttons.

  function handleWindowChange(w: Window) {
    setDays(w)
    // The hook will re-run because fetchFn closes over the new `days` value
    // only after the next render. We call refetch() after state settles via
    // a callback approach — but since useApi memoises fetchFn via ref it will
    // pick up the new days on the NEXT render's refetch call.
    // Cleanest solution: just refetch immediately after the state update.
    setTimeout(refetch, 0)
  }

  return (
    <div>
      <RefreshBar
        lastRefreshedAt={lastRefreshedAt}
        onRefresh={refetch}
        isLoading={loading}
      />

      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Trends</h1>
          <p className="mt-1 text-sm text-slate-400">
            Daily user signups and vault provisioning.
          </p>
        </div>

        {/* Window selector */}
        <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          {WINDOWS.map(w => (
            <button
              key={w}
              onClick={() => handleWindowChange(w)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
                days === w
                  ? 'bg-sky-500/20 text-sky-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {w}d
            </button>
          ))}
        </div>
      </div>

      {loading && !data && <LoadingSpinner />}
      {error && !data && (
        <ErrorMessage message={error} isUnauthorized={isUnauthorized} onRetry={refetch} />
      )}

      {data && (
        <div className="space-y-5">
          {data.period_start && (
            <p className="text-xs text-slate-500">
              {data.period_start} → {data.period_end}
            </p>
          )}
          <SeriesBlock
            title="User Signups"
            series={data.user_signups}
            colour="#38bdf8"
          />
          <SeriesBlock
            title="Vault Provisioning"
            series={data.vault_provisioning}
            colour="#a78bfa"
          />
        </div>
      )}
    </div>
  )
}
