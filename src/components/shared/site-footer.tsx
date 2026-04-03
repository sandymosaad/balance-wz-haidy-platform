import {getTranslations} from 'next-intl/server';
import type {AppLocale} from '@/i18n/routing';

type SiteFooterProps = {
  locale: AppLocale;
};

export async function SiteFooter({locale}: SiteFooterProps) {
  const t = await getTranslations({locale, namespace: 'common'});

  return (
    <footer className="border-t border-border/70 bg-art-beige/60">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-art-taupe lg:px-8">
        <p>{t('footer')}</p>
      </div>
    </footer>
  );
}
