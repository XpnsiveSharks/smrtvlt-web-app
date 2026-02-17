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
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-app-text">Audit Logs</h1>
          <p className="mt-1 text-sm text-app-muted">
            Track internal admin actions with optional filtering by action type.
          </p>
        </div>
        <Button variant="secondary" onClick={() => void refetch()} isLoading={loading}>
          Refresh
        </Button>
      </header>

      <Card className="space-y-4">
        <form className="flex flex-wrap items-end gap-3" onSubmit={handleFilterSubmit}>
          <label className="flex min-w-52 flex-col gap-1 text-sm">
            <span className="text-app-muted">Action filter</span>
            <input
              value={actionInput}
              onChange={(event) => setActionInput(event.target.value)}
              placeholder="e.g. api_key_created"
              className="rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-app-text outline-none ring-brand/30 focus:ring-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-app-muted">Per page</span>
            <select
              value={String(limit)}
              onChange={handleLimitChange}
              className="rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-app-text outline-none ring-brand/30 focus:ring-2"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>

          <Button type="submit">Apply</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setActionInput('')
              updateParams({ page: 1, action: '' })
            }}
          >
            Clear
          </Button>
        </form>

        {loading && <LoadingState label="Loading audit logs..." />}

        {!loading && error && (
          <div className="space-y-3">
            <ErrorState title="Failed to load audit logs" detail={error} />
            <Button variant="secondary" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {(data?.items?.length ?? 0) === 0 ? (
              <div className="rounded-lg border border-app-border bg-app-surface p-4 text-sm text-app-muted">
                No audit log entries found for the current filters.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-app-border">
                <table className="min-w-full divide-y divide-app-border text-sm">
                  <thead className="bg-app-surface-2">
                    <tr className="text-left text-app-muted">
                      <th className="px-3 py-2 font-medium">Created</th>
                      <th className="px-3 py-2 font-medium">Action</th>
                      <th className="px-3 py-2 font-medium">Target</th>
                      <th className="px-3 py-2 font-medium">Target ID</th>
                      <th className="px-3 py-2 font-medium">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-app-border bg-app-surface">
                    {data?.items.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5">
                        <td className="whitespace-nowrap px-3 py-2 text-app-text">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-3 py-2 text-app-text">{toDisplayValue(item.action)}</td>
                        <td className="px-3 py-2 text-app-text">{toDisplayValue(item.target_type)}</td>
                        <td className="px-3 py-2 text-app-text">{toDisplayValue(item.target_id)}</td>
                        <td className="px-3 py-2 text-app-text">{toDisplayValue(item.ip_address)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-app-muted">
                Page {data?.page ?? page} of {Math.max(1, data?.pages ?? 1)}. Total {data?.total ?? 0} items.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  disabled={!canGoPrev}
                  onClick={() => updateParams({ page: page - 1 })}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  disabled={!canGoNext}
                  onClick={() => updateParams({ page: page + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </section>
  )
}
