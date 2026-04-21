import ToastClient from "@/components/ToastClient";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const NEWS = [
  "Breaking: new products just dropped.",
  "Flash sale vibes — check the catalog.",
  "Stock update: some items may sell out fast.",
  "Heads up: new arrivals are live now.",
  "Today’s pick: browse by category for hidden gems.",
];

export default async function NewsPage() {
  const h = await headers();
  const seed =
    h.get("x-vercel-id") ??
    h.get("x-request-id") ??
    h.get("user-agent") ??
    "";
  const idx =
    seed.split("").reduce((acc, ch) => (acc + ch.charCodeAt(0)) % 100000, 0) %
    NEWS.length;
  const message = NEWS[idx];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <ToastClient key={message} message={`News: ${message}`} />
      <div className="yh-animate-up">
        <h1 className="text-3xl font-black tracking-tight text-neutral-950">
          News 
        </h1>
        <p className="mt-2 text-neutral-600">
          Notifacion
        </p>
      </div>

      <div className="yh-animate-up yh-delay-1 mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-neutral-600">Latest headline</p>
        <p className="mt-2 text-xl font-black text-neutral-950">{message}</p>
      </div>
    </div>
  );
}

