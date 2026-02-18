import { useRateLimits } from './hooks/useRateLimits'

export function OpsRateLimitsPage() {
  const { data, loading, error, refetch } = useRateLimits()
  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Rate Limits</h1>
      {loading && <p className="text-app-muted">Loading…</p>}
      {error && <div className="text-red-500">{error} <button className="underline ml-2" onClick={refetch}>Retry</button></div>}
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Metric label="Total Active Keys" value={data.total_active_keys} />
            <Metric label="Checked At" value={data.checked_at} />
          </div>
          <div>
            <h2 className="font-semibold text-app-muted mb-1">Top Violators</h2>
            {data.top_violators.length === 0 ? <p className="text-app-muted">None</p> : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-app-muted">
                    <th className="text-left">Key</th>
                    <th>Count</th>
                    <th>TTL (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_violators.map(v => (
                    <tr key={v.key} className="hover:bg-white/5">
                      <td className="font-mono">{v.key}</td>
                      <td>{v.current_count}</td>
                      <td>{v.ttl_seconds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-app-muted mb-1">By Category</h2>
            <ul className="list-disc ml-6 text-app-text text-sm">
              {Object.entries(data.by_category).map(([cat, count]) => (
                <li key={cat}><span className="font-mono text-app-muted">{cat}</span>: {count}</li>
              ))}
            </ul>
          </div>
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
