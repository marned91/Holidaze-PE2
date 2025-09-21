import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { type TVenue } from '../../types/venueTypes';
import { VenueSort } from './VenueSort';
import { VenueCard } from './VenueCard';
import { VenuesFilters } from './VenuesFilters';
import type { TDateRange } from '../../types/dateTypes';
import { useVenues } from './hooks/useVenues';
import { Pagination } from './Pagination';
import {
  getCityOptions,
  filterVenues,
  sortVenues,
  type SortOrder,
} from './sortAndFilter';
import { SearchResults } from '../Common/SearchResults';

type VenuesListProps = { pageSize?: number };

/**
 * Lists available venues with client-side filtering, sorting, and pagination.
 *
 * @remarks
 * - When a `q` query param is present, renders `<SearchResults>` instead of the standard list.
 * - Section is labeled via `aria-labelledby` and exposes `aria-busy` while loading.
 * - Uses polite status for loading and `role="alert"` for error feedback.
 * - No functional or styling changes were made.
 */
export function VenuesList({ pageSize = 12 }: VenuesListProps) {
  const location = useLocation();
  const searchQuery =
    new URLSearchParams(location.search).get('q')?.trim() ?? '';

  const { venues: allVenues, loading, error: loadError } = useVenues(100);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [minGuests, setMinGuests] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<TDateRange>({});

  useEffect(() => {
    if (!loading) setCurrentPage(1);
  }, [
    loading,
    pageSize,
    sortOrder,
    selectedCity,
    minGuests,
    dateRange.startDate,
    dateRange.endDate,
  ]);

  const cityOptions = useMemo(() => getCityOptions(allVenues), [allVenues]);

  const filteredVenues = useMemo(
    () => filterVenues(allVenues, { selectedCity, minGuests, dateRange }),
    [allVenues, selectedCity, minGuests, dateRange]
  );

  const sortedVenues = useMemo(
    () => sortVenues(filteredVenues, sortOrder),
    [filteredVenues, sortOrder]
  );

  const totalVenues = sortedVenues.length;
  const totalPages = Math.max(1, Math.ceil(totalVenues / pageSize));

  const pageItems: TVenue[] = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedVenues.slice(startIndex, startIndex + pageSize);
  }, [sortedVenues, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage((previous) => Math.min(previous, totalPages));
  }, [totalPages]);

  if (searchQuery) {
    return <SearchResults query={searchQuery} />;
  }

  return (
    <section
      className="m-auto w-full px-5 md:px-10 py-10"
      aria-busy={loading}
      aria-labelledby="venues-heading"
    >
      <div className="mb-4 flex justify-center">
        <VenuesFilters
          cities={cityOptions}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          minGuests={minGuests}
          onMinGuestsChange={setMinGuests}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>
      <div className="mb-6 border-b border-gray-400" />
      <div className="mb-4 flex-wrap sm:flex items-end justify-between gap-5">
        <h2
          id="venues-heading"
          className="text-2xl font-medium font-medium-buttons"
        >
          Venues
        </h2>
        {!loading && !loadError && totalVenues > 0 && (
          <VenueSort
            sortOrder={sortOrder}
            onChange={setSortOrder}
            disabled={loading}
          />
        )}
      </div>

      {loading && (
        <p className="text-gray-600" role="status">
          Loading…
        </p>
      )}

      {!loading && loadError && (
        <p className="text-red-600" role="alert">
          {loadError}
        </p>
      )}

      {!loading && !loadError && totalVenues === 0 && (
        <p className="text-gray-600">No Norwegian venues right now.</p>
      )}

      {!loading && !loadError && totalVenues > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pageItems.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => {
              setCurrentPage((previous) => Math.max(1, previous - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNext={() => {
              setCurrentPage((previous) => Math.min(totalPages, previous + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </section>
  );
}
