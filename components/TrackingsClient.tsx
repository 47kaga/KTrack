"use client";

import { useState } from "react";
import { SessionList } from "@/components/SessionList";
import { deleteSession, getAllSessions } from "@/lib/storage";
import type { TrackingSession } from "@/types";

export function TrackingsClient() {
  const [sessions, setSessions] = useState<TrackingSession[]>(() => getAllSessions());

  const handleDelete = (id: string) => {
    deleteSession(id);
    setSessions(getAllSessions());
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-zinc-100">Previous trackings</h2>
        <p className="mt-1 text-sm text-zinc-500">Saved in this browser (localStorage).</p>
      </div>
      <SessionList sessions={sessions} onDelete={handleDelete} />
    </div>
  );
}
