import type { TrackingSession } from "@/types";

const SESSIONS_KEY = "ktrack:sessions:v1";

function readRaw(): TrackingSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as TrackingSession[];
  } catch {
    return [];
  }
}

function writeAll(sessions: TrackingSession[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function getAllSessions(): TrackingSession[] {
  return readRaw().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getSessionById(id: string): TrackingSession | undefined {
  return readRaw().find((s) => s.id === id);
}

export function upsertSession(session: TrackingSession): void {
  const all = readRaw();
  const idx = all.findIndex((s) => s.id === session.id);
  if (idx >= 0) all[idx] = session;
  else all.push(session);
  writeAll(all);
}

export function deleteSession(id: string): void {
  writeAll(readRaw().filter((s) => s.id !== id));
}

/** Repository-style API for future DB swap */
export const sessionRepository = {
  list: getAllSessions,
  getById: getSessionById,
  save: upsertSession,
  remove: deleteSession,
};
