import type {SVGProps} from 'react';
import type {VideoPlatform} from '@prisma/client';
import {cn} from '@/lib/utils';
import {getPlatformLabel} from '@/lib/video-platform';

type LogoProps = SVGProps<SVGSVGElement>;

function FacebookLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.01 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.236 2.686.236v2.953H15.83c-1.49 0-1.954.931-1.954 1.887v2.253h3.328l-.532 3.49h-2.796V24C19.612 23.083 24 18.092 24 12.073z" />
    </svg>
  );
}

function InstagramLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9zm10.1 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z" />
    </svg>
  );
}

function TikTokLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.36 2h3.12c.2 1.73 1.18 3.22 2.67 4.12.94.56 2.03.87 3.15.88v3.24c-1.5-.03-2.97-.42-4.26-1.13-.47-.26-.91-.56-1.31-.9v6.72c0 1.25-.34 2.48-.99 3.55a7.05 7.05 0 0 1-2.89 2.66 7.36 7.36 0 0 1-3.47.7A7.2 7.2 0 0 1 4 20.02 6.78 6.78 0 0 1 2.3 15.4a6.86 6.86 0 0 1 2.83-5.28 7.3 7.3 0 0 1 4.41-1.3v3.21a3.66 3.66 0 0 0-2.54.86 3.46 3.46 0 0 0-1.2 2.74c0 1.07.49 2.07 1.33 2.74.52.43 1.18.67 1.86.69.58.02 1.15-.12 1.66-.4.72-.4 1.27-1.02 1.57-1.75.2-.46.31-.96.31-1.46V2z" />
    </svg>
  );
}

function YouTubeLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.5 7.2a3 3 0 0 0-2.1-2.12C19.55 4.6 12 4.6 12 4.6s-7.55 0-9.4.48A3 3 0 0 0 .5 7.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.12c1.85.48 9.4.48 9.4.48s7.55 0 9.4-.48a3 3 0 0 0 2.1-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-4.8zM9.6 15.3V8.7L15.8 12l-6.2 3.3z" />
    </svg>
  );
}

const ICONS: Record<VideoPlatform, React.ComponentType<{className?: string}>> = {
  YOUTUBE: YouTubeLogo,
  INSTAGRAM: InstagramLogo,
  TIKTOK: TikTokLogo,
  FACEBOOK: FacebookLogo
};

type PlatformIconProps = {
  platform: VideoPlatform;
  label?: string;
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
};

export function PlatformIcon({platform, label, className, showLabel = false, compact = false}: PlatformIconProps) {
  const Icon = ICONS[platform];
  const resolvedLabel = label ?? getPlatformLabel(platform);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide',
        compact ? 'px-2 py-1' : '',
        'border-art-sage bg-white/80 text-art-charcoal',
        className
      )}
      aria-label={resolvedLabel}
      title={resolvedLabel}
    >
      <Icon className={cn('h-4 w-4', compact ? 'h-3.5 w-3.5' : '')} aria-hidden />
      {showLabel ? <span>{resolvedLabel}</span> : null}
    </span>
  );
}