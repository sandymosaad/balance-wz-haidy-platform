import type {ContentType, UserRole, VideoPlatform} from '@prisma/client';
import type {ApiResponse as BaseApiResponse} from '@/lib/api-response';

export type ID = string;

export type Locale = 'en' | 'ar';

export interface User {
  id: ID;
  name: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: ID;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  contentType: ContentType;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoSource {
  id: ID;
  videoId: ID;
  platform: VideoPlatform;
  url: string;
  externalId: string | null;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: ID;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  playlistId: ID;
  playlist?: Playlist | null;
  sources: VideoSource[];
  orderIndex: number;
  tags: string[];
  viewCount: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

export type ApiResponse<T> = BaseApiResponse<T>;

export * from '@/types/admin';
