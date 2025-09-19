import { ProfileTabs, type ProfileTab } from './VenueManagerProfileTabs';
import { AddVenues } from './AddVenuesSection';
import { UpcomingVenueBookings } from './UpcomingVenueBookingsSection';
import type { TVenue } from '../../../types/venueTypes';
import type { TBooking } from '../../../types/bookingType';
import type { TBookingWithVenue } from '../../../types/bookingType';
import { MyBookingsSection } from '../MyBookingsSection';

type VenueManagerProps = {
  activeTab: ProfileTab;
  onChangeTab: (next: ProfileTab) => void;
  venues: TVenue[];
  isLoadingVenues: boolean;
  venuesError: string | null;

  myBookings?: TBookingWithVenue[];
  isLoadingMyBookings?: boolean;
  myBookingsError?: string | null;

  onCreateVenue: () => void;
  onEditVenue: (venue: TVenue) => void;
  onDeleteVenue: (venue: TVenue) => void;

  onCancelMyBooking?: (booking: TBooking, venue: TVenue) => void;
};

export function VenueManager({
  activeTab,
  onChangeTab,
  venues,
  isLoadingVenues,
  venuesError,
  myBookings,
  isLoadingMyBookings,
  myBookingsError,
  onCreateVenue,
  onEditVenue,
  onDeleteVenue,
  onCancelMyBooking,
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
          <UpcomingVenueBookings
            venues={venues}
            isLoading={isLoadingVenues}
            errorMessage={venuesError}
          />
        </section>
      )}
      {activeTab === 'myBookings' && (
        <section id="tab-myBookings" className="mt-2">
          <MyBookingsSection
            bookings={myBookings ?? []}
            isLoading={!!isLoadingMyBookings}
            errorMessage={myBookingsError ?? null}
            onCancelBooking={onCancelMyBooking}
          />
        </section>
      )}
    </>
  );
}
