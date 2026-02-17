# AGENTS.md — smartvault-internal-webapp

## Project summary
Internal admin webapp for SmartVault.

Frontend:
- Vite + React + TypeScript
- React Router v6
- TailwindCSS (dark theme tokens)
- Data fetching: useEffect (no TanStack Query)

Backend (dev):
- Base URL: VITE_API_BASE_URL (default http://localhost:8000)
- IMPORTANT: API is mounted under `/api`
  - Internal endpoints are `/api/internal/...`
- Auth header required for internal endpoints:
  - `X-Admin-Token: <token>`

## Non-negotiable rules
- Do not add new dependencies unless explicitly requested.
- Do not log or print the admin token.
- Do not store one-time secrets (like API key value) anywhere persistent.
- Use the shared HTTP client (`src/api/http.ts`) for all requests.
- Always use design tokens (Tailwind theme colors/fonts). Do not hardcode hex colors in components.
- Keep changes minimal and focused to the requested slice.

## Auth + token storage
- Token is stored in localStorage.
- The storage key comes from `VITE_ADMIN_TOKEN_KEY` (default `smartvault_admin_token`).
- All API calls must include `X-Admin-Token` when token exists.
- Provide a logout action that clears the token and redirects to `/login`.

## Routing rules
- `/login` is public.
- Everything else is protected by AuthGuard.
- `/` redirects to `/ops/summary`.

## File structure conventions
- `src/api/**`: networking only (no JSX)
- `src/auth/**`: login, token store, guards
- `src/layouts/**`: AdminLayout, Sidebar, TopBar
- `src/features/<domain>/**`: domain UI + hooks (ops/business/security)
- `src/shared/**`: reusable UI components + helpers

## Commands to run before finishing any task
- `npm run lint`
- `npm run build`

If a command fails, report the error and fix it (within scope).
If a fix requires broad refactors, stop and explain the smallest safe change.
