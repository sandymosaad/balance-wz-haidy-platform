'use client';

import {useMemo, useState} from 'react';
import {usePathname} from 'next/navigation';
import {AdminSidebar} from '@/components/admin/AdminSidebar';
import {AdminHeader} from '@/components/admin/AdminHeader';
import {AdminMobileMenu} from '@/components/admin/AdminMobileMenu';

type AdminLayoutShellProps = {
  children: React.ReactNode;
  email?: string;
};

export function AdminLayoutShell({children, email}: AdminLayoutShellProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();

  const title = useMemo(() => {
    if (pathname.includes('/videos')) return 'Videos';
    if (pathname.includes('/playlists')) return 'Playlists';
    return 'Dashboard';
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-art-cream">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      <AdminMobileMenu open={openMenu} onClose={() => setOpenMenu(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader title={title} email={email} onOpenMenu={() => setOpenMenu(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
