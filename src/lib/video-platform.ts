import type {VideoPlatform} from '@prisma/client';

export type VideoSourceMetadata = {
  platform: VideoPlatform;
  externalId: string | null;
  thumbnailUrl: string | null;
};

const SUPPORTED_PLATFORM_MESSAGE = 'Supported: YouTube, Instagram, TikTok, Facebook.';

const YOUTUBE_REGEXES = [
  /(?:youtube\.com\/watch\?v=)([\w-]{6,})/i,
  /(?:youtu\.be\/)([\w-]{6,})/i,
  /(?:youtube\.com\/shorts\/)([\w-]{6,})/i,
  /(?:youtube\.com\/embed\/)([\w-]{6,})/i
];

const INSTAGRAM_REGEXES = [
  /instagram\.com\/(?:reel|p|tv)\/([\w-]+)/i,
  /instagram\.com\/stories\/[^/]+\/(\d+)/i
];

const TIKTOK_REGEXES = [
  /tiktok\.com\/@[^/]+\/video\/(\d+)/i,
  /tiktok\.com\/v\/(\d+)/i,
  /tiktok\.com\/t\/([^/?#]+)/i
];

const FACEBOOK_REGEXES = [
  /facebook\.com\/watch\/?\?v=(\d+)/i,
  /facebook\.com\/video\.php\?v=(\d+)/i,
  /facebook\.com\/(?:reel|reels)\/(\d+)/i,
  /facebook\.com\/[^/]+\/videos\/(\d+)/i,
  /fb\.watch\/([^/?#]+)/i
];

function parseUrl(url: string): URL {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`Invalid URL protocol. ${SUPPORTED_PLATFORM_MESSAGE}`);
  }
  return parsed;
}

function normalizeHost(hostname: string) {
  return hostname.replace(/^www\./i, '').replace(/^m\./i, '').toLowerCase();
}

export function detectPlatform(url: string): VideoPlatform {
  const parsed = parseUrl(url);
  const host = normalizeHost(parsed.hostname);

  if (host === 'fb.watch' || host.endsWith('facebook.com')) {
    return 'FACEBOOK';
  }

  if (host === 'youtu.be' || host.includes('youtube.com')) {
    return 'YOUTUBE';
  }

  if (host.endsWith('instagram.com')) {
    return 'INSTAGRAM';
  }

  if (host.endsWith('tiktok.com')) {
    return 'TIKTOK';
  }

  throw new Error(`Unsupported video platform. ${SUPPORTED_PLATFORM_MESSAGE}`);
}

function matchFirst(regexes: RegExp[], value: string) {
  for (const regex of regexes) {
    const match = value.match(regex);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

export function extractExternalId(url: string, platform: VideoPlatform): string | null {
  const parsed = parseUrl(url);

  if (platform === 'YOUTUBE') {
    return matchFirst(YOUTUBE_REGEXES, parsed.toString());
  }

  if (platform === 'INSTAGRAM') {
    return matchFirst(INSTAGRAM_REGEXES, parsed.toString());
  }

  if (platform === 'TIKTOK') {
    return matchFirst(TIKTOK_REGEXES, parsed.toString());
  }

  if (platform === 'FACEBOOK') {
    return (
      parsed.searchParams.get('v') ??
      parsed.searchParams.get('video_id') ??
      parsed.searchParams.get('story_fbid') ??
      matchFirst(FACEBOOK_REGEXES, parsed.toString())
    );
  }

  return null;
}

export function getThumbnailUrl(platform: VideoPlatform, externalId: string | null): string | null {
  if (platform === 'YOUTUBE' && externalId) {
    return `https://img.youtube.com/vi/${externalId}/hqdefault.jpg`;
  }

  return null;
}

export function getPlatformLabel(platform: VideoPlatform): string {
  switch (platform) {
    case 'YOUTUBE':
      return 'YouTube';
    case 'INSTAGRAM':
      return 'Instagram';
    case 'TIKTOK':
      return 'TikTok';
    case 'FACEBOOK':
      return 'Facebook';
  }
}

export function isEmbeddablePlatform(platform: VideoPlatform): boolean {
  return platform === 'YOUTUBE';
}

export function getEmbedUrl(platform: VideoPlatform, externalId: string | null): string | null {
  if (platform !== 'YOUTUBE' || !externalId) {
    return null;
  }

  return `https://www.youtube.com/embed/${externalId}`;
}

export function isValidVideoUrl(url: string): boolean {
  try {
    detectPlatform(url);
    return true;
  } catch {
    return false;
  }
}

export async function extractVideoMetadata(url: string): Promise<VideoSourceMetadata> {
  const platform = detectPlatform(url);
  const externalId = extractExternalId(url, platform);
  const thumbnailUrl = getThumbnailUrl(platform, externalId);

  return {
    platform,
    externalId,
    thumbnailUrl
  };
}
