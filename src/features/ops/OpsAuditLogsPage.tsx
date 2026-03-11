import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { useAuditLogs } from './hooks/useAuditLogs'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 50
const MIN_LIMIT = 1
const MAX_LIMIT = 100

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback
  }

  return parsed
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}

function toDisplayValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '-'
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return '-'
  }

  return String(value)
}

function getActionStyles(action: string | null | undefined): string {
  const a = (action ?? '').toLowerCase()
  if (a.includes('created') || a.includes('success') || a.includes('added')) return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
  if (a.includes('deleted') || a.includes('revoked') || a.includes('failed') || a.includes('denied') || a.includes('error')) return 'border-app-danger/30 bg-app-danger/10 text-app-danger'
  if (a.includes('updated') || a.includes('modified') || a.includes('changed')) return 'border-amber-500/30 bg-amber-500/10 text-amber-400'
  return 'border-app-border bg-app-surface-2 text-app-text'
}

export function OpsAuditLogsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [actionInput, setActionInput] = useState(searchParams.get('action') ?? '')

  const page = useMemo(
    () => parsePositiveInt(searchParams.get('page'), DEFAULT_PAGE),
    [searchParams],
  )
  const limit = useMemo(() => {
    const parsedLimit = parsePositiveInt(searchParams.get('limit'), DEFAULT_LIMIT)
    return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, parsedLimit))
  }, [searchParams])
  const action = useMemo(() => (searchParams.get('action') ?? '').trim(), [searchParams])
  useEffect(() => {
    setActionInput(action)
  }, [action])

  const { data, loading, error, refetch } = useAuditLogs({ page, limit, action })

  const totalPages = data?.pages ?? 1
  const canGoPrev = page > 1
  const canGoNext = page < totalPages

  function updateParams(next: { page?: number; limit?: number; action?: string }) {
    const updated = new URLSearchParams(searchParams)

    const nextPage = next.page ?? page
    const nextLimit = next.limit ?? limit
    const nextAction = (next.action ?? action).trim()

    updated.set('page', String(nextPage))
    updated.set('limit', String(nextLimit))
    if (nextAction) {
      updated.set('action', nextAction)
    } else {
      updated.delete('action')
    }

    setSearchParams(updated)
  }

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    updateParams({ page: 1, action: actionInput })
  }

  function handleLimitChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLimit = parsePositiveInt(event.target.value, DEFAULT_LIMIT)
    updateParams({ page: 1, limit: Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, nextLimit)) })
  }

  return (
    <section className="space-y-6 relative overflow-hidden rounded-2xl">
      {/* P5: Atmospheric Depth Gradient - Contained */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-brand/5 via-transparent to-transparent pointer-events-none" />
      
      <header className="flex flex-wrap items-center justify-between gap-3 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center">
          {/* P3: Strengthen Section Identity with Glowing Bar */}
          <div className="h-10 w-1 bg-brand rounded-full shadow-[0_0_15px_rgba(var(--color-brand),0.6)]" />
          <div className="ml-4">
            <h1 className="font-display text-3xl tracking-tighter text-app-text drop-shadow-[0_0_12px_rgba(var(--color-brand),0.2)]">Audit Logs</h1>
            <p className="mt-0.5 text-sm text-app-muted opacity-80">
              Track internal admin actions with optional filtering by action type.
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => void refetch()} isLoading={loading} className="border-app-border/30 hover:bg-app-surface/50">
          Refresh
        </Button>
      </header>

      <div className="relative z-10 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
        <form
          className="flex flex-wrap items-end gap-4 rounded-xl border border-app-border/30 bg-app-surface/60 backdrop-blur-md p-4 shadow-2xl shadow-black/40"
          onSubmit={handleFilterSubmit}
        >
          <label className="flex min-w-52 flex-col gap-1.5 text-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-app-muted opacity-40">
              Action filter
            </span>
            {/* P3: Filter Input Interactive Prefix & Glow */}
            <div className="relative group/input">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-black text-brand opacity-20 group-focus-within/input:opacity-100 transition-opacity pointer-events-none">
                CMD&gt;
              </div>
              <input
                value={actionInput}
                onChange={(event) => setActionInput(event.target.value)}
                placeholder="api_key_created"
                className="h-10 w-full rounded-lg border border-app-border/50 bg-app-bg/60 pl-12 pr-3 font-mono text-xs text-app-text outline-none transition duration-300 focus:border-brand/50 focus:ring-2 focus:ring-brand/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5),0_0_20px_rgba(var(--color-brand),0.1)]"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-app-muted opacity-40">
              Per page
            </span>
            <div className="relative">
              <select
                value={String(limit)}
                onChange={handleLimitChange}
                className="h-10 appearance-none rounded-lg border border-app-border/50 bg-app-bg/60 pl-3 pr-10 font-mono text-xs text-app-text outline-none transition duration-300 focus:border-brand/50 focus:ring-2 focus:ring-brand/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-40">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </label>

          {/* P1: Refine Primary Action Materiality */}
          <Button type="submit" className="h-10 px-8 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-brand/10 border border-t-white/20 active:scale-95 transition-all">
            Apply
          </Button>
          <Button
            type="button"
            variant="secondary"
             className="h-10 px-6 font-bold uppercase tracking-widest text-[10px] border-app-border/30 hover:bg-app-surface/50"
            onClick={() => {
              setActionInput('')
              updateParams({ page: 1, action: '' })
            }}
          >
            Clear
          </Button>
        </form>

        {/* P2: Glass-Rim Card Definition */}
          <Card className="p-0 overflow-hidden border-app-border/30 shadow-2xl shadow-black/60 shadow-[inset_0_1px_0_0_rgba(var(--color-app-text),0.06)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
          {loading && <LoadingState label="Loading audit logs..." />}

          {!loading && error && (
            <div className="p-8 space-y-4 flex flex-col items-center">
              <ErrorState title="Failed to load audit logs" detail={error} />
              <Button variant="secondary" onClick={() => void refetch()}>
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && (
            <>
              {(data?.items?.length ?? 0) === 0 ? (
                /* P1 & P4: Radar Empty State Refinement */
                <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-app-bg/20 overflow-hidden">
                  <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-dashed border-app-border/30 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-4 rounded-full border border-app-border/20 animate-pulse" />
                    <div className="absolute inset-8 rounded-full border border-brand/5 animate-pulse delay-700" />
                    <div className="w-3 h-3 rounded-full bg-brand shadow-[0_0_20px_rgba(var(--color-brand),0.8)] animate-pulse" />
                  </div>
                  <h3 className="font-mono text-lg text-app-text font-black tracking-[0.3em] uppercase opacity-90 animate-pulse duration-1000">System Scan: Zero Matches</h3>
                  <p className="mt-3 text-[10px] text-app-muted opacity-40 max-w-[280px] mx-auto uppercase tracking-[0.2em] font-bold">
                    Expand search parameters or reset active filter matrix
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-app-border/30 text-sm">
                    <thead className="bg-app-surface/20">
                      <tr className="text-left">
                        <th className="px-6 py-4 font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">Created</th>
                        <th className="px-6 py-4 font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">Action</th>
                        <th className="px-6 py-4 font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">Target Type</th>
                        <th className="px-6 py-4 font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">Target ID</th>
                        <th className="px-6 py-4 font-bold tracking-[0.2em] text-[10px] uppercase text-app-muted opacity-60">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-app-border/30">
                      {data?.items.map((item) => (
                        <tr key={item.id} className="group hover:bg-app-surface-2/30 transition-colors duration-200">
                          <td className="whitespace-nowrap px-6 py-4 text-app-muted text-xs font-mono group-hover:text-app-text group-hover:translate-x-1 transition-all duration-300">
                            {formatDate(item.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-tight shadow-sm ${getActionStyles(item.action)}`}>
                              {toDisplayValue(item.action)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-app-text/80 text-xs font-medium">{toDisplayValue(item.target_type)}</td>
                          <td className="px-6 py-4 font-mono text-[11px] text-app-muted group-hover:text-app-text transition-colors">
                            {toDisplayValue(item.target_id)}
                          </td>
                          <td className="px-6 py-4 font-mono text-[11px] text-app-muted/70">
                            {toDisplayValue(item.ip_address)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* P4: Pagination Hub */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-app-border/20 bg-app-surface/20 p-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    {/* P2: Amplify Live Signal Indicator */}
                    <div className="flex items-end gap-1 h-3.5">
                      <div className="w-0.5 h-1.5 bg-brand/80 animate-[bounce_1.5s_infinite]" />
                      <div className="w-0.5 h-3 bg-brand animate-[bounce_2s_infinite] delay-100" />
                      <div className="w-0.5 h-2 bg-brand/70 animate-[bounce_1.2s_infinite] delay-300" />
                      <div className="w-0.5 h-3.5 bg-brand animate-[bounce_2.5s_infinite] delay-200" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-app-text/60">
                        System Hub Readout
                      </div>
                    </div>
                  </div>
                  <div className="h-4 w-px bg-app-border/50" />
                  <p className="text-[11px] font-mono text-app-muted">
                    PAGE <span className="font-bold text-app-text">[{String(data?.page ?? page).padStart(2, '0')}]</span> 
                    &nbsp;OF&nbsp; 
                    <span className="font-bold text-app-text">[{String(Math.max(1, data?.pages ?? 1)).padStart(2, '0')}]</span>
                    &nbsp;|&nbsp;
                    TOTAL <span className="font-bold text-brand">{data?.total ?? 0}</span> RECORDS
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    disabled={!canGoPrev}
                    onClick={() => updateParams({ page: page - 1 })}
                    className="h-8 px-4 text-[10px] font-black uppercase tracking-widest border-app-border/30 hover:bg-app-surface/50 transition-all"
                  >
                    Prev
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={!canGoNext}
                    onClick={() => updateParams({ page: page + 1 })}
                    className="h-8 px-4 text-[10px] font-black uppercase tracking-widest border-app-border/30 hover:bg-app-surface/50 transition-all"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </section>
  )
}
