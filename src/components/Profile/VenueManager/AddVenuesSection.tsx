import type { TVenue } from '../../../types/venueTypes';
import { ManageVenueCard } from './ManageVenueCard';
import { AddVenueCard } from './AddVenueButton';

type AddVenuesProps = {
  venues: TVenue[];
  isLoading: boolean;
  errorMessage: string | null;
  onCreateVenue?: () => void;
  onEditVenue?: (venue: TVenue) => void;
  onDeleteVenue?: (venue: TVenue) => void;
};

export function AddVenues({
  venues,
  isLoading,
  errorMessage,
  onCreateVenue,
  onEditVenue,
  onDeleteVenue,
}: AddVenuesProps) {
  return (
    <section id="tab-addVenue">
      <div className="mb-4">
        <h1 className="text-3xl font-large">Your Venues</h1>
      </div>

      {isLoading && <p>Loading venues…</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      {!isLoading && !errorMessage && venues.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="mb-4 text-gray-700 font-text">
            You do not have any venues yet.
          </p>
          <div className="mx-auto max-w-sm">
            <AddVenueCard onClick={onCreateVenue} />
          </div>
        </div>
      )}
      {!errorMessage && !isLoading && venues.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AddVenueCard onClick={onCreateVenue} />
          {venues.map((venue) => (
            <ManageVenueCard
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
