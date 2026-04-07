'use client';

import type {Video} from '@/types';
import {VideoGrid} from '@/features/videos/components/VideoGrid';

type VideosLibraryItem = Omit<Video, 'playlist'> & {
  playlist?: {
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
  } | null;
};

type VideosLibraryProps = {
  videos: VideosLibraryItem[];
  loading?: boolean;
  error?: string | null;
  dictionary: {
    emptyState: string;
    errorTitle: string;
  };
};

export function VideosLibrary({videos, loading, error, dictionary}: VideosLibraryProps) {
  return (
    <div className="space-y-6">
      <VideoGrid
        videos={videos}
        loading={loading}
        error={error}
        emptyTitle={dictionary.emptyState}
        emptyMessage={dictionary.emptyState}
        errorTitle={dictionary.errorTitle}
      />
    </div>
  );
}
