"use client";
import Logo from "@/components/Logo";
import Link from "next/link";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [providers, setProviders] = useState<
    Awaited<ReturnType<typeof getProviders>> | null
  >(null);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(
    () => (mode === "login" ? "Sign in" : "Create account"),
    [mode]
  );

  useEffect(() => {
    let cancelled = false;
    getProviders()
      .then((p) => {
        if (!cancelled) setProviders(p);
      })
      .catch(() => {
        if (!cancelled) setProviders(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const githubEnabled = Boolean(providers?.github);
  const linkedinEnabled = Boolean(providers?.linkedin);

  return (
    <div className="relative flex min-h-[calc(100vh-4.25rem)] items-center justify-center bg-neutral-950 px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(127,29,29,0.25),_transparent_55%)]"
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-10 shadow-2xl yh-animate-up">
        <div className="mb-8 flex justify-center">
          <Logo variant="onLight" href="/" />
        </div>
        {status !== "loading" && session ? (
          <>
            <h2 className="text-center text-2xl font-black text-neutral-950">
              You&apos;re signed in
            </h2>
            <p className="mt-2 text-center text-sm text-neutral-500">
              {session.user?.email ?? "Account"}
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-red-950 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:bg-black"
            >
              Go to products
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-center text-2xl font-black text-neutral-950">
              {title}
            </h2>
            <p className="mt-2 text-center text-sm text-neutral-500">
              {mode === "login"
                ? "Use your email + password"
                : "Use your name, phone, email + password"}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-neutral-950 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-white text-neutral-950 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                Register
              </button>
            </div>

            <form
              className="mt-6 flex flex-col gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setSubmitting(true);
                try {
                  if (mode === "register") {
                    const res = await fetch("/api/auth/register", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: registerForm.name,
                        phone: registerForm.phone,
                        email: registerForm.email,
                        password: registerForm.password,
                      }),
                    });
                    const raw = (await res.json().catch(() => null)) as unknown;
                    if (!res.ok) {
                      const message =
                        raw && typeof raw === "object" && "error" in raw
                          ? String((raw as { error: unknown }).error)
                          : "Register failed";
                      throw new Error(message);
                    }
                    const r = await signIn("credentials", {
                      email: registerForm.email,
                      password: registerForm.password,
                      callbackUrl: "/products",
                      redirect: false,
                    });
                    if (!r || r.error) throw new Error("Login failed");
                    window.location.href = r.url ?? "/products";
                    return;
                  }

                  const r = await signIn("credentials", {
                    email: loginForm.email,
                    password: loginForm.password,
                    callbackUrl: "/products",
                    redirect: false,
                  });
                  if (!r || r.error) throw new Error("Invalid email or password");
                  window.location.href = r.url ?? "/products";
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Auth failed");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {mode === "register" && (
                <>
                  <input
                    placeholder="Name"
                    required
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
                  />
                  <input
                    placeholder="Phone"
                    required
                    value={registerForm.phone}
                    onChange={(e) =>
                      setRegisterForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
                  />
                </>
              )}

              <input
                type="email"
                placeholder="Email"
                required
                autoComplete="email"
                value={mode === "login" ? loginForm.email : registerForm.email}
                onChange={(e) => {
                  const v = e.target.value;
                  if (mode === "login") setLoginForm((p) => ({ ...p, email: v }));
                  else setRegisterForm((p) => ({ ...p, email: v }));
                }}
                className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
              />
              <input
                type="password"
                placeholder="Password"
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={
                  mode === "login" ? loginForm.password : registerForm.password
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (mode === "login")
                    setLoginForm((p) => ({ ...p, password: v }));
                  else setRegisterForm((p) => ({ ...p, password: v }));
                }}
                className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
              />

              {error && (
                <p className="rounded-lg bg-red-950/10 px-4 py-2 text-sm text-red-950">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 w-full rounded-lg bg-red-950 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:bg-black disabled:opacity-60"
              >
                {submitting
                  ? "Please wait…"
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-xs font-semibold text-neutral-500">OR</span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <div className="flex flex-col gap-3">
              {githubEnabled && (
                <button
                  type="button"
                  onClick={() => signIn("github", { callbackUrl: "/products" })}
                  className="w-full rounded-lg bg-neutral-950 py-3 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Continue with GitHub
                </button>
              )}
              {linkedinEnabled && (
                <button
                  type="button"
                  onClick={() => signIn("linkedin", { callbackUrl: "/products" })}
                  className="w-full rounded-lg border border-neutral-300 bg-white py-3 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950"
                >
                  Continue with LinkedIn
                </button>
              )}
              {!githubEnabled && !linkedinEnabled && (
                <p className="text-center text-xs font-medium text-neutral-500">
                  OAuth providers are not configured yet.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
