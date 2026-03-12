import { useSessionStats, useRevokeSessions } from './hooks/useSessions'
import { useState } from 'react'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { StatCard } from '../../components/ui/StatCard'

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
        <div className="bg-app-surface-2 rounded-lg p-6 shadow-2xl shadow-app-shadow/40 border border-app-border/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-brand/10 to-transparent pointer-events-none" />
          
          {/* Primary metrics card */}
          <div className="relative z-10 bg-app-surface/50 backdrop-blur-sm rounded-lg p-5 border border-app-border/20 mb-8 shadow-inner">
            <div className="text-[10px] uppercase tracking-[0.2em] text-brand mb-4 font-bold opacity-80">Active Sessions</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard label="Total Active Tokens" value={data.total_active_tokens} size="lg" />
              <StatCard label="Checked At" value={data.checked_at} isTimestamp size="sm" />
            </div>
          </div>

          {/* Top Users */}
          <div className="mb-8 relative z-10">
            <div className="text-[10px] uppercase tracking-[0.2em] text-brand mb-4 font-bold opacity-80 border-t border-app-border/30 pt-6">Top Users</div>
            {data.top_users.length === 0 ? (
              <p className="text-app-muted text-sm italic">No active sessions found</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-app-border/20">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-app-muted bg-app-surface/20">
                      <th className="text-left py-3 px-4 font-semibold tracking-wider uppercase text-[10px]">User ID</th>
                      <th className="text-right py-3 px-4 font-semibold tracking-wider uppercase text-[10px]">Tokens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-app-border/30">
                    {data.top_users.map(u => (
                      <tr key={u.user_id} className="hover:bg-app-surface-2/50 transition-colors group">
                        <td className="py-3 px-4">
                          <span className="font-mono text-[11px] text-app-muted group-hover:text-app-text transition-colors">{u.user_id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="font-display font-bold text-app-text">{u.token_count}</span>
                            <div className="w-24 h-1 bg-app-surface/30 rounded-full overflow-hidden">
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
            <div className="text-[10px] uppercase tracking-[0.2em] text-brand mb-4 font-bold opacity-80 border-t border-app-border/30 pt-6">Revoke User Sessions</div>
            <div className="bg-app-bg/30 p-4 rounded-xl border border-app-border/30">
              <form className="flex gap-3 items-center" onSubmit={e => { e.preventDefault(); revoke(userId) }}>
                <div className="flex-1 relative group">
                  <input
                    className="w-full border border-app-border/50 rounded-lg px-4 py-2.5 font-mono text-sm bg-app-bg/50 text-app-text outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 transition-all placeholder:text-app-muted/50"
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

