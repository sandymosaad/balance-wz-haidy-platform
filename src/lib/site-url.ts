export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  function normalizeAbsoluteUrl(value: string): string | null {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    try {
      return new URL(withProtocol).toString().replace(/\/$/, '');
    } catch {
      return null;
    }
  }

  if (configuredUrl) {
    const normalizedConfiguredUrl = normalizeAbsoluteUrl(configuredUrl);

    if (normalizedConfiguredUrl) {
      return normalizedConfiguredUrl;
    }
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    const normalizedVercelUrl = normalizeAbsoluteUrl(vercelUrl);

    if (normalizedVercelUrl) {
      return normalizedVercelUrl;
    }
  }

  return 'http://localhost:3000';
}