import type {ReactNode} from 'react';
import {AdminLayoutShell} from '@/components/admin/AdminLayoutShell';
import {getCurrentAdminSession} from '@/server/actions/admin.actions';

export default async function ProtectedAdminLayout({children}: {children: ReactNode}) {
  const session = await getCurrentAdminSession();

  // Route protection is handled by root middleware.
  // Keep layout non-redirecting so /admin/login does not loop.
  return <AdminLayoutShell email={session.isAdmin ? session.email : undefined}>{children}</AdminLayoutShell>;
}
