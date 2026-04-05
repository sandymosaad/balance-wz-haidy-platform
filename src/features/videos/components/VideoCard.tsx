import Image from 'next/image';
import type {Video} from '@/types';
import {Card} from '@/components/ui/Card';
import {Badge} from '@/components/ui/Badge';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Link} from '@/i18n/navigation';
import {PlatformIcon} from '@/features/videos/components/PlatformIcon';

type VideoCardProps = {
  video: Video;
  playlistSlug: string;
};

export function VideoCard({video, playlistSlug}: VideoCardProps) {
  const playlistPath = playlistSlug ?? video.playlist?.slug ?? 'videos';
  const sources = video.sources.filter((source, index, self) => self.findIndex((item) => item.platform === source.platform) === index);

  return (
    <Card hover className="group h-full">
      <Link href={`/videos/${playlistPath}/${video.slug}`} className="block">
        <div className="relative mb-4 aspect-video overflow-hidden rounded-xl bg-art-sage/25">
          <Image
            src={video.thumbnailUrl ?? 'https://placehold.co/800x450/E8DCC8/5A5047?text=Video'}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-calm group-hover:scale-[1.02]"
          />
          <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2">
            {sources.map((source) => (
              <PlatformIcon
                key={source.platform}
                platform={source.platform}
                label={source.platform}
                compact
                className="border-white/20 bg-black/55 text-white backdrop-blur"
              />
            ))}
          </div>
        </div>
        <Badge variant="primary" className="mb-3">{video.playlist?.title ?? 'Video'}</Badge>
        <Heading level={4} className="line-clamp-2">{video.title}</Heading>
        {video.duration ? <Text variant="small">{Math.floor(video.duration / 60)}m {video.duration % 60}s</Text> : null}
      </Link>
    </Card>
  );
}
