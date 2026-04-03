'use client';

import {forwardRef} from 'react';
import {cn} from '@/lib/utils';

type InputProps = {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({label, helperText, error, className, id, ...props}, ref) => {
    const inputId = id ?? `input-${props.name ?? Math.random().toString(36).slice(2)}`;
    const describedBy = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className="space-y-2">
        {label ? (
          <label className="block text-sm font-medium text-art-charcoal" htmlFor={inputId}>
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'w-full rounded-2xl border bg-art-beige px-4 py-3 text-art-taupe outline-none transition-all duration-calm placeholder:text-art-clay focus:border-art-terracotta focus:ring-2 focus:ring-art-gold/40',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {helperText ? (
          <p id={describedBy} className={cn('text-xs', error ? 'text-red-600' : 'text-art-clay')}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';
