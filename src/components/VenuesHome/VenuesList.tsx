import { useEffect, useMemo, useState } from 'react';
import { type TVenue } from '../../types/venues';
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
  const { venues: allVenues, loading, error: loadError } = useVenues(50);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [minGuests, setMinGuests] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({});

  useEffect(() => {
    if (!loading) setCurrentPage(1);
  }, [loading]);

  const cityOptions = useMemo(() => {
    return getCityOptions(allVenues);
  }, [allVenues]);

  const filteredVenues = useMemo(() => {
    return filterVenues(allVenues, { selectedCity, minGuests, dateRange });
  }, [allVenues, selectedCity, minGuests, dateRange]);

  const sortedVenues = useMemo(() => {
    return sortVenues(filteredVenues, sortOrder);
  }, [filteredVenues, sortOrder]);

  const totalVenues = sortedVenues.length;
  const totalPages = Math.max(1, Math.ceil(totalVenues / pageSize));

  const pageItems: TVenue[] = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedVenues.slice(startIndex, startIndex + pageSize);
  }, [sortedVenues, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity, minGuests, dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder]);

  function goToPreviousPage() {
    setCurrentPage((previousPage) => Math.max(1, previousPage - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToNextPage() {
    setCurrentPage((previousPage) => Math.min(totalPages, previousPage + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="m-auto w-full px-10 py-10">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pageItems.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={goToPreviousPage}
            onNext={goToNextPage}
          />
        </>
      )}
    </section>
  );
}
