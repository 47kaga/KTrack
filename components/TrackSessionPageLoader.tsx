"use client";

import dynamic from "next/dynamic";

const TrackSessionGate = dynamic(
  () =>
    import("@/components/TrackSessionGate").then((m) => ({
      default: m.TrackSessionGate,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center px-4 py-16 text-sm text-zinc-500">
        Loading…
      </div>
    ),
  },
);

export function TrackSessionPageLoader({ sessionId }: { sessionId: string }) {
  return <TrackSessionGate sessionId={sessionId} />;
}
