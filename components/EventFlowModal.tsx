"use client";

import { useId, useMemo, useState } from "react";
import type { ActionType, EventResult, MatchEvent, Team, TrackingSession } from "@/types";
import { newId } from "@/lib/ids";
import { btnPrimary, btnSecondary } from "@/lib/ui";

type FlowStep = "result" | "assist" | "receive";

type EventFlowModalProps = {
  open: boolean;
  session: TrackingSession;
  actingTeam: Team;
  actingPlayerId: string;
  actionType: ActionType;
  onClose: () => void;
  onSave: (event: MatchEvent) => void;
};

const RESULTS: EventResult[] = ["Kill", "Received", "Out", "Fault"];

export function EventFlowModal({
  open,
  session,
  actingTeam,
  actingPlayerId,
  actionType,
  onClose,
  onSave,
}: EventFlowModalProps) {
  const labelId = useId();
  const [step, setStep] = useState<FlowStep>("result");

  const opponentTeam = useMemo(
    () => session.teams.find((t) => t.id !== actingTeam.id)!,
    [session.teams, actingTeam.id],
  );

  if (!open) return null;

  const actingPlayer = actingTeam.players.find((p) => p.id === actingPlayerId);
  const title = actingPlayer
    ? `${actingPlayer.name} — ${actionType}`
    : `${actionType}`;

  const base = (): Omit<MatchEvent, "result" | "assistedByPlayerId" | "receivedByPlayerId"> => ({
    id: newId(),
    timestamp: new Date().toISOString(),
    actingTeamId: actingTeam.id,
    actingPlayerId,
    actionType,
  });

  const finish = (partial: Pick<MatchEvent, "result" | "assistedByPlayerId" | "receivedByPlayerId">) => {
    onSave({
      ...base(),
      ...partial,
    });
    onClose();
  };

  const teammateChoices = actingTeam.players.filter((p) => p.id !== actingPlayerId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
    >
      <div className="w-full max-w-md border border-zinc-800 bg-[#0a0a0a] shadow-lg">
        <div className="border-b border-zinc-800 px-4 py-3">
          <h2 id={labelId} className="text-sm font-semibold text-zinc-100">
            {title}
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            {step === "result" ? "Choose result." : step === "assist" ? "Assisted by?" : "Received by?"}
          </p>
        </div>

        <div className="px-4 py-4">
          {step === "result" ? (
            <div className="grid grid-cols-2 gap-2">
              {RESULTS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`${btnSecondary} w-full py-3 font-medium`}
                  onClick={() => {
                    if (r === "Kill") {
                      if (actionType === "Ape") {
                        finish({
                          result: "Kill",
                          assistedByPlayerId: null,
                          receivedByPlayerId: null,
                        });
                      } else {
                        setStep("assist");
                      }
                    } else if (r === "Received") setStep("receive");
                    else if (r === "Out" || r === "Fault") {
                      finish({ result: r, assistedByPlayerId: null, receivedByPlayerId: null });
                    }
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          ) : null}

          {step === "assist" ? (
            <div className="space-y-2">
              <div className="grid max-h-48 gap-1 overflow-y-auto">
                {teammateChoices.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`${btnSecondary} w-full py-2 text-left`}
                    onClick={() =>
                      finish({
                        result: "Kill",
                        assistedByPlayerId: p.id,
                        receivedByPlayerId: null,
                      })
                    }
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={`${btnPrimary} w-full py-2`}
                onClick={() =>
                  finish({
                    result: "Kill",
                    assistedByPlayerId: null,
                    receivedByPlayerId: null,
                  })
                }
              >
                Unassisted
              </button>
            </div>
          ) : null}

          {step === "receive" ? (
            <div className="grid max-h-56 gap-1 overflow-y-auto">
              {opponentTeam.players.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`${btnSecondary} w-full py-2 text-left`}
                  onClick={() =>
                    finish({
                      result: "Received",
                      assistedByPlayerId: null,
                      receivedByPlayerId: p.id,
                    })
                  }
                >
                  {p.name}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex justify-end border-t border-zinc-800 px-4 py-3">
          <button type="button" onClick={onClose} className={btnSecondary}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
