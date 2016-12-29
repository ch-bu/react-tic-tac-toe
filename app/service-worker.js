// Constant for name of my service worker
const STATICCACHENAME = 'app-4';

/**
 * Listen for install event on service worker
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATICCACHENAME).then((cache) => {
      return cache.addAll([
          '/',
          '/scripts/main.min.js',
          '/styles/styles.min.css',
      ]);
    })
  );
});


/**
 * Listen for fetch events
 */
self.addEventListener('fetch', (event) => {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
          return response || fetch(event.request);
        })
    );
});


/**
 * Listen for active of service worker
 */
self.addEventListener('activate', function(event) {
    // Remove old service workers
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
          return Promise.all(
            cacheNames.filter(function(cacheName) {
              return cacheName.startsWith('app-') &&
                     cacheName != STATICCACHENAME;
            }).map(function(cacheName) {
              return caches.delete(cacheName);
            })
          );
        })
    );
});
