# UI Refactor Plan: OpsDiagnostics Page

**Generated**: 2024  
**Target**: `src/features/ops/OpsDiagnosticsPage.tsx`  
**Agent**: refactor-planner  

---

## 1) Summary

### Goal of refactor
Transform the diagnostics UI from text-only metrics into a visually hierarchical, color-coded interface that reduces cognitive load for rapid system health assessment.

### Non-goals (what will NOT change)
- Tab-based navigation structure (redis/websockets/database)
- Data fetching logic or API contracts
- Loading/error state behavior
- Online vaults list structure (websockets)
- Grid layout pattern (2-column metric grid)

### Dependencies
- **No new npm dependencies** (per project constraints)
- Leverage existing design tokens from `tailwind.config.js`
- Use existing UI components from `src/components/ui/`

### Scope mode
- **Full-file refactor** of `OpsDiagnosticsPage.tsx`
- Component-only changes (no API/backend modifications)

### Confidence
- **High**
- All required files provided
- Existing UI component library (StatusBadge, Card, LoadingState, ErrorState, Button) supports planned changes
- Design tokens clearly defined in tailwind config
- Data contracts stable (types from ops.ts)

---

## 2) Task List (Prioritized)

### Task P1-1: Add visual status indicators with color encoding

**Problem (from critique)**:  
Status fields (`status: "ok"/"healthy"`) displayed as raw text with no visual distinction, requiring cognitive effort to assess system health.

**Proposed change**:  
Replace text status values with `StatusBadge` component (already exists) for both Redis and Database diagnostics.

**Files to touch**:
- `src/features/ops/OpsDiagnosticsPage.tsx`

**Implementation notes**:
```tsx
// Before (line 45):
<Metric label="Status" value={data.status} />

// After:
<div>
  <div className="text-xs text-app-muted">Status</div>
  <div className="mt-1">
    <StatusBadge status={data.status} />
  </div>
</div>
```

Apply to:
- `RedisDiagnostics` (line 45: status)
- `DatabaseDiagnostics` (line 90: status)

Import `StatusBadge` from `../../components/ui/StatusBadge`

**Acceptance criteria**:
- [ ] Redis status shows colored badge (green for "ok", red for "error", etc.)
- [ ] Database status shows colored badge
- [ ] Badge includes colored dot indicator
- [ ] Badge uses design tokens (no hardcoded colors)

**Tests / verification**:
- Manual: Visual inspection of diagnostics page with ok/error states
- TypeCheck: `npm run build`
- Lint: `npm run lint`

**Risks / edge cases**:
- If backend returns unexpected status values, StatusBadge defaults to gray (already handles via `statusStyles` fallback)

**Cross-team?**: No

---

### Task P1-2: Convert timestamps to relative format

**Problem (from critique)**:  
`checked_at` timestamps displayed as raw ISO strings (e.g., "2024-01-15T14:23:45Z"), requiring mental conversion to assess data freshness.

**Proposed change**:  
Create local utility function `formatRelativeTime(isoString: string): string` using native JavaScript (no external deps). Display both relative time (primary) and absolute timestamp (secondary/hover).

**Files to touch**:
- `src/features/ops/OpsDiagnosticsPage.tsx`

**Implementation notes**:
```tsx
// Add utility at top of file (after imports):
function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// Update Metric component for timestamp fields:
function Metric({ label, value, isTimestamp }: { 
  label: string, 
  value: string | number | boolean | null | undefined,
  isTimestamp?: boolean 
}) {
  const displayValue = isTimestamp && typeof value === 'string' 
    ? formatRelativeTime(value) 
    : String(value)
  
  const title = isTimestamp && typeof value === 'string' 
    ? new Date(value).toLocaleString() 
    : undefined
  
  return (
    <div>
      <div className="text-xs text-app-muted">{label}</div>
      <div 
        className="font-mono text-lg text-app-text" 
        title={title}
      >
        {displayValue}
      </div>
    </div>
  )
}

// Usage (lines 50, 69, 94):
<Metric label="Checked At" value={data.checked_at} isTimestamp />
```

**Acceptance criteria**:
- [ ] All `checked_at` fields show relative time (e.g., "2m ago", "1h ago")
- [ ] Hovering over relative time shows full timestamp tooltip
- [ ] Relative time updates reflect current time (not cached)
- [ ] No external date library added (native JS only)

**Tests / verification**:
- Manual: Mock different timestamp values in API response
- TypeCheck: `npm run build`
- Lint: `npm run lint`

**Risks / edge cases**:
- Future timestamps (bad data): formatRelativeTime will show negative values → Add guard: `if (seconds < 0) return "just now"`
- Invalid ISO strings: Add try-catch in formatRelativeTime, return original string on error

**Cross-team?**: No

---

### Task P1-3: Add visual hierarchy for metrics (primary vs secondary)

**Problem (from critique)**:  
All metrics presented with equal visual weight, making it hard to quickly identify the most important health indicators.

**Proposed change**:  
Differentiate primary metrics (status, connected, pool_size) with larger text and secondary metrics (uptime, memory, keys) with smaller, muted styling.

**Files to touch**:
- `src/features/ops/OpsDiagnosticsPage.tsx`

**Implementation notes**:
```tsx
// Update Metric component signature:
function Metric({ 
  label, 
  value, 
  isTimestamp,
  isPrimary = false 
}: { 
  label: string, 
  value: string | number | boolean | null | undefined,
  isTimestamp?: boolean,
  isPrimary?: boolean
}) {
  const displayValue = isTimestamp && typeof value === 'string' 
    ? formatRelativeTime(value) 
    : String(value)
  
  const title = isTimestamp && typeof value === 'string' 
    ? new Date(value).toLocaleString() 
    : undefined
  
  return (
    <div>
      <div className={`text-xs ${isPrimary ? 'font-semibold text-app-text' : 'text-app-muted'}`}>
        {label}
      </div>
      <div 
        className={`font-mono ${isPrimary ? 'text-2xl' : 'text-lg'} text-app-text`}
        title={title}
      >
        {displayValue}
      </div>
    </div>
  )
}

// Mark primary metrics:
// Redis: Connected (line 46), Total Keys (line 48)
// WebSockets: Total Users (line 64), Online Vaults (line 68)
// Database: Pool Size (line 91), Checked Out (line 92)

<Metric label="Connected" value={data.connected ? 'Yes' : 'No'} isPrimary />
```

**Acceptance criteria**:
- [ ] Primary metrics use larger font (text-2xl vs text-lg)
- [ ] Primary metric labels are bolder/more prominent
- [ ] Visual hierarchy is immediately apparent (can identify key metrics in <2 seconds)
- [ ] All metrics remain readable

**Tests / verification**:
- Manual: Visual comparison before/after
- TypeCheck: `npm run build`
- Lint: `npm run lint`

**Risks / edge cases**:
- May need to adjust grid layout if large primary metrics cause wrapping → Test with various viewport widths

**Cross-team?**: No

---

### Task P1-4: Enhance connection status visualization (Yes/No → Badge)

**Problem (from critique)**:  
Redis "Connected" field shows text "Yes"/"No" without semantic color coding.

**Proposed change**:  
Replace boolean text with colored badge: green for connected, red for disconnected.

**Files to touch**:
- `src/features/ops/OpsDiagnosticsPage.tsx`

**Implementation notes**:
```tsx
// Replace line 46:
// Before:
<Metric label="Connected" value={data.connected ? 'Yes' : 'No'} isPrimary />

// After:
<div>
  <div className="text-xs font-semibold text-app-text">Connected</div>
  <div className="mt-1">
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold ${
      data.connected 
        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
        : 'bg-app-danger/20 text-app-danger border-app-danger/30'
    }`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {data.connected ? 'Connected' : 'Disconnected'}
    </span>
  </div>
</div>
```

**Acceptance criteria**:
- [ ] Connected state shows green badge with dot indicator
- [ ] Disconnected state shows red badge with dot indicator
- [ ] Badge styling matches StatusBadge component pattern
- [ ] Uses design tokens (emerald-500, app-danger)

**Tests / verification**:
- Manual: Mock `connected: false` in API response
- TypeCheck: `npm run build`
- Lint: `npm run lint`

**Risks / edge cases**:
- None (boolean field, no edge cases)

**Cross-team?**: No

---

### Task P2-1: Convert online vaults list to badge grid

**Problem (from critique)**:  
Online vaults displayed as bulleted list, lacks visual structure and takes excessive vertical space.

**Proposed change**:  
Render online vaults as inline badge grid with wrapping, similar to tag cloud pattern.

**Files to touch**:
- `src/features/ops/OpsDiagnosticsPage.tsx`

**Implementation notes**:
```tsx
// Replace lines 71-78:
{data.online_vaults.length > 0 && (
  <div className="mt-6 pt-6 border-t border-app-border">
    <p className="text-xs font-semibold text-app-text mb-3">
      Online Vaults ({data.online_vaults.length})
    </p>
    <div className="flex flex-wrap gap-2">
      {data.online_vaults.map(vaultId => (
        <span
          key={vaultId}
          className="inline-flex items-center rounded-md border border-app-border bg-app-surface px-2.5 py-1 text-xs font-mono text-app-text"
        >
          {vaultId}
        </span>
      ))}
    </div>
  </div>
)}
```

**Acceptance criteria**:
- [ ] Each vault ID rendered as individual badge
- [ ] Badges wrap to multiple lines if needed
- [ ] Count indicator shows total (e.g., "Online Vaults (5)")
- [ ] Section separated from metrics with border
- [ ] Monospace font for vault IDs

**Tests / verification**:
- Manual: Mock various vault counts (0, 1, 10, 50)
- TypeCheck: `npm run build`
- Lint: `npm run lint`

**Risks / edge cases**:
- Large vault counts (>100): May need max-height + scroll or "show more" pattern → Defer to future improvement (not blocking)

**Cross-team?**: No

---

### Task P2-2: Replace inline loading/error with shared components

**Problem (from critique)**:  
Loading and error states use inline primitives instead of consistent design system components.

**Proposed change**:  
Replace inline loading text and error divs with `LoadingState` and `ErrorState` components from `src/components/ui/`.

**Files to touch**:
- `src/features/ops/OpsDiagnosticsPage.tsx`

**Implementation notes**:
```tsx
// Add imports:
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'

// Replace lines 39, 58, 85 (loading):
// Before:
if (loading) return <p className="text-app-muted">Loading…</p>

// After:
if (loading) return <LoadingState label="Loading diagnostics..." />

// Replace lines 40, 59, 86 (error):
// Before:
if (error) return <div className="text-red-500">{error} <button className="underline ml-2" onClick={refetch}>Retry</button></div>

// After:
if (error) return <ErrorState detail={error} onRetry={refetch} />
```

**Acceptance criteria**:
- [ ] Loading state shows spinner + consistent styling
- [ ] Error state shows styled error card with retry button
- [ ] All three diagnostic sections use same loading/error components
- [ ] Visual consistency with other pages in app

**Tests / verification**:
- Manual: Test loading and error states for each diagnostic type
- TypeCheck: `npm run build`
- Lint: `npm run lint`

**Risks / edge cases**:
- ErrorState expects `detail` prop (string), current `error` is already string → No conversion needed

**Cross-team?**: No

---

### Task P2-3: Add context for numeric metrics

**Problem (from critique)**:  
Numeric values lack context (e.g., "Memory Used: 1024" → MB? Bytes? High or low?).

**Proposed change**:  
Add unit labels and optional context hints for key metrics.

**Files to touch**:
- `src/features/ops/OpsDiagnosticsPage.tsx`

**Implementation notes**:
```tsx
// Update Metric component to support unit suffix:
function Metric({ 
  label, 
  value, 
  unit,
  isTimestamp,
  isPrimary = false 
}: { 
  label: string, 
  value: string | number | boolean | null | undefined,
  unit?: string,
  isTimestamp?: boolean,
  isPrimary?: boolean
}) {
  const displayValue = isTimestamp && typeof value === 'string' 
    ? formatRelativeTime(value) 
    : String(value)
  
  const title = isTimestamp && typeof value === 'string' 
    ? new Date(value).toLocaleString() 
    : undefined
  
  return (
    <div>
      <div className={`text-xs ${isPrimary ? 'font-semibold text-app-text' : 'text-app-muted'}`}>
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <div 
          className={`font-mono ${isPrimary ? 'text-2xl' : 'text-lg'} text-app-text`}
          title={title}
        >
          {displayValue}
        </div>
        {unit && (
          <span className="text-xs text-app-muted font-normal">{unit}</span>
        )}
      </div>
    </div>
  )
}

// Apply units:
<Metric label="Memory Used" value={data.memory_used_mb} unit="MB" />
<Metric label="Uptime" value={data.uptime_seconds} unit="sec" />
```

**Acceptance criteria**:
- [ ] Memory shows "MB" unit
- [ ] Uptime shows "sec" unit
- [ ] Units styled consistently (smaller, muted)
- [ ] Units aligned with metric values

**Tests / verification**:
- Manual: Visual inspection
- TypeCheck: `npm run build`
- Lint: `npm run lint`

**Risks / edge cases**:
- None (additive change)

**Cross-team?**: No

---

### Task P2-4: Enhance Card visual hierarchy with nested sections

**Problem (from critique)**:  
Flat metric grid lacks structural depth; difficult to distinguish metric groups.

**Proposed change**:  
Wrap diagnostic sections in `Card` component from `src/components/ui/Card.tsx` to add visual elevation.

**Files to touch**:
- `src/features/ops/OpsDiagnosticsPage.tsx`

**Implementation notes**:
```tsx
// Add import:
import { Card } from '../../components/ui/Card'

// Wrap return content of each diagnostic component:
// Example for RedisDiagnostics (lines 42-53):
return (
  <Card>
    <div className="grid grid-cols-2 gap-4">
      {/* metrics */}
    </div>
  </Card>
)
```

Note: Parent container (line 28) already has bg-app-surface-2, Card adds gradient + border. May need to adjust parent styling to avoid double-background.

**Acceptance criteria**:
- [ ] Each diagnostic section has subtle card elevation
- [ ] Card borders and gradients use design tokens
- [ ] No visual conflicts with parent container
- [ ] Maintains existing spacing

**Tests / verification**:
- Manual: Visual inspection, check for layering issues
- TypeCheck: `npm run build`
- Lint: `npm run lint`

**Risks / edge cases**:
- Parent container (line 28: `bg-app-surface-2`) may conflict with Card gradient → Test and potentially remove parent bg, or remove Card wrapper if conflicts arise

**Cross-team?**: No

---

## 3) Rollout / Review Checklist

**Reviewer should verify**:
- [ ] StatusBadge used for all status fields (redis, database)
- [ ] All timestamps show relative format with hover tooltip
- [ ] Primary metrics visually distinct (larger, bolder)
- [ ] Connected badge shows green (connected) or red (disconnected)
- [ ] Online vaults render as badge grid (not bullet list)
- [ ] LoadingState and ErrorState components used consistently
- [ ] Numeric metrics include unit labels where applicable
- [ ] Card components add visual hierarchy without layout breaks
- [ ] No new npm dependencies added
- [ ] All design tokens from tailwind.config.js (no hardcoded colors)
- [ ] TypeScript builds without errors (`npm run build`)
- [ ] Linter passes (`npm run lint`)
- [ ] Manual testing: Toggle between tabs, test loading/error states
- [ ] Responsive: Test on mobile viewport (grid should stack)

**Commands to run**:
```bash
npm run lint
npm run build
```

---

## 4) UNKNOWN / Missing Inputs

**None** — All required context provided:
- ✅ Target component source (`OpsDiagnosticsPage.tsx`)
- ✅ Data hooks (`useDiagnostics.ts`)
- ✅ Type definitions (`ops.ts`)
- ✅ Available UI components confirmed (`StatusBadge`, `LoadingState`, `ErrorState`, `Button`, `Card`)
- ✅ Design tokens documented (`tailwind.config.js`)
- ✅ Project constraints clarified (no new deps, use design tokens)

---

## Execution Order (Recommended)

1. **P1-2** (timestamps) — Foundation for other metrics, no dependencies
2. **P1-3** (visual hierarchy) — Extends Metric component built in P1-2
3. **P1-1** (status badges) — Independent, high visual impact
4. **P1-4** (connection badge) — Similar pattern to P1-1
5. **P2-2** (shared components) — Quick win, improves consistency
6. **P2-3** (metric context) — Extends Metric component
7. **P2-1** (vault badges) — WebSocket-specific, isolated
8. **P2-4** (Card hierarchy) — Final polish, may require style adjustments

**Estimated effort**: 2-3 hours for all P1 tasks, +1 hour for P2 tasks.

---

**Plan ready for execution.** All tasks are surgical, minimal-risk changes that preserve existing functionality while addressing critique findings.
