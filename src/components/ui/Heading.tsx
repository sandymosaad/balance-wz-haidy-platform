import type {ReactNode} from 'react';
import {cn} from '@/lib/utils';

type HeadingProps = {
  level?: 1 | 2 | 3 | 4;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  children: ReactNode;
  className?: string;
  alignment?: 'left' | 'center' | 'right';
};

const styles = {
  1: 'text-4xl sm:text-5xl lg:text-6xl',
  2: 'text-3xl sm:text-4xl lg:text-5xl',
  3: 'text-2xl sm:text-3xl',
  4: 'text-xl sm:text-2xl'
} as const;

export function Heading({level = 2, as, children, className, alignment = 'left'}: HeadingProps) {
  const Tag = as ?? (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4');
  return (
    <Tag
      className={cn(
        'mb-4 font-serif leading-[1.2] text-art-taupe tracking-calm',
        styles[level],
        alignment === 'center' && 'text-center',
        alignment === 'right' && 'text-right',
        className
      )}
    >
      {children}
    </Tag>
  );
}
