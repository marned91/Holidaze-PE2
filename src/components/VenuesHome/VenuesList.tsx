import { useEffect, useMemo, useState } from 'react';
import { type TVenue } from '../../types/venueTypes';
import { VenueSort } from './VenueSort';
import { VenueCard } from './VenueCard';
import { VenuesFilters, type DateRange } from './VenuesFilters';
import { useVenues } from './hooks/useVenues';
import { Pagination } from './Pagination';
import {
  getCityOptions,
  filterVenues,
  sortVenues,
  type SortOrder,
} from './sortAndFilter';

type VenuesListProps = { pageSize?: number };

export function VenuesList({ pageSize = 12 }: VenuesListProps) {
  const { venues: allVenues, loading, error: loadError } = useVenues(100);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [minGuests, setMinGuests] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({});

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
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  function handlePreviousPage() {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNextPage() {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="m-auto w-full px-10 py-10" aria-busy={loading}>
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

      <div className="mb-6 border-b border-gray-200" />

      <div className="mb-4 flex items-end justify-between gap-5">
        <h2 className="text-2xl font-medium">Venues</h2>
        {!loading && !loadError && totalVenues > 0 && (
          <VenueSort
            sortOrder={sortOrder}
            onChange={setSortOrder}
            disabled={loading}
          />
        )}
      </div>

      {loading && <p className="text-gray-600">Loading…</p>}
      {!loading && loadError && <p className="text-red-600">{loadError}</p>}
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
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        </>
      )}
    </section>
  );
}
