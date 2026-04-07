import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Section} from '@/components/layout/Section';
import {Button} from '@/components/ui/Button';
import {VideosLibrary} from '@/features/videos/components/VideosLibrary';
import {Link} from '@/i18n/navigation';
import {getPublishedVideos} from '@/server/actions/video.actions';
import {getPublishedPlaylists} from '@/server/actions/playlist.actions';
import type {VideoFilterInput} from '@/lib/validation';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 8;

type VideosPageSearchParams = Record<string, string | string[] | undefined>;

function getSingleValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parsePage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? '1', 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function parseSort(value: string | undefined): VideoFilterInput['sort'] {
  if (value === 'OLDEST' || value === 'ALPHABETICAL' || value === 'TRENDING' || value === 'NEWEST') {
    return value;
  }

  return 'NEWEST';
}

function parsePlatform(value: string | undefined): VideoFilterInput['platform'] {
  if (value === 'YOUTUBE' || value === 'INSTAGRAM' || value === 'TIKTOK' || value === 'FACEBOOK') {
    return value;
  }

  return undefined;
}

function parsePlaylistId(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(value)) {
    return undefined;
  }

  return value;
}

function parseTags(value: string | string[] | undefined): string[] | undefined {
  if (!value) {
    return undefined;
  }

  const rawValues = Array.isArray(value) ? value : [value];
  const normalized = rawValues
    .flatMap((item) => item.split(','))
    .map((item) => item.trim())
    .filter(Boolean);

  if (!normalized.length) {
    return undefined;
  }

  return Array.from(new Set(normalized));
}

function createPageQuery(searchParams: VideosPageSearchParams, page: number): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'page' || typeof value === 'undefined') {
      continue;
    }

    if (Array.isArray(value)) {
      query[key] = value;
      continue;
    }

    query[key] = value;
  }

  query.page = String(page);

  return query;
}

export const metadata: Metadata = {
  title: 'Video Library | Art Therapy & Wellness',
  description: 'Browse educational videos on art therapy, personal growth, and creative wellness.'
};

export default async function VideosPage({
  params,
  searchParams
}: {
  params: {locale: string};
  searchParams: VideosPageSearchParams;
}) {
  const t = await getTranslations({locale: params.locale, namespace: 'phase3.videos'});
  const tCommon = await getTranslations({locale: params.locale, namespace: 'common'});

  const page = parsePage(getSingleValue(searchParams.page));
  const search = getSingleValue(searchParams.search)?.trim();
  const playlist = parsePlaylistId(getSingleValue(searchParams.playlist)?.trim());
  const sort = parseSort(getSingleValue(searchParams.sort));
  const platform = parsePlatform(getSingleValue(searchParams.platform));
  const tags = parseTags(searchParams.tags);

  const videoFilters: VideoFilterInput = {
    page,
    limit: PAGE_SIZE,
    sort,
    ...(search ? {search} : {}),
    ...(platform ? {platform} : {}),
    ...(playlist ? {playlist_id: playlist} : {}),
    ...(tags ? {tags} : {})
  };

  const videosResponse = await getPublishedVideos(videoFilters);
  const playlistsResponse = await getPublishedPlaylists({limit: 40, page: 1, sort: 'ALPHABETICAL'});

  const videos = videosResponse.success ? videosResponse.data?.items ?? [] : [];
  const playlists = playlistsResponse.success ? playlistsResponse.data?.items ?? [] : [];
  const pagination = videosResponse.success
    ? (videosResponse.data?.pagination ?? {
        page,
        pageSize: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      })
    : {
        page,
        pageSize: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      };
  const prevQuery = createPageQuery(searchParams, Math.max(1, pagination.page - 1));
  const nextQuery = createPageQuery(searchParams, Math.min(pagination.totalPages, pagination.page + 1));

  const coverByPlaylistId = new Map(playlists.map((playlist) => [playlist.id, playlist.coverImage]));
  const videosWithCovers = videos.map((video) => ({
    ...video,
    playlist: video.playlist
      ? {
          ...video.playlist,
          coverImage: video.playlist.coverImage ?? coverByPlaylistId.get(video.playlistId) ?? null
        }
      : video.playlist
  }));

  return (
    <Section>
      <Container className="space-y-8">
        <div>
          <Heading level={1}>{t('title')}</Heading>
          <Text>{t('subtitle')}</Text>
        </div>

        <VideosLibrary
          videos={videosWithCovers}
          error={videosResponse.success ? null : videosResponse.error?.message ?? 'Could not load videos.'}
          dictionary={{
            emptyState: t('emptyState'),
            errorTitle: 'Error'
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-art-sage/50 pt-6">
          {pagination.hasPrev ? (
            <Button asChild variant="outline">
              <Link href={{pathname: '/videos', query: prevQuery}}>{tCommon('previous')}</Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              {tCommon('previous')}
            </Button>
          )}

          <Text className="font-medium text-art-taupe">
            {t('pagination.pageOf', {current: pagination.page, total: pagination.totalPages})}
          </Text>

          {pagination.hasNext ? (
            <Button asChild variant="outline">
              <Link href={{pathname: '/videos', query: nextQuery}}>{tCommon('next')}</Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              {tCommon('next')}
            </Button>
          )}
        </div>
      </Container>
    </Section>
  );
}
