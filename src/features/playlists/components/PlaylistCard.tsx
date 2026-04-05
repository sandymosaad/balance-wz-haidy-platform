import Image from 'next/image';
import type {Playlist} from '@prisma/client';
import {Card} from '@/components/ui/Card';
import {Badge} from '@/components/ui/Badge';
import {Button} from '@/components/ui/Button';
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
  const coverSrc = normalizeImageSrc(playlist.coverImage, '/images/playlist-placeholder.svg');

  return (
    <Card hover className="h-full">
      <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-art-sage/25">
        <Image
          src={coverSrc}
          alt={playlist.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <Badge variant="secondary" className="mb-3">{videoCount} videos</Badge>
      <Heading level={3} className="line-clamp-2">{playlist.title}</Heading>
      <Text className="line-clamp-2">{playlist.description ?? ''}</Text>
      <div className="mt-5">
        <Button asChild variant="outline" size="sm">
          <Link href={href}>View Playlist</Link>
        </Button>
      </div>
    </Card>
  );
}
