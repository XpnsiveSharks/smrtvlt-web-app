# SmartVault Internal Admin API Contract

This document outlines the contract for the SmartVault Internal Admin API. This API is used for internal administrative and operational purposes.

## Base URL & Prefix

The base URL for the internal admin API includes a global prefix.

*   **Global Prefix**: `/api`
*   **Internal Prefix**: `/internal`
*   **Full Base Path**: `/api/internal`

*Code pointer*:
*   `app/main.py`: `app.include_router(api_router, prefix="/api")`
*   `app/api/router.py`: `api_router.include_router(internal_router)`
*   `app/api/internal/router.py`: `internal_router = APIRouter(prefix="/internal", ...)`

## Authentication

All internal endpoints require authentication using a static admin token passed in the `X-Admin-Token` header.

The authentication is handled by the `require_admin_token` dependency.

*Code pointer*: `app/api/internal/deps/admin_auth.py`

## Authentication Errors

Authentication failures are handled uniformly across all internal endpoints.

### 401 Unauthorized (Missing Token)

*   **Reason**: The `X-Admin-Token` header is missing from the request.
*   **Response Body**:
    ```json
    {
      "detail": "Admin token required"
    }
    ```

### 401 Unauthorized (Invalid Token)

*   **Reason**: The value of the `X-Admin-Token` header is incorrect.
*   **Response Body**:
    ```json
    {
      "detail": "Invalid admin token"
    }
    ```

### 503 Service Unavailable

*   **Reason**: The `ADMIN_API_TOKEN` is not configured on the server.
*   **Response Body**:
    ```json
    {
      "detail": "Admin API is not configured"
    }
    ```

## Endpoints Summary

| Method | Path                                          | Summary                                      |
|--------|-----------------------------------------------|----------------------------------------------|
| GET    | `/api/internal/ping`                          | Admin API connectivity check.                |
| GET    | `/api/internal/business/activity`             | Recent activity log.                         |
| GET    | `/api/internal/business/overview`             | Business metrics overview.                   |
| GET    | `/api/internal/business/trends`               | User signup and vault provisioning trends.   |
| GET    | `/api/internal/security/alerts`               | Security alerts and suspicious activity.     |
| GET    | `/api/internal/ops/summary`                   | Complete ops dashboard summary.              |
| GET    | `/api/internal/ops/diagnostics/redis`         | Redis health and statistics.                 |
| GET    | `/api/internal/ops/diagnostics/websockets`    | WebSocket connection statistics.             |
| GET    | `/api/internal/ops/diagnostics/database`      | Database connection pool statistics.         |
| GET    | `/api/internal/ops/rate-limits`               | Rate limiting dashboard.                     |
| GET    | `/api/internal/ops/sessions/stats`            | Refresh token session statistics.            |
| DELETE | `/api/internal/ops/sessions/{user_id}`        | Revoke all sessions for a user.              |
| GET    | `/api/internal/ops/notifications/email`       | Email service status and daily send counts.  |
| GET    | `/api/internal/ops/audit`                     | Admin audit logs.                            |
| GET    | `/api/internal/ops/api-keys`                  | List API keys.                               |
| POST   | `/api/internal/ops/api-keys`                  | Create a new API key.                        |
| DELETE | `/api/internal/ops/api-keys/{key_id}`         | Revoke an API key.                           |


---

## GET /api/internal/ping

**Summary**: Admin API connectivity check.

**Request**:
*   Headers: `X-Admin-Token`

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`AdminPingResponse`):
    ```json
    {
      "status": "string",
      "admin_api": "string",
      "version": "string"
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.

**Code Pointers**:
*   Route: `app/api/internal/router.py:22`
*   Response Model: `app/schemas/admin.py` -> `AdminPingResponse`

---

## GET /api/internal/business/activity

**Summary**: Recent activity log.

**Request**:
*   Headers: `X-Admin-Token`
*   Query Params:
    *   `hours: int` (default: 24, min: 1, max: 168) - Activity window in hours.
    *   `limit: int` (default: 50, min: 1, max: 100) - Max entries to return.

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`ActivityResponse`):
    ```json
    {
      "generated_at": "datetime",
      "period_hours": "integer",
      "summary": {
        "total_events": "integer",
        "vault_unlocks": "integer",
        "failed_unlocks": "integer",
        "pin_operations": "integer",
        "member_changes": "integer",
        "state_changes": "integer"
      },
      "entries": [
        {
          "id": "string",
          "vault_id": "string",
          "user_id": "string | null",
          "action": "string",
          "method": "string",
          "metadata": "dict | null",
          "created_at": "datetime"
        }
      ]
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.
*   `422 Unprocessable Entity`: If query params fail validation.

**Code Pointers**:
*   Route: `app/api/internal/business/activity.py:43`
*   Response Models: `app/api/internal/business/activity.py:17-40`

---

## GET /api/internal/business/overview

**Summary**: Business metrics overview.

**Request**:
*   Headers: `X-Admin-Token`

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`BusinessOverviewResponse`):
    ```json
    {
      "generated_at": "datetime",
      "users": {
        "total": "integer",
        "new_today": "integer",
        "new_this_week": "integer"
      },
      "vaults": {
        "total": "integer",
        "with_pin": "integer",
        "by_status": {
          "string": "integer"
        }
      },
      "members": {
        "total_authorizations": "integer",
        "by_role": {
          "string": "integer"
        }
      }
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.

**Code Pointers**:
*   Route: `app/api/internal/business/overview.py:48`
*   Response Models: `app/api/internal/business/overview.py:17-45`

---

## GET /api/internal/business/trends

**Summary**: User signup and vault provisioning trends.

**Request**:
*   Headers: `X-Admin-Token`
*   Query Params:
    *   `days: int` (default: 30, min: 7, max: 90) - Window size in days.

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`BusinessTrendsResponse`):
    ```json
    {
      "generated_at": "datetime",
      "period_days": "integer",
      "period_start": "string",
      "period_end": "string",
      "user_signups": {
        "daily": [
          {
            "date": "string",
            "count": "integer"
          }
        ],
        "total": "integer",
        "average_per_day": "float",
        "peak_date": "string | null",
        "peak_count": "integer",
        "change_pct": "float | null"
      },
      "vault_provisioning": {
        "daily": [
          {
            "date": "string",
            "count": "integer"
          }
        ],
        "total": "integer",
        "average_per_day": "float",
        "peak_date": "string | null",
        "peak_count": "integer",
        "change_pct": "float | null"
      }
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.
*   `422 Unprocessable Entity`: If query params fail validation.

**Code Pointers**:
*   Route: `app/api/internal/business/trends.py:61`
*   Response Models: `app/api/internal/business/trends.py:27-58`

---

## GET /api/internal/security/alerts

**Summary**: Security alerts and suspicious activity.

**Request**:
*   Headers: `X-Admin-Token`

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`SecurityAlertsResponse`):
    ```json
    {
      "generated_at": "datetime",
      "status": "string",
      "active_alerts": [
        {
          "type": "string",
          "severity": "string",
          "message": "string",
          "count": "integer",
          "threshold": "integer",
          "window": "string"
        }
      ],
      "last_24h": {
        "failed_unlocks_1h": "integer",
        "failed_unlocks_24h": "integer",
        "pin_lockouts_24h": "integer"
      }
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.

**Code Pointers**:
*   Route: `app/api/internal/security/alerts.py:168`
*   Response Models: `app/api/internal/security/alerts.py:46-77`

---

## GET /api/internal/ops/summary

**Summary**: Complete ops dashboard summary.

**Request**:
*   Headers: `X-Admin-Token`

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`OpsSummaryResponse`):
    ```json
    {
      "generated_at": "datetime",
      "overall_status": "string",
      "business": {
        "users": {
          "total": "integer",
          "new_today": "integer",
          "new_this_week": "integer"
        },
        "vaults": {
          "total": "integer",
          "with_pin": "integer",
          "by_status": {
            "string": "integer"
          }
        },
        "members": {
          "total_authorizations": "integer",
          "by_role": {
            "string": "integer"
          }
        }
      },
      "security": {
        "status": "string",
        "failed_unlocks_1h": "integer",
        "failed_unlocks_24h": "integer",
        "pin_lockouts_24h": "integer",
        "alert_count": "integer"
      },
      "activity": {
        "period_hours": "integer",
        "total_events": "integer",
        "vault_unlocks": "integer",
        "failed_unlocks": "integer",
        "pin_operations": "integer",
        "member_changes": "integer",
        "state_changes": "integer"
      }
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.

**Code Pointers**:
*   Route: `app/api/internal/ops/summary.py:116`
*   Response Models: `app/api/internal/ops/summary.py:27-84`

---

## GET /api/internal/ops/diagnostics/redis

**Summary**: Redis health and statistics.

**Request**:
*   Headers: `X-Admin-Token`

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`RedisDiagnosticsResponse`):
    ```json
    {
      "status": "string",
      "connected": "boolean",
      "memory_used_mb": "float",
      "total_keys": "integer",
      "uptime_seconds": "integer",
      "checked_at": "datetime"
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.

**Code Pointers**:
*   Route: `app/api/internal/ops/diagnostics.py:46`
*   Response Models: `app/api/internal/ops/diagnostics.py:20-27`

---

## GET /api/internal/ops/diagnostics/websockets

**Summary**: WebSocket connection statistics.

**Request**:
*   Headers: `X-Admin-Token`

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`WebSocketDiagnosticsResponse`):
    ```json
    {
      "total_users": "integer",
      "total_user_connections": "integer",
      "total_vaults": "integer",
      "subscriptions": "integer",
      "online_vaults": [
        "string"
      ],
      "checked_at": "datetime"
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.

**Code Pointers**:
*   Route: `app/api/internal/ops/diagnostics.py:61`
*   Response Models: `app/api/internal/ops/diagnostics.py:30-37`

---

## GET /api/internal/ops/diagnostics/database

**Summary**: Database connection pool statistics.

**Request**:
*   Headers: `X-Admin-Token`

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`DatabaseDiagnosticsResponse`):
    ```json
    {
      "status": "string",
      "pool_size": "integer",
      "checked_out": "integer",
      "overflow": "integer",
      "checked_at": "datetime"
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.

**Code Pointers**:
*   Route: `app/api/internal/ops/diagnostics.py:78`
*   Response Models: `app/api/internal/ops/diagnostics.py:40-46`

---

## GET /api/internal/ops/rate-limits

**Summary**: Rate limiting dashboard.

**Request**:
*   Headers: `X-Admin-Token`

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`RateLimitsResponse`):
    ```json
    {
      "total_active_keys": "integer",
      "top_violators": [
        {
          "key": "string",
          "current_count": "integer",
          "ttl_seconds": "integer"
        }
      ],
      "by_category": {
        "string": "integer"
      },
      "checked_at": "datetime"
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.

**Code Pointers**:
*   Route: `app/api/internal/ops/rate_limits.py:42`
*   Response Models: `app/api/internal/ops/rate_limits.py:22-39`

---

## GET /api/internal/ops/sessions/stats

**Summary**: Refresh token session statistics.

**Request**:
*   Headers: `X-Admin-Token`

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`SessionStatsResponse`):
    ```json
    {
      "total_active_tokens": "integer",
      "top_users": [
        {
          "user_id": "string",
          "token_count": "integer"
        }
      ],
      "checked_at": "datetime"
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.

**Code Pointers**:
*   Route: `app/api/internal/ops/sessions.py:44`
*   Response Models: `app/api/internal/ops/sessions.py:22-31`

---

## DELETE /api/internal/ops/sessions/{user_id}

**Summary**: Revoke all sessions for a user.

**Request**:
*   Headers: `X-Admin-Token`
*   Path Params:
    *   `user_id: str`

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`RevokeSessionsResponse`):
    ```json
    {
      "user_id": "string",
      "sessions_revoked": "integer"
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.

**Code Pointers**:
*   Route: `app/api/internal/ops/sessions.py:69`
*   Response Models: `app/api/internal/ops/sessions.py:34-37`

---

## GET /api/internal/ops/notifications/email

**Summary**: Email service status and daily send counts.

**Request**:
*   Headers: `X-Admin-Token`

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`EmailStatusResponse`):
    ```json
    {
      "service": "string",
      "status": "string",
      "sent_today": "integer",
      "failed_today": "integer",
      "note": "string",
      "checked_at": "datetime"
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.

**Code Pointers**:
*   Route: `app/api/internal/ops/notifications.py:26`
*   Response Models: `app/api/internal/ops/notifications.py:14-23`

---

## GET /api/internal/ops/audit

**Summary**: Admin audit logs.

**Request**:
*   Headers: `X-Admin-Token`
*   Query Params:
    *   `page: int` (default: 1, min: 1) - Page number.
    *   `limit: int` (default: 50, min: 1, max: 100) - Items per page.
    *   `action: str | None` (default: None) - Filter by action type.

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`AuditLogsResponse`):
    ```json
    {
      "items": [
        {
          "id": "integer",
          "action": "string",
          "target_type": "string",
          "target_id": "string | null",
          "details": "dict | null",
          "ip_address": "string | null",
          "created_at": "datetime"
        }
      ],
      "total": "integer",
      "page": "integer",
      "pages": "integer"
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.
*   `422 Unprocessable Entity`: If query params fail validation.

**Code Pointers**:
*   Route: `app/api/internal/ops/audit.py:45`
*   Response Models: `app/api/internal/ops/audit.py:24-42`

---

## GET /api/internal/ops/api-keys

**Summary**: List API keys.

**Request**:
*   Headers: `X-Admin-Token`
*   Query Params:
    *   `active_only: bool` (default: True)

**Response (Success)**:
*   Status Code: `200 OK`
*   Response Body (`APIKeysListResponse`):
    ```json
    {
      "items": [
        {
          "id": "integer",
          "name": "string",
          "created_by": "string",
          "last_used_at": "datetime | null",
          "expires_at": "datetime | null",
          "is_active": "boolean",
          "created_at": "datetime"
        }
      ]
    }
    ```

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.

**Code Pointers**:
*   Route: `app/api/internal/ops/api_keys.py:64`
*   Response Models: `app/api/internal/ops/api_keys.py:42-51`

---

## POST /api/internal/ops/api-keys

**Summary**: Create a new API key.

**Request**:
*   Headers: `X-Admin-Token`
*   Request Body (`CreateAPIKeyRequest`):
    ```json
    {
      "name": "string",
      "expires_in_days": "integer | null"
    }
    ```

**Response (Success)**:
*   Status Code: `201 Created`
*   Response Body (`CreatedAPIKeyResponse`):
    ```json
    {
      "id": "integer",
      "key": "string",
      "name": "string",
      "expires_at": "datetime | null"
    }
    ```

**Errors**:.
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.
*   `422 Unprocessable Entity`: If request body fails validation.

**Code Pointers**:
*   Route: `app/api/internal/ops/api_keys.py:91`
*   Request/Response Models: `app/api/internal/ops/api_keys.py:54-61`

---

## DELETE /api/internal/ops/api-keys/{key_id}

**Summary**: Revoke an API key.

**Request**:
*   Headers: `X-Admin-Token`
*   Path Params:
    *   `key_id: int`

**Response (Success)**:
*   Status Code: `204 No Content`

**Errors**:
*   `401 Unauthorized`: Missing or invalid `X-Admin-Token`.
*   `404 Not Found`: If `key_id` does not exist.

**Code Pointers**:
*   Route: `app/api/internal/ops/api_keys.py:120`
