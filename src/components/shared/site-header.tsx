import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {AppLocale} from '@/i18n/routing';

type SiteHeaderProps = {
  locale: AppLocale;
};

export async function SiteHeader({locale}: SiteHeaderProps) {
  const t = await getTranslations({locale, namespace: 'navigation'});

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-art-cream/85 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
        <Link className="font-serif text-xl tracking-calm text-art-charcoal" href="/">
          Art Therapy Coaching
        </Link>
        <nav className="flex items-center gap-5 text-sm text-art-taupe">
          <Link className="transition-all duration-calm hover:text-art-terracotta" href="/about">
            {t('about')}
          </Link>
          <Link className="transition-all duration-calm hover:text-art-terracotta" href="/services">
            {t('services')}
          </Link>
          <Link className="transition-all duration-calm hover:text-art-terracotta" href="/videos">
            {t('videos')}
          </Link>
          <Link
            className="rounded-full border border-art-sage px-4 py-2 transition-all duration-calm hover:border-art-gold hover:bg-art-beige"
            href="/contact"
          >
            {t('contact')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
