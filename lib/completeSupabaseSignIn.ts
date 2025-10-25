import { supabase } from './supabaseClient';

export const GENERIC_ERROR =
  'We could not confirm your magic link. Open the link on the same device you requested it from or ask for a fresh one.';

function parseHashParams(hash: string) {
  if (!hash) return new URLSearchParams();
  const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
  return new URLSearchParams(trimmed);
}

function cleanUrl() {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    url.hash = '';
    url.search = '';
    window.history.replaceState({}, document.title, url.toString());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Unable to clean auth callback URL', error);
  }
}

function getLoginEmail(queryParams: URLSearchParams, hashParams: URLSearchParams) {
  const queryEmail = queryParams.get('email') || hashParams.get('email');
  const redirectEmail = queryParams.get('login_email') || hashParams.get('login_email');

  if (queryEmail) return queryEmail;
  if (redirectEmail) return redirectEmail;

  const redirectTo = queryParams.get('redirect_to') || hashParams.get('redirect_to');

  if (redirectTo) {
    try {
      const redirectUrl = new URL(redirectTo, typeof window !== 'undefined' ? window.location.origin : undefined);
      const nestedParams = redirectUrl.searchParams;
      const nestedEmail = nestedParams.get('login_email') || nestedParams.get('email');
      if (nestedEmail) {
        return nestedEmail;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Unable to parse Supabase redirect_to email parameter', error);
    }
  }

  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('aligned:last-login-email');
  }

  return null;
}

async function waitForSession() {
  const maxAttempts = 10;
  const delayMs = 150;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('Unable to retrieve Supabase session while finalising sign-in', error);
      break;
    }
    if (data?.session) {
      return data.session;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return null;
}

type VerifyOtpParams = Parameters<typeof supabase.auth.verifyOtp>[0];
type EmailOtpType = Extract<VerifyOtpParams['type'], 'magiclink' | 'signup' | 'recovery' | 'invite' | 'email_change'>;

export async function completeSupabaseSignIn() {
  if (typeof window === 'undefined') {
    throw new Error(GENERIC_ERROR);
  }

  const queryParams = new URLSearchParams(window.location.search);
  const hashParams = parseHashParams(window.location.hash);

  const siteError =
    queryParams.get('error_description') ||
    hashParams.get('error_description') ||
    queryParams.get('error') ||
    hashParams.get('error');

  if (siteError) {
    throw new Error(siteError);
  }

  const code = queryParams.get('code');
  const queryTokenHash = queryParams.get('token_hash');
  const hashTokenHash = hashParams.get('token_hash');
  const tokenHash = queryTokenHash || hashTokenHash;
  const typeParam = queryParams.get('type') || hashParams.get('type');
  const email = getLoginEmail(queryParams, hashParams);
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else if (tokenHash && email) {
      const supportedTypes: EmailOtpType[] = ['signup', 'magiclink', 'recovery', 'invite', 'email_change'];
      const rawType = (typeParam || 'magiclink').toLowerCase();
      const type = supportedTypes.includes(rawType as EmailOtpType) ? (rawType as EmailOtpType) : 'magiclink';
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type, email });
      if (error) throw error;
    } else if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (error) throw error;
    } else {
      throw new Error(GENERIC_ERROR);
    }
    const session = await waitForSession();
    if (!session) {
      throw new Error('We verified your link but could not establish a session. Request a fresh magic link and try again.');
    }
  } catch (error: any) {
    throw new Error(error?.message || GENERIC_ERROR);
  } finally {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('aligned:last-login-email');
    }
    cleanUrl();
  }
}

export { parseHashParams };
