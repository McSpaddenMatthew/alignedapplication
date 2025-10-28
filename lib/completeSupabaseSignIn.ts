import { supabase } from './supabaseClient';

export const GENERIC_ERROR =
  'We could not confirm your magic link. Open the link on the same device you requested it from or ask for a fresh one.';

export const LOGIN_EMAIL_REQUIRED = 'LOGIN_EMAIL_REQUIRED';

function createLoginEmailError() {
  const error = new Error('We need to confirm your email before finishing sign-in.');
  (error as Error & { code?: string }).code = LOGIN_EMAIL_REQUIRED;
  return error;
}

const LOGIN_EMAIL_STORAGE_KEY = 'aligned:last-login-email';

function normaliseEmail(value: string | null | undefined) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function safeDecode(value: string | null) {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

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

function hasSupabasePayload(queryParams: URLSearchParams, hashParams: URLSearchParams) {
  return (
    queryParams.has('code') ||
    queryParams.has('token_hash') ||
    hashParams.has('token_hash') ||
    hashParams.has('access_token') ||
    hashParams.has('refresh_token')
  );
}

type CompleteSupabaseSignInOptions = {
  email?: string;
};

export async function completeSupabaseSignIn(options?: CompleteSupabaseSignInOptions) {
  if (typeof window === 'undefined') {
    throw new Error(GENERIC_ERROR);
  }

  const queryParams = new URLSearchParams(window.location.search);
  const hashParams = parseHashParams(window.location.hash);
  const loginEmailParam = safeDecode(
    queryParams.get('login_email') ||
      hashParams.get('login_email') ||
      queryParams.get('email') ||
      hashParams.get('email')
  );
  const overrideEmail = normaliseEmail(options?.email);
  const storedEmail = (() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(LOGIN_EMAIL_STORAGE_KEY);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Unable to read stored login email', error);
      return null;
    }
  })();

  const loginEmail = normaliseEmail(overrideEmail || loginEmailParam || storedEmail);

  const emailToPersist = overrideEmail || loginEmailParam;

  if (emailToPersist && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(LOGIN_EMAIL_STORAGE_KEY, emailToPersist);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Unable to store override login email', error);
    }
  }

  const siteError =
    queryParams.get('error_description') ||
    hashParams.get('error_description') ||
    queryParams.get('error') ||
    hashParams.get('error');

  if (siteError) {
    throw new Error(siteError);
  }

  if (!hasSupabasePayload(queryParams, hashParams)) {
    throw new Error(GENERIC_ERROR);
  }

  const code = queryParams.get('code');
  const queryTokenHash = queryParams.get('token_hash');
  const hashTokenHash = hashParams.get('token_hash');
  const tokenHash = queryTokenHash || hashTokenHash;
  const typeParam = queryParams.get('type') || hashParams.get('type');
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');

  let shouldCleanUrl = false;
  let shouldClearStoredEmail = false;

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else if (tokenHash) {
      const supportedTypes: EmailOtpType[] = ['signup', 'magiclink', 'recovery', 'invite', 'email_change'];
      const rawType = (typeParam || 'magiclink').toLowerCase();
      const type = supportedTypes.includes(rawType as EmailOtpType) ? (rawType as EmailOtpType) : 'magiclink';
      const payload = { token_hash: tokenHash, type } as VerifyOtpParams & { email?: string };
      if (type !== 'recovery') {
        if (!loginEmail) {
          throw createLoginEmailError();
        }
        payload.email = loginEmail;
      }
      const { error } = await supabase.auth.verifyOtp(payload);
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

    shouldCleanUrl = true;
    shouldClearStoredEmail = true;
  } catch (error: any) {
    if (error?.code === LOGIN_EMAIL_REQUIRED) {
      throw error;
    }

    if (typeof error?.message === 'string' && error.message.toLowerCase().includes('provide either an email or phone')) {
      throw createLoginEmailError();
    }

    throw error?.message ? error : new Error(GENERIC_ERROR);
  } finally {
    if (shouldClearStoredEmail && typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(LOGIN_EMAIL_STORAGE_KEY);
      } catch (storageError) {
        // eslint-disable-next-line no-console
        console.warn('Unable to clear stored login email', storageError);
      }
    }

    if (shouldCleanUrl) {
      cleanUrl();
    }
  }
}

export { parseHashParams };
