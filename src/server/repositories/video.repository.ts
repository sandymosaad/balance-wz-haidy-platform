import type {Prisma, VideoPlatform} from '@prisma/client';
import {db} from '@/lib/db';
import {ServerActionError} from '@/lib/api-response';
import {detectPlatform, extractExternalId, getThumbnailUrl} from '@/lib/video-platform';
import type {VideoCreateInput, VideoFilterInput, VideoUpdateInput, VideoSourceInput} from '@/lib/validation';

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

type NormalizedSource = {
  platform: VideoPlatform;
  url: string;
  externalId: string | null;
  isPrimary: boolean;
};

function normalizeSources(sources: VideoSourceInput[]): NormalizedSource[] {
  return sources.map((source) => {
    const platform = source.platform ?? detectPlatform(source.url);
    return {
      platform,
      url: source.url,
      externalId: extractExternalId(source.url, platform),
      isPrimary: Boolean(source.isPrimary)
    };
  });
}

function ensureSinglePrimary(sources: NormalizedSource[]): NormalizedSource[] {
  if (!sources.length) {
    return sources;
  }

  const primaryIndex = sources.findIndex((source) => source.isPrimary);
  const effectivePrimaryIndex = primaryIndex >= 0 ? primaryIndex : 0;

  return sources.map((source, index) => ({
    ...source,
    isPrimary: index === effectivePrimaryIndex
  }));
}

function resolveThumbnailUrl(sources: NormalizedSource[], providedThumbnailUrl?: string | null) {
  if (providedThumbnailUrl) {
    return providedThumbnailUrl;
  }

  for (const source of sources) {
    const thumbnail = getThumbnailUrl(source.platform, source.externalId);
    if (thumbnail) {
      return thumbnail;
    }
  }

  return null;
}

function createVideoSourceData(sources: NormalizedSource[]) {
  return sources.map((source) => ({
    platform: source.platform,
    url: source.url,
    externalId: source.externalId,
    isPrimary: source.isPrimary
  }));
}

export class VideoRepository {
  async getAllVideos(filters?: VideoFilterInput) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.VideoWhereInput = {
      isPublished: filters?.is_published ?? true,
      ...(filters?.playlist_id ? {playlistId: filters.playlist_id} : {}),
      ...(filters?.platform ? {sources: {some: {platform: filters.platform}}} : {}),
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
              slug: true,
              coverImage: true
            }
          },
          sources: {
            orderBy: [{isPrimary: 'desc'}, {createdAt: 'asc'}]
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
        playlist: true,
        sources: {
          orderBy: [{isPrimary: 'desc'}, {createdAt: 'asc'}]
        }
      }
    });
  }

  async getVideoBySlug(slug: string) {
    return db.video.findUnique({
      where: {slug},
      include: {
        playlist: true,
        sources: {
          orderBy: [{isPrimary: 'desc'}, {createdAt: 'asc'}]
        }
      }
    });
  }

  async getVideosByPlaylist(playlistId: string) {
    return db.video.findMany({
      where: {
        playlistId,
        isPublished: true
      },
      orderBy: {orderIndex: 'asc'},
      include: {
        playlist: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true
          }
        },
        sources: {
          orderBy: [{isPrimary: 'desc'}, {createdAt: 'asc'}]
        }
      }
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

    const slug = data.slug ? slugify(data.slug) : slugify(data.title);
    const sources = ensureSinglePrimary(normalizeSources(data.sources));
    const thumbnailUrl = resolveThumbnailUrl(sources, data.thumbnail_url);

    return db.video.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        thumbnailUrl,
        duration: data.duration,
        playlistId: data.playlist_id,
        tags: data.tags,
        orderIndex: data.order_index ?? 0,
        isPublished: data.is_published ?? false,
        sources: {
          create: createVideoSourceData(sources)
        }
      },
      include: {
        playlist: true,
        sources: {
          orderBy: [{isPrimary: 'desc'}, {createdAt: 'asc'}]
        }
      }
    });
  }

  async updateVideo(id: string, data: VideoUpdateInput) {
    const current = await db.video.findUnique({where: {id}});
    if (!current) throw new ServerActionError('Video not found.', 'NOT_FOUND');

    const sources = data.sources ? ensureSinglePrimary(normalizeSources(data.sources)) : null;
    const thumbnailUrl = sources ? resolveThumbnailUrl(sources, data.thumbnail_url) : data.thumbnail_url ?? current.thumbnailUrl;

    return db.$transaction(async (tx) => {
      const updated = await tx.video.update({
        where: {id},
        data: {
          title: data.title,
          slug: data.slug ? slugify(data.slug) : undefined,
          description: data.description,
          thumbnailUrl,
          duration: data.duration,
          playlistId: data.playlist_id,
          tags: data.tags,
          orderIndex: data.order_index,
          isPublished: data.is_published
        },
        include: {
          playlist: true,
          sources: true
        }
      });

      if (sources) {
        await tx.videoSource.deleteMany({where: {videoId: id}});
        await tx.videoSource.createMany({
          data: createVideoSourceData(sources).map((source) => ({
            videoId: id,
            platform: source.platform,
            url: source.url,
            externalId: source.externalId,
            isPrimary: source.isPrimary
          }))
        });
      }

      return tx.video.findUnique({
        where: {id},
        include: {
          playlist: true,
          sources: {
            orderBy: [{isPrimary: 'desc'}, {createdAt: 'asc'}]
          }
        }
      }) ?? updated;
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
