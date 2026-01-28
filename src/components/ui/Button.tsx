import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'outline' | 'danger' | 'ghost' | 'subtle';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary text-sm',
  outline: 'btn-outline text-sm',
  danger: 'btn-danger text-sm',
  ghost: 'btn-ghost text-sm hover:text-white',
  subtle: 'bg-zinc-900/60 border border-white/5 text-zinc-300',
};

const sizeClass: Record<Size, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, leftIcon, rightIcon, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn('btn-base', variantClass[variant], sizeClass[size], className)}
      {...props}
    >
      {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex items-center">{rightIcon}</span>}
    </button>
  ),
);

Button.displayName = 'Button';
