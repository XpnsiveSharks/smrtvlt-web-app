# TypeScript Type Generation from OpenAPI

## Overview
This document outlines the recommended approach for generating TypeScript types from the backend OpenAPI specification.

## Tool: openapi-typescript

**Why**: Lightweight, type-only generator that produces clean TypeScript interfaces without runtime code.

**Installation**:
```bash
npm install --save-dev openapi-typescript
```

## Setup

### 1. Obtain OpenAPI Schema

You need the OpenAPI schema file from the backend. Request it from the backend team or generate it from the FastAPI application:

```bash
# If backend exposes OpenAPI JSON at /openapi.json
curl http://localhost:8000/openapi.json > docs/openapi.json
```

### 2. Add Generation Script

Add to `package.json`:

```json
{
  "scripts": {
    "types:generate": "openapi-typescript docs/openapi.json -o src/api/generated/internal-types.ts",
    "types:watch": "npm run types:generate -- --watch"
  }
}
```

### 3. Directory Structure

```
src/api/
├── generated/
│   └── internal-types.ts    # ← Generated types (gitignored or committed)
├── internal/
│   ├── business.ts          # Use generated types
│   ├── security.ts          # Use generated types
│   └── ops.ts               # Use generated types
├── http.ts                  # Low-level HTTP client
└── client.ts                # Legacy (to be migrated)
```

### 4. Usage Pattern

**Before** (manual types):
```typescript
export interface BusinessOverviewResponse {
  generated_at: string
  users: {
    total: number
    new_today: number
    new_this_week: number
  }
  // ...
}
```

**After** (generated types):
```typescript
import type { components } from '../generated/internal-types'

type BusinessOverviewResponse = components['schemas']['BusinessOverviewResponse']

export function getBusinessOverview(): Promise<BusinessOverviewResponse | null> {
  return httpRequest<BusinessOverviewResponse>('/api/internal/business/overview', {
    method: 'GET',
  })
}
```

## Workflow

### Development Workflow
1. Backend developer updates API contract
2. Backend regenerates OpenAPI schema
3. Frontend runs `npm run types:generate`
4. TypeScript compiler catches breaking changes

### CI/CD Integration
Add to GitHub Actions:

```yaml
- name: Generate API Types
  run: npm run types:generate

- name: Type Check
  run: npm run build
```

## Migration Strategy

### Phase 1: Generate Types ✅
- Install `openapi-typescript`
- Add generation script
- Generate initial types file

### Phase 2: Migrate Internal API Modules
- Replace manual types in `src/api/internal/business.ts`
- Replace manual types in `src/api/internal/security.ts`
- Replace manual types in `src/api/internal/ops.ts`

### Phase 3: Deprecate client.ts (Optional)
- Move remaining API functions to `internal/` modules
- Remove `src/api/client.ts` once fully migrated

## Benefits

1. **Zero Drift**: Types always match backend contract
2. **Breaking Changes Detection**: Compile errors when API changes
3. **Autocomplete**: Full IDE support for request/response shapes
4. **Documentation**: Types serve as inline API docs
5. **No Manual Updates**: Automated type sync on every backend change

## Caveats

- Requires OpenAPI schema from backend (request from backend team if not available)
- Generated types can be verbose (use type aliases to simplify)
- Nullable/optional field handling may need manual adjustment
- Keep generated file in `.gitignore` OR commit it (team decision)

## Status

**Current State**: Manual types in place, working ✅  
**Next Step**: Request OpenAPI schema from backend team  
**Blocker**: Need `openapi.json` file from backend
