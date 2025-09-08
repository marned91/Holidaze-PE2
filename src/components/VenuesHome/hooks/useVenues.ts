import { useEffect, useState } from 'react';
import { doFetch } from '../../../api/doFetch';
import { API_VENUES } from '../../../api/endpoints';
import { type TVenue } from '../../../types/venues';

export type UseVenuesResult = {
  venues: TVenue[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useVenues(limit = 50): UseVenuesResult {
  const [venues, setVenues] = useState<TVenue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(
    function loadVenuesEffect() {
      let isComponentActive = true;

      async function fetchVenues() {
        setLoading(true);
        setError(null);

        try {
          const responseData = await doFetch<TVenue[]>(
            `${API_VENUES}?limit=${limit}&_bookings=true`,
            { method: 'GET', auth: false }
          );

          if (!isComponentActive) return;

          const venuesSortedByNewest = (responseData ?? []).sort(
            (venueA, venueB) =>
              new Date(venueB.created).getTime() -
              new Date(venueA.created).getTime()
          );

          setVenues(venuesSortedByNewest);
        } catch (caughtError: any) {
          if (isComponentActive) {
            setError(
              caughtError?.message ??
                'Failed to load venues, please reload the page'
            );
          }
        } finally {
          if (isComponentActive) setLoading(false);
        }
      }

      fetchVenues();

      return () => {
        isComponentActive = false;
      };
    },
    [limit, reloadKey]
  );

  function reload() {
    setReloadKey((previousKey) => previousKey + 1);
  }

  return { venues, loading, error, reload };
}
