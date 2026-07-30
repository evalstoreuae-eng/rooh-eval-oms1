import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ar" dir="rtl">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content="#eab308" />

          {/* iOS support */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="إيفال OMS" />
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />

          {/* Manifest */}
          <link rel="manifest" href="/manifest.json" />

          {/* Mobile meta tags */}
          <meta name="viewport" content="width=device-width,initial-scale=1" />

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
