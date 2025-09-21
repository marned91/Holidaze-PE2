import { useEffect, useState } from 'react';
import { searchVenuesByName } from '../api/venuesApi';
import type { TVenue } from '../types/venueTypes';
import { isInNorway } from '../components/VenuesHome/sortAndFilter';

/**
 * React hook that searches venues by name and returns Norwegian results only.
 *
 * @remarks
 * - Trims the incoming query; empty queries clear results and errors.
 * - Exposes loading and error states.
 * - No functional changes were made.
 *
 * @param searchQuery - Raw user-entered query string.
 * @returns Object with `isSearching`, `searchError`, and `searchResults`.
 */
export function useVenueSearch(searchQuery: string): {
  isSearching: boolean;
  searchError: string | null;
  searchResults: TVenue[];
} {
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TVenue[]>([]);

  useEffect(() => {
    let isActive = true;

    async function run() {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        if (!isActive) return;
        setIsSearching(false);
        setSearchError(null);
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const items = await searchVenuesByName(trimmed);
        if (isActive) setSearchResults(items.filter(isInNorway));
      } catch (error: unknown) {
        if (isActive) {
          const message =
            error instanceof Error ? error.message : 'Search failed';
          setSearchError(message);
        }
      } finally {
        if (isActive) setIsSearching(false);
      }
    }

    run();
    return () => {
      isActive = false;
    };
  }, [searchQuery]);

  return { isSearching, searchError, searchResults };
}
