'use strict';

// Constant for name of my service worker
var STATICCACHENAME = 'app-4';

/**
 * Listen for install event on service worker
 */
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(STATICCACHENAME).then(function (cache) {
    return cache.addAll(['/', '/scripts/main.min.js', '/styles/styles.min.css']);
  }));
});

/**
 * Listen for fetch events
 */
self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    return response || fetch(event.request);
  }));
});

/**
 * Listen for active of service worker
 */
self.addEventListener('activate', function (event) {
  // Remove old service workers
  event.waitUntil(caches.keys().then(function (cacheNames) {
    return Promise.all(cacheNames.filter(function (cacheName) {
      return cacheName.startsWith('app-') && cacheName != STATICCACHENAME;
    }).map(function (cacheName) {
      return caches.delete(cacheName);
    }));
  }));
});