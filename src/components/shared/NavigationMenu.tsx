'use client';

import {useLocale, useTranslations} from 'next-intl';
import {usePathname, Link} from '@/i18n/navigation';
import {NAV_ROUTES} from '@/lib/constants';
import {cn} from '@/lib/utils';

type NavigationMenuProps = {
  vertical?: boolean;
  onNavigate?: () => void;
};

export function NavigationMenu({vertical = false, onNavigate}: NavigationMenuProps) {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <nav
      className={cn(
        'flex gap-5',
        vertical ? 'flex-col items-start' : 'items-center',
        locale === 'ar' && !vertical ? 'flex-row-reverse' : ''
      )}
      aria-label="Main navigation"
    >
      {NAV_ROUTES.map((route) => {
        const active = pathname === route.href || pathname?.startsWith(`${route.href}/`);
        return (
          <Link
            key={route.key}
            href={route.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'text-sm text-art-taupe transition-all duration-calm hover:text-art-terracotta',
              active && 'text-art-terracotta underline decoration-art-terracotta underline-offset-8'
            )}
          >
            {t(route.key)}
          </Link>
        );
      })}
    </nav>
  );
}
