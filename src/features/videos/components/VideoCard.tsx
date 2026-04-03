import Image from 'next/image';
import {PlayCircle} from 'lucide-react';
import type {Video} from '@prisma/client';
import {Card} from '@/components/ui/Card';
import {Badge} from '@/components/ui/Badge';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Link} from '@/i18n/navigation';

type VideoCardProps = {
  video: Video;
  playlistSlug: string;
};

export function VideoCard({video, playlistSlug}: VideoCardProps) {
  return (
    <Card hover className="group h-full">
      <Link href={`/videos/${playlistSlug}/${video.slug}`} className="block">
        <div className="relative mb-4 aspect-video overflow-hidden rounded-xl bg-art-sage/25">
          <Image
            src={video.thumbnailUrl ?? 'https://placehold.co/800x450/E8DCC8/5A5047?text=Video'}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-calm group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-calm group-hover:bg-black/15">
            <PlayCircle className="h-10 w-10 text-white opacity-0 transition-opacity duration-calm group-hover:opacity-100" />
          </div>
        </div>
        <Badge variant="primary" className="mb-3">{video.platform}</Badge>
        <Heading level={4} className="line-clamp-2">{video.title}</Heading>
        {video.duration ? <Text variant="small">{Math.floor(video.duration / 60)}m {video.duration % 60}s</Text> : null}
      </Link>
    </Card>
  );
}
