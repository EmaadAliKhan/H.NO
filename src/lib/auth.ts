const AUTH_KEY = "ctype-mapper-auth";

// Default demo credentials. Override at build time for production.
const EXPECTED_USERNAME =
  process.env.NEXT_PUBLIC_APP_USERNAME?.trim() || "nw";
const EXPECTED_PASSWORD =
  process.env.NEXT_PUBLIC_APP_PASSWORD?.trim() || "ctype2026";

export function getStoredAuth(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(AUTH_KEY) === "1";
}

export function setStoredAuth(value: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  if (value) {
    window.sessionStorage.setItem(AUTH_KEY, "1");
  } else {
    window.sessionStorage.removeItem(AUTH_KEY);
  }
}

export function validateCredentials(username: string, password: string): boolean {
  return (
    username.trim().toLowerCase() === EXPECTED_USERNAME.toLowerCase() &&
    password === EXPECTED_PASSWORD
  );
}

export function getDefaultUsername(): string {
  return EXPECTED_USERNAME;
}
