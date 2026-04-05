"use client";

import { formatEventLine } from "@/lib/formatEvent";
import type { TrackingSession } from "@/types";

type EventLogProps = {
  session: TrackingSession;
};

export function EventLog({ session }: EventLogProps) {
  const ordered = [...session.events].reverse();

  return (
    <section className="flex min-h-0 flex-1 flex-col border border-zinc-800 bg-zinc-950/40">
      <div className="border-b border-zinc-800 px-4 py-2">
        <h2 className="text-sm font-semibold text-zinc-100">Event log</h2>
        <p className="text-xs text-zinc-500">Newest first</p>
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {ordered.length === 0 ? (
          <p className="px-4 py-6 text-sm text-zinc-500">No events yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-800/80">
            {ordered.map((e) => (
              <li key={e.id} className="px-4 py-2 text-sm text-zinc-200">
                {formatEventLine(session, e)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
