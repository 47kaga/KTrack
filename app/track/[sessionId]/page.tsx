import { TrackSessionPageLoader } from "@/components/TrackSessionPageLoader";

export default async function TrackSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <TrackSessionPageLoader sessionId={sessionId} />;
}
