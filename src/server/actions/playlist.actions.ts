'use server';

import {
  errorResponse,
  mapToApiError,
  successResponse,
  type ApiResponse
} from '@/lib/api-response';
import {
  PlaylistCreateSchema,
  PlaylistFilterSchema,
  PlaylistUpdateSchema,
  type PlaylistCreateInput,
  type PlaylistFilterInput,
  type PlaylistUpdateInput
} from '@/lib/validation';
import {playlistRepository} from '@/server/repositories/playlist.repository';

export async function getPublishedPlaylists(
  filters?: PlaylistFilterInput
): Promise<ApiResponse<Awaited<ReturnType<typeof playlistRepository.getAllPlaylists>>>> {
  try {
    const parsed = filters ? PlaylistFilterSchema.parse(filters) : undefined;
    const data = await playlistRepository.getAllPlaylists(parsed);
    return successResponse(data);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function getPlaylistDetails(slug: string) {
  try {
    const data = await playlistRepository.getPlaylistBySlug(slug);
    if (!data) return errorResponse('Playlist was not found.', 'NOT_FOUND');
    return successResponse(data);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function createPlaylistAction(data: PlaylistCreateInput) {
  try {
    const parsed = PlaylistCreateSchema.parse(data);
    const created = await playlistRepository.createPlaylist(parsed);
    return successResponse(created);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function updatePlaylistAction(id: string, data: PlaylistUpdateInput) {
  try {
    const parsed = PlaylistUpdateSchema.parse(data);
    const updated = await playlistRepository.updatePlaylist(id, parsed);
    return successResponse(updated);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function deletePlaylistAction(id: string) {
  try {
    const deleted = await playlistRepository.deletePlaylist(id);
    return successResponse(deleted);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function publishPlaylistAction(id: string) {
  try {
    const published = await playlistRepository.publishPlaylist(id);
    return successResponse(published);
  } catch (error) {
    return mapToApiError(error);
  }
}
