import Link from "next/link";

type LogoProps = {
  variant?: "onDark" | "onLight";
  showWordmark?: boolean;
  href?: string | null;
  className?: string;
};

export default function Logo({
  variant = "onDark",
  showWordmark = true,
  href = "/",
  className = "",
}: LogoProps) {
  const isDark = variant === "onDark";
  const wordClass = isDark ? "text-white" : "text-neutral-950";
  const subClass = "text-neutral-500";
  const markRing = isDark ? "ring-white/20" : "ring-neutral-950/15";

  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-950 shadow-lg ring-1 ${markRing} transition duration-300 ease-out will-change-transform group-hover:scale-[1.03] group-hover:shadow-red-950/40`}
        aria-hidden
      >
        <span className="absolute inset-x-2 top-2 h-px bg-white/25" />
        <span className="font-black text-sm leading-none tracking-tight text-white">
          YH
        </span>
        <span className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/60" />
      </span>
      {showWordmark && (
        <span className="flex min-w-0 flex-col text-left leading-none">
          <span
            className={`font-black text-base tracking-[0.22em] sm:text-lg ${wordClass}`}
          >
            YH
          </span>
          <span
            className={`mt-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.38em] ${subClass}`}
          >
            Store
          </span>
        </span>
      )}
    </span>
  );

  const ringOffset = isDark
    ? "focus-visible:ring-offset-neutral-950"
    : "focus-visible:ring-offset-white";
  const wrapClass = `group inline-flex rounded-lg outline-none transition focus-visible:ring-2 focus-visible:ring-red-950/50 focus-visible:ring-offset-2 ${ringOffset}`;

  if (href) {
    return (
      <Link href={href} className={wrapClass}>
        {content}
      </Link>
    );
  }

  return <span className={`group inline-flex ${wrapClass}`}>{content}</span>;
}
