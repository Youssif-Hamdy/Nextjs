import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
        Not found
      </p>
      <h1 className="text-6xl font-black text-neutral-950">404</h1>
      <h2 className="text-2xl font-bold text-neutral-950">Page not found</h2>
      <p className="text-neutral-600">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-red-950 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/25 transition hover:bg-black"
      >
        Go home
      </Link>
    </div>
  );
}
