"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function AuthForm() {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const { accessToken, loading, login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  useEffect(() => {
    if (!loading && accessToken && user?.roles.includes("ADMIN")) {
      router.replace(next);
    }
  }, [accessToken, loading, next, router, user?.roles]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(username.trim(), password);
      router.replace(next);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-[78vh] place-items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="surface grid w-full max-w-5xl overflow-hidden rounded-lg lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-white/10 bg-navy-950/70 p-8 lg:border-b-0 lg:border-r">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-electric-500/40 bg-electric-500/12 text-electric-500">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <h1 className="mt-8 text-3xl font-bold text-white">Admin sign in</h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Authenticate before updating the profile, project case studies, CV link,
            skills, education, certifications, and experience.
          </p>
        </div>

        <form className="grid gap-5 p-8" onSubmit={handleSubmit}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-success-500">
              Secure Dashboard
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">Continue to admin</h2>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-white">
            Username
            <input
              autoComplete="username"
              className="focus-ring min-h-11 rounded-md border border-white/10 bg-navy-950 px-3 text-white placeholder:text-slate-500"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              required
              type="text"
              value={username}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-white">
            Password
            <input
              autoComplete="current-password"
              className="focus-ring min-h-11 rounded-md border border-white/10 bg-navy-950 px-3 text-white placeholder:text-slate-500"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <div className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-electric-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-electric-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting || loading}
            type="submit"
          >
            {submitting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <LockKeyhole className="h-4 w-4" />
            )}
            <span>{submitting ? "Signing in..." : "Sign in"}</span>
            {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>
      </section>
    </main>
  );
}
