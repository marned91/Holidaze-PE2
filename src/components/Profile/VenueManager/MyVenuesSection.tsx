import type { TVenue } from '../../../types/venueTypes';
import { ManageVenues } from './ManageVenues';
import { AddVenueCard } from './AddVenueCard';

type AddVenuesProps = {
  venues: TVenue[];
  isLoading: boolean;
  errorMessage: string | null;
  onCreateVenue?: () => void;
  onEditVenue?: (venue: TVenue) => void;
  onDeleteVenue?: (venue: TVenue) => void;
};

/**
 * Section for listing and managing the user's venues.
 *
 * @remarks
 * - Shows loading/error states, an empty state with call-to-action, and a grid of venues.
 * - Adds basic ARIA semantics: `aria-labelledby` for the section title,
 *   `role="status"` for loading, and `role="alert"` for errors.
 * - No functional changes to rendering logic or handlers.
 */
export function DisplayAndAddVenues({
  venues,
  isLoading,
  errorMessage,
  onCreateVenue,
  onEditVenue,
  onDeleteVenue,
}: AddVenuesProps) {
  const titleId = 'add-venues-title';

  return (
    <section id="tab-addVenue" aria-labelledby={titleId}>
      <div className="mb-4">
        <h1 id={titleId} className="text-3xl font-large font-dark">
          My Venues
        </h1>
      </div>

      {isLoading && <p role="status">Loading venues…</p>}

      {errorMessage && (
        <p role="alert" className="text-red-600">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && venues.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="mb-4 text-gray-700 font-text">
            You do not have any venues yet!
          </p>
          <div className="mx-auto max-w-sm font-text">
            <AddVenueCard onClick={onCreateVenue} />
          </div>
        </div>
      )}

      {!errorMessage && !isLoading && venues.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 font-text">
          <AddVenueCard onClick={onCreateVenue} />
          {venues.map((venue) => (
            <ManageVenues
              key={venue.id}
              venue={venue}
              onEdit={onEditVenue}
              onDelete={onDeleteVenue}
            />
          ))}
        </div>
      )}
    </section>
  );
}
