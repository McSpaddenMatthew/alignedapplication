import Document, { Html, Head, Main, NextScript } from 'next/document';

const redirectScript = [
  '(() => {',
  '  try {',
  "    if (typeof window === 'undefined') {",
  '      return;',
  '    }',
  '',
  '    const { pathname } = window.location;',
  "    if (pathname === '/auth/callback') {",
  '      return;',
  '    }',
  '',
  '    const toUrl = (url) => {',
  "      if (url.startsWith('http://') || url.startsWith('https://')) {",
  '        return new URL(url);',
  '      }',
  '      return new URL(url, window.location.origin);',
  '    };',
  '',
  '    const inspect = (url) => {',
  '      try {',
  '        const parsed = toUrl(url);',
  "        const rawHash = parsed.hash.startsWith('#') ? parsed.hash.slice(1) : parsed.hash;",
  '        const searchParams = parsed.searchParams;',
  '        const hashParams = new URLSearchParams(rawHash);',
  '',
  '        if (',
  "          searchParams.has('code') ||",
  "          searchParams.has('token_hash') ||",
  "          hashParams.has('token_hash') ||",
  "          hashParams.has('access_token') ||",
  "          hashParams.has('refresh_token') ||",
  "          hashParams.get('type') === 'recovery'",
  '        ) {',
  "          const search = parsed.search ? parsed.search : '';",
  "          const hash = parsed.hash ? parsed.hash : '';",
  "          window.location.replace(`/auth/callback${search}${hash}`);",
  '        }',
  '      } catch (error) {',
  "        console.error('Failed to evaluate Supabase auth params', error);",
  '      }',
  '    };',
  '',
  '    inspect(window.location.href);',
  '  } catch (error) {',
  "    console.error('Supabase redirect bootstrap failed', error);",
  '  }',
  '})();'
].join('\n');

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
        </Head>
        <body style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
