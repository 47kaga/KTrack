"use client";

import { useCallback, useMemo, useState } from "react";
import { EventFlowModal } from "@/components/EventFlowModal";
import { EventLog } from "@/components/EventLog";
import { StatsTable } from "@/components/StatsTable";
import { TeamPanel } from "@/components/TeamPanel";
import { aggregatePlayerStats } from "@/lib/aggregateStats";
import { upsertSession } from "@/lib/storage";
import { btnSecondary } from "@/lib/ui";
import type { ActionType, MatchEvent, Team, TrackingSession } from "@/types";

type TrackSessionViewProps = {
  initialSession: TrackingSession;
};

export function TrackSessionView({ initialSession }: TrackSessionViewProps) {
  const [session, setSession] = useState<TrackingSession>(initialSession);
  const [flow, setFlow] = useState<{
    team: Team;
    playerId: string;
    action: ActionType;
  } | null>(null);

  const persist = useCallback((next: TrackingSession) => {
    upsertSession(next);
    setSession(next);
  }, []);

  const stats = useMemo(() => aggregatePlayerStats(session), [session]);

  const openFlow = (teamId: string, playerId: string, action: ActionType) => {
    const team = session.teams.find((t) => t.id === teamId);
    if (!team) return;
    setFlow({ team, playerId, action });
  };

  const handleSaveEvent = useCallback(
    (event: MatchEvent) => {
      const now = new Date().toISOString();
      const next: TrackingSession = {
        ...session,
        updatedAt: now,
        events: [...session.events, event],
      };
      persist(next);
    },
    [persist, session],
  );

  const handleUndo = () => {
    if (session.events.length === 0) return;
    const now = new Date().toISOString();
    const next: TrackingSession = {
      ...session,
      updatedAt: now,
      events: session.events.slice(0, -1),
    };
    persist(next);
  };

  const handleReset = () => {
    if (session.events.length === 0) return;
    if (!window.confirm("Clear all events for this session?")) return;
    const now = new Date().toISOString();
    persist({ ...session, updatedAt: now, events: [] });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8">
      <div className="flex flex-col gap-3 border-b border-zinc-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-100">{session.title}</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {session.teams[0].name} vs {session.teams[1].name}
            {session.importMetadata?.fileName ? (
              <span className="text-zinc-600"> · file: {session.importMetadata.fileName}</span>
            ) : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`${btnSecondary} disabled:opacity-40`}
            onClick={handleUndo}
            disabled={session.events.length === 0}
          >
            Undo last
          </button>
          <button
            type="button"
            className={`${btnSecondary} disabled:opacity-40`}
            onClick={handleReset}
            disabled={session.events.length === 0}
          >
            Reset tracking
          </button>
        </div>
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <TeamPanel team={session.teams[0]} onPlayerAction={openFlow} />
          <TeamPanel team={session.teams[1]} onPlayerAction={openFlow} />
        </div>
        <div className="flex min-h-0 flex-col gap-6">
          <EventLog session={session} />
          <StatsTable rows={stats} />
        </div>
      </div>

      {flow ? (
        <EventFlowModal
          key={`${flow.team.id}-${flow.playerId}-${flow.action}`}
          open
          session={session}
          actingTeam={flow.team}
          actingPlayerId={flow.playerId}
          actionType={flow.action}
          onClose={() => setFlow(null)}
          onSave={handleSaveEvent}
        />
      ) : null}
    </div>
  );
}
