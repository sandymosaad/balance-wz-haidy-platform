'use client';

import {useEffect, useState} from 'react';
import type {Playlist} from '@/types';
import {getPlaylists} from '@/features/playlists/services/playlist-service';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlaylists()
      .then(setPlaylists)
      .finally(() => setLoading(false));
  }, []);

  return {playlists, loading};
}
