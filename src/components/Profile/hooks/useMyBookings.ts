// src/components/Profile/hooks/useMyBookings.ts
import { useCallback, useEffect, useState } from 'react';
import { getBookingsByProfile } from '../../../api/bookingsApi';
import type { TBookingWithVenue } from '../../../types/bookingTypes';

/**
 * Loads bookings for a given profile name with venue included.
 * Runs only when profileName is present.
 * Also exposes small helpers to update local state optimistically.
 */
export function useMyBookings(profileName?: string) {
  const [bookings, setBookings] = useState<TBookingWithVenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  const reload = useCallback(() => {
    setReloadCounter((count) => count + 1);
  }, []);

  const removeBookingLocally = useCallback((bookingId: string) => {
    setBookings((previous) => previous.filter((item) => item.id !== bookingId));
  }, []);

  const replaceBookingLocally = useCallback((updated: TBookingWithVenue) => {
    setBookings((previous) => previous.map((item) => (item.id === updated.id ? updated : item)));
  }, []);

  useEffect(() => {
    if (!profileName) {
      setBookings([]);
      setLoading(false);
      return;
    }

    let isEffectActive = true;

    async function load(name: string) {
      try {
        setLoading(true);
        setErrorMessage(null);
        const bookingsList = await getBookingsByProfile(name, {
          withVenue: true,
        });
        if (!isEffectActive) return;
        setBookings(bookingsList);
      } catch (error) {
        if (!isEffectActive) return;
        const message = (error as Error)?.message || 'Failed to load bookings';
        setErrorMessage(message);
      } finally {
        if (isEffectActive) setLoading(false);
      }
    }

    load(profileName);
    return () => {
      isEffectActive = false;
    };
  }, [profileName, reloadCounter]);

  return {
    bookings,
    loading,
    error: errorMessage,
    reload,
    removeBookingLocally,
    replaceBookingLocally,
  };
}
