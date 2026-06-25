import rawMappings from "@/data/mappings.json";

export type MappingData = {
  meta: {
    title: string;
    location: string;
    prefix: string;
    municipalCount: number;
    ctypeCount: number;
  };
  municipalToCtype: Record<string, string>;
  ctypeToMunicipal: Record<string, string>;
};

export const mappingData = rawMappings as MappingData;

const PREFIX = mappingData.meta.prefix;

export type LookupDirection = "municipal" | "ctype";

export type LookupResult = {
  input: string;
  normalizedInput: string;
  direction: LookupDirection;
  matches: Array<{
    municipal: string;
    ctype: string;
  }>;
};

function stripPrefix(value: string): string {
  return value.replace(/^7-1-277\/?/i, "").trim();
}

function normalizeCtype(value: string): string {
  const trimmed = value.trim().toUpperCase();
  if (!trimmed) {
    return "";
  }

  if (trimmed.includes("/")) {
    const [base, suffix] = trimmed.split("/");
    if (suffix === "C") {
      return `${base}/C`;
    }
    return trimmed;
  }

  return trimmed;
}

function normalizeMunicipal(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.toLowerCase().startsWith("7-1-277")) {
    return trimmed.replace(/\s+/g, "");
  }

  return `${PREFIX}${stripPrefix(trimmed)}`;
}

function municipalSuffix(value: string): string {
  return stripPrefix(value);
}

function ctypeVariants(value: string): string[] {
  const normalized = normalizeCtype(value);
  if (!normalized) {
    return [];
  }

  const variants = new Set<string>([normalized]);
  if (normalized.endsWith("/C")) {
    variants.add(normalized.replace("/C", ""));
  } else if (/^\d+$/.test(normalized)) {
    variants.add(`${normalized}/C`);
  }

  return [...variants];
}

function addMatch(
  matches: Map<string, { municipal: string; ctype: string }>,
  municipal: string,
  ctype: string,
) {
  matches.set(`${municipal}::${ctype}`, { municipal, ctype });
}

export function lookupByMunicipal(query: string): LookupResult {
  const normalizedInput = normalizeMunicipal(query);
  const suffix = municipalSuffix(normalizedInput).toLowerCase();
  const matches = new Map<string, { municipal: string; ctype: string }>();

  if (!suffix) {
    return { input: query, normalizedInput, direction: "municipal", matches: [] };
  }

  for (const [municipal, ctype] of Object.entries(mappingData.municipalToCtype)) {
    const candidate = municipalSuffix(municipal).toLowerCase();
    if (candidate === suffix) {
      addMatch(matches, municipal, ctype);
    }
  }

  if (matches.size === 0) {
    for (const [municipal, ctype] of Object.entries(mappingData.municipalToCtype)) {
      const candidate = municipalSuffix(municipal).toLowerCase();
      if (candidate.includes(suffix)) {
        addMatch(matches, municipal, ctype);
      }
    }
  }

  return {
    input: query,
    normalizedInput,
    direction: "municipal",
    matches: [...matches.values()],
  };
}

export function lookupByCtype(query: string): LookupResult {
  const normalizedInput = normalizeCtype(query);
  const matches = new Map<string, { municipal: string; ctype: string }>();

  if (!normalizedInput) {
    return { input: query, normalizedInput, direction: "ctype", matches: [] };
  }

  for (const variant of ctypeVariants(normalizedInput)) {
    const municipal = mappingData.ctypeToMunicipal[variant];
    if (municipal) {
      addMatch(matches, municipal, variant);
      const reverse = mappingData.municipalToCtype[municipal];
      if (reverse) {
        addMatch(matches, municipal, reverse);
      }
    }
  }

  for (const [municipal, ctype] of Object.entries(mappingData.municipalToCtype)) {
    for (const variant of ctypeVariants(normalizedInput)) {
      if (
        normalizeCtype(ctype) === variant ||
        normalizeCtype(ctype).replace("/C", "") === variant.replace("/C", "")
      ) {
        addMatch(matches, municipal, ctype);
      }
    }
  }

  return {
    input: query,
    normalizedInput,
    direction: "ctype",
    matches: [...matches.values()],
  };
}

export function lookup(query: string, direction: LookupDirection): LookupResult {
  return direction === "municipal"
    ? lookupByMunicipal(query)
    : lookupByCtype(query);
}

export function formatMunicipal(value: string): string {
  return value.startsWith(PREFIX) ? value : `${PREFIX}${value}`;
}

export function formatCtype(value: string): string {
  return value;
}
