import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import type { SecurityAlert } from '../../api/internal/security'

interface NotificationBellProps {
  alerts: SecurityAlert[]
}

const severityClasses: Record<SecurityAlert['severity'], string> = {
  low: 'text-blue-400',
  medium: 'text-amber-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
}

export function NotificationBell({ alerts }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const count = alerts.length

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current || containerRef.current.contains(event.target as Node)) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-app-surface-2 text-app-muted transition-all duration-300 hover:bg-white/5 hover:text-brand"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Bell className="h-4 w-4" />
      </button>
      {count === 1 && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-brand" />}
      {count >= 2 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-app-bg text-[9px] font-black">
          {count}
        </span>
      )}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-white/5 bg-app-surface shadow-2xl">
          <div className="px-4 py-3 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-app-muted">
            Notifications
          </div>
          {alerts.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-app-muted">No active alerts</div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.type}
                className="px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-app-text">{alert.type}</p>
                  <span className={`text-[10px] font-semibold uppercase ${severityClasses[alert.severity]}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-[11px] text-app-muted mt-1">{alert.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
