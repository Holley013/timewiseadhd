const CACHE_NAME = 'timewiseadhd';
const urlsToCache = [
  '/timewiseadhd/',
  '/timewiseadhd/static/js/bundle.js',
  '/timewiseadhd/static/css/main.css',
  '/timewiseadhd/manifest.json',
  '/timewiseadhd/icon-192.png',
  '/timewiseadhd/icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.filter(url => url !== '/'));
      })
      .catch((error) => {
        console.log('Cache addAll failed:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for saving task completion data
self.addEventListener('sync', (event) => {
  if (event.tag === 'save-task-data') {
    event.waitUntil(
      // Here you could sync data to a server when back online
      console.log('Background sync: save-task-data')
    );
  }
});

// Handle notifications (for future task reminders)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/timewiseadhd/')
  );
});