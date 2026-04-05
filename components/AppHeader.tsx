"use client";

import Link from "next/link";
import { LogoBrand } from "@/components/LogoBrand";
import { btnPrimary, btnSecondary } from "@/lib/ui";

type AppHeaderProps = {
  onLoadCsv: () => void;
};

export function AppHeader({ onLoadCsv }: AppHeaderProps) {
  return (
    <header className="relative z-20 grid h-14 shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-b border-zinc-800 bg-[#0a0a0a] px-4">
      <div className="flex min-w-0 items-center justify-start">
        <LogoBrand />
      </div>

      <h1 className="text-center text-base font-semibold tracking-tight text-zinc-100">K-Track</h1>

      <div className="flex min-w-0 items-center justify-end gap-2">
        <button type="button" onClick={onLoadCsv} className={`${btnPrimary} shrink-0`}>
          Load CSV
        </button>
        <Link href="/trackings" className={`${btnSecondary} shrink-0 text-center`}>
          Previous Trackings
        </Link>
      </div>
    </header>
  );
}
