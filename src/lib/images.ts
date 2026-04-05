const BLOCKED_REMOTE_HOSTS = new Set(['placehold.co']);
const IMAGE_EXTENSION_REGEX = /\.(avif|webp|png|jpe?g|gif|svg)(?:$|[?#])/i;

function isBlockedHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return BLOCKED_REMOTE_HOSTS.has(normalized);
}

export function isRenderableImageSrc(value?: string | null): value is string {
  if (!value || typeof value !== 'string') {
    return false;
  }

  const src = value.trim();
  if (!src) {
    return false;
  }

  if (src.startsWith('/')) {
    return true;
  }

  try {
    const parsed = new URL(src);
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return false;
    }

    if (isBlockedHost(parsed.hostname)) {
      return false;
    }

    // For remote URLs, require a direct image-like asset path to avoid HTML/share pages.
    if (!IMAGE_EXTENSION_REGEX.test(parsed.pathname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function normalizeImageSrc(value: string | null | undefined, fallback: string): string {
  return isRenderableImageSrc(value) ? value : fallback;
}

export function normalizePersistedImageUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return isRenderableImageSrc(value) ? value : null;
}
