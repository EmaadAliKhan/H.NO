import mappings from "@/data/mappings.json";
import { LoginGate } from "@/components/LoginGate";
import { Converter } from "@/components/Converter";

export default function HomePage() {
  return (
    <LoginGate>
      <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-5 sm:px-6">
        <header className="mb-5 rounded-3xl bg-[var(--card)] p-5 shadow-sm ring-1 ring-[var(--border)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            APHB C-Type Colony
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-[var(--foreground)]">
            House Number Converter
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Look up municipal numbers and C-Type house numbers both ways. Built
            for quick use on mobile.
          </p>
        </header>

        <Converter data={mappings} />
      </main>
    </LoginGate>
  );
}
