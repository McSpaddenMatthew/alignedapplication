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
  '    const inspect = (url) => {',
  '      try {',
  "        const [pathAndQuery, rawHash = ''] = url.split('#');",
  "        const [, rawQuery = ''] = pathAndQuery.split('?');",
  '        const searchParams = new URLSearchParams(rawQuery);',
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
  "          const search = rawQuery ? `?${rawQuery}` : '';",
  "          const hash = rawHash ? `#${rawHash}` : '';",
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
