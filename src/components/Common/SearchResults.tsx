import { useLocation, useNavigate } from 'react-router-dom';
import { useVenueSearch } from '../../hooks/useVenueSearch';
import { VenueCard } from '../VenuesHome/VenueCard';

type SearchResultsProps = {
  query: string;
};

export function SearchResults({ query }: SearchResultsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSearching, searchError, searchResults } = useVenueSearch(query);

  function clearSearch() {
    const params = new URLSearchParams(location.search);
    params.delete('q');
    navigate({ pathname: '/', search: params.toString() }, { replace: false });
  }

  return (
    <section className="m-auto w-full px-10 py-10">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-2xl font-medium font-medium-buttons">
          Results <span className="text-gray-500">for “{query}”</span>
        </h2>
        <button
          type="button"
          onClick={clearSearch}
          className="rounded-lg border border-gray-400 px-3 py-1.5 text-sm hover:bg-gray-50 font-medium-buttons"
        >
          Clear search
        </button>
      </div>

      {isSearching && <p className="text-gray-600 font-text">Searching…</p>}
      {!isSearching && searchError && (
        <p className="text-red-600">{searchError}</p>
      )}
      {!isSearching && !searchError && searchResults.length === 0 && (
        <p className="text-gray-600">No venues found.</p>
      )}
      {!isSearching && !searchError && searchResults.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {searchResults.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </section>
  );
}
