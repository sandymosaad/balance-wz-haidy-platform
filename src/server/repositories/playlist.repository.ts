import type {Prisma} from '@prisma/client';
import {db} from '@/lib/db';
import {ServerActionError} from '@/lib/api-response';
import type {
  PlaylistCreateInput,
  PlaylistFilterInput,
  PlaylistUpdateInput
} from '@/lib/validation';

function getPlaylistSort(sort: PlaylistFilterInput['sort']): Prisma.PlaylistOrderByWithRelationInput {
  switch (sort) {
    case 'OLDEST':
      return {createdAt: 'asc'};
    case 'ALPHABETICAL':
      return {title: 'asc'};
    case 'NEWEST':
    default:
      return {createdAt: 'desc'};
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

export class PlaylistRepository {
  async getAllPlaylists(filters?: PlaylistFilterInput) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.PlaylistWhereInput = {
      isPublished: filters?.is_published ?? true,
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
      db.playlist.findMany({
        where,
        orderBy: getPlaylistSort(filters?.sort ?? 'NEWEST'),
        skip,
        take: limit,
        include: {
          _count: {
            select: {videos: true}
          }
        }
      }),
      db.playlist.count({where})
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

  async getPlaylistById(id: string) {
    const playlist = await db.playlist.findUnique({
      where: {id},
      include: {
        videos: {
          orderBy: {orderIndex: 'asc'}
        }
      }
    });

    return playlist;
  }

  async getPlaylistBySlug(slug: string) {
    return db.playlist.findUnique({
      where: {slug},
      include: {
        videos: {
          where: {isPublished: true},
          orderBy: {orderIndex: 'asc'}
        }
      }
    });
  }

  async createPlaylist(data: PlaylistCreateInput) {
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);

    return db.playlist.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        coverImage: data.cover_image,
        contentType: data.content_type,
        order: data.order ?? 0,
        isPublished: data.is_published ?? false
      }
    });
  }

  async updatePlaylist(id: string, data: PlaylistUpdateInput) {
    const existing = await db.playlist.findUnique({where: {id}});
    if (!existing) throw new ServerActionError('Playlist not found.', 'NOT_FOUND');

    return db.playlist.update({
      where: {id},
      data: {
        title: data.title,
        slug: data.slug ? slugify(data.slug) : undefined,
        description: data.description,
        coverImage: data.cover_image,
        contentType: data.content_type,
        order: data.order,
        isPublished: data.is_published
      }
    });
  }

  async deletePlaylist(id: string) {
    const existing = await db.playlist.findUnique({where: {id}});
    if (!existing) throw new ServerActionError('Playlist not found.', 'NOT_FOUND');

    return db.playlist.delete({where: {id}});
  }

  async publishPlaylist(id: string) {
    return db.playlist.update({
      where: {id},
      data: {isPublished: true}
    });
  }
}

export const playlistRepository = new PlaylistRepository();
