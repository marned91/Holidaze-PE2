import { useEffect, useState } from 'react';
import { type TVenue } from '../../../types/venues';
import { listVenuesAll } from '../../../api/venues';

export type UseVenuesResult = {
  venues: TVenue[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

function isNorwegianVenue(venue: TVenue): boolean {
  const country = (venue.location?.country || '').trim().toLowerCase();
  return country === 'norway' || country === 'norge';
}

export function useVenues(limit = 100): UseVenuesResult {
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
          const apiVenues = await listVenuesAll({
            limitPerPage: 100,
            maxPages: 10,
            withBookings: true,
            sort: 'created',
            sortOrder: 'desc',
          });
          if (!isComponentActive) return;

          const norwegianOnly = (apiVenues ?? []).filter(isNorwegianVenue);

          const venuesSortedByNewest = [...norwegianOnly].sort(
            (venueA, venueB) => {
              const aTime = new Date(
                venueA.created || venueA.updated || 0
              ).getTime();
              const bTime = new Date(
                venueB.created || venueB.updated || 0
              ).getTime();
              return bTime - aTime;
            }
          );

          setVenues(venuesSortedByNewest);
        } catch (unknownError: unknown) {
          if (isComponentActive) {
            const message =
              (unknownError as Error)?.message ??
              'Failed to load venues, please reload the page';
            setError(message);
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
