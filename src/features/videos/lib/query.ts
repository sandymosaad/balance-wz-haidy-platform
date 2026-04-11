import type {VideoFilterInput} from '@/lib/validation';

export type VideosSearchParams = Record<string, string | string[] | undefined>;

export type VideoLibraryQueryState = {
  page: number;
  search: string;
  sort: VideoFilterInput['sort'];
  platform?: VideoFilterInput['platform'];
  playlist?: string;
  tags: string[];
};

export type VideoLibraryQueryUpdates = Record<string, string | string[] | undefined>;

export function getSingleValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function parsePageParam(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? '1', 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

export function parseSortParam(value: string | undefined): VideoFilterInput['sort'] {
  if (value === 'OLDEST' || value === 'ALPHABETICAL' || value === 'TRENDING' || value === 'NEWEST') {
    return value;
  }

  return 'NEWEST';
}

export function parsePlatformParam(value: string | undefined): VideoFilterInput['platform'] {
  if (value === 'YOUTUBE' || value === 'INSTAGRAM' || value === 'TIKTOK' || value === 'FACEBOOK') {
    return value;
  }

  return undefined;
}

export function parsePlaylistParam(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(value)) {
    return undefined;
  }

  return value;
}

export function parseTagsParam(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }

  const rawValues = Array.isArray(value) ? value : [value];
  const normalized = rawValues
    .flatMap((item) => item.split(','))
    .map((item) => item.trim())
    .filter(Boolean);

  return Array.from(new Set(normalized));
}

export function parseVideoQueryState(searchParams: VideosSearchParams): VideoLibraryQueryState {
  return {
    page: parsePageParam(getSingleValue(searchParams.page)),
    search: getSingleValue(searchParams.search)?.trim() ?? '',
    sort: parseSortParam(getSingleValue(searchParams.sort)),
    platform: parsePlatformParam(getSingleValue(searchParams.platform)),
    playlist: parsePlaylistParam(getSingleValue(searchParams.playlist)?.trim()),
    tags: parseTagsParam(searchParams.tags)
  };
}

export function buildVideoQuery(
  searchParams: VideosSearchParams,
  updates: VideoLibraryQueryUpdates
): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'undefined' || key in updates) {
      continue;
    }

    query[key] = value;
  }

  for (const [key, value] of Object.entries(updates)) {
    if (typeof value === 'undefined') {
      continue;
    }

    query[key] = value;
  }

  return query;
}

export function hasActiveVideoFilters(state: VideoLibraryQueryState): boolean {
  return Boolean(state.search || state.platform || state.playlist || state.tags.length || state.sort !== 'NEWEST');
}
