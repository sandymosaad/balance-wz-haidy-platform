'use client';

import {useEffect, useMemo, useState} from 'react';
import {X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/Input';
import {Select} from '@/components/ui/Select';
import {useDebounce} from '@/hooks/use-debounce';
import {useLockBodyScroll} from '@/hooks/use-lock-body-scroll';
import {cn} from '@/lib/utils';
import {parseVideoQueryState, type VideosSearchParams} from '@/features/videos/lib/query';

type PlaylistOption = {
  id: string;
  title: string;
};

type SelectOption = {
  label: string;
  value: string;
};

type VideosFiltersDrawerProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  locale: string;
  searchParams: VideosSearchParams;
  playlists: PlaylistOption[];
  sortOptions: SelectOption[];
  platformOptions: SelectOption[];
  onUpdate: (updates: Record<string, string | string[] | undefined>) => void;
  onClearAll: () => void;
};

export function VideosFiltersDrawer({
  id,
  open,
  onClose,
  locale,
  searchParams,
  playlists,
  sortOptions,
  platformOptions,
  onUpdate,
  onClearAll
}: VideosFiltersDrawerProps) {
  const t = useTranslations('phase3.videos');
  const tCommon = useTranslations('common');
  const state = useMemo(() => parseVideoQueryState(searchParams), [searchParams]);
  const [isVisible, setIsVisible] = useState(open);
  const [tagInput, setTagInput] = useState(state.tags.join(', '));
  const debouncedTags = useDebounce(tagInput, 300);

  useLockBodyScroll(open);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      return;
    }

    const timer = window.setTimeout(() => setIsVisible(false), 180);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setTagInput(state.tags.join(', '));
  }, [state.tags]);

  useEffect(() => {
    const parsedTags = debouncedTags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const normalized = Array.from(new Set(parsedTags));
    const current = state.tags;

    if (normalized.length === current.length && normalized.every((tag, index) => tag === current[index])) {
      return;
    }

    onUpdate({tags: normalized.length ? normalized : undefined});
  }, [debouncedTags, onUpdate, state.tags]);

  if (!isVisible) {
    return null;
  }

  const slideFromEnd = locale === 'ar' ? 'left' : 'right';
  const panelPosition = slideFromEnd === 'left' ? 'left-0' : 'right-0';
  const closedTransform = slideFromEnd === 'left' ? '-translate-x-full' : 'translate-x-full';

  return (
    <div className="fixed inset-0 z-40 xl:hidden" id={id} role="dialog" aria-modal="true" aria-label={t('drawer.title')}>
      <button
        type="button"
        className={cn('absolute inset-0 bg-art-charcoal/35 transition-opacity', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
        aria-label={tCommon('close')}
      />

      <aside
        className={cn(
          'absolute top-0 h-full w-[min(100vw,28rem)] border-y border-art-sage bg-art-cream shadow-2xl transition-transform duration-300 ease-out',
          panelPosition,
          open ? 'translate-x-0' : closedTransform,
          slideFromEnd === 'left' ? 'border-r' : 'border-l'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between border-b border-art-sage/50 p-6">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl text-art-charcoal">{t('drawer.title')}</h2>
              <p className="text-sm leading-calm text-art-taupe">{t('drawer.description')}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label={tCommon('close')}>
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            <Select
              label={t('toolbar.sortLabel')}
              options={sortOptions}
              value={state.sort}
              onChange={(value) => onUpdate({sort: value || undefined})}
              placeholder={t('toolbar.sortPlaceholder')}
              isRtl={locale === 'ar'}
            />

            <Select
              label={t('toolbar.platformLabel')}
              options={platformOptions}
              value={state.platform}
              onChange={(value) => onUpdate({platform: value || undefined})}
              placeholder={t('toolbar.allPlatforms')}
              isRtl={locale === 'ar'}
            />

            <Select
              label={t('toolbar.playlistLabel')}
              options={playlists.map((playlist) => ({label: playlist.title, value: playlist.id}))}
              value={state.playlist}
              onChange={(value) => onUpdate({playlist: value || undefined})}
              placeholder={t('toolbar.allPlaylists')}
              isRtl={locale === 'ar'}
            />

            <Input
              label={t('toolbar.tagsLabel')}
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              placeholder={t('toolbar.tagsPlaceholder')}
              helperText={t('toolbar.tagsHelper')}
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-art-sage/50 p-6">
            <Button type="button" variant="ghost" onClick={onClearAll} disabled={!state.search && !state.platform && !state.playlist && !state.tags.length && state.sort === 'NEWEST'}>
              {t('toolbar.clearAll')}
            </Button>
            <Button type="button" variant="primary" onClick={onClose}>
              {tCommon('close')}
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
