"use client";

import { useEffect, useState } from "react";

export default function ToastClient({
  message,
  durationMs = 3500,
}: {
  message: string;
  durationMs?: number;
}) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setOpen(false), durationMs);
    return () => clearTimeout(t);
  }, [durationMs]);

  if (!open) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] w-[min(92vw,420px)]">
      <div className="rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-xl backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-neutral-950">{message}</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
            aria-label="Close toast"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

