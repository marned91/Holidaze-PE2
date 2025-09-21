/**
 * Utilities for storing and migrating auth session data in localStorage.
 * Mirrors current key names; no behavior changes.
 */

/** Key for the bearer token in localStorage. */
export const TOKEN_KEY = 'token';
/** Key for the username in localStorage. */
export const USERNAME_KEY = 'username';

/** Legacy composite auth object key (deprecated). */
const OLD_AUTH_STORAGE_KEY = 'auth';
/** Legacy user object key (deprecated). */
const OLD_USER_STORAGE_KEY = 'user';

/**
 * Persist the current auth session.
 * Stores the access token and the username under stable keys.
 *
 * @param token - Access token string as issued by the API.
 * @param username - Account display name / handle for UI use.
 */
export function setAuthSession(token: string, username: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

/**
 * Read the stored access token, if any.
 * @returns The token string or `null` when missing.
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Read the stored username, if any.
 * @returns The username string or `null` when missing.
 */
export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

/**
 * Clear all known auth/session entries from localStorage.
 * Also removes legacy keys to avoid stale state.
 */
export function clearAuthSession() {
  [TOKEN_KEY, USERNAME_KEY, OLD_AUTH_STORAGE_KEY, OLD_USER_STORAGE_KEY].forEach(
    (key) => localStorage.removeItem(key)
  );
}

/**
 * One-time migration from legacy storage formats to the current keys.
 *
 * @remarks
 * - If the current keys (`token`, `username`) already exist, the migration
 *   no-ops and removes legacy keys to keep storage tidy.
 * - Safely parses legacy JSON payloads; on parse errors, it removes the
 *   offending legacy key and continues.
 * - This function is idempotent and safe to call at app startup.
 */
export function migrateOldStorageOnce() {
  if (localStorage.getItem(TOKEN_KEY) || localStorage.getItem(USERNAME_KEY)) {
    localStorage.removeItem(OLD_AUTH_STORAGE_KEY);
    localStorage.removeItem(OLD_USER_STORAGE_KEY);
    return;
  }

  try {
    const oldAuthJsonString = localStorage.getItem(OLD_AUTH_STORAGE_KEY);
    if (oldAuthJsonString) {
      const oldAuthObject = JSON.parse(oldAuthJsonString) as Partial<{
        token: string;
        username: string;
      }>;
      if (typeof oldAuthObject.token === 'string') {
        localStorage.setItem(TOKEN_KEY, oldAuthObject.token);
      }
      if (typeof oldAuthObject.username === 'string') {
        localStorage.setItem(USERNAME_KEY, oldAuthObject.username);
      }
      localStorage.removeItem(OLD_AUTH_STORAGE_KEY);
    }
  } catch {
    localStorage.removeItem(OLD_AUTH_STORAGE_KEY);
  }

  try {
    const oldUserJsonString = localStorage.getItem(OLD_USER_STORAGE_KEY);
    if (oldUserJsonString) {
      const oldUserObject = JSON.parse(oldUserJsonString) as Partial<{
        accessToken: string;
        name: string;
      }>;
      if (typeof oldUserObject.accessToken === 'string') {
        localStorage.setItem(TOKEN_KEY, oldUserObject.accessToken);
      }
      if (typeof oldUserObject.name === 'string') {
        localStorage.setItem(USERNAME_KEY, oldUserObject.name);
      }
      localStorage.removeItem(OLD_USER_STORAGE_KEY);
    }
  } catch {
    localStorage.removeItem(OLD_USER_STORAGE_KEY);
  }
}
