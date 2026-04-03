'use client';

import {Menu, UserCircle2} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {Breadcrumb} from '@/components/admin/Breadcrumb';

type AdminHeaderProps = {
  title: string;
  email?: string;
  onOpenMenu: () => void;
};

export function AdminHeader({title, email, onOpenMenu}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-art-sage bg-art-cream/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="md:hidden" onClick={onOpenMenu} aria-label="Open menu">
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <p className="font-serif text-xl text-art-charcoal">{title}</p>
            <Breadcrumb items={[{label: 'Admin', href: '/admin/dashboard'}, {label: title}]} />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-art-taupe">
          <UserCircle2 className="h-5 w-5" />
          <span className="hidden sm:inline">{email ?? 'admin@local'}</span>
        </div>
      </div>
    </header>
  );
}
