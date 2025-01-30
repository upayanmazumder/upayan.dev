const CACHE_NAME = "UPAYAN-V4.0.0";

async function dynamicCaching(request) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const response = await fetch(request);
        const responseClone = response.clone();
        await cache.put(request, responseClone);
        return response;
    } catch (error) {
        console.error("Dynamic caching failed:", error);
        return caches.match(request);
    }
}

self.addEventListener("install", (event) => {
    event.waitUntil(cacheCoreAssets());
    self.skipWaiting();
});

async function clearOldCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
    );
}

self.addEventListener("activate", (event) => {
    event.waitUntil(clearOldCaches());
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);
    event.respondWith(fetch(event.request));
});