import * as z from 'zod';

import type { LiveDiscord, LivePc, LiveResponse, LiveSpotify, LiveTrack } from './types';

const trackSchema = z.object({
  title: z.string().nullish(),
  artists: z.array(z.string()).default([]),
  album: z.string().nullish(),
  art: z.string().nullish(),
  url: z.string().nullish(),
  duration: z.number().nullish(),
});

const spotifySchema = z.object({
  playback: z
    .object({
      isPlaying: z.boolean(),
      progress: z.number().nullish(),
      track: trackSchema.nullish(),
    })
    .nullish(),
  recent: z.array(z.object({ playedAt: z.string().nullish(), track: trackSchema })).nullish(),
});

const discordSchema = z.object({
  discord_status: z.enum(['online', 'idle', 'dnd', 'offline']).catch('offline'),
  activities: z
    .array(
      z.object({
        type: z.number(),
        name: z.string(),
        details: z.string().nullish(),
        state: z.string().nullish(),
      })
    )
    .default([]),
});

const pcSchema = z.object({
  online: z.boolean(),
  lastSeen: z.number().nullable(),
  stats: z
    .object({
      cpu_percent: z.number(),
      memory_used_bytes: z.number(),
      memory_total_bytes: z.number(),
      uptime_seconds: z.number(),
      zed: z
        .object({ workspace: z.string(), file: z.string(), active_seconds: z.number() })
        .nullish()
        .catch(null),
    })
    .nullable(),
});

/** Top level of `GET /api/stats`. Providers are parsed separately so one bad shape cannot hide the others. */
export const statsSchema = z.object({
  spotify: z.unknown(),
  discord: z.unknown(),
  pc: z.unknown(),
});

const ACTIVITY_VERBS: Record<number, string> = {
  0: 'Playing',
  1: 'Streaming',
  2: 'Listening to',
  3: 'Watching',
  5: 'Competing in',
};
const CUSTOM_STATUS = 4;

function toTrack(track: z.infer<typeof trackSchema> | null | undefined): LiveTrack | null {
  if (!track?.title) return null;
  return {
    title: track.title,
    artists: track.artists,
    album: track.album ?? null,
    art: track.art ?? null,
    url: track.url ?? null,
    durationMs: track.duration ?? null,
  };
}

function toSpotify(raw: unknown): LiveSpotify | null {
  const parsed = spotifySchema.safeParse(raw);
  if (!raw || !parsed.success) return null;
  const { playback, recent } = parsed.data;
  const playing = playback?.isPlaying ? toTrack(playback.track) : null;
  if (playing) return { state: 'playing', track: playing, progressMs: playback?.progress ?? null };
  const last = recent?.[0];
  const lastTrack = toTrack(last?.track);
  if (lastTrack) return { state: 'recent', track: lastTrack, playedAt: last?.playedAt ?? null };
  return { state: 'idle' };
}

function toDiscord(raw: unknown): LiveDiscord | null {
  const parsed = discordSchema.safeParse(raw);
  if (!raw || !parsed.success) return null;
  const { discord_status: status, activities } = parsed.data;
  // Spotify already has its own card, so prefer a game or app; the custom status is the last resort.
  const primary =
    activities.find(
      a => a.type !== CUSTOM_STATUS && a.name !== 'Spotify' && a.type in ACTIVITY_VERBS
    ) ?? activities.find(a => a.type in ACTIVITY_VERBS);
  const custom = activities.find(a => a.type === CUSTOM_STATUS && a.state);
  const activity = primary
    ? {
        verb: ACTIVITY_VERBS[primary.type]!,
        name: primary.name,
        detail: primary.details ?? primary.state ?? null,
      }
    : custom?.state
      ? { verb: 'Status', name: custom.state, detail: null }
      : null;
  return { status, activity };
}

function toPc(raw: unknown): LivePc | null {
  const parsed = pcSchema.safeParse(raw);
  // No report yet looks the same as reporting disabled upstream; both are "unavailable" here.
  if (!parsed.success || !parsed.data.stats || parsed.data.lastSeen === null) return null;
  const { online, lastSeen, stats } = parsed.data;
  return {
    online,
    lastSeen,
    uptimeSeconds: stats.uptime_seconds,
    cpuPercent: stats.cpu_percent,
    memory: { used: stats.memory_used_bytes, total: stats.memory_total_bytes },
    zed: stats.zed
      ? {
          workspace: stats.zed.workspace,
          file: stats.zed.file,
          activeSeconds: stats.zed.active_seconds,
        }
      : null,
  };
}

/** Reduces the Rust `/api/stats` payload to display fields. */
export function toLiveResponse(stats: z.infer<typeof statsSchema>): LiveResponse {
  return {
    spotify: toSpotify(stats.spotify),
    discord: toDiscord(stats.discord),
    pc: toPc(stats.pc),
  };
}
