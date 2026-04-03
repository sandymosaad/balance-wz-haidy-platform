import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Section} from '@/components/layout/Section';
import {VideosLibrary} from '@/features/videos/components/VideosLibrary';
import {getPublishedVideos} from '@/server/actions/video.actions';
import {getPublishedPlaylists} from '@/server/actions/playlist.actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Video Library | Art Therapy & Wellness',
  description: 'Browse educational videos on art therapy, personal growth, and creative wellness.'
};

export default async function VideosPage({params}: {params: {locale: string}}) {
  const t = await getTranslations({locale: params.locale, namespace: 'phase3.videos'});
  const videosResponse = await getPublishedVideos({limit: 40, page: 1, sort: 'NEWEST'});
  const playlistsResponse = await getPublishedPlaylists({limit: 40, page: 1, sort: 'ALPHABETICAL'});

  const videos = videosResponse.success ? videosResponse.data?.items ?? [] : [];
  const playlists = playlistsResponse.success ? playlistsResponse.data?.items ?? [] : [];

  return (
    <Section>
      <Container className="space-y-8">
        <div>
          <Heading level={1}>{t('title')}</Heading>
          <Text>{t('subtitle')}</Text>
        </div>

        <VideosLibrary
          videos={videos as never[]}
          playlists={playlists.map((item) => ({id: item.id, title: item.title, slug: item.slug}))}
          dictionary={{searchPlaceholder: t('searchPlaceholder')}}
        />
      </Container>
    </Section>
  );
}
