import type {PropsWithChildren} from 'react';
import {cn} from '@/lib/utils';

type CardProps = PropsWithChildren<{
  className?: string;
  hover?: boolean;
}>;

export function Card({children, className, hover = false}: CardProps) {
  return (
    <article
      className={cn(
        'rounded-gentle border border-art-sage bg-art-beige p-6 shadow-soft transition-all duration-calm md:p-7',
        hover && 'hover:-translate-y-1 hover:shadow-hover',
        className
      )}
    >
      {children}
    </article>
  );
}
