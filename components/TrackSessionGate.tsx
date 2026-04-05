"use client";

import Link from "next/link";
import { useMemo } from "react";
import { TrackSessionView } from "@/components/TrackSessionView";
import { getSessionById } from "@/lib/storage";
import { btnSecondary } from "@/lib/ui";

export function TrackSessionGate({ sessionId }: { sessionId: string }) {
  const session = useMemo(() => getSessionById(sessionId) ?? null, [sessionId]);

  if (!session) {
    return (
      <div className="mx-auto flex max-w-md flex-1 flex-col items-start gap-4 px-4 py-16">
        <p className="text-sm text-zinc-400">
          Session not found. It may have been deleted or never saved in this browser.
        </p>
        <Link href="/" className={btnSecondary}>
          Back home
        </Link>
      </div>
    );
  }

  return <TrackSessionView key={session.id} initialSession={session} />;
}
