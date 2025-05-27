export interface ActivityInfo {
  name: string;
  type: number;
  details: string | null;
  state: string | null;
  startTimestamp?: number;
  endTimestamp?: number;
  largeImageURL: string | null;
  largeText: string | null;
  smallImageURL: string | null;
  smallText: string | null;
  partyId?: string;
  partySize?: [number, number];
  partyMax?: number;
  syncId?: string;
  flags?: string[];
  sessionId?: string;
}
