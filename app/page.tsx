import Link from "next/link";
import { btnSecondary } from "@/lib/ui";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-16">
      <div className="border border-zinc-800 bg-zinc-950/50 px-6 py-10">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Live tracking</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100">
          Start a session to track spikes, apes, and serves
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Use <span className="text-zinc-200">Load CSV</span> in the header to name teams, add players, and optionally attach a CSV file for future import. Sessions are stored in this browser.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <p className="text-xs text-zinc-500">
            Tip: after setup you open the live board; events save automatically.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/trackings" className={btnSecondary}>
            Previous Trackings
          </Link>
          <span className="self-center text-xs text-zinc-600">or use Load CSV above</span>
        </div>
      </div>
    </div>
  );
}
