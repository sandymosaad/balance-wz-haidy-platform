'use client';

import {useMemo} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/Button';
import {cn} from '@/lib/utils';
import {buildVideoQuery, type VideosSearchParams} from '@/features/videos/lib/query';

type PaginationProps = {
  locale: string;
  searchParams: VideosSearchParams;
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

type PageItem = number | 'ellipsis';

function buildPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({length: totalPages}, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) {
    items.push('ellipsis');
  }

  for (let current = start; current <= end; current += 1) {
    items.push(current);
  }

  if (end < totalPages - 1) {
    items.push('ellipsis');
  }

  items.push(totalPages);
  return items;
}

function buildPageQuery(searchParams: VideosSearchParams, page: number) {
  return buildVideoQuery(searchParams, {page: String(page)});
}

export function Pagination({locale, searchParams, page, totalPages, hasPrev, hasNext}: PaginationProps) {
  const t = useTranslations('phase3.videos');
  const tCommon = useTranslations('common');
  const items = useMemo(() => buildPageItems(page, totalPages), [page, totalPages]);

  return (
    <nav aria-label={t('pagination.ariaLabel')} className="rounded-[1.5rem] border border-art-sage/60 bg-art-cream/90 px-4 py-4 shadow-soft md:px-6">
      <div className={cn('flex flex-col gap-4 md:flex-row md:items-center md:justify-between', locale === 'ar' && 'md:flex-row-reverse')}>
        <div className="flex items-center justify-between gap-3 md:justify-start">
          {hasPrev ? (
            <Button asChild variant="outline" className="rounded-full">
              <Link href={{pathname: '/videos', query: buildPageQuery(searchParams, page - 1)}}>{tCommon('previous')}</Link>
            </Button>
          ) : (
            <Button variant="outline" disabled className="rounded-full">
              {tCommon('previous')}
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {items.map((item, index) => {
            if (item === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-sm text-art-clay" aria-hidden>
                  …
                </span>
              );
            }

            const active = item === page;
            return active ? (
              <Button key={item} variant="primary" className="h-10 min-w-10 rounded-full px-3" disabled aria-current="page">
                {item}
              </Button>
            ) : (
              <Button key={item} asChild variant="ghost" className="h-10 min-w-10 rounded-full px-3">
                <Link href={{pathname: '/videos', query: buildPageQuery(searchParams, item)}} aria-label={t('pagination.goToPage', {page: item})}>
                  {item}
                </Link>
              </Button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end">
          {hasNext ? (
            <Button asChild variant="outline" className="rounded-full">
              <Link href={{pathname: '/videos', query: buildPageQuery(searchParams, page + 1)}}>{tCommon('next')}</Link>
            </Button>
          ) : (
            <Button variant="outline" disabled className="rounded-full">
              {tCommon('next')}
            </Button>
          )}
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-art-clay">{t('pagination.pageOf', {current: page, total: totalPages})}</p>
    </nav>
  );
}
