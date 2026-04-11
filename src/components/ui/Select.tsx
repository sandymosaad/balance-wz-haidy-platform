'use client';

import {ChevronDown} from 'lucide-react';
import {cn} from '@/lib/utils';
import type {Option} from '@/types/components';

type SelectProps = {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isRtl?: boolean;
};

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  disabled,
  className,
  isRtl = false
}: SelectProps) {
  return (
    <div className="space-y-2">
      {label ? <label className="block text-sm font-medium text-art-charcoal">{label}</label> : null}
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className={cn(
            'w-full appearance-none rounded-2xl border border-art-sage bg-art-beige px-4 py-3 text-art-taupe outline-none transition-all duration-calm focus:border-art-terracotta focus:ring-2 focus:ring-art-gold/40 disabled:opacity-60',
            isRtl ? 'pl-10 pr-4' : 'pr-10 pl-4',
            className
          )}
          aria-label={label ?? placeholder}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={cn('pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-art-clay', isRtl ? 'left-3' : 'right-3')} />
      </div>
    </div>
  );
}
