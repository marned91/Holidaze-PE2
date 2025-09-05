import { useEffect, useState } from 'react';
import { doFetch } from '../../api/doFetch';
import { API_VENUES } from '../../api/endpoints';
import { type TVenue } from '../../types/venues';
import { VenueSort } from './VenueSort';
import { VenueCard } from './VenueCard';

type VenuesListProps = { pageSize?: number };

export function VenuesList({ pageSize = 12 }: VenuesListProps) {
  const [allVenues, setAllVenues] = useState<TVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<
    'newest' | 'oldest' | 'priceLow' | 'priceHigh'
  >('newest');

  useEffect(() => {
    let isComponentActive = true;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await doFetch<TVenue[]>(`${API_VENUES}?limit=50`, {
          method: 'GET',
          auth: false,
        });
        if (!isComponentActive) return;

        const sortedByNewest = (data ?? []).sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime()
        );

        setAllVenues(sortedByNewest);
        setCurrentPage(1);
      } catch (error: any) {
        if (isComponentActive) {
          setLoadError(
            error?.message || 'Failed to load venues, please reload the page'
          );
        }
      } finally {
        if (isComponentActive) setLoading(false);
      }
    }

    load();
    return () => {
      isComponentActive = false;
    };
  }, []);

  const norwegianVenues = allVenues.filter((venue) =>
    /norway|norge/i.test(venue.location?.country ?? '')
  );

  let sortedVenues: TVenue[] = [...norwegianVenues];
  if (sortOrder === 'newest') {
    sortedVenues.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    );
  } else if (sortOrder === 'oldest') {
    sortedVenues.sort(
      (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
    );
  } else if (sortOrder === 'priceLow') {
    sortedVenues.sort((a, b) => {
      const aPrice =
        typeof a.price === 'number' ? a.price : Number.POSITIVE_INFINITY;
      const bPrice =
        typeof b.price === 'number' ? b.price : Number.POSITIVE_INFINITY;
      return aPrice - bPrice;
    });
  } else {
    sortedVenues.sort((a, b) => {
      const aPrice =
        typeof a.price === 'number' ? a.price : Number.NEGATIVE_INFINITY;
      const bPrice =
        typeof b.price === 'number' ? b.price : Number.NEGATIVE_INFINITY;
      return bPrice - aPrice;
    });
  }

  const totalVenues = sortedVenues.length;
  const totalPages = Math.max(1, Math.ceil(totalVenues / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = sortedVenues.slice(startIndex, startIndex + pageSize);

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

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
