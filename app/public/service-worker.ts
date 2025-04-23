/// <reference lib="webworker" />

const CACHE_NAME = "UPAYAN-V4.3.1";
const CORE_ASSETS: string[] = [
    '/',
    '/offline',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

async function cacheCoreAssets(): Promise<void> {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
}

async function dynamicCaching(request: Request): Promise<Response> {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        await cache.put(request, response.clone());
        return response;
    } catch (error) {
        console.warn("[SW] Fetch failed; serving from cache if possible:", error);
        return (await cache.match(request)) || (await cache.match('/offline'))!;
    }
}

self.addEventListener("install", (event) => {
    const swEvent = event as ExtendableEvent;
    console.log("[SW] Installing...");
    swEvent.waitUntil(cacheCoreAssets());
    (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
});

self.addEventListener("activate", (event) => {
    const swEvent = event as ExtendableEvent;
    console.log("[SW] Activating...");
    swEvent.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
            (self as unknown as ServiceWorkerGlobalScope).clients.claim();
        })()
    );
});

self.addEventListener("fetch", (event) => {
    const fetchEvent = event as FetchEvent;
    const url = new URL(fetchEvent.request.url);

    if (fetchEvent.request.method !== 'GET') return;

    if (url.origin === self.location.origin) {
        fetchEvent.respondWith(dynamicCaching(fetchEvent.request));
    }
});