import { useEmailStatus } from './hooks/useEmailStatus'

export function OpsEmailStatusPage() {
  const { data, loading, error, refetch } = useEmailStatus()
  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Email Status</h1>
      {loading && <p className="text-app-muted">Loading…</p>}
      {error && <div className="text-red-500">{error} <button className="underline ml-2" onClick={refetch}>Retry</button></div>}
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Metric label="Service" value={data.service} />
            <Metric label="Status" value={data.status} />
            <Metric label="Sent Today" value={data.sent_today} />
            <Metric label="Failed Today" value={data.failed_today} />
            <Metric label="Checked At" value={data.checked_at} />
          </div>
          {data.note && <div className="text-app-muted mt-2">{data.note}</div>}
        </div>
      )}
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
