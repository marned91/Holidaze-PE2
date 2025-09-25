import { useEffect, useState } from 'react';
import { getAccessToken, migrateOldStorageOnce } from '../utils/authStorage';

migrateOldStorageOnce();

export const AUTH_CHANGED_EVENT = 'auth:changed';

/** Returns true if an access token exists and is a non-empty string. */
function hasToken(): boolean {
  try {
    const token = getAccessToken();
    return typeof token === 'string' && token.length > 0;
  } catch {
    return false;
  }
}

/**
 * Dispatches the auth changed custom event on `window`.
 *
 * @remarks
 * - Consumers can listen via `window.addEventListener(AUTH_CHANGED_EVENT, handler)`.
 */
export function authChanged(): void {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

/**
 * React hook that derives whether the user is logged in based on the presence of an access token.
 *
 * @remarks
 * - Subscribes to both `storage` events and a custom `AUTH_CHANGED_EVENT` to keep state in sync.
 * - No external side effects beyond event listeners.
 *
 * @returns Object with a single boolean `isLoggedIn`.
 */
export function useAuthStatus(): { isLoggedIn: boolean } {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(hasToken());

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea === localStorage) setIsLoggedIn(hasToken());
    };
    const onAuthChanged = () => setIsLoggedIn(hasToken());

    window.addEventListener('storage', onStorage);
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged as EventListener);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged as EventListener);
    };
  }, []);

  return { isLoggedIn };
}
