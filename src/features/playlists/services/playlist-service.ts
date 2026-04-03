import type {Playlist} from '@/types';
import {fetchJson} from '@/lib/http';

export async function getPlaylists(): Promise<Playlist[]> {
  const response = await fetchJson<Playlist[]>('/api/playlists', {method: 'GET'});
  return response.data ?? [];
}
