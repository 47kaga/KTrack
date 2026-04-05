"use client";

import dynamic from "next/dynamic";

const TrackingsClient = dynamic(
  () =>
    import("@/components/TrackingsClient").then((m) => ({
      default: m.TrackingsClient,
    })),
  { ssr: false },
);

export function TrackingsPageLoader() {
  return <TrackingsClient />;
}
