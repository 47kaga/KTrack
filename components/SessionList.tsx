"use client";

import Link from "next/link";
import { btnPrimary, btnSecondary } from "@/lib/ui";
import type { TrackingSession } from "@/types";

type SessionListProps = {
  sessions: TrackingSession[];
  onDelete: (id: string) => void;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function SessionList({ sessions, onDelete }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-zinc-800 px-6 py-12 text-center">
        <p className="text-sm text-zinc-400">No saved sessions yet.</p>
        <p className="mt-2 text-xs text-zinc-600">
          Use <span className="text-zinc-300">Load CSV</span> in the header to create a session and start tracking.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-zinc-800 border border-zinc-800 bg-zinc-950/40">
      {sessions.map((s) => (
        <li key={s.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm font-semibold text-zinc-100">{s.title}</p>
            <p className="text-xs text-zinc-500">{formatDate(s.createdAt)}</p>
            <p className="text-xs text-zinc-400">
              {s.teams[0].name} vs {s.teams[1].name}
            </p>
            <p className="text-xs text-zinc-500">{s.events.length} events</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href={`/track/${s.id}`} className={btnPrimary}>
              Open
            </Link>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                if (window.confirm("Delete this session permanently?")) onDelete(s.id);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
