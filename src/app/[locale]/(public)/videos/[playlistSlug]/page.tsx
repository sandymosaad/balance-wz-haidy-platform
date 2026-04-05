import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations} from 'next-intl/server';
import {Container} from '@/components/ui/Container';
import {Section} from '@/components/layout/Section';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Button} from '@/components/ui/Button';
import {Badge} from '@/components/ui/Badge';
import {Link} from '@/i18n/navigation';
import {PlaylistCoverMini} from '@/features/videos/components/PlaylistCoverMini';
import {getPlaylistDetails} from '@/server/actions/playlist.actions';

export const dynamic = 'force-dynamic';

type PlaylistVideo = {
  id: string;
  title: string;
  slug: string;
  duration: number | null;
};

type PlaylistDetails = {
  slug: string;
  title: string;
  description: string | null;
  contentType: string;
  coverImage?: string | null;
  cover_image?: string | null;
  videos: PlaylistVideo[];
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params
}: {
  params: {locale: string; playlistSlug: string};
}): Promise<Metadata> {
  const response = await getPlaylistDetails(params.playlistSlug);
  if (!response.success || !response.data) return {title: 'Playlist'};

  return {
    title: `${response.data.title} | Playlist`,
    description: response.data.description ?? 'Art therapy playlist content'
  };
}

export default async function PlaylistDetailPage({
  params
}: {
  params: {locale: string; playlistSlug: string};
}) {
  const t = await getTranslations({locale: params.locale, namespace: 'phase3.playlist'});
  const response = await getPlaylistDetails(params.playlistSlug);

  if (!response.success || !response.data) {
    notFound();
  }

  const playlist = response.data as unknown as PlaylistDetails;
  const playlistCoverImage = playlist.coverImage ?? playlist.cover_image ?? null;

  return (
    <Section>
      <Container className="space-y-8">
        <div className="rounded-gentle border border-art-sage bg-art-beige/60 p-8">
          <Heading level={1}>{playlist.title}</Heading>
          <Text>{playlist.description ?? ''}</Text>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge>{playlist.contentType}</Badge>
            <Badge variant="secondary">{playlist.videos.length} {t('videosCount')}</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <Heading level={2}>{t('videoList')}</Heading>
          <ol className="space-y-3">
            {playlist.videos.map((video, index) => (
              <li key={video.id} className="rounded-xl border border-art-sage bg-art-cream p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <Text variant="small" color="muted">{t('videoNumber', {number: index + 1})}</Text>
                    <Heading level={4} className="mb-1">{video.title}</Heading>
                    <PlaylistCoverMini
                      coverImage={playlistCoverImage}
                      title={t('coverPlaceholderAria', {title: playlist.title})}
                      alt={t('coverAlt', {title: playlist.title})}
                    />
                    <Text variant="small">{video.duration ? `${Math.floor(video.duration / 60)}m` : t('durationUnknown')}</Text>
                  </div>
                  <Button asChild size="sm" className="self-start sm:self-auto">
                    <Link href={`/videos/${playlist.slug}/${video.slug}`}>{t('watch')}</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
