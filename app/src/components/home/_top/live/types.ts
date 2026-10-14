/** Display-only payload served by `/api/live`. `null` providers are unavailable. */
export interface LiveResponse {
  spotify: LiveSpotify | null;
  discord: LiveDiscord | null;
  pc: LivePc | null;
}

export interface LiveTrack {
  title: string;
  artists: string[];
  album: string | null;
  art: string | null;
  url: string | null;
  durationMs: number | null;
}

export type LiveSpotify =
  | { state: 'playing'; track: LiveTrack; progressMs: number | null }
  | { state: 'recent'; track: LiveTrack; playedAt: string | null }
  | { state: 'idle' };

export type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface LiveDiscord {
  status: DiscordStatus;
  activity: { verb: string; name: string; detail: string | null } | null;
}

export interface LivePc {
  online: boolean;
  /** Unix seconds of the last report. */
  lastSeen: number;
  uptimeSeconds: number;
  cpuPercent: number;
  memory: { used: number; total: number };
  /** Present only when the PC reports an allowlisted Zed workspace. */
  zed: LiveZed | null;
}

export interface LiveZed {
  workspace: string;
  file: string;
  /** Session seconds at `lastSeen`. */
  activeSeconds: number;
}
