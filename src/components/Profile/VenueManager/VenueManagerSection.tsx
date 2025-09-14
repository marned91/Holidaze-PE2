import type { TVenue } from '../../../types/venues';
import { ManageVenueCard } from './ManageVenueCard';
import { AddVenueCard } from './AddVenueCard';

type VenueManagerSectionProps = {
  venues: TVenue[];
  isLoading: boolean;
  errorMessage: string | null;
  onCreateVenue?: () => void;
  onEditVenue?: (venue: TVenue) => void;
  onDeleteVenue?: (venue: TVenue) => void;
};

export function VenueManagerSection({
  venues,
  isLoading,
  errorMessage,
  onCreateVenue,
  onEditVenue,
  onDeleteVenue,
}: VenueManagerSectionProps) {
  return (
    <section>
      <div className="mb-4">
        <h1 className="text-3xl font-medium font-large">Your Venues</h1>
      </div>

      {isLoading && <p>Loading venues…</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      {!errorMessage && !isLoading && (
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
