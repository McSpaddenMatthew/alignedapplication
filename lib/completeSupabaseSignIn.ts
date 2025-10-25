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

  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('aligned:last-login-email');
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
