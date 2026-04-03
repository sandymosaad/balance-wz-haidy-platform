import type {Video} from '@prisma/client';
import {Button} from '@/components/ui/Button';

type VideoPlayerProps = {
  video: Video;
  autoplay?: boolean;
  controls?: boolean;
};

function getEmbedUrl(video: Video, autoplay: boolean, controls: boolean) {
  if (video.platform === 'YOUTUBE') {
    const auto = autoplay ? '1' : '0';
    const ctrl = controls ? '1' : '0';
    return `https://www.youtube.com/embed/${video.videoId}?autoplay=${auto}&controls=${ctrl}`;
  }
  return null;
}

export function VideoPlayer({video, autoplay = false, controls = true}: VideoPlayerProps) {
  const embedUrl = getEmbedUrl(video, autoplay, controls);

  if (embedUrl) {
    return (
      <div className="overflow-hidden rounded-gentle border border-art-sage bg-black shadow-card">
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-gentle border border-art-sage bg-art-beige p-8 text-center">
      <p className="mb-4 text-art-taupe">Direct embed is limited for this platform.</p>
      <Button asChild>
        <a href={video.videoUrl} target="_blank" rel="noreferrer">Open Original Video</a>
      </Button>
    </div>
  );
}
