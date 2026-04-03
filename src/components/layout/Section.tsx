import type {PropsWithChildren} from 'react';
import {cn} from '@/lib/utils';

type SectionProps = PropsWithChildren<{
  className?: string;
  background?: 'cream' | 'beige' | 'white' | 'transparent';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  spacing?: boolean;
}>;

const backgroundMap = {
  cream: 'bg-art-cream',
  beige: 'bg-art-beige/60',
  white: 'bg-white/60',
  transparent: 'bg-transparent'
} as const;

const paddingMap = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24'
} as const;

export function Section({
  children,
  className,
  background = 'transparent',
  padding = 'lg',
  spacing = true
}: SectionProps) {
  return (
    <section className={cn(backgroundMap[background], spacing ? paddingMap[padding] : '', className)}>
      {children}
    </section>
  );
}
