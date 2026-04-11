'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/Button';
import {Badge} from '@/components/ui/Badge';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {cn} from '@/lib/utils';

type VideosPageHeaderProps = {
  locale: string;
  totalItems: number;
  page: number;
  totalPages: number;
  className?: string;
};

export function VideosPageHeader({locale, totalItems, page, totalPages, className}: VideosPageHeaderProps) {
  const t = useTranslations('phase3.videos');
  const tNavigation = useTranslations('navigation');
  const tCommon = useTranslations('common');

  return (
    <header
      className={cn(
        'relative overflow-hidden rounded-[2rem] border border-art-sage/60 bg-gradient-to-br from-art-cream via-art-beige to-art-sage/15 p-6 shadow-soft md:p-8',
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(205,163,122,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(166,186,167,0.18),transparent_45%)]"
      />

      <div className="relative space-y-7">
        <nav aria-label="Breadcrumb" className="text-sm text-art-clay">
          <ol className={cn('flex flex-wrap items-center gap-2', locale === 'ar' && 'justify-start')}>
            <li>
              <Link href="/" className="transition-colors hover:text-art-terracotta">
                {tNavigation('home')}
              </Link>
            </li>
            <li aria-hidden className="text-art-sage">
              /
            </li>
            <li aria-current="page" className="text-art-taupe">
              {t('breadcrumb.videos')}
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl space-y-4">
          <Heading level={1} className="mb-0 text-4xl leading-tight text-art-charcoal sm:text-5xl lg:text-6xl">
            {t('title')}
          </Heading>
          <div className="max-w-2xl space-y-1.5 text-art-taupe sm:space-y-2">
            <Text className="text-sm leading-relaxed sm:text-base">{t('descriptionLine1')}</Text>
            <Text className="text-sm leading-relaxed sm:text-base">{t('descriptionLine2')}</Text>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3" aria-label={t('resultsCount', {count: totalItems})}>
          <Badge variant="secondary" className="bg-art-cream/80 text-art-taupe">
            {t('resultsCount', {count: totalItems})}
          </Badge>
          <Badge variant="primary" className="bg-art-terracotta/15 text-art-terracotta">
            {t('pagination.pageOf', {current: page, total: totalPages})}
          </Badge>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/playlists">{tCommon('allPlaylists')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
