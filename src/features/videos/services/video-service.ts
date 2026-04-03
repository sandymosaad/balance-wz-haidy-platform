import type {Video} from '@/types';
import {fetchJson} from '@/lib/http';

export async function getVideos(): Promise<Video[]> {
  const response = await fetchJson<Video[]>('/api/videos', {method: 'GET'});
  return response.data ?? [];
}
