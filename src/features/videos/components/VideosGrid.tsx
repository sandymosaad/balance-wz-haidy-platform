'use client';

import type {Video} from '@/types';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Button} from '@/components/ui/Button';
import {Card} from '@/components/ui/Card';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {VideoGrid} from '@/features/videos/components/VideoGrid';

type VideoGridItem = Omit<Video, 'playlist'> & {
  playlist?: {
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
  } | null;
};

type VideosGridProps = {
  videos: VideoGridItem[];
  loading?: boolean;
  error?: string | null;
  hasActiveFilters: boolean;
  resetHref: {pathname: string; query?: Record<string, string | string[]>};
  homeHref: string;
};

export function VideosGrid({videos, loading, error, hasActiveFilters, resetHref, homeHref}: VideosGridProps) {
  const t = useTranslations('phase3.videos');

  if (loading) {
    return <VideoGrid videos={[]} loading />;
  }

  if (error) {
    return <VideoGrid videos={[]} error={error} errorTitle={t('errorTitle')} />;
  }

  if (!videos.length) {
    return (
      <Card className="relative overflow-hidden border-art-sage/60 bg-gradient-to-br from-art-cream to-art-beige/80 p-8 md:p-10">
        <div className="max-w-2xl space-y-5">
          <Heading level={2} className="mb-0 text-3xl text-art-charcoal">
            {hasActiveFilters ? t('emptyState.filteredTitle') : t('emptyState.title')}
          </Heading>
          <Text className="max-w-xl text-art-taupe">
            {hasActiveFilters ? t('emptyState.filteredDescription') : t('emptyState.description')}
          </Text>

          <div className="flex flex-wrap gap-3 pt-2">
            {hasActiveFilters ? (
              <Button asChild variant="primary">
                <Link href={resetHref}>{t('emptyState.resetFilters')}</Link>
              </Button>
            ) : null}
            <Button asChild variant={hasActiveFilters ? 'outline' : 'primary'}>
              <Link href={homeHref}>{t('emptyState.goHome')}</Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return <VideoGrid videos={videos} />;
}
