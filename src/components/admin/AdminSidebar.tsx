'use client';

import Link from 'next/link';
import {LayoutDashboard, ListVideo, LibraryBig, PlusCircle, ArrowLeftRight, LogOut} from 'lucide-react';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';

const items = [
  {label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard},
  {label: 'All Videos', href: '/admin/videos', icon: ListVideo},
  {label: 'Add Video', href: '/admin/videos/add', icon: PlusCircle},
  {label: 'All Playlists', href: '/admin/playlists', icon: LibraryBig},
  {label: 'Add Playlist', href: '/admin/playlists/add', icon: PlusCircle},
  {label: 'Reorder', href: '/admin/playlists', icon: ArrowLeftRight}
] as const;

type AdminSidebarProps = {
  onNavigate?: () => void;
};

export function AdminSidebar({onNavigate}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="h-full w-72 border-r border-art-sage bg-art-beige/60 p-5">
      <div className="mb-6">
        <p className="font-serif text-xl text-art-charcoal">Art Therapy Admin</p>
      </div>

      <nav className="space-y-2" aria-label="Admin navigation">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-art-taupe transition-all duration-calm hover:bg-art-cream',
                active && 'bg-art-cream text-art-terracotta'
              )}
              onClick={onNavigate}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-art-sage pt-4">
        <form action="/admin/login" method="get">
          <button className="flex items-center gap-2 text-sm text-art-taupe hover:text-art-terracotta" type="submit">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
