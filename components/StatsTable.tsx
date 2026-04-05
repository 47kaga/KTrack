"use client";

import type { PlayerStats } from "@/lib/aggregateStats";

type StatsTableProps = {
  rows: PlayerStats[];
};

export function StatsTable({ rows }: StatsTableProps) {
  return (
    <section className="border border-zinc-800 bg-zinc-950/40">
      <div className="border-b border-zinc-800 px-4 py-2">
        <h2 className="text-sm font-semibold text-zinc-100">Live stats</h2>
        <p className="text-xs text-zinc-500">Derived from the event log</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-xs text-zinc-200">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400">
              <th className="px-3 py-2 font-medium">Player</th>
              <th className="px-2 py-2 font-medium">Spk</th>
              <th className="px-2 py-2 font-medium">Ape</th>
              <th className="px-2 py-2 font-medium">Srv</th>
              <th className="px-2 py-2 font-medium">K</th>
              <th className="px-2 py-2 font-medium">Ast</th>
              <th className="px-2 py-2 font-medium">Rec</th>
              <th className="px-2 py-2 font-medium">Out</th>
              <th className="px-2 py-2 font-medium">Flt</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.playerId} className="border-b border-zinc-800/60">
                <td className="px-3 py-2 text-sm text-zinc-100">{r.playerName}</td>
                <td className="px-2 py-2 tabular-nums">{r.spikesAttempted}</td>
                <td className="px-2 py-2 tabular-nums">{r.apesAttempted}</td>
                <td className="px-2 py-2 tabular-nums">{r.servesAttempted}</td>
                <td className="px-2 py-2 tabular-nums text-yellow-400/90">{r.kills}</td>
                <td className="px-2 py-2 tabular-nums">{r.assists}</td>
                <td className="px-2 py-2 tabular-nums">{r.receives}</td>
                <td className="px-2 py-2 tabular-nums">{r.outs}</td>
                <td className="px-2 py-2 tabular-nums">{r.faults}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
