// Configuration du Service Worker pour le site Franchini

const CACHE_NAME = 'franchini-cache-v1';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/css/header.css',
  '/assets/css/footer.css',
  '/assets/css/carousel.css',
  '/assets/js/main.js',
  '/assets/js/carousel.js',
  '/assets/images/logo.png',
  '/assets/images/favicon.ico',
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

/**
 * Gère les requêtes réseau avec stratégie "Network first, cache fallback"
 * pour les requêtes de navigation et "Cache first, network fallback" pour les autres
 */
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  
  // Ignorer les requêtes vers des domaines externes
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  // Gestion des requêtes de navigation (pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(handlePageRequest(event));
  } else {
    // Pour les autres requêtes (CSS, JS, images, etc.)
    event.respondWith(handleAssetRequest(event));
  }
});

/**
 * Gère les requêtes de page avec stratégie "Network first, cache fallback"
 */
async function handlePageRequest(event) {
  try {
    // Essayer d'abord le réseau
    const networkResponse = await fetchWithTimeout(event.request, 5000); // Timeout de 5 secondes
    
    // Si la réponse est valide, la mettre en cache et la retourner
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(event.request, networkResponse.clone());
      return networkResponse;
    }
    
    // Si la réponse réseau échoue, essayer le cache
    return await serveFromCache(event.request);
    
  } catch (error) {
    console.error('Erreur lors de la récupération de la page:', error);
    // En cas d'erreur, essayer de servir depuis le cache
    return await serveFromCache(event.request);
  }
}

/**
 * Gère les requêtes d'assets avec stratégie "Cache first, network fallback"
 */
async function handleAssetRequest(event) {
  try {
    // Essayer d'abord le cache
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si pas dans le cache, essayer le réseau
    const networkResponse = await fetchWithTimeout(event.request, 3000); // Timeout de 3 secondes
    
    // Si la réponse réseau est valide, la mettre en cache et la retourner
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(event.request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('Erreur lors de la récupération de la ressource:', error);
    
    // Pour les images, retourner une image de remplacement
    if (event.request.destination === 'image') {
      return caches.match('/images/placeholder.jpg');
    }
    
    // Pour les autres types de requêtes, retourner une réponse d'erreur
    return new Response(JSON.stringify({
      error: 'Ressource non disponible hors ligne',
      status: 503,
      url: event.request.url,
      timestamp: new Date().toISOString()
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Tente de récupérer une réponse depuis le cache
 */
async function serveFromCache(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si la page demandée n'est pas en cache, retourner la page hors ligne
    return caches.match(OFFLINE_URL);
    
  } catch (error) {
    console.error('Erreur lors de la récupération depuis le cache:', error);
    return caches.match(OFFLINE_URL);
  }
}

/**
 * Effectue une requête avec timeout
 */
async function fetchWithTimeout(request, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw new Error(`Délai d'attente dépassé (${timeout}ms) pour: ${request.url}`);
  }
}

// Gestion de la mise à jour automatique
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
