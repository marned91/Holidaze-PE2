import { ProfileTabs, type ProfileTab } from './VenueManagerProfileTabs';
import { DisplayAndAddVenues } from './MyVenuesSection';
import { UpcomingVenueBookings } from './UpcomingVenueBookingsSection';
import type { TVenue } from '../../../types/venueTypes';
import type { TBooking } from '../../../types/bookingTypes';
import type { TBookingWithVenue } from '../../../types/bookingTypes';
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

/**
 * Renders the Venue Manager dashboard with tabs for managing venues and bookings.
 *
 * Behavior:
 * - Shows three tabs: **My Venues**, **Bookings for my venues**, **My Bookings**.
 * - Uses `activeTab` to decide which panel to render and calls `onChangeTab` when user switches.
 * - Delegates create/edit/delete venue and cancel booking actions to provided callbacks.
 *
 * @param activeTab - Currently selected tab key (`'addVenue' | 'managerBookings' | 'myBookings'`).
 * @param onChangeTab - Called when the user switches tab.
 * @param venues - List of venues owned by the manager.
 * @param isLoadingVenues - Whether venue data is loading.
 * @param venuesError - Error message for venue load failures.
 * @param onCreateVenue - Triggered when user clicks to create a new venue.
 * @param onEditVenue - Triggered when user chooses to edit an existing venue.
 * @param onDeleteVenue - Triggered when user confirms deleting a venue.
 * @param myBookings - The manager's own bookings (for “My Bookings” tab).
 * @param isLoadingMyBookings - Whether bookings are loading.
 * @param myBookingsError - Error message for bookings load failures.
 * @param onCancelMyBooking - Triggered when user cancels one of their bookings.
 * @returns JSX section containing the manager UI.
 */

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
        <DisplayAndAddVenues
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
