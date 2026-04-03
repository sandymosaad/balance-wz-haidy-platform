import type {ReactNode} from 'react';
import {cn} from '@/lib/utils';

type TextProps = {
  variant?: 'body' | 'caption' | 'small' | 'large';
  color?: 'primary' | 'secondary' | 'muted';
  children: ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'div';
};

const variantStyles = {
  body: 'text-base leading-calm',
  caption: 'text-xs leading-calm uppercase tracking-[0.12em]',
  small: 'text-sm leading-calm',
  large: 'text-lg leading-calm'
} as const;

const colorStyles = {
  primary: 'text-art-taupe',
  secondary: 'text-art-charcoal',
  muted: 'text-art-clay'
} as const;

export function Text({variant = 'body', color = 'primary', children, className, as = 'p'}: TextProps) {
  const Tag = as;
  return <Tag className={cn('font-sans', variantStyles[variant], colorStyles[color], className)}>{children}</Tag>;
}
