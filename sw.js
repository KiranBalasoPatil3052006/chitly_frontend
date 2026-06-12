/* Basic offline-first service worker for SskChitFrontend */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `chitly-cache-${CACHE_VERSION}`;

const OFFLINE_URLS = [
  './',
  './index.html',
  './plans.html',
  './profile.html',
  './members.html',
  './chits.html',
  './create-chit.html',
  './feedback.html',
  './memberdetail.html',
  './translations.js',
  './rest.html',
  './manifest.json',
  './images/sskicon.png',
  './images/chitly.png',
  './images/sskLogo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(OFFLINE_URLS);
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only cache GET requests
  if (req.method !== 'GET') return;

  // Skip non-http(s)
  const url = new URL(req.url);

  // Network-first for same-origin navigation; cache-first for assets
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, res.clone());
          return res;
        } catch (e) {
          const cached = await caches.match('./index.html');
          return cached || new Response('Offline', { status: 200 });
        }
      })()
    );
    return;
  }

  // Cache-first for assets
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;

      try {
        const res = await fetch(req);
        // Only cache successful responses
        if (res && res.status === 200 && res.type !== 'opaque') {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, res.clone());
        }
        return res;
      } catch (e) {
        // If offline and not cached, try returning cached index.html
        const fallback = await caches.match('./index.html');
        return fallback || new Response('Offline', { status: 200 });
      }
    })()
  );
});

