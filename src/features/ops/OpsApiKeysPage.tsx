import { type FormEvent, useCallback, useState, type JSX } from 'react'
import {
  createApiKey,
  revokeApiKey,
  type CreatedApiKeyResponse,
} from '../../api/internal/ops'
import { normalizeApiError } from '../../api/http'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { useApiKeys } from './hooks/useApiKeys'

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

function formatDate(value: string | null | undefined, showRelative = false): JSX.Element | string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  
  const isoFormat = date.toISOString()
  const relativeTime = formatRelativeTime(isoFormat)
  const displayText = showRelative ? relativeTime : date.toLocaleString()
  
  // Return a tooltip-enabled element for relative time
  if (showRelative) {
    return (
      <span 
        className="cursor-help hover:text-brand transition-colors"
        title={isoFormat}
      >
        {displayText}
      </span>
    )
  }
  
  return displayText
}

/* ── Create Key Modal ── */

interface CreateKeyModalProps {
  onClose: () => void
  onCreated: (result: CreatedApiKeyResponse) => void
}

function CreateKeyModal({ onClose, onCreated }: CreateKeyModalProps) {
  const [name, setName] = useState('')
  const [expiresInDays, setExpiresInDays] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    setSubmitting(true)
    setError(null)

    try {
      const parsed = expiresInDays.trim() ? Number.parseInt(expiresInDays, 10) : null
      const expires = parsed && !Number.isNaN(parsed) && parsed > 0 ? parsed : null

      const result = await createApiKey({ name: trimmedName, expires_in_days: expires })
      if (result) {
        onCreated(result)
      }
    } catch (err) {
      setError(normalizeApiError(err).detail)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-app-border bg-app-surface p-6 shadow-xl shadow-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-app-text">Create API Key</h2>

        <form className="mt-4 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-app-muted">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. mobile-app-prod"
              required
              className="rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-app-text outline-none ring-brand/30 focus:ring-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-app-muted">Expires in (days, optional)</span>
            <input
              type="number"
              min="1"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              placeholder="Leave empty for no expiry"
              className="rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-app-text outline-none ring-brand/30 focus:ring-2"
            />
          </label>

          {error && <ErrorState title="Failed to create key" detail={error} />}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── One-Time Key Dialog ── */

interface KeyRevealDialogProps {
  result: CreatedApiKeyResponse
  onClose: () => void
}

function KeyRevealDialog({ result, onClose }: KeyRevealDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result.key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select the text for manual copy
    }
  }, [result.key])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-2xl border border-app-border bg-app-surface p-6 shadow-xl shadow-black/40">
        <h2 className="font-display text-xl text-app-text">API Key Created</h2>
        <p className="mt-2 text-sm text-app-muted">
          Copy this key now. It will not be shown again.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <code className="flex-1 overflow-x-auto rounded-lg border border-app-border bg-app-surface-2 px-3 py-2 text-sm text-brand">
            {result.key}
          </code>
          <Button variant="secondary" onClick={() => void handleCopy()}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="text-app-muted">Name:</dt>
            <dd className="text-app-text">{result.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-app-muted">Expires:</dt>
            <dd className="text-app-text">{result.expires_at ? formatDate(result.expires_at, true) : 'Never'}</dd>
          </div>
        </dl>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  )
}

/* ── Revoke Confirmation Dialog ── */

interface RevokeDialogProps {
  keyName: string
  onConfirm: () => void
  onCancel: () => void
  revoking: boolean
}

function RevokeDialog({ keyName, onConfirm, onCancel, revoking }: RevokeDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onCancel}>
      <div
        className="w-full max-w-sm rounded-2xl border border-app-border bg-app-surface p-6 shadow-xl shadow-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-app-text">Revoke API Key</h2>
        <p className="mt-2 text-sm text-app-muted">
          Are you sure you want to revoke <strong className="text-app-text">{keyName}</strong>? This cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={revoking}>
            Cancel
          </Button>
          <Button
            className="bg-app-danger text-white hover:bg-red-600"
            onClick={onConfirm}
            isLoading={revoking}
          >
            Revoke
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ── */

export function OpsApiKeysPage() {
  const { data, loading, error, refetch } = useApiKeys(true)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createdKey, setCreatedKey] = useState<CreatedApiKeyResponse | null>(null)
  const [revokeTarget, setRevokeTarget] = useState<{ id: number; name: string } | null>(null)
  const [revoking, setRevoking] = useState(false)
  const [revokeError, setRevokeError] = useState<string | null>(null)

  function handleCreated(result: CreatedApiKeyResponse) {
    setShowCreateModal(false)
    setCreatedKey(result)
    void refetch()
  }

  function handleKeyRevealClose() {
    setCreatedKey(null)
  }

  async function handleRevoke() {
    if (!revokeTarget) return

    setRevoking(true)
    setRevokeError(null)

    try {
      await revokeApiKey(revokeTarget.id)
      setRevokeTarget(null)
      void refetch()
    } catch (err) {
      setRevokeError(normalizeApiError(err).detail)
    } finally {
      setRevoking(false)
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-app-text">API Keys</h1>
          <p className="mt-1 text-sm text-app-muted">
            Manage API keys for programmatic access.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => void refetch()} isLoading={loading}>
            Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>Create Key</Button>
        </div>
      </header>

      {revokeError && (
        <ErrorState title="Failed to revoke key" detail={revokeError} />
      )}

      <Card>
        {loading && <LoadingState label="Loading API keys..." />}

        {!loading && error && (
          <div className="space-y-3">
            <ErrorState title="Failed to load API keys" detail={error} />
            <Button variant="secondary" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            {(data?.items?.length ?? 0) === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-app-border bg-app-surface-2 py-8 px-4 text-center">
                <div className="mb-2 text-sm text-app-muted">No API keys found</div>
                <p className="text-xs text-app-muted/70">Create your first API key to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-app-border">
                <table className="min-w-full divide-y divide-app-border text-sm">
                  <thead className="bg-app-surface-2 bg-gradient-to-b from-white/5 to-transparent">
                    <tr className="text-left text-app-muted">
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Created By</th>
                      <th className="px-3 py-2 font-medium">Created</th>
                      <th className="px-3 py-2 font-medium">Last Used</th>
                      <th className="px-3 py-2 font-medium">Expires</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-app-border bg-app-surface">
                    {data?.items.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5">
                        <td className="px-3 py-2 font-medium text-app-text">{item.name}</td>
                        <td className="px-3 py-2 text-app-text">{item.created_by}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-app-text">
                          {formatDate(item.created_at, true)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">
                          {item.last_used_at ? (
                            formatDate(item.last_used_at, true)
                          ) : (
                            <span className="inline-block rounded-full bg-app-muted/20 px-2 py-0.5 text-xs text-app-muted">
                              Never
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-app-text">
                          {formatDate(item.expires_at, true)}
                        </td>
                        <td className="px-3 py-2">
                          {item.is_active ? (
                            <span className="inline-block rounded-full bg-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">
                              Active
                            </span>
                          ) : (
                            <span className="inline-block rounded-full bg-app-danger/20 px-2 py-0.5 text-xs font-semibold text-app-danger">
                              Revoked
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {item.is_active && (
                            <button
                              type="button"
                              className="text-xs text-app-danger hover:underline"
                              onClick={() => setRevokeTarget({ id: item.id, name: item.name })}
                            >
                              Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modals */}
      {showCreateModal && (
        <CreateKeyModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}

      {createdKey && (
        <KeyRevealDialog result={createdKey} onClose={handleKeyRevealClose} />
      )}

      {revokeTarget && (
        <RevokeDialog
          keyName={revokeTarget.name}
          onConfirm={() => void handleRevoke()}
          onCancel={() => {
            setRevokeTarget(null)
            setRevokeError(null)
          }}
          revoking={revoking}
        />
      )}
    </section>
  )
}
