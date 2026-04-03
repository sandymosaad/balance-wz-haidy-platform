import type {Platform} from '@prisma/client';

export type VideoMetadata = {
  platform: Platform;
  videoId: string;
  thumbnailUrl: string;
};

const YOUTUBE_REGEXES = [
  /(?:youtube\.com\/watch\?v=)([\w-]{6,})/i,
  /(?:youtu\.be\/)([\w-]{6,})/i,
  /(?:youtube\.com\/shorts\/)([\w-]{6,})/i
];

const INSTAGRAM_REGEX = /instagram\.com\/(?:reel|p)\/([\w-]+)/i;
const TIKTOK_REGEX = /tiktok\.com\/(?:@[^/]+\/video\/|v\/)(\d+)/i;

export function detectPlatform(url: string): Platform {
  const normalized = url.toLowerCase();

  if (normalized.includes('youtube.com') || normalized.includes('youtu.be')) {
    return 'YOUTUBE';
  }
  if (normalized.includes('instagram.com')) {
    return 'INSTAGRAM';
  }
  if (normalized.includes('tiktok.com')) {
    return 'TIKTOK';
  }

  throw new Error('Unsupported video platform. Supported: YouTube, Instagram, TikTok.');
}

export function extractVideoId(url: string, platform: Platform): string {
  if (platform === 'YOUTUBE') {
    for (const regex of YOUTUBE_REGEXES) {
      const match = url.match(regex);
      if (match?.[1]) return match[1];
    }
  }

  if (platform === 'INSTAGRAM') {
    const match = url.match(INSTAGRAM_REGEX);
    if (match?.[1]) return match[1];
  }

  if (platform === 'TIKTOK') {
    const match = url.match(TIKTOK_REGEX);
    if (match?.[1]) return match[1];
  }

  throw new Error('Could not extract video identifier from URL.');
}

export function getThumbnailUrl(platform: Platform, videoId: string): string {
  if (platform === 'YOUTUBE') {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  if (platform === 'INSTAGRAM') {
    // Placeholder strategy for public metadata-limited platforms.
    return `https://www.instagram.com/p/${videoId}/media/?size=l`;
  }

  return `https://placehold.co/1280x720/E8DCC8/5A5047?text=TikTok+Video+${videoId}`;
}

export function isValidVideoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol)) return false;
    detectPlatform(url);
    return true;
  } catch {
    return false;
  }
}

export async function extractVideoMetadata(url: string): Promise<VideoMetadata> {
  const platform = detectPlatform(url);
  const videoId = extractVideoId(url, platform);
  const thumbnailUrl = getThumbnailUrl(platform, videoId);

  return {
    platform,
    videoId,
    thumbnailUrl
  };
}
