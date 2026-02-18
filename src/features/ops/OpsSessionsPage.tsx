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

  const maxTokens = data?.top_users.reduce((max, u) => Math.max(max, u.token_count), 0) || 1

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="font-display text-3xl mb-6 tracking-tight text-app-text border-l-2 border-brand pl-3">Sessions</h1>
      
      {loading && <LoadingState label="Loading sessions..." />}
      {error && <ErrorState detail={error} onRetry={refetch} />}
      
      {data && (
        <div className="bg-app-surface-2 rounded-lg p-6 shadow-2xl shadow-black/40 border border-white/[0.06] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-brand/10 to-transparent pointer-events-none" />
          
          {/* Primary metrics card */}
          <div className="relative z-10 bg-app-surface/50 backdrop-blur-sm rounded-lg p-5 border border-white/[0.03] mb-8 shadow-inner">
            <div className="text-[10px] uppercase tracking-[0.2em] text-brand mb-4 font-bold opacity-80">Active Sessions</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Metric 
                label="Total Active Tokens" 
                value={data.total_active_tokens} 
                isPrimary 
                className="bg-app-bg/40 rounded-xl p-5 border border-white/5 shadow-lg motion-safe:hover:scale-[1.02] transition-transform duration-300" 
              />
              <Metric 
                label="Checked At" 
                value={data.checked_at} 
                isTimestamp 
                className="bg-app-bg/40 rounded-xl p-5 border border-white/5 shadow-lg motion-safe:hover:scale-[1.02] transition-transform duration-300" 
              />
            </div>
          </div>

          {/* Top Users */}
          <div className="mb-8 relative z-10">
            <div className="text-[10px] uppercase tracking-[0.2em] text-brand mb-4 font-bold opacity-80 border-t border-white/5 pt-6">Top Users</div>
            {data.top_users.length === 0 ? (
              <p className="text-app-muted text-sm italic">No active sessions found</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-white/[0.03]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-app-muted bg-white/[0.02]">
                      <th className="text-left py-3 px-4 font-semibold tracking-wider uppercase text-[10px]">User ID</th>
                      <th className="text-right py-3 px-4 font-semibold tracking-wider uppercase text-[10px]">Tokens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {data.top_users.map(u => (
                      <tr key={u.user_id} className="hover:bg-white/[0.04] transition-colors group">
                        <td className="py-3 px-4">
                          <span className="font-mono text-[11px] text-app-muted group-hover:text-app-text transition-colors">{u.user_id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="font-display font-bold text-app-text">{u.token_count}</span>
                            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-brand shadow-[0_0_8px_rgba(var(--color-brand),0.5)] transition-all duration-1000 ease-out"
                                style={{ width: `${(u.token_count / maxTokens) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Revoke User Sessions */}
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-[0.2em] text-brand mb-4 font-bold opacity-80 border-t border-white/5 pt-6">Revoke User Sessions</div>
            <div className="bg-app-bg/30 p-4 rounded-xl border border-white/5">
              <form className="flex gap-3 items-center" onSubmit={e => { e.preventDefault(); revoke(userId) }}>
                <div className="flex-1 relative group">
                  <input
                    className="w-full border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm bg-app-bg/50 text-app-text outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 transition-all placeholder:text-app-muted/50"
                    placeholder="Enter User ID..."
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    disabled={revoking}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-app-danger/10 text-app-danger border border-app-danger/30 hover:bg-app-danger hover:text-white transition-all duration-300 rounded-lg px-6 py-2.5 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-app-danger/5 disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={revoking || !userId}
                >
                  {revoking ? 'Revoking…' : 'Revoke'}
                </button>
              </form>
            </div>
            {revokeError && <div className="mt-4"><ErrorState detail={revokeError} /></div>}
            {result && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-4 text-emerald-400 text-sm flex items-center gap-3 animate-in zoom-in-95 duration-300">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Revoked <strong>{result.sessions_revoked}</strong> sessions for user <code className="text-xs bg-emerald-500/10 px-1.5 py-0.5 rounded">{result.user_id}</code></span>
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
  className,
}: { 
  label: string
  value: string | number | boolean | null | undefined
  isTimestamp?: boolean
  isPrimary?: boolean
  className?: string
}) {
  const displayValue = isTimestamp && typeof value === 'string' 
    ? formatRelativeTime(value) 
    : String(value)
  
  const title = isTimestamp && typeof value === 'string' 
    ? new Date(value).toLocaleString() 
    : undefined
  
  return (
    <div className={className}>
      <div className={`text-[10px] uppercase tracking-[0.15em] mb-3 ${isPrimary ? 'font-bold text-app-text/90' : 'text-app-muted'}`}>
        {label}
      </div>
      <div 
        className={`leading-none ${isPrimary ? 'text-5xl font-display font-black text-app-text drop-shadow-[0_0_15px_rgba(var(--color-brand),0.15)]' : 'text-2xl font-display font-bold text-app-text/70'}`}
        title={title}
      >
        {displayValue}
      </div>
    </div>
  )
}
