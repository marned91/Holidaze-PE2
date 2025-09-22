import { useCallback, useEffect, useState } from 'react';
import { getProfile } from '../../../api/profilesApi';
import type { TProfile } from '../../../types/profileTypes';

/**
 * Loads a profile by username and exposes loading state, error message and a reload function.
 */
export function useProfile(username: string) {
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  const reload = useCallback(() => {
    setReloadCounter((count) => count + 1);
  }, []);

  useEffect(() => {
    if (!username) {
      setProfile(null);
      setErrorMessage('Missing username');
      setLoading(false);
      return;
    }

    let isEffectActive = true;

    async function load() {
      try {
        setLoading(true);
        setErrorMessage(null);
        const data = await getProfile(username);
        if (!isEffectActive) return;
        setProfile(data);
      } catch (error) {
        if (!isEffectActive) return;
        const message = (error as Error)?.message || 'Failed to load profile';
        setErrorMessage(message);
      } finally {
        if (isEffectActive) setLoading(false);
      }
    }

    load();
    return () => {
      isEffectActive = false;
    };
  }, [username, reloadCounter]);

  return { profile, loading, error: errorMessage, reload };
}
