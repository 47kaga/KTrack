"use client";

import { PlayerRow } from "@/components/PlayerRow";
import type { ActionType, Team } from "@/types";

type TeamPanelProps = {
  team: Team;
  onPlayerAction: (teamId: string, playerId: string, action: ActionType) => void;
};

export function TeamPanel({ team, onPlayerAction }: TeamPanelProps) {
  return (
    <section className="flex flex-col border border-zinc-800 bg-zinc-950/40">
      <div className="border-b border-zinc-800 px-4 py-2">
        <h2 className="text-sm font-semibold text-zinc-100">{team.name}</h2>
      </div>
      <div className="px-4 py-1">
        {team.players.map((p) => (
          <PlayerRow
            key={p.id}
            player={p}
            onAction={(playerId, action) => onPlayerAction(team.id, playerId, action)}
          />
        ))}
      </div>
    </section>
  );
}
