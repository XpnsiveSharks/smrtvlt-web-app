import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-app-border bg-app-surface p-6 ${className ?? ''}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}