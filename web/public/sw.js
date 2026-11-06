// Service worker: keeps the app itself available offline.
// (Translation models and text-recognition data are cached separately by
// Transformers.js and Tesseract, in Cache Storage and IndexedDB.)
const VERSION = '__VERSION__';
const CACHE = `app-${VERSION}`;
const PRECACHE = __PRECACHE__;
// Large engine files cached on first use; kept across app updates until the engines change.
const VENDOR_CACHE = 'vendor-__VENDOR__';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => (k.startsWith('app-') && k !== CACHE) || (k.startsWith('vendor-') && k !== VENDOR_CACHE))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Cross-origin isolation lets the camera and voice engines use every CPU core (much faster on
// iPhone). GitHub Pages can't send these headers, so the service worker adds them.
function isolate(response) {
  if (!response || response.type === 'opaque' || response.type === 'opaqueredirect' || response.status === 0) return response;
  const headers = new Headers(response.headers);
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    // Network first for the page so updates arrive; fall back to the cached copy offline.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('./index.html', copy));
          return isolate(response);
        })
        .catch(() => caches.match('./index.html', { ignoreSearch: true }).then(isolate)),
    );
    return;
  }

  // Cache first; anything not cached yet (voice/camera engines) is saved the first time it loads.
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(
      (hit) =>
        (hit && isolate(hit)) ||
        fetch(event.request).then((response) => {
          if (response.ok && url.pathname.includes('/vendor/')) {
            const copy = response.clone();
            caches.open(VENDOR_CACHE).then((cache) => cache.put(event.request, copy));
          }
          return isolate(response);
        }),
    ),
  );
});
