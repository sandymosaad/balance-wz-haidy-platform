import type {PropsWithChildren} from 'react';
import {cn} from '@/lib/utils';

type GridProps = PropsWithChildren<{
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}>;

const colStyles = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
} as const;

const gapStyles = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8'
} as const;

export function Grid({children, cols = 3, gap = 'md', className}: GridProps) {
  return <div className={cn('grid', colStyles[cols], gapStyles[gap], className)}>{children}</div>;
}
