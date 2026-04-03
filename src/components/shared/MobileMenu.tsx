'use client';

import {X} from 'lucide-react';
import {useLocale} from 'next-intl';
import {Button} from '@/components/ui/Button';
import {NavigationMenu} from '@/components/shared/NavigationMenu';
import {useLockBodyScroll} from '@/hooks/use-lock-body-scroll';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({open, onClose}: MobileMenuProps) {
  const locale = useLocale();
  useLockBodyScroll(open);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-art-charcoal/40 lg:hidden" onClick={onClose}>
      <aside
        className={
          'absolute top-0 h-full w-72 bg-art-cream p-6 shadow-hover ' +
          (locale === 'ar' ? 'left-0' : 'right-0')
        }
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close menu">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <NavigationMenu vertical onNavigate={onClose} />
      </aside>
    </div>
  );
}
