import type {Metadata} from 'next';
import {Container} from '@/components/ui/Container';
import {Section} from '@/components/layout/Section';
import {VideosPageHeader} from '@/features/videos/components/VideosPageHeader';
import {VideosToolbar} from '@/features/videos/components/VideosToolbar';
import {VideosGrid} from '@/features/videos/components/VideosGrid';
import {Pagination} from '@/features/videos/components/Pagination';
import {getPublishedVideos} from '@/server/actions/video.actions';
import {getPublishedPlaylists} from '@/server/actions/playlist.actions';
import type {VideoFilterInput} from '@/lib/validation';
import {
  buildVideoQuery,
  getSingleValue,
  hasActiveVideoFilters,
  parsePageParam,
  parsePlatformParam,
  parsePlaylistParam,
  parseSortParam,
  parseTagsParam,
  type VideosSearchParams
} from '@/features/videos/lib/query';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 8;

export const metadata: Metadata = {
  title: 'Video Library | Art Therapy & Wellness',
  description: 'Browse educational videos on art therapy, personal growth, and creative wellness.'
};

export default async function VideosPage({
  params,
  searchParams
}: {
  params: {locale: string};
  searchParams: VideosSearchParams;
}) {
  const pageState = {
    page: parsePageParam(getSingleValue(searchParams.page)),
    search: getSingleValue(searchParams.search)?.trim() ?? '',
    sort: parseSortParam(getSingleValue(searchParams.sort)),
    platform: parsePlatformParam(getSingleValue(searchParams.platform)),
    playlist: parsePlaylistParam(getSingleValue(searchParams.playlist)?.trim()),
    tags: parseTagsParam(searchParams.tags)
  };

  const videoFilters: VideoFilterInput = {
    page: pageState.page,
    limit: PAGE_SIZE,
    sort: pageState.sort,
    ...(pageState.search ? {search: pageState.search} : {}),
    ...(pageState.platform ? {platform: pageState.platform} : {}),
    ...(pageState.playlist ? {playlist_id: pageState.playlist} : {}),
    ...(pageState.tags.length ? {tags: pageState.tags} : {})
  };

  const videosResponse = await getPublishedVideos(videoFilters);
  const playlistsResponse = await getPublishedPlaylists({limit: 40, page: 1, sort: 'ALPHABETICAL'});

  const videos = videosResponse.success ? videosResponse.data?.items ?? [] : [];
  const playlists = playlistsResponse.success ? playlistsResponse.data?.items ?? [] : [];
  const pagination = videosResponse.success
    ? (videosResponse.data?.pagination ?? {
        page: pageState.page,
        pageSize: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      })
    : {
        page: pageState.page,
        pageSize: PAGE_SIZE,
        totalItems: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      };
  const hasActiveFilters = hasActiveVideoFilters(pageState);
  const resetQuery = buildVideoQuery(searchParams, {
    page: '1',
    search: undefined,
    platform: undefined,
    playlist: undefined,
    tags: undefined,
    sort: undefined
  });

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
      <Container className="space-y-10 pb-20 pt-2">
        <VideosPageHeader
          locale={params.locale}
          totalItems={pagination.totalItems}
          page={pagination.page}
          totalPages={pagination.totalPages}
        />

        <VideosToolbar
          locale={params.locale}
          searchParams={searchParams}
          playlists={playlists.map((playlist) => ({id: playlist.id, title: playlist.title}))}
          resultCount={pagination.totalItems}
          page={pagination.page}
          totalPages={pagination.totalPages}
        />

        <section aria-label="Videos results">
          <VideosGrid
            videos={videosWithCovers}
            loading={false}
            error={videosResponse.success ? null : videosResponse.error?.message ?? null}
            hasActiveFilters={hasActiveFilters}
            resetHref={{pathname: '/videos', query: resetQuery}}
            homeHref="/"
          />
        </section>

        <Pagination
          locale={params.locale}
          searchParams={searchParams}
          page={pagination.page}
          totalPages={pagination.totalPages}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
        />
      </Container>
    </Section>
  );
}
