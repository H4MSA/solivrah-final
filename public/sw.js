// Solivrah Progressive Web App - Service Worker
const CACHE_NAME = 'solivrah-cache-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/placeholder.svg',
  '/assets/index.css',
  '/assets/index.js',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(err => console.error('Service Worker: Cache failed', err))
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheAllowList = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheAllowList.includes(cacheName)) {
              console.log('Service Worker: Removing old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Now ready to handle fetches!');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, then network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) &&
      !event.request.url.includes('lovable-uploads') &&
      !event.request.url.includes('supabase.co')) {
    return;
  }
  
  // Skip API requests (will be handled by the offline queue)
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/auth/') ||
      event.request.url.includes('/rest/')) {
    return;
  }
  
  // For HTML pages - network first, fallback to cache
  if (event.request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((cacheResponse) => {
              // If we have a cached version, return it
              if (cacheResponse) return cacheResponse;
              
              // If we don't have a cached version, try to return the cached homepage
              // as a fallback for navigation requests
              return caches.match('/');
            });
        })
    );
    return;
  }
  
  // For assets - cache first, network fallback
  event.respondWith(
    caches.match(event.request)
      .then((cacheResponse) => {
        // Return from cache if available
        if (cacheResponse) return cacheResponse;
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache the network response for future
            const clonedResponse = networkResponse.clone();
            
            if (networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clonedResponse);
              });
            }
            
            return networkResponse;
          });
      })
      .catch((error) => {
        console.error('Service Worker: Fetch failed', error);
        
        // For image requests, return a placeholder
        if (event.request.destination === 'image') {
          return caches.match('/placeholder.svg');
        }
        
        // Let the browser handle other failures
        throw error;
      })
  );
});

// Background sync for offline operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'offline-quest-completion') {
    event.waitUntil(syncOfflineQuestCompletions());
  }
});

// Function to sync offline quest completions
async function syncOfflineQuestCompletions() {
  try {
    // Get all offline quest completions from IndexedDB
    const offlineData = await getOfflineQuestData();
    
    if (!offlineData || offlineData.length === 0) return;
    
    // Process each offline entry
    const syncResults = await Promise.all(
      offlineData.map(async (entry) => {
        try {
          // Attempt to submit the quest completion
          const response = await fetch('/api/quests/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry.data)
          });
          
          if (response.ok) {
            // If successful, remove from offline storage
            await removeOfflineQuestEntry(entry.id);
            return { success: true, id: entry.id };
          } else {
            return { success: false, id: entry.id, error: 'Server rejected' };
          }
        } catch (error) {
          console.error('Failed to sync quest completion:', error);
          return { success: false, id: entry.id, error };
        }
      })
    );
    
    // Log results
    console.log('Sync results:', syncResults);
    
    // Notify the main thread about the sync results
    const clientList = await self.clients.matchAll();
    clientList.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        results: syncResults
      });
    });
    
  } catch (err) {
    console.error('Error in syncOfflineQuestCompletions:', err);
  }
}

// These functions would be implemented in the main app and shared with the service worker
// For now we'll use stubs
async function getOfflineQuestData() {
  // This would normally retrieve data from IndexedDB
  return [];
}

async function removeOfflineQuestEntry(id) {
  // This would normally remove data from IndexedDB
  return true;
} 