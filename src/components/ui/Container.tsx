import type {PropsWithChildren} from 'react';
import {cn} from '@/lib/utils';

type ContainerProps = PropsWithChildren<{
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}>;

const sizes: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-[900px]',
  lg: 'max-w-[1200px]',
  full: 'max-w-full'
};

export function Container({children, className, size = 'lg'}: ContainerProps) {
  return <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizes[size], className)}>{children}</div>;
}
