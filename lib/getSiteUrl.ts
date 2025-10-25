const DEFAULT_SITE_URL = 'http://localhost:3000';

/**
 * Resolve the canonical site URL regardless of whether we're on the client or
 * rendering on the server. Supabase requires an absolute redirect when sending
 * magic links, so we centralise that logic here rather than hard-coding the
 * window origin inside components.
 */
export function getSiteUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

  if (!envUrl) {
    return DEFAULT_SITE_URL;
  }

  if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
    return envUrl;
  }

  return `https://${envUrl}`;
}

