'use client';

import type { QueryClient } from '@tanstack/react-query';

import { liveQuery } from '@/components/home/_top/live/live-query';

function windowLoaded(): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve();
  const { promise, resolve } = Promise.withResolvers<void>();
  window.addEventListener('load', () => resolve(), { once: true });
  return promise;
}

/** Downloads and decodes one image now, even a lazy one below the fold. A broken image counts as done. */
function imageReady(img: HTMLImageElement): Promise<void> {
  if (img.loading === 'lazy') img.loading = 'eager';
  const decoded = () => img.decode().catch(() => undefined);
  if (img.complete) return decoded();
  const { promise, resolve } = Promise.withResolvers<void>();
  img.addEventListener('load', () => resolve(), { once: true });
  img.addEventListener('error', () => resolve(), { once: true });
  return promise.then(decoded);
}

/** Downloads an image that the page shows only later, such as a CSS background, into the cache. */
function urlReady(src: string): Promise<void> {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => undefined);
}

/** The live snapshot (Spotify, Discord, and machine stats), then the album art it points to. */
async function liveReady(client: QueryClient): Promise<void> {
  await client.prefetchQuery({ ...liveQuery, retry: false });
  const spotify = client.getQueryData(liveQuery.queryKey)?.spotify;
  const art = spotify && spotify.state !== 'idle' ? spotify.track.art : null;
  if (art) await urlReady(art);
}

/**
 * Downloads what the page shows before the preloader lifts: the document and its stylesheets, the
 * fonts, every image in the server markup (lazy ones too), and the live snapshot with its album
 * art. The snapshot loads on every page, so the home tiles have it after a client navigation too.
 * Lazy component chunks are not touched, so they still load only near the viewport. `onProgress`
 * gets the share of finished tasks, from 0 to 1.
 */
export function preloadPage(
  client: QueryClient,
  onProgress: (share: number) => void
): Promise<void> {
  const tasks: Promise<unknown>[] = [windowLoaded(), document.fonts.ready, liveReady(client)];
  for (const img of document.querySelectorAll('img')) tasks.push(imageReady(img));

  let done = 0;
  onProgress(0);
  return Promise.all(
    tasks.map(task =>
      task.finally(() => {
        done += 1;
        onProgress(done / tasks.length);
      })
    )
  ).then(() => undefined);
}
