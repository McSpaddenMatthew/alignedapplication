import type { NextRouter } from 'next/router';

const allowedRedirectHosts = (process.env.NEXT_PUBLIC_ALLOWED_REDIRECT_HOSTS || '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

const canonicalMagicLinkTarget = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL;

const isHttpsProtocol = (url: URL) => url.protocol === 'https:' || url.protocol === 'http:';

const hostMatchesAllowedList = (host: string) => {
  if (!allowedRedirectHosts.length) {
    return true;
  }

  return allowedRedirectHosts.some((allowedHost) => {
    if (allowedHost.startsWith('*.')) {
      const suffix = allowedHost.slice(1); // remove leading *
      return host === allowedHost.slice(2) || host.endsWith(suffix);
    }

    return host === allowedHost;
  });
};

export const extractRedirectOrigin = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  try {
    const url = new URL(window.location.href);
    const originParam = url.searchParams.get('redirect_origin');

    if (!originParam) return undefined;

    const parsedOrigin = new URL(originParam);

    if (!isHttpsProtocol(parsedOrigin)) return undefined;

    if (!hostMatchesAllowedList(parsedOrigin.host)) return undefined;

    return parsedOrigin.origin;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Invalid redirect_origin parameter, ignoring.', error);
    return undefined;
  }
};

export const buildDashboardRedirectUrl = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  const redirectOrigin = extractRedirectOrigin();
  const originToUse = redirectOrigin || window.location.origin;

  try {
    const url = new URL('/dashboard', originToUse);
    return url.toString();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to build dashboard redirect URL', error);
    return undefined;
  }
};

export const performDashboardRedirect = async (
  router: NextRouter,
  dashboardUrl?: string,
): Promise<void> => {
  if (typeof window === 'undefined') {
    if (router.pathname !== '/dashboard') {
      await router.replace('/dashboard');
    }
    return;
  }

  const targetUrl = dashboardUrl || buildDashboardRedirectUrl();

  if (!targetUrl) return;

  const sameOriginTarget = targetUrl.startsWith(`${window.location.origin}/`);

  if (sameOriginTarget) {
    if (router.pathname !== '/dashboard') {
      try {
        await router.replace('/dashboard');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Next router failed to redirect to dashboard', error);
      }
    }

    if (window.location.pathname !== '/dashboard') {
      window.location.assign(targetUrl);
    }
    return;
  }

  if (window.location.href !== targetUrl) {
    window.location.assign(targetUrl);
  }
};

export const buildMagicLinkRedirectUrl = (): string | undefined => {
  if (typeof window === 'undefined') return canonicalMagicLinkTarget;

  const currentHref = window.location.href;
  let canonicalUrl: URL | undefined;

  if (canonicalMagicLinkTarget) {
    try {
      canonicalUrl = new URL(canonicalMagicLinkTarget);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Invalid NEXT_PUBLIC_SUPABASE_REDIRECT_URL, ignoring canonical target', error);
    }
  }

  let targetUrl: URL | undefined;

  try {
    const currentUrl = new URL(currentHref);

    if (canonicalUrl) {
      targetUrl = new URL(canonicalUrl.toString());
      targetUrl.protocol = currentUrl.protocol;
      targetUrl.host = currentUrl.host;
    } else {
      targetUrl = new URL(currentUrl.toString());
    }

    // Reset search/hash so we control the params explicitly.
    targetUrl.search = canonicalUrl?.search ?? '';
    targetUrl.hash = canonicalUrl?.hash ?? '';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to derive magic link redirect URL from current location', error);
    targetUrl = canonicalUrl;
  }

  if (!targetUrl) return undefined;

  targetUrl.searchParams.set('redirect_origin', window.location.origin);

  return targetUrl.toString();
};
