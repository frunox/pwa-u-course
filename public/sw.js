self.addEventListener('install', function (event) {
  console.log('[SW] installing SW..', event);
});

self.addEventListener('activate', function (event) {
  console.log('[SW] activating SW..', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  console.log('[SW] fetch event', event.request.url);
  event.respondWith(fetch(event.request));
});
