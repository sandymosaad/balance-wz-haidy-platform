import type {Prisma} from '@prisma/client';
import {db} from '@/lib/db';
import {ServerActionError} from '@/lib/api-response';
import {extractVideoMetadata} from '@/lib/video-platform';
import type {VideoCreateInput, VideoFilterInput, VideoUpdateInput} from '@/lib/validation';

function getVideoSort(sort: VideoFilterInput['sort']): Prisma.VideoOrderByWithRelationInput[] {
  switch (sort) {
    case 'OLDEST':
      return [{createdAt: 'asc'}];
    case 'ALPHABETICAL':
      return [{title: 'asc'}];
    case 'TRENDING':
      return [{viewCount: 'desc'}, {createdAt: 'desc'}];
    case 'NEWEST':
    default:
      return [{createdAt: 'desc'}];
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export class VideoRepository {
  async getAllVideos(filters?: VideoFilterInput) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.VideoWhereInput = {
      isPublished: filters?.is_published ?? true,
      ...(filters?.playlist_id ? {playlistId: filters.playlist_id} : {}),
      ...(filters?.platform ? {platform: filters.platform} : {}),
      ...(filters?.tags?.length ? {tags: {hasEvery: filters.tags}} : {}),
      ...(filters?.search
        ? {
            OR: [
              {title: {contains: filters.search, mode: 'insensitive'}},
              {description: {contains: filters.search, mode: 'insensitive'}}
            ]
          }
        : {})
    };

    const [items, total] = await db.$transaction([
      db.video.findMany({
        where,
        skip,
        take: limit,
        orderBy: getVideoSort(filters?.sort ?? 'NEWEST'),
        include: {
          playlist: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          }
        }
      }),
      db.video.count({where})
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        pageCount: Math.max(1, Math.ceil(total / limit))
      }
    };
  }

  async getVideoById(id: string) {
    return db.video.findUnique({
      where: {id},
      include: {
        playlist: true
      }
    });
  }

  async getVideoBySlug(slug: string) {
    return db.video.findUnique({
      where: {slug},
      include: {
        playlist: true
      }
    });
  }

  async getVideosByPlaylist(playlistId: string) {
    return db.video.findMany({
      where: {
        playlistId,
        isPublished: true
      },
      orderBy: {orderIndex: 'asc'}
    });
  }

  async getNextVideo(playlistId: string, currentOrderIndex: number) {
    return db.video.findFirst({
      where: {
        playlistId,
        orderIndex: {gt: currentOrderIndex},
        isPublished: true
      },
      orderBy: {orderIndex: 'asc'}
    });
  }

  async createVideo(data: VideoCreateInput) {
    const playlist = await db.playlist.findUnique({where: {id: data.playlist_id}});
    if (!playlist) throw new ServerActionError('Playlist does not exist.', 'PLAYLIST_NOT_FOUND');

    const metadata = await extractVideoMetadata(data.video_url);
    const finalVideoId = data.video_id ?? metadata.videoId;
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);

    return db.video.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        videoUrl: data.video_url,
        platform: data.platform ?? metadata.platform,
        videoId: finalVideoId,
        thumbnailUrl: data.thumbnail_url ?? metadata.thumbnailUrl,
        duration: data.duration,
        playlistId: data.playlist_id,
        tags: data.tags,
        orderIndex: data.order_index ?? 0,
        isPublished: data.is_published ?? false
      },
      include: {
        playlist: true
      }
    });
  }

  async updateVideo(id: string, data: VideoUpdateInput) {
    const current = await db.video.findUnique({where: {id}});
    if (!current) throw new ServerActionError('Video not found.', 'NOT_FOUND');

    let metadata:
      | {
          platform: Prisma.EnumPlatformFieldUpdateOperationsInput['set'];
          videoId: string;
          thumbnailUrl: string;
        }
      | undefined;

    if (data.video_url) {
      const extracted = await extractVideoMetadata(data.video_url);
      metadata = {
        platform: extracted.platform,
        videoId: extracted.videoId,
        thumbnailUrl: extracted.thumbnailUrl
      };
    }

    return db.video.update({
      where: {id},
      data: {
        title: data.title,
        slug: data.slug ? slugify(data.slug) : undefined,
        description: data.description,
        videoUrl: data.video_url,
        platform: data.platform ?? metadata?.platform,
        videoId: data.video_id ?? metadata?.videoId,
        thumbnailUrl: data.thumbnail_url ?? metadata?.thumbnailUrl,
        duration: data.duration,
        playlistId: data.playlist_id,
        tags: data.tags,
        orderIndex: data.order_index,
        isPublished: data.is_published
      },
      include: {
        playlist: true
      }
    });
  }

  async deleteVideo(id: string) {
    const current = await db.video.findUnique({where: {id}});
    if (!current) throw new ServerActionError('Video not found.', 'NOT_FOUND');

    return db.video.delete({where: {id}});
  }

  async publishVideo(id: string) {
    return db.video.update({
      where: {id},
      data: {isPublished: true}
    });
  }

  async reorderVideosInPlaylist(playlistId: string, videoIds: string[]) {
    const playlist = await db.playlist.findUnique({where: {id: playlistId}});
    if (!playlist) throw new ServerActionError('Playlist does not exist.', 'PLAYLIST_NOT_FOUND');

    await db.$transaction(
      videoIds.map((videoId, index) =>
        db.video.update({
          where: {id: videoId},
          data: {orderIndex: index}
        })
      )
    );

    return this.getVideosByPlaylist(playlistId);
  }

  async searchVideos(query: string) {
    if (!query.trim()) {
      return {
        items: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 20,
          pageCount: 1
        }
      };
    }

    return this.getAllVideos({search: query, page: 1, limit: 20, sort: 'NEWEST'});
  }
}

export const videoRepository = new VideoRepository();
