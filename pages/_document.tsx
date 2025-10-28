import Document, { Html, Head, Main, NextScript } from 'next/document';

const authBootstrap = `
(function () {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    var AUTH_PAYLOAD_KEY = 'aligned:pending-auth-payload';

    var toUrl = function (url) {
      try {
        if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
          return new URL(url);
        }
        return new URL(url, window.location.origin);
      } catch (error) {
        return new URL(window.location.href);
      }
    };

    var hasAuthParams = function (url) {
      var parsed = toUrl(url);
      if (parsed.pathname === '/auth/callback') {
        return false;
      }

      var rawHash = parsed.hash && parsed.hash.charAt(0) === '#' ? parsed.hash.slice(1) : parsed.hash;
      var searchParams = parsed.searchParams;
      var hashParams = new URLSearchParams(rawHash || '');

      if (searchParams.has('code') || searchParams.has('token_hash')) {
        return true;
      }

      return hashParams.has('token_hash') || hashParams.has('access_token') || hashParams.has('refresh_token');
    };

    var storePayload = function (search, rawHash) {
      try {
        if (!search && !rawHash) {
          return;
        }

        window.sessionStorage.setItem(
          AUTH_PAYLOAD_KEY,
          JSON.stringify({ search: search ? search.slice(1) : '', hash: rawHash || '' })
        );
      } catch (storageError) {
        console.warn('Unable to persist Supabase auth payload', storageError);
      }
    };

    var forwardToCallback = function (url) {
      var parsed = toUrl(url);
      var search = parsed.search ? parsed.search : '';
      var hash = parsed.hash ? parsed.hash : '';
      var rawHash = parsed.hash && parsed.hash.charAt(0) === '#' ? parsed.hash.slice(1) : parsed.hash;

      storePayload(search, rawHash);
      window.location.replace('/auth/callback' + search + hash);
    };

    var inspect = function (url) {
      try {
        if (hasAuthParams(url)) {
          forwardToCallback(url);
        }
      } catch (error) {
        console.error('Supabase auth bootstrap inspection failed', error);
      }
    };

    inspect(window.location.href);
    window.addEventListener('hashchange', function () {
      inspect(window.location.href);
    });
    window.addEventListener('pageshow', function (event) {
      if (event && event.persisted) {
        inspect(window.location.href);
      }
    });
  } catch (error) {
    console.error('Supabase auth bootstrap failed', error);
  }
})();
`;

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script dangerouslySetInnerHTML={{ __html: authBootstrap }} />
        </Head>
        <body style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
