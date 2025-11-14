import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

let projectRef: string | undefined;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  try {
    const { hostname } = new URL(supabaseUrl);
    projectRef = hostname.split(".")[0];
  } catch (error) {
    projectRef = undefined;
  }
}

const AUTH_COOKIE_NAME = projectRef ? `sb-${projectRef}-auth-token` : undefined;

function hasValidSupabaseSession(req: NextRequest) {
  if (!AUTH_COOKIE_NAME) {
    return false;
  }

  const cookie = req.cookies.get(AUTH_COOKIE_NAME);
  if (!cookie) {
    return false;
  }

  const value = cookie.value.startsWith("%7B") ? decodeURIComponent(cookie.value) : cookie.value;

  try {
    const payload = JSON.parse(value);
    const session = payload?.currentSession ?? payload?.session;
    if (!session?.access_token) {
      return false;
    }

    const expiresAtRaw = session.expires_at ?? payload?.expires_at ?? payload?.expiresAt;
    if (expiresAtRaw) {
      const expiresAtSeconds = typeof expiresAtRaw === "string" ? Number(expiresAtRaw) : expiresAtRaw;
      if (!Number.isFinite(expiresAtSeconds)) {
        return false;
      }
      const normalized = expiresAtSeconds > 1_000_000_000_000 ? Math.floor(expiresAtSeconds / 1000) : expiresAtSeconds;
      const now = Math.floor(Date.now() / 1000);
      if (normalized <= now) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");

  if (isProtectedRoute && !hasValidSupabaseSession(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
