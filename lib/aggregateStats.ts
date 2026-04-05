import type { Player, TrackingSession } from "@/types";

export interface PlayerStats {
  playerId: string;
  playerName: string;
  teamId: string;
  spikesAttempted: number;
  apesAttempted: number;
  servesAttempted: number;
  kills: number;
  assists: number;
  receives: number;
  outs: number;
  faults: number;
}

function emptyStats(p: Player): PlayerStats {
  return {
    playerId: p.id,
    playerName: p.name,
    teamId: p.teamId,
    spikesAttempted: 0,
    apesAttempted: 0,
    servesAttempted: 0,
    kills: 0,
    assists: 0,
    receives: 0,
    outs: 0,
    faults: 0,
  };
}

/**
 * All stats are derived from the event log (single source of truth).
 */
export function aggregatePlayerStats(session: TrackingSession): PlayerStats[] {
  const teams = session.teams;
  const players: Player[] = [...teams[0].players, ...teams[1].players];
  const byId = new Map(players.map((p) => [p.id, emptyStats(p)]));

  for (const e of session.events) {
    const acting = byId.get(e.actingPlayerId);
    if (acting) {
      if (e.actionType === "Spike") acting.spikesAttempted += 1;
      if (e.actionType === "Ape") acting.apesAttempted += 1;
      if (e.actionType === "Serve") acting.servesAttempted += 1;
      if (e.result === "Kill") acting.kills += 1;
      if (e.result === "Out") acting.outs += 1;
      if (e.result === "Fault") acting.faults += 1;
    }

    if (e.assistedByPlayerId) {
      const assist = byId.get(e.assistedByPlayerId);
      if (assist) assist.assists += 1;
    }

    if (e.receivedByPlayerId) {
      const recv = byId.get(e.receivedByPlayerId);
      if (recv) recv.receives += 1;
    }
  }

  return players.map((p) => byId.get(p.id)!);
}
