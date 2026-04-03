'use client';

import {useEffect, useState} from 'react';
import type {Video} from '@/types';
import {getVideos} from '@/features/videos/services/video-service';

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .finally(() => setLoading(false));
  }, []);

  return {videos, loading};
}
