import type {ContentType, Platform, UserRole} from '@prisma/client';
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

export interface Video {
  id: ID;
  title: string;
  slug: string;
  description: string | null;
  videoUrl: string;
  platform: Platform;
  videoId: string;
  thumbnailUrl: string | null;
  duration: number | null;
  playlistId: ID;
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
