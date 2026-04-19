"use client";

import Link from "next/link";

/** Renders without `(site)` layout — root layout has no navbar/footer. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-950 px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
        Error
      </p>
      <h1 className="text-6xl font-black text-red-950">500</h1>
      <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
      <p className="max-w-md text-sm text-neutral-400">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-red-950 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-950/25 transition hover:bg-black"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-white/20 bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
