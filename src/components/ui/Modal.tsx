'use client';

import type {ReactNode} from 'react';
import {X} from 'lucide-react';
import {useLockBodyScroll} from '@/hooks/use-lock-body-scroll';
import {Button} from '@/components/ui/Button';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function Modal({isOpen, onClose, title, children, actions}: ModalProps) {
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-art-charcoal/40 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-xl rounded-gentle border border-art-sage bg-art-cream p-6 shadow-hover">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="font-serif text-2xl text-art-charcoal">{title}</h2>
          <Button variant="ghost" size="sm" aria-label="Close modal" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-art-taupe">{children}</div>
        {actions ? <div className="mt-6 flex justify-end gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
