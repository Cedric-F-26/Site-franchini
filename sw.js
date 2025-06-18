// Configuration du Service Worker pour le site Franchini

const CACHE_NAME = 'franchini-cache-v1';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/header.css',
  '/css/footer.css',
  '/css/carousel.css',
  '/js/main.js',
  '/js/carousel.js',
  '/images/logo.png',
  '/images/favicon.ico',
  OFFLINE_URL
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Gestion des requêtes
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  // Gestion des requêtes de navigation (pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la requête réussit, on met en cache la réponse
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // En cas d'échec, on essaie de récupérer la page depuis le cache
          return caches.match(event.request)
            .then((response) => {
              // Si la page n'est pas en cache, on affiche la page hors ligne
              return response || caches.match(OFFLINE_URL);
            });
        })
    );
  } else {
    // Pour les autres requêtes (CSS, JS, images, etc.)
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Retourne la réponse en cache si elle existe, sinon effectue la requête
          return response || fetch(event.request)
            .then((response) => {
              // Si c'est une requête réussie, on met en cache la réponse
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            });
        })
    );
  }
});

// Gestion de la mise à jour automatique
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
