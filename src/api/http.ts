import { getAdminToken } from '../auth/tokenStore'

const apiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000'

const normalizedBaseUrl = apiBaseUrl.replace(/\/+$/, '')

export interface ApiErrorShape {
  status: number
  detail: string
}

export class ApiClientError extends Error implements ApiErrorShape {
  status: number
  detail: string

  constructor(error: ApiErrorShape) {
    super(error.detail)
    this.name = 'ApiClientError'
    this.status = error.status
    this.detail = error.detail
  }
}

export interface HttpRequestOptions extends RequestInit {
  authToken?: string | null
}

function buildUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBaseUrl}${normalizedPath}`
}

async function readErrorDetail(response: Response): Promise<string> {
  const raw = await response.text()
  if (!raw) {
    return response.statusText || 'Request failed'
  }

  try {
    const parsed = JSON.parse(raw) as { detail?: unknown; message?: unknown }
    if (typeof parsed.detail === 'string' && parsed.detail.trim()) {
      return parsed.detail
    }
    if (typeof parsed.message === 'string' && parsed.message.trim()) {
      return parsed.message
    }
  } catch {
    // Fall through to plain-text detail
  }

  return raw.trim() || response.statusText || 'Request failed'
}

export async function httpRequest<T>(
  path: string,
  options: HttpRequestOptions = {},
): Promise<T | null> {
  const { authToken, ...requestInit } = options

  const headers = new Headers(requestInit.headers)
  headers.set('Accept', 'application/json')
  headers.set('ngrok-skip-browser-warning', 'true')

  if (requestInit.body && !(requestInit.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const resolvedToken = (authToken ?? getAdminToken())?.trim()
  if (resolvedToken) {
    headers.set('X-Admin-Token', resolvedToken)
  }

  try {
    const response = await fetch(buildUrl(path), {
      ...requestInit,
      headers,
    })

    if (!response.ok) {
      throw new ApiClientError({
        status: response.status,
        detail: await readErrorDetail(response),
      })
    }

    if (response.status === 204) {
      return null
    }

    const raw = await response.text()
    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }

    const detail = error instanceof Error ? error.message : 'Network request failed'
    throw new ApiClientError({ status: 0, detail })
  }
}

export interface EnhancedApiError extends ApiErrorShape {
  statusText: string
  retryAfter?: number
}

export function normalizeApiError(error: unknown): EnhancedApiError {
  if (error instanceof ApiClientError) {
    const { status, detail } = error
    let statusText = detail

    // Provide friendly status-specific messages
    switch (status) {
      case 401:
        statusText = 'Authentication required. Please check your admin token.'
        break
      case 403:
        statusText = 'Access forbidden. You do not have permission to access this resource.'
        break
      case 429:
        statusText = 'Rate limit exceeded. Please wait before retrying.'
        break
      case 503:
        statusText = 'Service temporarily unavailable. Please try again later.'
        break
    }

    return { status, detail, statusText }
  }

  if (error instanceof Error) {
    return { status: 0, detail: error.message, statusText: 'Network request failed' }
  }

  return { status: 0, detail: 'Unexpected error', statusText: 'An unexpected error occurred' }
}