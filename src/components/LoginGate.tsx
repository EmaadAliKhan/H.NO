"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import {
  getDefaultUsername,
  getStoredAuth,
  setStoredAuth,
  validateCredentials,
} from "@/lib/auth";

type LoginGateProps = {
  children: ReactNode;
};

export function LoginGate({ children }: LoginGateProps) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState(getDefaultUsername());
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthenticated(getStoredAuth());
    setReady(true);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (validateCredentials(username, password)) {
      setStoredAuth(true);
      setAuthenticated(true);
      setPassword("");
      return;
    }

    setError("Incorrect username or password.");
  }

  function handleLogout() {
    setStoredAuth(false);
    setAuthenticated(false);
    setPassword("");
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 text-sm text-[var(--muted)]">
        Loading...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-lg items-center px-4 py-8 sm:px-6">
        <section className="w-full rounded-3xl bg-[var(--card)] p-6 shadow-sm ring-1 ring-[var(--border)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Protected access
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
            Sign in to use the converter
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Enter the shared username and password to open the house number
            lookup on your phone.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--foreground)]">
                Username
              </span>
              <input
                autoComplete="username"
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none ring-[var(--accent)] focus:ring-2"
                onChange={(event) => setUsername(event.target.value)}
                value={username}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--foreground)]">
                Password
              </span>
              <input
                autoComplete="current-password"
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none ring-[var(--accent)] focus:ring-2"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </label>

            {error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              className="w-full rounded-2xl bg-[var(--accent)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--accent-dark)]"
              type="submit"
            >
              Continue
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="fixed right-4 top-4 z-20">
        <button
          className="rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-[var(--muted)] shadow-sm ring-1 ring-[var(--border)] backdrop-blur"
          onClick={handleLogout}
          type="button"
        >
          Log out
        </button>
      </div>
      {children}
    </>
  );
}
