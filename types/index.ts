export type ActionType = "Spike" | "Ape" | "Serve";

export type EventResult = "Kill" | "Received" | "Out" | "Fault";

export interface Player {
  id: string;
  name: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

/** Optional data captured at import time; real CSV parsing can populate more later. */
export interface ImportMetadata {
  fileName?: string;
  fileSize?: number;
  importedAt?: string;
  /** Placeholder until real parsing exists */
  placeholderRowCount?: number;
}

export interface MatchEvent {
  id: string;
  timestamp: string;
  actingTeamId: string;
  actingPlayerId: string;
  actionType: ActionType;
  result: EventResult;
  assistedByPlayerId?: string | null;
  receivedByPlayerId?: string | null;
}

export interface TrackingSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  teams: [Team, Team];
  importMetadata?: ImportMetadata | null;
  events: MatchEvent[];
}
