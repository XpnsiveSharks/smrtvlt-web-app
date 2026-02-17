const apiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000'

const adminTokenKey =
  (import.meta.env.VITE_ADMIN_TOKEN_KEY as string | undefined) ??
  'smartvault_admin_token'

const adminToken =
  typeof window !== 'undefined'
    ? window.localStorage.getItem(adminTokenKey) ?? ''
    : ''

export const config = {
  apiBaseUrl,
  adminToken,
  adminTokenKey,
} as const