import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Register service worker if available
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch((err) => console.warn('Service Worker registration failed:', err));
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
