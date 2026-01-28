import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'neutral' | 'success' | 'warning' | 'danger' | 'muted';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  pill?: boolean;
}

const styles: Record<Variant, string> = {
  neutral: 'bg-zinc-800 text-zinc-300 border border-white/10',
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
  muted: 'bg-zinc-900 text-zinc-500 border border-zinc-800',
};

export const Badge = ({ variant = 'neutral', pill = true, className, children, ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 font-semibold text-xs px-2 py-1 border',
      pill ? 'rounded-full' : 'rounded-md',
      styles[variant],
      className,
    )}
    {...props}
  >
    {children}
  </span>
);
