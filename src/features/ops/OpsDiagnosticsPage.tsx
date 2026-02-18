import { useState } from 'react'
import { useRedisDiagnostics, useWebSocketDiagnostics, useDatabaseDiagnostics } from './hooks/useDiagnostics'

const tabs = [
  { key: 'redis', label: 'Redis' },
  { key: 'websockets', label: 'Websockets' },
  { key: 'database', label: 'Database' },
]

export function OpsDiagnosticsPage() {
  const [tab, setTab] = useState('redis')

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Diagnostics</h1>
      <div className="mb-4 flex gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors ${tab === t.key ? 'border-brand text-brand' : 'border-transparent text-app-muted hover:text-app-text'}`}
            onClick={() => setTab(t.key)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="bg-app-surface-2 rounded-lg p-6">
        {tab === 'redis' && <RedisDiagnostics />}
        {tab === 'websockets' && <WebSocketDiagnostics />}
        {tab === 'database' && <DatabaseDiagnostics />}
      </div>
    </div>
  )
}

function RedisDiagnostics() {
  const { data, loading, error, refetch } = useRedisDiagnostics()
  if (loading) return <p className="text-app-muted">Loading…</p>
  if (error) return <div className="text-red-500">{error} <button className="underline ml-2" onClick={refetch}>Retry</button></div>
  if (!data) return <p className="text-app-muted">No data.</p>
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Metric label="Status" value={data.status} />
        <Metric label="Connected" value={data.connected ? 'Yes' : 'No'} />
        <Metric label="Memory Used (MB)" value={data.memory_used_mb} />
        <Metric label="Total Keys" value={data.total_keys} />
        <Metric label="Uptime (s)" value={data.uptime_seconds} />
        <Metric label="Checked At" value={data.checked_at} />
      </div>
    </div>
  )
}

function WebSocketDiagnostics() {
  const { data, loading, error, refetch } = useWebSocketDiagnostics()
  if (loading) return <p className="text-app-muted">Loading…</p>
  if (error) return <div className="text-red-500">{error} <button className="underline ml-2" onClick={refetch}>Retry</button></div>
  if (!data) return <p className="text-app-muted">No data.</p>
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Metric label="Total Users" value={data.total_users} />
        <Metric label="User Connections" value={data.total_user_connections} />
        <Metric label="Total Vaults" value={data.total_vaults} />
        <Metric label="Subscriptions" value={data.subscriptions} />
        <Metric label="Online Vaults" value={data.online_vaults.length} />
        <Metric label="Checked At" value={data.checked_at} />
      </div>
      {data.online_vaults.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold text-app-muted mb-1">Online Vaults:</p>
          <ul className="list-disc ml-6 text-app-text text-sm">
            {data.online_vaults.map(v => <li key={v}>{v}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

function DatabaseDiagnostics() {
  const { data, loading, error, refetch } = useDatabaseDiagnostics()
  if (loading) return <p className="text-app-muted">Loading…</p>
  if (error) return <div className="text-red-500">{error} <button className="underline ml-2" onClick={refetch}>Retry</button></div>
  if (!data) return <p className="text-app-muted">No data.</p>
  return (
    <div className="grid grid-cols-2 gap-4">
      <Metric label="Status" value={data.status} />
      <Metric label="Pool Size" value={data.pool_size} />
      <Metric label="Checked Out" value={data.checked_out} />
      <Metric label="Overflow" value={data.overflow} />
      <Metric label="Checked At" value={data.checked_at} />
    </div>
  )
}

function Metric({ label, value }: { label: string, value: string | number | boolean | null | undefined }) {
  return (
    <div>
      <div className="text-xs text-app-muted">{label}</div>
      <div className="font-mono text-lg text-app-text">{String(value)}</div>
    </div>
  )
}
