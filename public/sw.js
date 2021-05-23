let CACHE_STATIC_NAME = 'static-v8';
let CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function (event) {
  console.log('[SW] installing SW..', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then((cache) => {
      console.log('SW: Precaching app shell');
      cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
        '/src/js/app.js',
        '/src/js/feed.js',
        '/src/js/promise.js',
        '/src/js/fetch.js',
        'https://code.getmdl.io/1.3.0/material.min.js',
        '/src/css/app.css',
        '/src/css/feed.css',
        '/src/images/main-image.jpg',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css',
      ]);
      // cache individual files
      // cache.add('/');
      // cache.add('/index.html');
      // cache.add('/src/js/app.js');
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('[SW] activating SW..', event);
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key != CACHE_STATIC_NAME && key != CACHE_DYNAMIC_NAME) {
            console.log('SW  remove old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  // console.log('[SW] fetch event', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // console.log('already cached');
        return response;
      } else {
        // console.log('fetching...');
        return fetch(event.request)
          .then((res) => {
            return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
              cache.put(event.request.url, res.clone());
              return res;
            });
          })
          .catch((err) => {
            return caches.open(CACHE_STATIC_NAME).then((cache) => {
              return cache.match('/offline.html');
            });
          });
      }
    })
  );
});
