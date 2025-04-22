const CACHE_NAME = "UPAYAN-V4.3.1";
const CORE_ASSETS = [
    '/',
    '/offline',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

async function cacheCoreAssets() {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(CORE_ASSETS);
}

async function dynamicCaching(request) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        await cache.put(request, response.clone());
        return response;
    } catch (error) {
        console.warn("[SW] Fetch failed; serving from cache if possible:", error);
        return await cache.match(request) || await cache.match('/offline');
    }
}

self.addEventListener("install", (event) => {
    console.log("[SW] Installing...");
    event.waitUntil(cacheCoreAssets());
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("[SW] Activating...");
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
            self.clients.claim();
        })()
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (event.request.method !== 'GET') return;

    if (url.origin === self.location.origin) {
        event.respondWith(dynamicCaching(event.request));
    }
});
