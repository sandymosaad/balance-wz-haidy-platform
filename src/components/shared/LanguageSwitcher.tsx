'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {Button} from '@/components/ui/Button';
import {localeCookieName} from '@/i18n.config';

type LanguageSwitcherProps = {
  currentLocale?: 'en' | 'ar';
};

export function LanguageSwitcher({currentLocale}: LanguageSwitcherProps) {
  const detectedLocale = useLocale() as 'en' | 'ar';
  const locale = currentLocale ?? detectedLocale;
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === 'en' ? 'ar' : 'en';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
        router.replace(pathname, {locale: nextLocale});
      }}
      aria-label="Switch language"
    >
      {locale === 'en' ? 'العربية' : 'EN'}
    </Button>
  );
}
