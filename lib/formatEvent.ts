import type { MatchEvent, TrackingSession } from "@/types";

function playerName(session: TrackingSession, playerId: string): string {
  for (const t of session.teams) {
    const p = t.players.find((x) => x.id === playerId);
    if (p) return p.name;
  }
  return "Unknown";
}

export function formatEventLine(session: TrackingSession, e: MatchEvent): string {
  const actor = playerName(session, e.actingPlayerId);
  let line = `${actor} — ${e.actionType} — ${e.result}`;

  if (e.result === "Kill" && e.assistedByPlayerId) {
    line += ` — Assisted by ${playerName(session, e.assistedByPlayerId)}`;
  }
  if (e.result === "Kill" && !e.assistedByPlayerId && e.actionType !== "Ape") {
    line += ` — Unassisted`;
  }
  if (e.result === "Received" && e.receivedByPlayerId) {
    line += ` — Received by ${playerName(session, e.receivedByPlayerId)}`;
  }

  return line;
}
