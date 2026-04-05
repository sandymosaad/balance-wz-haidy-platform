"use client";

import {useEffect, useMemo, useState} from 'react';
import {ExternalLink} from 'lucide-react';
import {useTranslations} from 'next-intl';
import type {VideoPlatform} from '@prisma/client';
import type {VideoSource} from '@/types';
import {Button} from '@/components/ui/Button';
import {getEmbedUrl, getPlatformLabel, isEmbeddablePlatform} from '@/lib/video-platform';
import {PlatformPicker} from '@/features/videos/components/PlatformPicker';

type VideoPlayerProps = {
  title: string;
  sources: VideoSource[];
  autoplay?: boolean;
  controls?: boolean;
};

export function VideoPlayer({title, sources, autoplay = false, controls = true}: VideoPlayerProps) {
  const t = useTranslations('phase3.videoDetail');
  const primarySource = useMemo(() => sources.find((source) => source.isPrimary) ?? sources[0] ?? null, [sources]);
  const [selectedPlatform, setSelectedPlatform] = useState<VideoPlatform>(
    primarySource?.platform ?? sources[0]?.platform ?? 'YOUTUBE'
  );

  useEffect(() => {
    const fallback = primarySource?.platform ?? sources[0]?.platform;
    if (fallback) {
      setSelectedPlatform(fallback);
    }
  }, [primarySource?.platform, sources]);

  const selectedSource = sources.find((source) => source.platform === selectedPlatform) ?? primarySource;
  const embedUrl = selectedSource ? getEmbedUrl(selectedSource.platform, selectedSource.externalId) : null;
  const watchLabel = selectedSource ? t(`openOn.${selectedSource.platform.toLowerCase()}`) : t('selectPlatform');

  if (!selectedSource) {
    return (
      <div className="rounded-gentle border border-art-sage bg-art-beige p-8 text-center">
        <p className="text-art-taupe">{t('selectPlatform')}</p>
      </div>
    );
  }

  const embedWithParams = embedUrl
    ? `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=${autoplay ? '1' : '0'}&controls=${controls ? '1' : '0'}`
    : null;

  return (
    <div className="space-y-4">
      <PlatformPicker
        sources={sources.map((source) => ({platform: source.platform, isPrimary: source.isPrimary}))}
        value={selectedPlatform}
        onChange={setSelectedPlatform}
        label={t('selectPlatform')}
      />

      {embedWithParams && isEmbeddablePlatform(selectedSource.platform) ? (
        <div className="overflow-hidden rounded-gentle border border-art-sage bg-black shadow-card">
          <div className="aspect-video">
            <iframe
              src={embedWithParams}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-gentle border border-art-sage bg-art-beige p-8 text-center">
          <p className="mb-4 text-art-taupe">
            {selectedSource.platform === 'FACEBOOK'
              ? 'Facebook embeds are limited. Open the original post for the best experience.'
              : `${getPlatformLabel(selectedSource.platform)} embed is limited. Open the original post to watch.`}
          </p>
          <Button asChild>
            <a href={selectedSource.url} target="_blank" rel="noreferrer" aria-label={watchLabel}>
              <ExternalLink className="mr-2 h-4 w-4" />
              {watchLabel}
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
