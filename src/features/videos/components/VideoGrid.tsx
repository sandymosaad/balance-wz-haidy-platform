'use client';

import type {Video} from '@prisma/client';
import {Grid} from '@/components/layout/Grid';
import {Button} from '@/components/ui/Button';
import {Skeleton} from '@/components/ui/Skeleton';
import {Alert} from '@/components/ui/Alert';
import {VideoCard} from '@/features/videos/components/VideoCard';

type VideoWithPlaylist = Video & {playlist?: {slug: string}};

type VideoGridProps = {
  videos: VideoWithPlaylist[];
  loading?: boolean;
  error?: string | null;
  onLoadMore?: () => void;
};

export function VideoGrid({videos, loading, error, onLoadMore}: VideoGridProps) {
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
    return <Alert type="error" title="Error" message={error} />;
  }

  if (!videos.length) {
    return <Alert type="info" title="No videos" message="No videos matched your filters." />;
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
