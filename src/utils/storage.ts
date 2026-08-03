/**
 * localStorage access for the whole app, in one place so a missing key, private
 * browsing or a corrupt value can never throw at start-up.
 *
 * The component gallery at /storybook sets `window.__IRACING_EPHEMERAL__` before the
 * app boots. In that mode reads return nothing and writes are dropped, so clicking
 * around the demo cards can neither see nor overwrite a real visitor's garage,
 * saved schedule or theme.
 */

const ephemeral = typeof window !== 'undefined'
  && (window as { __IRACING_EPHEMERAL__?: boolean }).__IRACING_EPHEMERAL__ === true;

/** True when persistence is switched off (the storybook page). */
export const isEphemeral = ephemeral;

/** The raw stored string, or null when absent, unreadable or ephemeral. */
export function readRaw(key: string): string | null {
  if (ephemeral) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** The parsed value, or null when absent, unparseable or ephemeral. */
export function readJSON<T>(key: string): T | null {
  const raw = readRaw(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeRaw(key: string, value: string): void {
  if (ephemeral) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* quota or private mode - the app works fine unsaved */
  }
}

export function writeJSON(key: string, value: unknown): void {
  writeRaw(key, JSON.stringify(value));
}
