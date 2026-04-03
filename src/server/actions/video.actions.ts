'use server';

import {
  errorResponse,
  mapToApiError,
  successResponse,
  type ApiResponse
} from '@/lib/api-response';
import {
  VideoCreateSchema,
  VideoFilterSchema,
  VideoUpdateSchema,
  type VideoCreateInput,
  type VideoFilterInput,
  type VideoUpdateInput
} from '@/lib/validation';
import {videoRepository} from '@/server/repositories/video.repository';

export async function getPublishedVideos(
  filters?: VideoFilterInput
): Promise<ApiResponse<Awaited<ReturnType<typeof videoRepository.getAllVideos>>>> {
  try {
    const parsed = filters ? VideoFilterSchema.parse(filters) : undefined;
    const data = await videoRepository.getAllVideos(parsed);
    return successResponse(data);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function getVideoDetails(slug: string) {
  try {
    const video = await videoRepository.getVideoBySlug(slug);
    if (!video) return errorResponse('Video was not found.', 'NOT_FOUND');

    const nextVideo = await videoRepository.getNextVideo(video.playlistId, video.orderIndex);
    return successResponse({video, nextVideo});
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function searchVideos(query: string) {
  try {
    const data = await videoRepository.searchVideos(query);
    return successResponse(data);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function createVideoAction(data: VideoCreateInput) {
  try {
    const parsed = VideoCreateSchema.parse(data);
    const created = await videoRepository.createVideo(parsed);
    return successResponse(created);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function updateVideoAction(id: string, data: VideoUpdateInput) {
  try {
    const parsed = VideoUpdateSchema.parse(data);
    const updated = await videoRepository.updateVideo(id, parsed);
    return successResponse(updated);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function deleteVideoAction(id: string) {
  try {
    const deleted = await videoRepository.deleteVideo(id);
    return successResponse(deleted);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function publishVideoAction(id: string) {
  try {
    const published = await videoRepository.publishVideo(id);
    return successResponse(published);
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function reorderVideosAction(playlistId: string, videoIds: string[]) {
  try {
    const reordered = await videoRepository.reorderVideosInPlaylist(playlistId, videoIds);
    return successResponse(reordered);
  } catch (error) {
    return mapToApiError(error);
  }
}
