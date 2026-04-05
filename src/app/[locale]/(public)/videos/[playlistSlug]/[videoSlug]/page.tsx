import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations} from 'next-intl/server';
import Image from 'next/image';
import {Container} from '@/components/ui/Container';
import {Section} from '@/components/layout/Section';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Badge} from '@/components/ui/Badge';
import {Button} from '@/components/ui/Button';
import {VideoPlayer} from '@/features/videos/components/VideoPlayer';
import {Link} from '@/i18n/navigation';
import {normalizeImageSrc} from '@/lib/images';
import {getPlaylistDetails} from '@/server/actions/playlist.actions';
import {getVideoDetails} from '@/server/actions/video.actions';
import type {Video} from '@/types';

export const dynamic = 'force-dynamic';

type NextVideo = {
  slug: string;
};

type VideoDetailsPayload = {
  video: Video;
  nextVideo: NextVideo | null;
};

export async function generateMetadata({
  params
}: {
  params: {locale: string; playlistSlug: string; videoSlug: string};
}): Promise<Metadata> {
  const response = await getVideoDetails(params.videoSlug);
  if (!response.success || !response.data) return {title: 'Video'};
  return {
    title: `${response.data.video.title} | Video`,
    description: response.data.video.description ?? 'Art therapy video content'
  };
}

export default async function VideoDetailPage({
  params
}: {
  params: {locale: string; playlistSlug: string; videoSlug: string};
}) {
  const t = await getTranslations({locale: params.locale, namespace: 'phase3.videoDetail'});
  const videoResponse = await getVideoDetails(params.videoSlug);

  if (!videoResponse.success || !videoResponse.data) notFound();

  const {video, nextVideo} = videoResponse.data as unknown as VideoDetailsPayload;
  const playlistResponse = await getPlaylistDetails(params.playlistSlug);
  const playlist = playlistResponse.success ? playlistResponse.data : null;
  const playlistCoverSrc = normalizeImageSrc(
    (playlist as {coverImage?: string | null; cover_image?: string | null} | null)?.coverImage ??
      (playlist as {coverImage?: string | null; cover_image?: string | null} | null)?.cover_image,
    '/images/playlist-placeholder.svg'
  );

  return (
    <Section>
      <Container className="space-y-8">
        <div className="text-sm text-art-clay">
          <Link href="/">{t('breadcrumb.home')}</Link> / <Link href="/videos">{t('breadcrumb.videos')}</Link> /{' '}
          <Link href={`/videos/${params.playlistSlug}`}>{playlist?.title ?? params.playlistSlug}</Link>
        </div>

   
        <div className="overflow-hidden rounded-gentle border border-art-sage bg-art-beige shadow-card">
          <div className="relative aspect-video">
            <Image
              src={playlistCoverSrc}
              alt={playlist?.title ?? video.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <VideoPlayer title={video.title} sources={video.sources} controls autoplay={false} />

        <div>
          <Heading level={1}>{video.title}</Heading>
          <div className="mb-3 flex flex-wrap gap-2">
            {video.duration ? <Badge variant="secondary">{Math.floor(video.duration / 60)}m</Badge> : null}
          </div>
          <Text>{video.description ?? ''}</Text>
        </div>

        <div className="flex flex-wrap gap-2">
          {video.tags.map((tag) => (
            <Badge key={tag} variant="warning">{tag}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline">
            <Link href={`/videos/${params.playlistSlug}`}>{t('backToPlaylist')}</Link>
          </Button>
          {nextVideo ? (
            <Button asChild>
              <Link href={`/videos/${params.playlistSlug}/${nextVideo.slug}`}>{t('nextVideo')}</Link>
            </Button>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
