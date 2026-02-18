import { useSessionStats, useRevokeSessions } from './hooks/useSessions'
import { useState } from 'react'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 0) return 'just now'
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  } catch {
    return isoString
  }
}

export function OpsSessionsPage() {
  const { data, loading, error, refetch } = useSessionStats()
  const { result, loading: revoking, error: revokeError, revoke } = useRevokeSessions()
  const [userId, setUserId] = useState('')

  return (
    <div>
      <h1 className="font-display text-2xl mb-6 text-app-text">Sessions</h1>
      
      {loading && <LoadingState label="Loading sessions..." />}
      {error && <ErrorState detail={error} onRetry={refetch} />}
      
      {data && (
        <div className="bg-app-surface-2 rounded-lg p-6 shadow-lg shadow-black/20">
          <div className="bg-gradient-to-b from-brand/5 to-transparent rounded-t-lg -mt-6 -mx-6 pt-6 px-6 pb-2" />
          
          {/* Primary metrics card */}
          <div className="bg-app-surface rounded-lg p-4 border border-app-border/50 mb-6">
            <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">Active Sessions</div>
            <div className="grid grid-cols-2 gap-6">
              <Metric label="Total Active Tokens" value={data.total_active_tokens} isPrimary />
              <Metric label="Checked At" value={data.checked_at} isTimestamp />
            </div>
          </div>

          {/* Top Users */}
          <div className="mb-6">
            <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">Top Users</div>
            {data.top_users.length === 0 ? (
              <p className="text-app-muted text-sm">None</p>
            ) : (
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

          {/* Revoke User Sessions */}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-brand mb-3 font-semibold">Revoke User Sessions</div>
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
            {revokeError && <ErrorState detail={revokeError} />}
            {result && (
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 mt-4 text-emerald-300 text-sm">
                Revoked {result.sessions_revoked} sessions for user {result.user_id}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Metric({ 
  label, 
  value, 
  isTimestamp,
  isPrimary = false,
}: { 
  label: string
  value: string | number | boolean | null | undefined
  isTimestamp?: boolean
  isPrimary?: boolean
}) {
  const displayValue = isTimestamp && typeof value === 'string' 
    ? formatRelativeTime(value) 
    : String(value)
  
  const title = isTimestamp && typeof value === 'string' 
    ? new Date(value).toLocaleString() 
    : undefined
  
  return (
    <div>
      <div className={`text-[11px] uppercase tracking-wider mb-2 ${isPrimary ? 'font-semibold text-app-text' : 'text-app-muted'}`}>
        {label}
      </div>
      <div 
        className={`font-mono ${isPrimary ? 'text-2xl font-display' : 'text-lg'} text-app-text`}
        title={title}
      >
        {displayValue}
      </div>
    </div>
  )
}
