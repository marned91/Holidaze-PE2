import { useEffect, useMemo, useState } from 'react';
import { doFetch } from '../api/doFetch';
import { API_VENUES } from '../api/endpoints';
import { type TVenue } from '../types/venues';

type VenuesListProps = { pageSize?: number };

export function VenuesList({ pageSize = 12 }: VenuesListProps) {
  const [allVenues, setAllVenues] = useState<TVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isActive = true;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await doFetch<TVenue[]>(`${API_VENUES}?limit=50`, {
          method: 'GET',
          auth: false,
        });
        if (!isActive) return;

        const normalized = (data ?? []).sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime()
        );

        setAllVenues(normalized);
        setPage(1);
      } catch (error: any) {
        if (isActive) {
          setLoadError(
            error?.message || 'Failed to load venues, please reload the page'
          );
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    load();
    return () => {
      isActive = false;
    };
  }, []);

  const norwegianVenues = allVenues.filter((venue) =>
    /norway|norge/i.test(venue.location?.country ?? '')
  );

  const total = norwegianVenues.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = norwegianVenues.slice(start, start + pageSize);

  function goPrev() {
    setPage((page) => Math.max(1, page - 1));
  }
  function goNext() {
    setPage((page) => Math.max(totalPages, page + 1));
  }

  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="text-2xl font-semibold">Venues</h2>
        {!loading && !loadError && (
          <p className="text-sm text-gray-600">
            Showing {total === 0 ? 0 : start + 1}–
            {Math.min(start + pageSize, total)} of {total} (Norway)
          </p>
        )}
      </div>

      {loading && <p className="text-gray-600">Loading…</p>}

      {!loading && loadError && <p className="text-red-600">{loadError}</p>}

      {!loading && !loadError && total === 0 && (
        <p className="text-gray-600">No Norwegian venues right now.</p>
      )}

      {!loading && !loadError && total > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pageItems.map((v) => {
              const imageUrl =
                v.media?.[0]?.url || 'https://placehold.co/600x400';
              const imageAlt = v.media?.[0]?.alt || v.name;
              const location =
                [v.location?.city, v.location?.country]
                  .filter(Boolean)
                  .join(', ') || 'Location';

              return (
                <article
                  key={v.id}
                  className="rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold">{v.name}</h3>
                    <p className="text-sm text-gray-600">
                      {location}
                      <br />
                      {typeof v.maxGuests === 'number'
                        ? `${v.maxGuests} people`
                        : 'People'}
                      <br />
                      <span className="font-semibold">Price</span>{' '}
                      {typeof v.price === 'number' ? v.price : ''}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700">
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={page === totalPages}
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
