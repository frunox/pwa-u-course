let CACHE_STATIC_NAME = 'static-v16';
let CACHE_DYNAMIC_NAME = 'dynamic-v2';
let STATIC_FILES = [
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
];

// CODE for trimming dynamic cache V96
// const trimCache = (cacheName, maxItems) => {
//   caches.open(cacheName).then((cache) => {
//     return cache.keys().then((keys) => {
//       if (keys.length > maxItems) {
//         cache.delete(keys[0]).then(trimCache(cacheName, maxItems));
//       }
//     });
//   });
// };

self.addEventListener('install', function (event) {
  console.log('[SW] installing SW..', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then((cache) => {
      console.log('SW: Precaching app shell');
      cache.addAll(STATIC_FILES);
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

// cache w/ network fallback
// self.addEventListener('fetch', function (event) {
//   // console.log('[SW] fetch event', event.request.url);
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       if (response) {
//         // console.log('already cached');
//         return response;
//       } else {
//         // console.log('fetching...');
//         return fetch(event.request)
//           .then((res) => {
//             return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
//               cache.put(event.request.url, res.clone());
//               return res;
//             });
//           })
//           .catch((err) => {
//             return caches.open(CACHE_STATIC_NAME).then((cache) => {
//               return cache.match('/offline.html');
//             });
//           });
//       }
//     })
//   );
// });

// cache only strategy
// self.addEventListener('fetch', function (event) {
//   event.respondWith(caches.match(event.request));
// });

// network only strategy
// self.addEventListener('fetch', function (event) {
//   event.respondWith(fetch(event.request));
// });

// network w/ cache fallback
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request).catch((err) => {
//       return caches.match(event.request);
//     })
//   );
// });

// network w/ cache fallback & dynamic caching
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//       .then((res) => {
//         return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
//           cache.put(event.request.url, res.clone());
//           return res;
//         });
//       })
//       .catch((err) => {
//         return caches.match(event.request);
//       })
//   );
// });

// cache then network & dynamic caching V87
// self.addEventListener('fetch', function (event) {
//   console.log('[SW] fetch event', event.request.url);
//   event.respondWith(
//     caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
//       return fetch(event.request)
//         .then((res) => {
//           cache.put(event.request, res.clone());
//           return res;
//         })
//         .catch((err) => {
//           console.log('Error in respondWith', err);
//         });
//     })
//   );
// });

// cache then network & dynamic caching for URLs in 'regular' JS files V88
// plus cache w/ network fallback for other URLs ('internal' resources)
// self.addEventListener('fetch', function (event) {
//   let url = 'https://httpbin.org/get';

//   if (event.request.url.indexOf(url) > -1) {
//     console.log('[SW] fetch event', event.request.url);
//     event.respondWith(
//       caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
//         return fetch(event.request)
//           .then((res) => {
//             cache.put(event.request, res.clone());
//             return res;
//           })
//           .catch((err) => {
//             console.log('Error in respondWith', err);
//           });
//       })
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         if (response) {
//           // console.log('already cached');
//           return response;
//         } else {
//           // console.log('fetching...');
//           return fetch(event.request)
//             .then((res) => {
//               return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
//                 cache.put(event.request.url, res.clone());
//                 return res;
//               });
//             })
//             .catch((err) => {
//               return caches.open(CACHE_STATIC_NAME).then((cache) => {
//                 // conditional added in V89
//                 if (event.request.url.indexOf('/help')) {
//                   return cache.match('/offline.html');
//                 }
//               });
//             });
//         }
//       })
//     );
//   }
// });

// cache then network & dynamic caching for URLs in 'regular' JS files V90
// plus cache w/ network fallback for other URLs ('internal' resources)
// plus cache only for static assets stored in the 'install' event
self.addEventListener('fetch', function (event) {
  let url = 'https://httpbin.org/get';
  console.log('FETCH event.request.url', event.request.url);

  if (event.request.url.indexOf(url) > -1) {
    console.log('[SW] fetch event', event.request.url);
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
        return fetch(event.request)
          .then((res) => {
            // trimCache(CACHE_DYNAMIC_NAME, 3);
            cache.put(event.request, res.clone());
            return res;
          })
          .catch((err) => {
            console.log('Error in respondWith', err);
          });
      })
    );
  } else if (
    // new RegExp('\\b' + STATIC_FILES.join('\\b|\\b') + '\\b').test(event.request.url)
    STATIC_FILES.indexOf(event.request.url) > -1
  ) {
    console.log('Get static asset from cache');
    event.respondWith(caches.match(event.request));
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          console.log('already cached');
          return response;
        } else {
          console.log('fetching...');
          return fetch(event.request)
            .then((res) => {
              return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
                // trimCache(CACHE_DYNAMIC_NAME, 3);
                cache.put(event.request.url, res.clone());
                return res;
              });
            })
            .catch((err) => {
              return caches.open(CACHE_STATIC_NAME).then((cache) => {
                // if (event.request.url.indexOf('/help')) {
                if (event.request.headers.get('accept').includes('text/html')) {
                  return cache.match('/offline.html');
                }
              });
            });
        }
      })
    );
  }
});
