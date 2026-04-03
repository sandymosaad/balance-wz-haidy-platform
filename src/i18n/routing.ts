import {defineRouting} from 'next-intl/routing';
import {defaultLocale, locales, localePrefix, localeCookieName} from '@/i18n.config';

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix,
  localeDetection: false,
  localeCookie: {
    name: localeCookieName,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  }
});

export type AppLocale = (typeof routing.locales)[number];
