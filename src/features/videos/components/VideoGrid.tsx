'use client';

import type {Video} from '@/types';
import {Grid} from '@/components/layout/Grid';
import {Button} from '@/components/ui/Button';
import {Skeleton} from '@/components/ui/Skeleton';
import {Alert} from '@/components/ui/Alert';
import {VideoCard} from '@/features/videos/components/VideoCard';

type VideoGridItem = Omit<Video, 'playlist'> & {
  playlist?: {
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
  } | null;
};

type VideoGridProps = {
  videos: VideoGridItem[];
  loading?: boolean;
  error?: string | null;
  errorTitle?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  onLoadMore?: () => void;
};

export function VideoGrid({
  videos,
  loading,
  error,
  errorTitle = 'Error',
  emptyTitle = 'No videos',
  emptyMessage = 'No videos matched your filters.',
  onLoadMore
}: VideoGridProps) {
  if (loading) {
    return (
      <Grid cols={4}>
        {Array.from({length: 8}).map((_, index) => (
          <Skeleton key={index} height="240px" className="rounded-gentle" />
        ))}
      </Grid>
    );
  }

  if (error) {
    return <Alert type="error" title={errorTitle} message={error} />;
  }

  if (!videos.length) {
    return <Alert type="info" title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className="space-y-8">
      <Grid cols={4}>
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} playlistSlug={video.playlist?.slug ?? 'videos'} />
        ))}
      </Grid>
      {onLoadMore ? (
        <div className="text-center">
          <Button variant="secondary" onClick={onLoadMore}>Load More</Button>
        </div>
      ) : null}
    </div>
  );
}
