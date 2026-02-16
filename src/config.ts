const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined
const adminToken = import.meta.env.VITE_ADMIN_TOKEN as string | undefined

if (!apiBaseUrl) {
  console.error('[SmartVault] VITE_API_BASE_URL is not set in .env')
}

if (!adminToken) {
  console.error('[SmartVault] VITE_ADMIN_TOKEN is not set in .env')
}

export const config = {
  apiBaseUrl: apiBaseUrl ?? '',
  adminToken: adminToken ?? '',
} as const