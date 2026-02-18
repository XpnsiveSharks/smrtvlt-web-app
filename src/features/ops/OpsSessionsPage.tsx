import { useSessionStats, useRevokeSessions } from './hooks/useSessions'
import { useState } from 'react'

export function OpsSessionsPage() {
  const { data, loading, error, refetch } = useSessionStats()
  const { result, loading: revoking, error: revokeError, revoke } = useRevokeSessions()
  const [userId, setUserId] = useState('')

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Sessions</h1>
      {loading && <p className="text-app-muted">Loading…</p>}
      {error && <div className="text-red-500">{error} <button className="underline ml-2" onClick={refetch}>Retry</button></div>}
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Metric label="Total Active Tokens" value={data.total_active_tokens} />
            <Metric label="Checked At" value={data.checked_at} />
          </div>
          <div>
            <h2 className="font-semibold text-app-muted mb-1">Top Users</h2>
            {data.top_users.length === 0 ? <p className="text-app-muted">None</p> : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-app-muted">
                    <th className="text-left">User ID</th>
                    <th>Token Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_users.map(u => (
                    <tr key={u.user_id} className="hover:bg-white/5">
                      <td className="font-mono">{u.user_id}</td>
                      <td>{u.token_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="mt-6">
            <h2 className="font-semibold text-app-muted mb-1">Revoke User Sessions</h2>
            <form className="flex gap-2 items-end" onSubmit={e => { e.preventDefault(); revoke(userId) }}>
              <input
                className="border border-app-border rounded px-2 py-1 font-mono text-sm bg-app-surface text-app-text"
                placeholder="User ID"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                disabled={revoking}
                required
              />
              <button
                type="submit"
                className="bg-brand text-black rounded px-3 py-1 font-semibold uppercase tracking-wider text-xs"
                disabled={revoking || !userId}
              >
                {revoking ? 'Revoking…' : 'Revoke'}
              </button>
            </form>
            {revokeError && <div className="text-red-500 mt-2">{revokeError}</div>}
            {result && <div className="text-green-600 mt-2">Revoked {result.sessions_revoked} sessions for user {result.user_id}</div>}
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
