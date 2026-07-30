// Basic Service Worker for caching static assets and enabling offline
const CACHE_NAME = 'rooh-eval-oms-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Try network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Optionally cache responses for same-origin GET requests
        if (request.method === 'GET' && request.url.startsWith(self.location.origin)) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
        }
        return response;
      })
      .catch(() => caches.match(request).then((r) => r || caches.match('/')))
  );
});
