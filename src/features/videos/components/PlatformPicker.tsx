'use client';

import type {VideoPlatform} from '@prisma/client';
import {cn} from '@/lib/utils';
import {getPlatformLabel} from '@/lib/video-platform';
import {PlatformIcon} from '@/features/videos/components/PlatformIcon';

type SourceOption = {
  platform: VideoPlatform;
  isPrimary?: boolean;
};

type PlatformPickerProps = {
  sources: SourceOption[];
  value: VideoPlatform;
  onChange: (platform: VideoPlatform) => void;
  label?: string;
  className?: string;
};

export function PlatformPicker({sources, value, onChange, label = 'Select a platform to watch', className}: PlatformPickerProps) {
  if (!sources.length) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-sm font-medium text-art-charcoal">{label}</p>
      <div className="flex flex-wrap gap-2">
        {sources.map((source) => {
          const selected = source.platform === value;
          const platformLabel = getPlatformLabel(source.platform);

          return (
            <button
              key={source.platform}
              type="button"
              onClick={() => onChange(source.platform)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-art-gold',
                selected
                  ? 'border-art-terracotta bg-art-terracotta text-art-cream shadow-card'
                  : 'border-art-sage bg-white text-art-charcoal hover:bg-art-beige'
              )}
              aria-pressed={selected}
              aria-label={`${selected ? 'Selected' : 'Choose'} ${platformLabel}`}
            >
              <PlatformIcon platform={source.platform} label={platformLabel} compact showLabel />
              {source.isPrimary ? <span className="text-xs uppercase tracking-[0.2em] opacity-80">Primary</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}