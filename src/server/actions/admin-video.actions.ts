'use server';

import {VideoSortOrderSchema, VideoCreateSchema, VideoUpdateSchema, type VideoFilterInput} from '@/lib/validation';
import {errorResponse, mapToApiError, successResponse} from '@/lib/api-response';
import {extractVideoMetadata} from '@/lib/video-platform';
import {requireAdminOrRedirect} from '@/server/actions/admin.actions';
import {videoRepository} from '@/server/repositories/video.repository';

export async function getAdminVideosAction(filters?: VideoFilterInput) {
  await requireAdminOrRedirect();
  try {
    const data = await videoRepository.getAllVideos(filters);
    return successResponse(data);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function createVideoAction(data: unknown) {
  await requireAdminOrRedirect();
  try {
    const parsed = VideoCreateSchema.parse(data);
    const enriched = await extractVideoMetadata(parsed.video_url);
    const created = await videoRepository.createVideo({
      ...parsed,
      platform: parsed.platform ?? enriched.platform,
      video_id: parsed.video_id ?? enriched.videoId,
      thumbnail_url: parsed.thumbnail_url ?? enriched.thumbnailUrl
    });
    return successResponse(created);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function updateVideoAction(id: string, data: unknown) {
  await requireAdminOrRedirect();
  try {
    const parsed = VideoUpdateSchema.parse(data);
    const updated = await videoRepository.updateVideo(id, parsed);
    return successResponse(updated);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function deleteVideoAction(id: string) {
  await requireAdminOrRedirect();
  try {
    const deleted = await videoRepository.deleteVideo(id);
    return successResponse(deleted);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function publishVideoAction(id: string) {
  await requireAdminOrRedirect();
  try {
    const published = await videoRepository.publishVideo(id);
    return successResponse(published);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function unpublishVideoAction(id: string) {
  await requireAdminOrRedirect();
  try {
    const updated = await videoRepository.updateVideo(id, {is_published: false});
    return successResponse(updated);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function bulkDeleteVideosAction(ids: string[]) {
  await requireAdminOrRedirect();
  try {
    const results = await Promise.allSettled(ids.map((id) => videoRepository.deleteVideo(id)));
    const successCount = results.filter((item) => item.status === 'fulfilled').length;
    const failedCount = results.length - successCount;
    return successResponse({successCount, failedCount});
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function reorderVideosInPlaylistAction(playlistId: string, videoIds: string[]) {
  await requireAdminOrRedirect();
  try {
    const updated = await videoRepository.reorderVideosInPlaylist(playlistId, videoIds);
    return successResponse(updated);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function getAdminVideoBySlugAction(slug: string) {
  await requireAdminOrRedirect();
  try {
    const video = await videoRepository.getVideoBySlug(slug);
    if (!video) return errorResponse('Video not found.', 'NOT_FOUND');
    return successResponse(video);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function setVideoSortAction(value: string) {
  await requireAdminOrRedirect();
  const parsed = VideoSortOrderSchema.safeParse(value);
  if (!parsed.success) {
    return errorResponse('Invalid sort value.', 'VALIDATION_ERROR');
  }
  return successResponse({sort: parsed.data});
}
