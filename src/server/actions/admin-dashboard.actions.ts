'use server';

import {db} from '@/lib/db';
import {mapToApiError, successResponse} from '@/lib/api-response';
import {requireAdminOrRedirect} from '@/server/actions/admin.actions';

export async function getDashboardStatsAction() {
  await requireAdminOrRedirect();
  try {
    const [totalPlaylists, totalVideos, publishedVideos, aggregateViews] = await Promise.all([
      db.playlist.count(),
      db.video.count(),
      db.video.count({where: {isPublished: true}}),
      db.video.aggregate({
        _sum: {
          viewCount: true
        }
      })
    ]);

    return successResponse({
      totalPlaylists,
      totalVideos,
      publishedVideos,
      totalViews: aggregateViews._sum.viewCount ?? 0
    });
  } catch (error) {
    return mapToApiError(error);
  }
}

export async function getRecentActivityAction(limit = 10) {
  await requireAdminOrRedirect();
  try {
    const [videos, playlists] = await Promise.all([
      db.video.findMany({
        take: limit,
        orderBy: {createdAt: 'desc'},
        select: {
          id: true,
          title: true,
          createdAt: true,
          isPublished: true
        }
      }),
      db.playlist.findMany({
        take: limit,
        orderBy: {createdAt: 'desc'},
        select: {
          id: true,
          title: true,
          createdAt: true,
          isPublished: true
        }
      })
    ]);

    const items = [
      ...videos.map((video) => ({...video, type: 'Video' as const})),
      ...playlists.map((playlist) => ({...playlist, type: 'Playlist' as const}))
    ]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, limit);

    return successResponse(items);
  } catch (error) {
    return mapToApiError(error);
  }
}
