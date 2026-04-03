'use client';

import {useMemo, useState} from 'react';
import type {Playlist} from '@prisma/client';

export function usePlaylists(initialPlaylists: Playlist[]) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');

  const playlists = useMemo(() => {
    return initialPlaylists.filter((playlist) => {
      const matchQuery = !query || playlist.title.toLowerCase().includes(query.toLowerCase());
      const matchStatus =
        status === 'all' || (status === 'published' ? playlist.isPublished : !playlist.isPublished);
      return matchQuery && matchStatus;
    });
  }, [initialPlaylists, query, status]);

  return {playlists, query, setQuery, status, setStatus};
}
