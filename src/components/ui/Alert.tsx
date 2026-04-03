'use client';

import type {ReactNode} from 'react';
import {Info, TriangleAlert, CircleAlert, CircleCheck, X} from 'lucide-react';
import {cn} from '@/lib/utils';

type AlertProps = {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose?: () => void;
  icon?: ReactNode;
};

const styles = {
  success: 'border-art-green bg-art-green/15 text-art-charcoal',
  error: 'border-red-400 bg-red-50 text-red-700',
  warning: 'border-art-gold bg-art-gold/15 text-art-charcoal',
  info: 'border-art-lavender bg-art-lavender/15 text-art-charcoal'
} as const;

const icons = {
  success: CircleCheck,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info
} as const;

export function Alert({type, title, message, onClose, icon}: AlertProps) {
  const Icon = icons[type];

  return (
    <div className={cn('rounded-gentle border p-4 shadow-soft animate-fadeIn', styles[type])} role="alert">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon ?? <Icon className="h-4 w-4" />}</div>
        <div className="flex-1">
          <h4 className="font-semibold">{title}</h4>
          <p className="mt-1 text-sm leading-calm">{message}</p>
        </div>
        {onClose ? (
          <button className="rounded-md p-1 hover:bg-black/5" aria-label="Close alert" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
