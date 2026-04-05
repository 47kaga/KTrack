"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { SessionSetupModal } from "@/components/SessionSetupModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [setupOpen, setSetupOpen] = useState(false);

  const handleComplete = useCallback(
    (sessionId: string) => {
      setSetupOpen(false);
      router.push(`/track/${sessionId}`);
    },
    [router],
  );

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader onLoadCsv={() => setSetupOpen(true)} />
      <main className="flex flex-1 flex-col">{children}</main>
      <SessionSetupModal
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        onComplete={handleComplete}
      />
    </div>
  );
}
