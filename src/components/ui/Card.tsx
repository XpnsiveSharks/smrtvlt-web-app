import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-app-border/60 bg-gradient-to-br from-app-surface to-app-surface-2/50 p-6 shadow-lg shadow-app-shadow/20 backdrop-blur-sm ${className ?? ''}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}
