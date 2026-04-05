"use client";

import { useCallback, useId, useState } from "react";
import { mockImportCsvFile } from "@/lib/mockCsv";
import { btnPrimary, btnSecondary } from "@/lib/ui";
import { newId } from "@/lib/ids";
import { upsertSession } from "@/lib/storage";
import type { ImportMetadata, Player, Team, TrackingSession } from "@/types";

type SessionSetupModalProps = {
  open: boolean;
  onClose: () => void;
  onComplete: (sessionId: string) => void;
};

function parsePlayerLines(text: string, teamId: string): Player[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((name) => ({ id: newId(), name, teamId }));
}

export function SessionSetupModal({
  open,
  onClose,
  onComplete,
}: SessionSetupModalProps) {
  const titleId = useId();
  const [title, setTitle] = useState("");
  const [teamAName, setTeamAName] = useState("Team A");
  const [teamBName, setTeamBName] = useState("Team B");
  const [playersA, setPlayersA] = useState("");
  const [playersB, setPlayersB] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setTitle("");
    setTeamAName("Team A");
    setTeamBName("Team B");
    setPlayersA("");
    setPlayersB("");
    setPendingFile(null);
    setError(null);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const t = title.trim();
    if (!t) {
      setError("Enter a session title.");
      return;
    }

    const teamAId = newId();
    const teamBId = newId();
    const listA = parsePlayerLines(playersA, teamAId);
    const listB = parsePlayerLines(playersB, teamBId);

    if (listA.length === 0 || listB.length === 0) {
      setError("Add at least one player per team (one name per line).");
      return;
    }

    let importMetadata: ImportMetadata | null = null;
    if (pendingFile) {
      const mock = mockImportCsvFile(pendingFile);
      importMetadata = {
        fileName: mock.fileName,
        fileSize: mock.fileSize,
        importedAt: new Date().toISOString(),
        placeholderRowCount: mock.placeholderRowCount,
      };
    }

    const teamA: Team = { id: teamAId, name: teamAName.trim() || "Team A", players: listA };
    const teamB: Team = { id: teamBId, name: teamBName.trim() || "Team B", players: listB };

    const now = new Date().toISOString();
    const session: TrackingSession = {
      id: newId(),
      title: t,
      createdAt: now,
      updatedAt: now,
      teams: [teamA, teamB],
      importMetadata,
      events: [],
    };

    upsertSession(session);
    reset();
    onComplete(session.id);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="w-full max-w-lg border border-zinc-800 bg-[#0a0a0a] shadow-lg">
        <div className="border-b border-zinc-800 px-4 py-3">
          <h2 id={titleId} className="text-sm font-semibold text-zinc-100">
            New session (CSV import placeholder)
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Real CSV parsing will plug in here later. For now, set teams and players manually.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
              Session title
            </label>
            <input
              className="mt-1 w-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-yellow-500/60"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. League match — Apr 5"
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Team A name
              </label>
              <input
                className="mt-1 w-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-yellow-500/60"
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Team B name
              </label>
              <input
                className="mt-1 w-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-yellow-500/60"
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Team A players
              </label>
              <textarea
                className="mt-1 min-h-[120px] w-full resize-y border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-yellow-500/60"
                value={playersA}
                onChange={(e) => setPlayersA(e.target.value)}
                placeholder={"One name per line\nAlice\nBob"}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Team B players
              </label>
              <textarea
                className="mt-1 min-h-[120px] w-full resize-y border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-yellow-500/60"
                value={playersB}
                onChange={(e) => setPlayersB(e.target.value)}
                placeholder={"One name per line\nChris\nDana"}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
              Optional CSV file (metadata only)
            </label>
            <input
              type="file"
              accept=".csv,text/csv"
              className="mt-1 w-full text-xs text-zinc-400 file:mr-3 file:border file:border-zinc-700 file:bg-zinc-900 file:px-2 file:py-1 file:text-xs file:text-zinc-200"
              onChange={(e) => setPendingFile(e.target.files?.[0] ?? null)}
            />
            {pendingFile ? (
              <p className="mt-1 text-xs text-zinc-500">
                Attached: {pendingFile.name} ({pendingFile.size} bytes)
              </p>
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex justify-end gap-2 border-t border-zinc-800 pt-4">
            <button type="button" onClick={handleClose} className={btnSecondary}>
              Cancel
            </button>
            <button type="submit" className={btnPrimary}>
              Start tracking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
