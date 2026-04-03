import type {PropsWithChildren} from 'react';
import {cn} from '@/lib/utils';

type BadgeProps = PropsWithChildren<{
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
}>;

const variants = {
  primary: 'bg-art-terracotta/15 text-art-terracotta border-art-terracotta/30',
  secondary: 'bg-art-sage/25 text-art-taupe border-art-sage/50',
  success: 'bg-art-green/20 text-art-charcoal border-art-green/50',
  warning: 'bg-art-gold/25 text-art-charcoal border-art-gold/50'
} as const;

export function Badge({variant = 'secondary', className, children}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
