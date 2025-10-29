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
const AUTH_PAYLOAD_STORAGE_KEY = 'aligned:pending-auth-payload';

type StoredAuthPayload = {
  search?: string;
  hash?: string;
} | null;

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

function persistAuthPayload(queryParams: URLSearchParams, hashParams: URLSearchParams) {
  if (typeof window === 'undefined') return;
  if (!hasSupabasePayload(queryParams, hashParams)) return;

  try {
    const payload = {
      search: queryParams.toString(),
      hash: hashParams.toString()
    };
    window.sessionStorage.setItem(AUTH_PAYLOAD_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Unable to persist Supabase auth payload', error);
  }
}

function readStoredAuthPayload(): StoredAuthPayload {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(AUTH_PAYLOAD_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuthPayload;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Unable to read stored Supabase auth payload', error);
    return null;
  }
}

export function getStoredSupabaseAuthPayload(): { search?: string; hash?: string } | null {
  const payload = readStoredAuthPayload();
  if (!payload) return null;

  const normalised: { search?: string; hash?: string } = {};

  if (typeof payload.search === 'string' && payload.search.length > 0) {
    normalised.search = payload.search;
  }

  if (typeof payload.hash === 'string' && payload.hash.length > 0) {
    normalised.hash = payload.hash;
  }

  if (!normalised.search && !normalised.hash) {
    return null;
  }

  return normalised;
}

function clearStoredAuthPayload() {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(AUTH_PAYLOAD_STORAGE_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Unable to clear stored Supabase auth payload', error);
  }
}

async function waitForSession() {
  const maxAttempts = 40;
  const delayMs = 250;

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

  let queryParams = new URLSearchParams(window.location.search);
  let hashParams = parseHashParams(window.location.hash);
  const storedAuthPayload = readStoredAuthPayload();

  if (!hasSupabasePayload(queryParams, hashParams) && storedAuthPayload) {
    try {
      const candidateQuery = new URLSearchParams(storedAuthPayload.search || '');
      const candidateHash = parseHashParams(storedAuthPayload.hash || '');
      if (hasSupabasePayload(candidateQuery, candidateHash)) {
        queryParams = candidateQuery;
        hashParams = candidateHash;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Unable to parse stored Supabase auth payload', error);
    }
  }

  persistAuthPayload(queryParams, hashParams);
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
  let shouldClearStoredPayload = false;

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else if (tokenHash) {
      const supportedTypes: EmailOtpType[] = ['signup', 'magiclink', 'recovery', 'invite', 'email_change'];
      const rawType = (typeParam || 'magiclink').toLowerCase();
      const type = supportedTypes.includes(rawType as EmailOtpType) ? (rawType as EmailOtpType) : 'magiclink';
      const payload = { token_hash: tokenHash, type } as VerifyOtpParams & { email?: string };
      if (loginEmail) {
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
    shouldClearStoredPayload = true;
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

    if (shouldClearStoredPayload) {
      clearStoredAuthPayload();
    }

    if (shouldCleanUrl) {
      cleanUrl();
    }
  }
}

export { parseHashParams };
