# PLANS.md — SmartVault Internal Admin Webapp

## Global “Definition of Done”
For every slice:
- Works in browser with real backend when possible
- Handles loading / error / empty states
- No console errors
- `npm run lint` passes
- `npm run build` passes
- Uses Tailwind design tokens (no hardcoded colors)

---

## Slice 0 — Foundation ✅
Status: Done
Includes:
- localStorage token store
- login page + ping test
- AuthGuard + AdminLayout + routing skeleton
- http client wrapper (header injection + 204 safe + normalized errors)
- CORS fixed on backend

---

## Slice 1 — Ops Summary ✅
Status: Done
Route: `/ops/summary`
Endpoint:
- `GET /api/internal/ops/summary`

UI:
- Page header + Refresh button
- 3 cards: Business / Security / Activity
- Show key metrics safely (fallback `-`)

Done when:
- Page renders real data with valid token
- Wrong/expired token shows clean error + Retry
- Refresh refetches

---

## Slice 2 — Audit Logs ✅
Status: Done
Route: `/ops/audit?page=&limit=&action=`
Endpoint:
- `GET /api/internal/ops/audit?page=&limit=&action=`

UI:
- Table of items
- Pagination
- Filter by action (optional text or dropdown)
- URL query params control state

Done when:
- Changing URL params refetches
- Pagination works
- Empty state works

---

## Slice 3 — API Keys ✅
Route: `/ops/api-keys`
Endpoints:
- `GET /api/internal/ops/api-keys?active_only=true`
- `POST /api/internal/ops/api-keys`
- `DELETE /api/internal/ops/api-keys/{key_id}` (204)

UI:
- List table
- Create key modal
- One-time key dialog (copy button)
- Revoke flow with confirmation

Done when:
- Create shows key once and never persists it
- Delete handles 204 (no JSON parsing)
- List refreshes after create/revoke

---

## Slice 4 — Ops Monitoring 
Routes:
- `/ops/diagnostics` (tabs)
- `/ops/rate-limits`
- `/ops/sessions`
- `/ops/notifications/email`

Endpoints:
- diagnostics: redis/websockets/database
- rate-limits
- sessions stats + revoke user sessions
- email status

Done when:
- Each page displays key metrics
- Revoke sessions works and shows result

---

## Slice 5 — Business + Security
Routes:
- `/business/overview`
- `/business/activity?hours=&limit=`
- `/business/trends?days=`
- `/security/alerts`

Done when:
- activity/trends query params work
- charts render for trends
- alerts render with severity/status

---

## Slice 6 — Polish
- logout in top bar
- consistent error banners
- optional polling for ops pages
- basic smoke test checklist in docs
