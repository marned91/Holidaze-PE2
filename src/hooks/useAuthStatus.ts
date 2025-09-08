import { useEffect, useState } from 'react';

export const AUTH_TOKEN_KEYS = ['accessToken', 'token', 'authToken'];
export const AUTH_CHANGED_EVENT = 'auth:changed';

function hasToken(): boolean {
  try {
    return AUTH_TOKEN_KEYS.some((key) => {
      const value = localStorage.getItem(key as string);
      return typeof value === 'string' && value.length > 0;
    });
  } catch {
    return false;
  }
}

export function authChanged(): void {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

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
      window.removeEventListener(
        AUTH_CHANGED_EVENT,
        onAuthChanged as EventListener
      );
    };
  }, []);

  return { isLoggedIn };
}
