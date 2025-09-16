import { ProfileTabs, type ProfileTab } from '../ProfileTabs';
import { AddVenues } from './AddVenuesSection';
import { VenueManagerUpcomingVenueBookings } from './VenueManagerVenueBookingsSection';
import type { TVenue } from '../../../types/venueTypes';

type VenueManagerProps = {
  activeTab: ProfileTab;
  onChangeTab: (next: ProfileTab) => void;

  venues: TVenue[];
  isLoadingVenues: boolean;
  venuesError: string | null;

  onCreateVenue: () => void;
  onEditVenue: (venue: TVenue) => void;
  onDeleteVenue: (venue: TVenue) => void;
};

export function VenueManager({
  activeTab,
  onChangeTab,
  venues,
  isLoadingVenues,
  venuesError,
  onCreateVenue,
  onEditVenue,
  onDeleteVenue,
}: VenueManagerProps) {
  return (
    <>
      <ProfileTabs active={activeTab} onChange={onChangeTab} isManager />
      <hr className="my-6 border-gray-400" />

      {activeTab === 'addVenue' && (
        <AddVenues
          venues={venues}
          isLoading={isLoadingVenues}
          errorMessage={venuesError}
          onCreateVenue={onCreateVenue}
          onEditVenue={onEditVenue}
          onDeleteVenue={onDeleteVenue}
        />
      )}

      {activeTab === 'managerBookings' && (
        <section id="tab-managerBookings" className="mt-2">
          <VenueManagerUpcomingVenueBookings
            venues={venues}
            isLoading={isLoadingVenues}
            errorMessage={venuesError}
          />
        </section>
      )}

      {activeTab === 'myBookings' && (
        <section id="tab-myBookings" className="mt-2">
          {/* Her rendrer du samme MyBookingsSection som for customers */}
        </section>
      )}
    </>
  );
}
