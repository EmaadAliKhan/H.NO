"use client";

import { useMemo, useState } from "react";
import {
  formatCtype,
  formatMunicipal,
  lookup,
  type LookupDirection,
  type MappingData,
} from "@/lib/lookup";

type ConverterProps = {
  data: MappingData;
};

const examples = {
  municipal: ["395", "7-1-277/93/1", "208/2"],
  ctype: ["12", "368/C", "17/C"],
};

export function Converter({ data }: ConverterProps) {
  const [direction, setDirection] = useState<LookupDirection>("municipal");
  const [query, setQuery] = useState("");

  const result = useMemo(() => lookup(query, direction), [query, direction]);

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="rounded-3xl bg-[var(--card)] p-4 shadow-sm ring-1 ring-[var(--border)]">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#eef4fb] p-1">
          <button
            className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
              direction === "municipal"
                ? "bg-white text-[var(--accent-dark)] shadow-sm"
                : "text-[var(--muted)]"
            }`}
            onClick={() => setDirection("municipal")}
            type="button"
          >
            Municipal to C-Type
          </button>
          <button
            className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
              direction === "ctype"
                ? "bg-white text-[var(--accent-dark)] shadow-sm"
                : "text-[var(--muted)]"
            }`}
            onClick={() => setDirection("ctype")}
            type="button"
          >
            C-Type to Municipal
          </button>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {direction === "municipal"
              ? "Enter municipal house number"
              : "Enter C-Type house number"}
          </span>
          <input
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-4 text-lg outline-none ring-[var(--accent)] focus:ring-2"
            inputMode={direction === "ctype" ? "text" : "text"}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              direction === "municipal"
                ? "e.g. 395 or 7-1-277/93/1"
                : "e.g. 12 or 368/C"
            }
            spellCheck={false}
            value={query}
          />
        </label>

        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          Tip: you can enter just the suffix like <strong>395</strong> instead
          of the full <strong>{data.meta.prefix}395</strong>.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {examples[direction].map((example) => (
            <button
              key={example}
              className="rounded-full bg-[#eef4fb] px-3 py-2 text-xs font-semibold text-[var(--accent-dark)]"
              onClick={() => setQuery(example)}
              type="button"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-[var(--card)] p-4 shadow-sm ring-1 ring-[var(--border)]">
        {!query.trim() ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)]">
            Start typing to see the converted house number.
          </div>
        ) : result.matches.length > 0 ? (
          <div className="space-y-3">
            {result.matches.map((match) => (
              <article
                key={`${match.municipal}-${match.ctype}`}
                className="rounded-2xl bg-[#f8fbff] px-4 py-4 ring-1 ring-[var(--border)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--success)]">
                  Match found
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                      Municipal
                    </p>
                    <p className="mt-1 text-lg font-bold text-[var(--foreground)]">
                      {formatMunicipal(match.municipal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                      C-Type
                    </p>
                    <p className="mt-1 text-lg font-bold text-[var(--foreground)]">
                      {formatCtype(match.ctype)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-amber-50 px-4 py-4 text-sm text-amber-900">
            No match found for{" "}
            <strong>{result.normalizedInput || query.trim()}</strong>. Try the
            full municipal suffix or include <strong>/C</strong> for C-Type
            numbers when needed.
          </div>
        )}
      </div>

      <footer className="pb-8 text-center text-xs leading-5 text-[var(--muted)]">
        {data.meta.municipalCount} municipal mappings and {data.meta.ctypeCount}{" "}
        C-Type mappings loaded from the colony register.
      </footer>
    </section>
  );
}
