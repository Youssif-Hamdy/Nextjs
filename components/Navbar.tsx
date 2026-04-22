"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/news", label: "News" },
    { href: "/about", label: "About" },
  ];

  const linkBase =
    "relative text-sm font-medium text-neutral-400 transition-colors duration-200 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-red-950 after:transition-transform after:duration-300 hover:after:scale-x-100";

  const linkActive =
    "text-white after:scale-x-100 after:bg-red-950";

  const staggerDelays = ["yh-delay-1", "yh-delay-2", "yh-delay-3", "yh-delay-4"];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950">
      <nav className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo variant="onDark" href="/" />

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              className={`yh-animate-up ${staggerDelays[i] ?? ""}`}
            >
              <Link
                href={link.href}
                className={`${linkBase} ${pathname === link.href ? linkActive : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {status !== "loading" && !session && (
            <Link
              href="/login"
              className="hidden rounded-lg bg-red-950 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-950/30 transition duration-200 hover:bg-black hover:shadow-black/25 sm:inline-flex"
            >
              Login
            </Link>
          )}
          {status !== "loading" && session && (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm font-semibold text-neutral-200">
                {session.user?.name ?? session.user?.email ?? "Account"}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        className={`border-t border-white/10 bg-neutral-950 md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 overflow-hidden opacity-0"
        } transition-all duration-300 ease-out`}
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-red-950 text-white"
                    : "text-neutral-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            {!session ? (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-red-950 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-black"
              >
                Login
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void signOut({ callbackUrl: "/" });
                }}
                className="block w-full rounded-lg bg-white/5 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Logout
              </button>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
