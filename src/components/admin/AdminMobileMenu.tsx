'use client';

import {X} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {AdminSidebar} from '@/components/admin/AdminSidebar';

type AdminMobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminMobileMenu({open, onClose}: AdminMobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-art-charcoal/30 md:hidden" onClick={onClose}>
      <div className="absolute left-0 top-0 h-full w-80" onClick={(event) => event.stopPropagation()}>
        <div className="absolute right-3 top-3 z-10">
          <Button variant="ghost" size="sm" aria-label="Close menu" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <AdminSidebar onNavigate={onClose} />
      </div>
    </div>
  );
}
