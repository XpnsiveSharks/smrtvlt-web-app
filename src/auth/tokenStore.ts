const tokenStorageKey =
  (import.meta.env.VITE_ADMIN_TOKEN_KEY as string | undefined) ??
  'smartvault_admin_token'

export function getAdminTokenKey(): string {
  return tokenStorageKey
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const token = window.localStorage.getItem(tokenStorageKey)
  if (!token) {
    return null
  }

  const trimmedToken = token.trim()
  return trimmedToken.length > 0 ? trimmedToken : null
}

export function hasAdminToken(): boolean {
  return getAdminToken() !== null
}

export function setAdminToken(token: string): void {
  window.localStorage.setItem(tokenStorageKey, token)
}

export function clearAdminToken(): void {
  window.localStorage.removeItem(tokenStorageKey)
}