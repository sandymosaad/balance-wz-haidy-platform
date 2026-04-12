'use client';

import {useEffect, useMemo, useState} from 'react';
import {Search, X, SlidersHorizontal} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/Input';
import {Select} from '@/components/ui/Select';
import {Badge} from '@/components/ui/Badge';
import {Text} from '@/components/ui/Text';
import {useDebounce} from '@/hooks/use-debounce';
import {cn} from '@/lib/utils';
import {
  buildVideoQuery,
  hasActiveVideoFilters,
  parseVideoQueryState,
  type VideosSearchParams
} from '@/features/videos/lib/query';
import {VideosFiltersDrawer} from '@/features/videos/components/VideosFiltersDrawer';

type PlaylistOption = {
  id: string;
  title: string;
};

type VideosToolbarProps = {
  locale: string;
  searchParams: VideosSearchParams;
  playlists: PlaylistOption[];
  resultCount: number;
  page: number;
  totalPages: number;
};

export function VideosToolbar({locale, searchParams, playlists, resultCount, page, totalPages}: VideosToolbarProps) {
  const t = useTranslations('phase3.videos');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const state = useMemo(() => parseVideoQueryState(searchParams), [searchParams]);
  const [searchValue, setSearchValue] = useState(state.search);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 300);
  const active = useMemo(() => hasActiveVideoFilters(state), [state]);
  const platformOptions = useMemo(
    () => [
      {label: t('platforms.youtube'), value: 'YOUTUBE'},
      {label: t('platforms.instagram'), value: 'INSTAGRAM'},
      {label: t('platforms.tiktok'), value: 'TIKTOK'},
      {label: t('platforms.facebook'), value: 'FACEBOOK'}
    ],
    [t]
  );
  const sortOptions = useMemo(
    () => [
      {label: t('toolbar.sortOptions.newest'), value: 'NEWEST'},
      {label: t('toolbar.sortOptions.oldest'), value: 'OLDEST'},
      {label: t('toolbar.sortOptions.alphabetical'), value: 'ALPHABETICAL'},
      {label: t('toolbar.sortOptions.trending'), value: 'TRENDING'}
    ],
    [t]
  );
  const chips = useMemo(() => {
    const items: Array<{key: string; label: string; value?: string}> = [];

    if (state.search) {
      items.push({key: 'search', label: t('toolbar.chips.search'), value: state.search});
    }

    if (state.sort !== 'NEWEST') {
      items.push({
        key: 'sort',
        label: t('toolbar.chips.sort'),
        value:
          state.sort === 'OLDEST'
            ? t('toolbar.sortOptions.oldest')
            : state.sort === 'ALPHABETICAL'
              ? t('toolbar.sortOptions.alphabetical')
              : t('toolbar.sortOptions.trending')
      });
    }

    if (state.platform) {
      items.push({key: 'platform', label: t('toolbar.chips.platform'), value: t(`platforms.${state.platform.toLowerCase()}`)});
    }

    if (state.playlist) {
      items.push({
        key: 'playlist',
        label: t('toolbar.chips.playlist'),
        value: playlists.find((item) => item.id === state.playlist)?.title ?? state.playlist
      });
    }

    state.tags.forEach((tag) => {
      items.push({key: `tag-${tag}`, label: t('toolbar.chips.tag'), value: tag});
    });

    return items;
  }, [playlists, state.platform, state.playlist, state.search, state.sort, state.tags, t]);

  useEffect(() => {
    setSearchValue(state.search);
  }, [state.search]);

  useEffect(() => {
    if (debouncedSearch === state.search) {
      return;
    }

    router.replace(
      {
        pathname: '/videos',
        query: buildVideoQuery(searchParams, {
          search: debouncedSearch || undefined,
          page: '1'
        })
      },
      {scroll: false}
    );
  }, [debouncedSearch, router, searchParams, state.search]);

  function updateQuery(updates: Record<string, string | string[] | undefined>) {
    router.push(
      {
        pathname: '/videos',
        query: buildVideoQuery(searchParams, {
          page: '1',
          ...updates
        })
      },
      {scroll: false}
    );
  }

  function removeChip(key: string) {
    if (key === 'search') {
      setSearchValue('');
      updateQuery({search: undefined});
      return;
    }

    if (key === 'sort') {
      updateQuery({sort: undefined});
      return;
    }

    if (key === 'platform') {
      updateQuery({platform: undefined});
      return;
    }

    if (key === 'playlist') {
      updateQuery({playlist: undefined});
      return;
    }

    if (key.startsWith('tag-')) {
      const tag = key.slice(4);
      const remainingTags = state.tags.filter((item) => item !== tag);
      updateQuery({tags: remainingTags.length ? remainingTags : undefined});
    }
  }

  function clearAllFilters() {
    setSearchValue('');
    updateQuery({search: undefined, sort: undefined, platform: undefined, playlist: undefined, tags: undefined});
  }

  const sortDesktop = (
    <div className="min-w-52">
      <Select
        label={t('toolbar.sortLabel')}
        options={sortOptions}
        value={state.sort}
        onChange={(value) => updateQuery({sort: value || undefined})}
        placeholder={t('toolbar.sortPlaceholder')}
        isRtl={locale === 'ar'}
      />
    </div>
  );

  return (
    <section className="sticky top-4 z-20 space-y-4">
      <div className="rounded-[1.75rem] border border-art-sage/60 bg-art-cream/95 p-4 shadow-soft backdrop-blur md:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:gap-5">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-art-charcoal" htmlFor="videos-search">
              {t('toolbar.searchLabel')}
            </label>
            <div className="relative">
              <Search
                className={cn(
                  'pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-art-clay',
                  locale === 'ar' ? 'right-4' : 'left-4'
                )}
                aria-hidden
              />
              <Input
                id="videos-search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={t('toolbar.searchPlaceholder')}
                className={cn('rounded-full border-art-sage bg-art-beige/90', locale === 'ar' ? 'pl-12 pr-11' : 'pl-11 pr-12')}
                aria-label={t('toolbar.searchLabel')}
              />
              {searchValue ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue('');
                    updateQuery({search: undefined});
                  }}
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 rounded-full p-1 text-art-clay transition-colors hover:text-art-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-art-gold',
                    locale === 'ar' ? 'left-3' : 'right-3'
                  )}
                  aria-label={tCommon('clear')}
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="hidden xl:block">{sortDesktop}</div>
            <Button
              type="button"
              variant="outline"
              className="h-12 gap-2 rounded-full px-5 xl:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              aria-controls="videos-filters-drawer"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              {t('toolbar.filtersButton')}
              {active ? (
                <Badge variant="primary" className="ml-1 bg-art-terracotta/15 text-art-terracotta">
                  {chips.length}
                </Badge>
              ) : null}
            </Button>
            {active ? (
              <Button type="button" variant="ghost" className="h-12 rounded-full px-4" onClick={clearAllFilters}>
                {t('toolbar.clearAll')}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-art-sage/40 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {chips.length ? (
              chips.map((chip) => (
                <Badge key={chip.key} variant="secondary" className="gap-2 border-art-sage/50 bg-art-beige/90 text-art-taupe">
                  <span className="font-medium text-art-charcoal">{chip.label}:</span>
                  <span>{chip.value}</span>
                  <button
                    type="button"
                    onClick={() => removeChip(chip.key)}
                    className="rounded-full p-0.5 text-art-clay transition-colors hover:text-art-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-art-gold"
                    aria-label={t('toolbar.removeFilter', {label: chip.label})}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </Badge>
              ))
            ) : (
              <Text variant="small" className="text-art-clay">
                {t('toolbar.noFilters')}
              </Text>
            )}
          </div>

          <Text variant="small" className="text-art-clay">
            {t('toolbar.resultsSummary', {count: resultCount, current: page, total: totalPages})}
          </Text>
        </div>
      </div>

      <VideosFiltersDrawer
        id="videos-filters-drawer"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        locale={locale}
        searchParams={searchParams}
        playlists={playlists}
        sortOptions={sortOptions}
        platformOptions={platformOptions}
        onUpdate={updateQuery}
        onClearAll={clearAllFilters}
      />
    </section>
  );
}
