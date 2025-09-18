import { useEffect, useState } from 'react';
import { searchVenuesByName } from '../api/venuesApi';
import type { TVenue } from '../types/venueTypes';

export function useVenueSearch(searchQuery: string) {
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
        if (isActive) setSearchResults(items);
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
