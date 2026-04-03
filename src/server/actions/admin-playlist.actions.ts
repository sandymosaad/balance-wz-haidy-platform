'use server';

import {
  PlaylistCreateSchema,
  PlaylistFilterSchema,
  PlaylistUpdateSchema,
  type PlaylistFilterInput
} from '@/lib/validation';
import {mapToApiError, successResponse} from '@/lib/api-response';
import {requireAdminOrRedirect} from '@/server/actions/admin.actions';
import {playlistRepository} from '@/server/repositories/playlist.repository';

export async function getAdminPlaylistsAction(filters?: PlaylistFilterInput) {
  await requireAdminOrRedirect();
  try {
    const parsed = filters ? PlaylistFilterSchema.parse(filters) : undefined;
    const data = await playlistRepository.getAllPlaylists(parsed);
    return successResponse(data);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function createPlaylistAction(data: unknown) {
  await requireAdminOrRedirect();
  try {
    const parsed = PlaylistCreateSchema.parse(data);
    const created = await playlistRepository.createPlaylist(parsed);
    return successResponse(created);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function updatePlaylistAction(id: string, data: unknown) {
  await requireAdminOrRedirect();
  try {
    const parsed = PlaylistUpdateSchema.parse(data);
    const updated = await playlistRepository.updatePlaylist(id, parsed);
    return successResponse(updated);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function deletePlaylistAction(id: string) {
  await requireAdminOrRedirect();
  try {
    const deleted = await playlistRepository.deletePlaylist(id);
    return successResponse(deleted);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function publishPlaylistAction(id: string) {
  await requireAdminOrRedirect();
  try {
    const published = await playlistRepository.publishPlaylist(id);
    return successResponse(published);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function unpublishPlaylistAction(id: string) {
  await requireAdminOrRedirect();
  try {
    const updated = await playlistRepository.updatePlaylist(id, {is_published: false});
    return successResponse(updated);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function bulkDeletePlaylistsAction(ids: string[]) {
  await requireAdminOrRedirect();
  try {
    const results = await Promise.allSettled(ids.map((id) => playlistRepository.deletePlaylist(id)));
    const successCount = results.filter((item) => item.status === 'fulfilled').length;
    const failedCount = results.length - successCount;
    return successResponse({successCount, failedCount});
  } catch (error) {
    return mapToApiError(error);
  }
}
