import type { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const SearchInput = ({ className, label, ...props }: SearchInputProps) => (
  <label className={cn('relative flex items-center', className)}>
    {label && <span className="sr-only">{label}</span>}
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
    <input
      className="glass-input w-full pl-9 pr-4 py-2 text-sm placeholder:text-zinc-500 font-medium bg-[rgba(24,24,27,0.7)]"
      {...props}
    />
  </label>
);
