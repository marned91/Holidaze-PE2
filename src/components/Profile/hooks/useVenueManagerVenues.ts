// src/components/Profile/hooks/useVenueManagerVenues.ts
import { useCallback, useEffect, useState } from 'react';
import { getVenuesByOwner } from '../../../api/venuesApi';
import type { TVenue } from '../../../types/venueTypes';

/**
 * Loads venues for a given owner with bookings included.
 * Runs only when enabled is true and profileName is present.
 * Also exposes small helpers to update local state optimistically.
 */
export function useVenueManagerVenues(profileName?: string, enabled?: boolean) {
  const [venues, setVenues] = useState<TVenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  const reload = useCallback(() => {
    setReloadCounter((count) => count + 1);
  }, []);

  const removeVenueLocally = useCallback((venueId: string) => {
    setVenues((previous) => previous.filter((item) => item.id !== venueId));
  }, []);

  const replaceVenueLocally = useCallback((updated: TVenue) => {
    setVenues((previous) =>
      previous.map((item) => (item.id === updated.id ? updated : item))
    );
  }, []);

  useEffect(() => {
    if (!enabled || !profileName) {
      setVenues([]);
      setLoading(false);
      return;
    }

    let isEffectActive = true;

    async function load(name: string) {
      try {
        setLoading(true);
        setErrorMessage(null);
        const venuesList = await getVenuesByOwner(name, { withBookings: true });
        if (!isEffectActive) return;
        setVenues(venuesList);
      } catch (error) {
        if (!isEffectActive) return;
        const message = (error as Error)?.message || 'Failed to load venues';
        setErrorMessage(message);
      } finally {
        if (isEffectActive) setLoading(false);
      }
    }

    load(profileName);
    return () => {
      isEffectActive = false;
    };
  }, [profileName, enabled, reloadCounter]);

  return {
    venues,
    loading,
    error: errorMessage,
    reload,
    removeVenueLocally,
    replaceVenueLocally,
  };
}
