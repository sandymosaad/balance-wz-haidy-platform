import Image from 'next/image';
import type {Video} from '@/types';
import {Card} from '@/components/ui/Card';
import {Badge} from '@/components/ui/Badge';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Link} from '@/i18n/navigation';
import {isRenderableImageSrc, normalizeImageSrc} from '@/lib/images';

type VideoCardItem = Omit<Video, 'playlist'> & {
  playlist?: {
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
  } | null;
};

type VideoCardProps = {
  video: VideoCardItem;
  playlistSlug: string;
};

export function VideoCard({video, playlistSlug}: VideoCardProps) {
  const playlistPath = playlistSlug ?? video.playlist?.slug ?? 'videos';
  const playlistCover = isRenderableImageSrc(video.playlist?.coverImage) ? video.playlist?.coverImage : null;
  const cardImageSrc = normalizeImageSrc(playlistCover, '/images/playlist-placeholder.svg');

  return (
    <Card hover className="group relative h-full overflow-hidden border-art-sage/70 bg-art-beige/95 shadow-soft">
      {playlistCover ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={playlistCover}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-10 blur-sm"
          />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-art-beige/70" aria-hidden />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-art-cream/80 via-art-beige/75 to-art-beige/90" aria-hidden />

      <Link
        href={`/videos/${playlistPath}/${video.slug}`}
        className="relative block rounded-gentle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-art-terracotta/70 focus-visible:ring-offset-2"
      >
        <div className="relative mb-4 aspect-video overflow-hidden rounded-xl border border-art-sage/40 bg-art-sage/20 shadow-sm">
          <Image
            src={cardImageSrc}
            alt={video.playlist?.title ?? video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-calm group-hover:scale-[1.02]"
          />
        </div>
        {video.playlist?.title ? <Badge variant="primary" className="mb-3">{video.playlist.title}</Badge> : null}
        <Heading level={4} className="line-clamp-2">{video.title}</Heading>
        {video.duration ? <Text variant="small">{Math.floor(video.duration / 60)}m {video.duration % 60}s</Text> : null}
      </Link>
    </Card>
  );
}
