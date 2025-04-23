/// <reference lib="webworker" />

const CACHE_NAME = "UPAYAN-V4.3.1";
const CORE_ASSETS: string[] = [
    '/',
    '/offline',
    '/manifest.json',
    '/fonts/RedHatDisplay-VariableFont_wght.ttf',
    '/fonts/RedHatMono-VariableFont_wght.ttf',
    '/icons/icon-16x16.webp',
    '/icons/icon-32x32.webp',
    '/icons/icon-48x48.webp',
    '/icons/icon-64x64.webp',
    '/icons/icon-72x72.webp',
    '/icons/icon-76x76.webp',
    '/icons/icon-96x96.webp',
    '/icons/icon-114x114.webp',
    '/icons/icon-120x120.webp',
    '/icons/icon-128x128.webp',
    '/icons/icon-144x144.webp',
    '/icons/icon-152x152.webp',
    '/icons/icon-180x180.webp',
    '/icons/icon-192x192.webp',
    '/icons/icon-196x196.webp',
    '/icons/icon-228x228.webp',
    '/icons/icon-256x256.webp',
    '/icons/icon-384x384.webp',
    '/icons/icon-512x512.webp',
    '/upayan-transparent-cropped.avif'
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