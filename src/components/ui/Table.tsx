import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export const Table = ({ className, children, ...props }: HTMLAttributes<HTMLTableElement>) => (
  <table className={cn('w-full text-left border-collapse', className)} {...props}>
    {children}
  </table>
);

export const THead = ({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('bg-zinc-900 border-b border-white/5', className)} {...props}>
    {children}
  </thead>
);

export const TBody = ({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('divide-y divide-white/5', className)} {...props}>
    {children}
  </tbody>
);

export const TH = ({ className, children, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500', className)} {...props}>
    {children}
  </th>
);

export const TD = ({ className, children, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('px-6 py-4', className)} {...props}>
    {children}
  </td>
);
