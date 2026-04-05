"use client";

import { btnSecondary } from "@/lib/ui";
import type { ActionType, Player } from "@/types";

type PlayerRowProps = {
  player: Player;
  onAction: (playerId: string, action: ActionType) => void;
};

const ACTIONS: ActionType[] = ["Spike", "Ape", "Serve"];

export function PlayerRow({ player, onAction }: PlayerRowProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-zinc-800/80 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="min-w-0 shrink text-sm font-medium text-zinc-100">{player.name}</span>
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a}
            type="button"
            className={`${btnSecondary} px-3 py-1.5 text-xs`}
            onClick={() => onAction(player.id, a)}
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}
