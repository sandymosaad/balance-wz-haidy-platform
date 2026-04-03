'use client';

import {useMemo, useState} from 'react';
import type {Video} from '@prisma/client';

export function useVideos(initialVideos: Video[]) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');

  const videos = useMemo(() => {
    return initialVideos.filter((video) => {
      const matchQuery = !query || video.title.toLowerCase().includes(query.toLowerCase());
      const matchStatus =
        status === 'all' || (status === 'published' ? video.isPublished : !video.isPublished);
      return matchQuery && matchStatus;
    });
  }, [initialVideos, query, status]);

  return {videos, query, setQuery, status, setStatus};
}
