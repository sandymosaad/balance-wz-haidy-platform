'use client';

import Image from 'next/image';
import type {Playlist} from '@prisma/client';
import {useTranslations} from 'next-intl';
import {Card} from '@/components/ui/Card';
import {Badge} from '@/components/ui/Badge';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Link} from '@/i18n/navigation';
import {normalizeImageSrc} from '@/lib/images';

type PlaylistCardProps = {
  playlist: Playlist;
  videoCount: number;
  href: string;
};

export function PlaylistCard({playlist, videoCount, href}: PlaylistCardProps) {
  const t = useTranslations('playlists');
  const coverSrc = normalizeImageSrc(playlist.coverImage, '/images/playlist-placeholder.svg');

  return (
    <Card hover className="group h-full overflow-hidden border-art-sage/70 bg-gradient-to-br from-art-beige via-art-cream to-art-beige/80 shadow-soft">
      <Link
        href={href}
        className="flex h-full flex-col rounded-gentle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-art-terracotta/70 focus-visible:ring-offset-2"
        aria-label={playlist.title}
      >
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-art-sage/40 bg-art-sage/25">
          <Image
            src={coverSrc}
            alt={playlist.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-calm group-hover:scale-[1.02]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 px-1 pt-4">
          <Badge variant="secondary" className="w-fit border-art-sage/60 bg-art-cream/70 text-art-taupe">
            {t('videoCount', {count: videoCount})}
          </Badge>
          <Heading level={3} className="mb-0 line-clamp-2 text-art-charcoal">{playlist.title}</Heading>
          {playlist.description ? <Text className="line-clamp-2 text-art-taupe">{playlist.description}</Text> : null}
        </div>
      </Link>
    </Card>
  );
}
