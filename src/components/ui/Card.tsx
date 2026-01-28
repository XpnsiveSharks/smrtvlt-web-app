import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  kind?: 'primary' | 'secondary';
}

export const Card = ({ kind = 'primary', className, children, ...props }: CardProps) => (
  <div className={cn(kind === 'primary' ? 'card-bento' : 'card-secondary', className)} {...props}>
    {children}
  </div>
);
